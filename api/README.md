# FastAPI Backend for Fishing App

This service provides a REST API backed by Firestore and Storage following the schema:
`artifacts/{APP_ID}/users/{uid}/...`.

## Setup
1. Create a Python venv (optional) and install deps:
   ```bash
   cd api
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure environment:
   - Copy `.env.example` to `.env` and set values
   - Provide Google credentials (e.g., `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON)
   - Optionally set `HUGGINGFACE_TOKEN` to enable Hugging Face proxy

## Run
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Auth
- Send `Authorization: Bearer <Firebase ID token>` header.
- For local development, set `DEV_NO_AUTH=true` to bypass verification.

## Endpoints
- `GET /health`
- `GET /users/{user_id}/profile`
- `PUT /users/{user_id}/profile`
- `GET /users/{user_id}/catches`
- `POST /users/{user_id}/catches`
- `DELETE /users/{user_id}/catches/{catch_id}`
- `POST /signed-url` (body: `{ "filePath": "artifacts/{APP_ID}/users/{uid}/..." }`)
- `GET /hf/health` (returns `{ token_present: boolean }`)
- `POST /hf/infer` (body: `{ model: string, inputs: any, params?: object }`) — proxies to Hugging Face Inference API using server-side token