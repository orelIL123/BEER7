# 🚀 Quick Reference - Beer Sheva App Migration

## ✅ What's Done (Automated)

### Text Changes
- ✅ All "Netivot" → "Beer Sheva" (26 files)
- ✅ All "נתיבות" → "באר שבע" (26 files)
- ✅ Package name: `beer-sheva-app`
- ✅ Bundle IDs: `com.beer-sheva.app`

### Color Changes (Purple → Red)
- ✅ Primary: `#7C3AED` → `#DC2626`
- ✅ All purple shades replaced with red equivalents
- ✅ 4 files updated with new colors

---

## ⚠️ What You Need to Do (Manual)

### 1. Replace Images (13 files)
**Location:** `assets/images/`

**Critical (must replace):**
- `logo.png` - Main app logo
- `icon.png` - App icon (1024x1024)
- `adaptive-icon.png` - Android icon (1024x1024)
- `favicon.png` - Web icon (32x32)

**City-specific:**
- `stadium_hero.png` - Beer Sheva stadium
- `city_view.png` - Beer Sheva cityscape

**Review & update:**
- `splash-icon.png`, `middle-icon.png`, `top_nav.png`
- `spining_bottom.png`, `spining_bottom1.png`
- `bino.png`, `orel_aharon.png` (person images)

### 2. Firebase Setup

#### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Create new project: "Beer Sheva"
3. Enable: Authentication, Firestore, Storage

#### Step 2: Add Apps
- **Android:** Package name = `com.beer-sheva.app`
- **iOS:** Bundle ID = `com.beer-sheva.app`
- **Web:** Register web app

#### Step 3: Update 4 Config Files

**File 1:** `lib/firebase.ts`
```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

**File 2:** `.firebaserc`
```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID"
  }
}
```

**File 3:** `google-services-16.json` (Download from Firebase Console - Android)

**File 4:** `GoogleService-Info-17.plist` (Download from Firebase Console - iOS)

#### Step 4: Deploy
```bash
npm install
npm run firebase:deploy
```

---

## 🎯 Priority Order

1. **Firebase Configuration** (Can't run app without this)
   - Create project
   - Update 4 config files
   
2. **Critical Logo Files** (App won't look right without these)
   - logo.png
   - icon.png
   - adaptive-icon.png

3. **Test & Deploy**
   - `npm start` to test
   - Build for production

---

## 📞 Quick Commands

```bash
# Install
npm install

# Run
npm start          # Choose platform
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser

# Deploy Firebase
npm run firebase:deploy
```

---

## 📂 Folder Structure

```
/home/ubuntu/BEER_SHEVA/
├── MIGRATION_README.md      ← Full documentation
├── QUICK_REFERENCE.md       ← This file
├── app/                     ← App screens (✅ updated)
├── assets/images/           ← ⚠️ REPLACE IMAGES HERE
├── constants/Colors.ts      ← ✅ Colors updated
├── lib/firebase.ts          ← ⚠️ UPDATE CONFIG HERE
├── .firebaserc             ← ⚠️ UPDATE PROJECT ID
├── google-services-16.json  ← ⚠️ REPLACE FILE
├── GoogleService-Info-17.plist ← ⚠️ REPLACE FILE
└── package.json            ← ✅ Updated
```

---

## ✔️ Checklist

- [ ] Create Firebase project
- [ ] Update `lib/firebase.ts` with config
- [ ] Update `.firebaserc` with project ID
- [ ] Download & replace `google-services-16.json`
- [ ] Download & replace `GoogleService-Info-17.plist`
- [ ] Replace logo.png
- [ ] Replace icon.png
- [ ] Replace adaptive-icon.png
- [ ] Replace favicon.png
- [ ] Replace stadium_hero.png
- [ ] Replace city_view.png
- [ ] Review other images
- [ ] Run `npm install`
- [ ] Run `npm start` and test
- [ ] Deploy Firebase rules

---

**Questions?** See `MIGRATION_README.md` for detailed instructions.
