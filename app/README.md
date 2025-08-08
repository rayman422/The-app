# Fishing App (Vite + React)

## Setup

1. Copy `.env.example` to `.env` and fill in your Firebase web app values (required):

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

- React Router with code-splitting (lazy routes)
- Firebase Auth (custom token or Google popup)
- Firestore storage for user profile and catches
- Tailwind CSS UI
- Recharts-based statistics
- OpenStreetMap map via react-leaflet
- Weather via Open-Meteo (free), with 10-minute in-memory caching per lat/lon

## Firestore structure

- User profile: `artifacts/{VITE_APP_ID}/users/{uid}/userProfile/profile`
- Catches: `artifacts/{VITE_APP_ID}/users/{uid}/catches/{doc}`

After adding a catch, the app updates `catches` and recomputes `species` counts in the user profile.

## Deploy (Firebase Hosting)

- Ensure you have the Firebase CLI installed and logged in
- Build the app: `npm run build`
- Use the included `firebase.json` and `firestore.rules`
- Initialize your project if needed: `firebase use <your-project-id>`
- Deploy hosting and rules:
```
firebase deploy --only hosting,firestore:rules
```

## Notes

- Enable Google sign-in in Firebase Console.
- The SPA router requires hosting rewrites to `index.html` (configured in `firebase.json`).
