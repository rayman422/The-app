# Fishing App (Improved)

Full-stack app with React + Vite frontend and FastAPI backend. Includes:
- Auth-ready UI with demo mode
- Catches, Gear, Species, Map, Weather pages
- AI Tips via Hugging Face proxy (server-side)
- Local persistence for offline-first UX
- Dockerized dev environment

## Quick start (Docker)
- Prereqs: Docker + Docker Compose
- Copy `api/.env.example` to `api/.env` and set values (HF token provided)
- Run: `docker-compose up --build`
  - App: http://localhost:5173
  - API: http://localhost:8000 (docs at /docs)

## Manual start
- API:
  - cd api; python3 -m venv .venv && source .venv/bin/activate
  - pip install -r requirements.txt
  - cp .env.example .env; edit values
  - uvicorn main:app --reload --port 8000
- App:
  - cd app; npm install; npm run dev

## Environment
- Backend: set `HUGGINGFACE_TOKEN` in `api/.env`
- Frontend: uses `VITE_API_BASE_URL` (defaults to http://localhost:8000)

## Tests
- Frontend unit tests: `cd app && npm test`

## Notes
- Offline: LocalStore mirrors catches/gear/species/locations in localStorage
- Map: OpenStreetMap tiles, click to add spots
- Weather: Open-Meteo, geolocation required