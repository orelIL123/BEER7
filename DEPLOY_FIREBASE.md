# Deploy Firebase (Rules + Indexes)

Deploy Firestore rules, indexes, and Storage rules to project **beer-sheva-83442**.

## 1. Use the correct account

Deploy must run with a Google account that has **Owner** or **Editor** on the Firebase project.

```bash
firebase login
```

If you have multiple accounts, choose the one that owns **beer-sheva-83442**. To add another account:

```bash
firebase login --add
```

## 2. Confirm project

```bash
firebase use beer-sheva-83442
```

If the project is missing from the list, create it in [Firebase Console](https://console.firebase.google.com) or switch to the right account.

## 3. Deploy everything

```bash
npm run firebase:deploy
```

Or manually:

```bash
# Firestore (rules + indexes)
firebase deploy --only firestore

# Storage rules
firebase deploy --only storage
```

Or both:

```bash
firebase deploy --only firestore,storage
```

## If you get 403 "Permission denied"

- **Firebase CLI**: Run `firebase login` and pick the account that owns **beer-sheva-83442**.
- **Google Cloud**: In [Google Cloud Console](https://console.cloud.google.com) → select project **beer-sheva-83442** → **APIs & Services** → enable **Cloud Firestore API** and **Firebase Storage API** (or do the same from the Firebase Console for this project).

## What gets deployed

| Target   | Files                      |
|----------|----------------------------|
| Firestore| `firestore.rules`, `firestore.indexes.json` |
| Storage  | `storage.rules`            |

Indexes may take a few minutes to finish building in the console after deploy.
