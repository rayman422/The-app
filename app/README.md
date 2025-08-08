# Fishing App (Vite + React)

## Setup

1. Copy `.env.example` to `.env` and fill in your Firebase web app values:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_APP_ID=my-app-id
```

2. Install dependencies:

```
npm install
```

3. Run the dev server:

```
npm run dev
```

4. Build for production:

```
npm run build
npm run preview
```

## Features

- Firebase Auth (custom token or Google popup fallback)
- Firestore storage for user profile and catches; localStorage fallback in demo mode
- Tailwind CSS UI
- Recharts-based statistics
- Offline/demo mode if Firebase is not configured

## Notes

- The app expects a Firestore layout under `artifacts/{VITE_APP_ID}/users/{uid}` for user profile and `catches` collection for entries.
- To provision Auth providers, enable Google in Firebase Console.
