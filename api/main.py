import os
import json
from datetime import timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import auth as fb_auth
from firebase_admin import credentials
from google.cloud import firestore
from google.cloud import storage
import requests

# Load .env if present
load_dotenv()

APP_ID = os.getenv("APP_ID", "default-app-id")
DEV_NO_AUTH = os.getenv("DEV_NO_AUTH", "false").lower() == "true"
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
GCS_BUCKET = os.getenv("GCS_BUCKET")
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

# Initialize Firebase Admin if not already
if not firebase_admin._apps:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path and os.path.isfile(cred_path):
        firebase_admin.initialize_app(credentials.Certificate(cred_path))
    else:
        # Fall back to Application Default Credentials or no credentials
        try:
            firebase_admin.initialize_app()
        except Exception:
            # Allow starting without credentials for dev-only flows
            pass

# Firestore client (works with ADC or emulator)
firestore_client = firestore.Client(project=os.getenv("FIREBASE_PROJECT_ID"))

# Storage client
storage_client: Optional[storage.Client]
try:
    storage_client = storage.Client(project=os.getenv("FIREBASE_PROJECT_ID"))
except Exception:
    storage_client = None

app = FastAPI(title="Fishing App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    profilePrivacy: Optional[str] = Field(None, pattern="^(public|private)$")


class CatchLocation(BaseModel):
    coordinates: Optional[List[float]] = None
    address: Optional[str] = ""
    waterBodyName: Optional[str] = ""
    waterType: Optional[str] = ""
    spotName: Optional[str] = ""


class CatchEnvironment(BaseModel):
    airTemperature: Optional[float] = None
    waterTemperature: Optional[float] = None
    weatherCondition: Optional[str] = ""
    windSpeed: Optional[float] = None
    windDirection: Optional[str] = ""
    airPressure: Optional[float] = None
    moonPhase: Optional[str] = ""
    tideInfo: Optional[str] = None
    visibility: Optional[str] = ""
    cloudCover: Optional[str] = ""


class CatchFishing(BaseModel):
    bait: Optional[str] = ""
    lure: Optional[str] = ""
    technique: Optional[str] = ""
    gearUsed: Optional[List[str]] = []
    depth: Optional[float] = None
    timeOfDay: Optional[str] = ""
    duration: Optional[int] = None


class CatchCreate(BaseModel):
    species: str
    speciesId: Optional[str] = None
    weight: Optional[float] = 0
    length: Optional[float] = 0
    photos: Optional[List[str]] = []
    notes: Optional[str] = ""
    keptOrReleased: Optional[str] = Field("released", pattern="^(kept|released)$")
    location: Optional[CatchLocation] = CatchLocation()
    environment: Optional[CatchEnvironment] = CatchEnvironment()
    fishing: Optional[CatchFishing] = CatchFishing()
    dateTime: Optional[str] = None  # ISO8601
    isPublic: Optional[bool] = True
    tags: Optional[List[str]] = []


# Auth dependency
async def get_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if DEV_NO_AUTH:
        # Dev bypass
        return None
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        decoded = fb_auth.verify_id_token(token)
        return decoded.get("uid")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "appId": APP_ID}


@app.get("/users/{user_id}/profile")
async def get_profile(user_id: str, uid: Optional[str] = Depends(get_user_id)):
    if uid and uid != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    doc_ref = (
        firestore_client.collection("artifacts").document(APP_ID)
        .collection("users").document(user_id)
        .collection("userProfile").document("profile")
    )
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Profile not found")
    return doc.to_dict()


@app.put("/users/{user_id}/profile")
async def update_profile(user_id: str, update: ProfileUpdate, uid: Optional[str] = Depends(get_user_id)):
    if uid and uid != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    data = {k: v for k, v in update.model_dump().items() if v is not None}
    data["updatedAt"] = firestore.SERVER_TIMESTAMP

    doc_ref = (
        firestore_client.collection("artifacts").document(APP_ID)
        .collection("users").document(user_id)
        .collection("userProfile").document("profile")
    )
    doc_ref.set(data, merge=True)
    return {"success": True}


@app.get("/users/{user_id}/catches")
async def list_catches(user_id: str, uid: Optional[str] = Depends(get_user_id)):
    if uid and uid != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    col_ref = (
        firestore_client.collection("artifacts").document(APP_ID)
        .collection("users").document(user_id)
        .collection("catches")
    )
    docs = col_ref.order_by("dateTime", direction=firestore.Query.DESCENDING).stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]


@app.post("/users/{user_id}/catches")
async def create_catch(user_id: str, catch: CatchCreate, uid: Optional[str] = Depends(get_user_id)):
    if uid and uid != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    col_ref = (
        firestore_client.collection("artifacts").document(APP_ID)
        .collection("users").document(user_id)
        .collection("catches")
    )
    data = catch.model_dump()
    data["createdAt"] = firestore.SERVER_TIMESTAMP
    data["updatedAt"] = firestore.SERVER_TIMESTAMP
    doc_ref = col_ref.add(data)[1]
    return {"id": doc_ref.id}


@app.delete("/users/{user_id}/catches/{catch_id}")
async def delete_catch(user_id: str, catch_id: str, uid: Optional[str] = Depends(get_user_id)):
    if uid and uid != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    doc_ref = (
        firestore_client.collection("artifacts").document(APP_ID)
        .collection("users").document(user_id)
        .collection("catches").document(catch_id)
    )
    doc_ref.delete()
    return {"success": True}


class SignedUrlRequest(BaseModel):
    filePath: str
    ttlMinutes: Optional[int] = 15


@app.post("/signed-url")
async def get_signed_url(req: SignedUrlRequest, uid: Optional[str] = Depends(get_user_id)):
    if not storage_client or not GCS_BUCKET:
        raise HTTPException(status_code=501, detail="Storage not configured")

    valid_prefix = f"artifacts/{APP_ID}/users/{uid}/" if uid else None
    if not DEV_NO_AUTH and (not uid or not req.filePath.startswith(valid_prefix)):
        raise HTTPException(status_code=403, detail="Invalid file path")

    bucket = storage_client.bucket(GCS_BUCKET)
    blob = bucket.blob(req.filePath)
    url = blob.generate_signed_url(expiration=timedelta(minutes=req.ttlMinutes or 15), method="GET")
    return {"url": url, "expiresIn": (req.ttlMinutes or 15) * 60}


# --------------------
# Hugging Face Proxy
# --------------------
class HFRequest(BaseModel):
    model: str
    inputs: object
    params: Optional[dict] = None


@app.get("/hf/health")
async def hf_health() -> dict:
    return {"token_present": bool(HUGGINGFACE_TOKEN)}


@app.post("/hf/infer")
async def hf_infer(payload: HFRequest, uid: Optional[str] = Depends(get_user_id)):
    if not HUGGINGFACE_TOKEN:
        raise HTTPException(status_code=501, detail="Hugging Face not configured")

    url = f"https://api-inference.huggingface.co/models/{payload.model}"
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_TOKEN}",
        "Content-Type": "application/json",
    }
    try:
        resp = requests.post(url, headers=headers, data=json.dumps({
            "inputs": payload.inputs,
            **({"parameters": payload.params} if payload.params else {}),
        }), timeout=60)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"HF request failed: {e}")

    if resp.status_code >= 400:
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text
        raise HTTPException(status_code=resp.status_code, detail=detail)

    try:
        return resp.json()
    except Exception:
        return {"result": resp.text}