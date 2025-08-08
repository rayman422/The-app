# Firebase scaffolds for Fishing App

Files included:
- `firestore.rules`: baseline Firestore security rules (owner access, public profile reads)
- `storage.rules`: Firebase Storage rules (owner path enforcement, image-only)
- `firestore.indexes.json`: initial indexes for catches and weather logs
- `functions/`: Cloud Functions scaffolds (signup profile, stats aggregation, cleanup, signed URLs)
- `firebase.json` + `.firebaserc`: project configuration (update project id)

## Quickstart
1. Install CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Set project: `firebase use -a <YOUR_PROJECT_ID>` or edit `.firebaserc`
4. Deploy rules and indexes:
   - `firebase deploy --only firestore:rules`
   - `firebase deploy --only firestore:indexes`
   - `firebase deploy --only storage`
5. Deploy functions:
   - `cd functions && npm install`
   - `cd .. && firebase deploy --only functions`

## Emulators
Run local emulators with:
```
firebase emulators:start
```

Ensure your app points to emulators during development as needed.