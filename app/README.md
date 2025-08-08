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

- Firebase Auth (custom token or Google popup)
- Firestore storage for user profile and catches
- Tailwind CSS UI
- Recharts-based statistics

## Firestore structure

- User profile: `artifacts/{VITE_APP_ID}/users/{uid}/userProfile/profile`
- Catches: `artifacts/{VITE_APP_ID}/users/{uid}/catches/{doc}`

After adding a catch, the app recalculates and updates `catches` and `species` counts in the user profile.

## Firebase console

- Enable Google sign-in in Authentication > Sign-in method.
- Create a Web App to get the required config values for `.env`.
