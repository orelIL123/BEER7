# 🚀 Firebase Deployment Commands Reference

**Project**: beer7-b898d (Beer Sheva App)  
**Location**: c:\Users\owner\Downloads\BEER_SHEVA  
**Date**: February 15, 2026

---

## 🔌 Connection & Authentication

### Check Firebase CLI Version
```bash
firebase --version
```
**Current**: 14.4.0 ✅

### List Logged-In Accounts
```bash
firebase login:list
```
**Current User**: vegoschat@gmail.com ✅

### View Active Projects
```bash
firebase projects:list
```
**Current Project**: beer7-b898d ✅

### Switch to Different Project
```bash
firebase use beer7-b898d
```

### Login to Firebase
```bash
firebase login
```

### Logout from Firebase
```bash
firebase logout
```

---

## 📦 Deployment Commands

### Deploy Everything
```bash
firebase deploy
```

### Deploy Only Specific Services

#### Firestore Database & Rules
```bash
firebase deploy --only firestore
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

#### Cloud Storage & Rules
```bash
firebase deploy --only storage
```

#### Both Database and Storage
```bash
firebase deploy --only firestore:rules,storage
```

#### Cloud Functions
```bash
firebase deploy --only functions
```

#### Hosting
```bash
firebase deploy --only hosting
```

#### Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

---

## 🔍 Monitoring & Logs

### View Firestore Indexes
```bash
firebase firestore:indexes
```

### View Cloud Functions Logs
```bash
firebase functions:log
```

### Follow Real-Time Function Logs
```bash
firebase functions:log --follow
```

---

## 📊 Local Development

### Initialize Firebase (First Time)
```bash
firebase init
```
**Note**: Already done for this project ✅

### Emulate Firestore Locally
```bash
firebase emulators:start --only firestore
```

### Emulate Storage Locally
```bash
firebase emulators:start --only storage
```

### Run All Emulators
```bash
firebase emulators:start
```

---

## 🧪 Testing & Validation

### Validate Firestore Rules
```bash
firebase deploy --dry-run --only firestore:rules
```

### Validate Storage Rules
```bash
firebase deploy --dry-run --only storage
```

### Validate All Configs
```bash
firebase deploy --dry-run
```

---

## 🗄️ Database Operations

### Open Firestore Console
```bash
firebase open firestore
```

### Open Storage Console
```bash
firebase open storage
```

### Open Firebase Console
```bash
firebase open
```

---

## 🔑 Credentials & Keys

### View Current Credentials
```bash
firebase config:get
```

### List Service Accounts
```bash
firebase auth:create-key
```

### Show Configuration
```bash
cat .firebaserc
```

---

## 📝 Configuration Files

### Your Current Configuration

**File**: `.firebaserc`
```json
{
  "projects": {
    "default": "beer7-b898d"
  }
}
```

**File**: `firebase.json`
- Contains hosting, firestore, and storage configurations

**File**: `lib/firebase.ts`
```typescript
export const firebaseConfig = {
  apiKey: 'AIzaSyDMFbEAQejC6s6jt8TdIK5dFhHfWnIlqS8',
  authDomain: 'beer7-b898d.firebaseapp.com',
  projectId: 'beer7-b898d',
  storageBucket: 'beer7-b898d.firebasestorage.app',
  messagingSenderId: '746227083454',
  appId: '1:746227083454:web:beer7-b898d',
};
```

---

## 🎯 Common Tasks

### Deploy After Code Changes
```bash
# Navigate to project
cd c:\Users\owner\Downloads\BEER_SHEVA

# Deploy all changes
firebase deploy
```

### Deploy New Cloud Function
```bash
firebase deploy --only functions:functionName
```

### Update Only Rules
```bash
# Firestore rules
firebase deploy --only firestore:rules

# Storage rules
firebase deploy --only storage

# Both
firebase deploy --only firestore:rules,storage
```

### Create Database Backup
```bash
firebase firestore:export backup-2026-02-15
```

### Restore Database
```bash
firebase firestore:import backup-2026-02-15
```

---

## 📱 App Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

---

## 🐛 Troubleshooting

### Clear Firebase Cache
```bash
firebase cache:clear
```

### Reset Local Emulator Data
```bash
firebase emulators:start --import=backup --export-on-exit
```

### Check for Errors
```bash
firebase deploy --dry-run
```

### View Detailed Logs
```bash
firebase functions:log --limit=50
```

---

## 🔗 Useful Links

### Firebase Console
https://console.firebase.google.com/project/beer7-b898d/overview

### Firestore Database
https://console.firebase.google.com/project/beer7-b898d/firestore

### Cloud Storage
https://console.firebase.google.com/project/beer7-b898d/storage

### Authentication
https://console.firebase.google.com/project/beer7-b898d/authentication

### Cloud Functions
https://console.firebase.google.com/project/beer7-b898d/functions

### Rules Playground
https://console.firebase.google.com/project/beer7-b898d/rules/firestore

---

## ✅ Status Check

### Quick Health Check
```bash
cd c:\Users\owner\Downloads\BEER_SHEVA
firebase projects:list
firebase emulators:start --dry-run
```

### Verify Deployment Success
```bash
firebase deploy --dry-run
```

---

## 📋 Deployment Workflow

### Step 1: Make Changes
```bash
# Edit your code, rules, or functions
```

### Step 2: Test Locally
```bash
npm start
# Test in browser/emulator
```

### Step 3: Validate Changes
```bash
firebase deploy --dry-run
```

### Step 4: Deploy
```bash
firebase deploy
```

### Step 5: Verify
```bash
firebase functions:log
# Check console for any errors
```

---

## 🚀 Next Steps

### Immediate (Today)
```bash
cd c:\Users\owner\Downloads\BEER_SHEVA
npm install
npm start
```

### Before Going Live
```bash
# Replace logo images
# Test all features
# Build for app stores
firebase deploy --only storage,firestore:rules
```

### Production Ready
```bash
firebase deploy
# Monitor logs
firebase functions:log --follow
```

---

## 📞 Emergency Commands

### View All Logs
```bash
firebase functions:log --limit=100
```

### Emergency Rollback
```bash
firebase deploy --force
```

### Clear Everything (CAUTION!)
```bash
firebase firestore:delete --recursive --all-collections
```

---

## 🎉 Your Project is Ready!

**Firebase Project**: beer7-b898d  
**Account**: vegoschat@gmail.com  
**Status**: ✅ Connected & Deployed  
**Ready to**: Develop, Test, Deploy

Use these commands for all your Firebase needs! 🚀
