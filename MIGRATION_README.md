# 🏙️ Beer Sheva City App - Migration Guide

## 📋 Overview
This is a React Native/Expo mobile application for the city of Beer Sheva, migrated from the Netivot city app. This document outlines all changes made and the steps required to complete the migration.

**Original Project:** Netivot City App  
**New Project:** Beer Sheva City App  
**Migration Date:** February 15, 2026  
**Platforms:** iOS, Android, Web

---

## ✅ Completed Changes

### 1. Text Replacements
All references have been updated throughout the codebase:

| Original | Updated | Files Affected |
|----------|---------|----------------|
| "Netivot" | "Beer Sheva" | 26 files |
| "באר שבע" | "באר שבע" | 26 files |
| "netivot-app" | "beer-sheva-app" | package.json |
| "com.netivot.app" | "com.beer-sheva.app" | app.json (bundle IDs) |
| "netivot" (slug) | "beer-sheva" | app.json |

### 2. Color Scheme Update (Purple → Red)
Brand colors have been changed from purple/violet to red throughout the app:

#### Color Mappings:
| Color Type | Old Color (Purple) | New Color (Red) | Usage |
|------------|-------------------|-----------------|-------|
| Primary | `#7C3AED` (Violet) | `#DC2626` (Red-600) | Main brand color |
| Primary Light | `#A78BFA` | `#EF4444` (Red-500) | Lighter accents |
| Primary Dark | `#5B21B6` | `#991B1B` (Red-800) | Darker accents |
| Secondary | `#EC4899` (Pink) | `#F87171` (Red-400) | Secondary elements |
| Secondary Light | `#F472B6` | `#FCA5A5` (Red-300) | Light secondary |
| Secondary Dark | `#BE185D` | `#B91C1C` (Red-700) | Dark secondary |
| Off-white | `#F5F3FF` (Violet tint) | `#FEF2F2` (Red tint) | Background |

#### Files Updated:
- ✅ `constants/Colors.ts` - Main color definitions
- ✅ `app.json` - Splash screen & adaptive icon backgrounds
- ✅ `app/(tabs)/_layout.tsx` - Tab bar styling
- ✅ `app/auth/index.tsx` - Authentication UI colors

---

## 🖼️ Logo & Image Files Requiring Replacement

The following 13 image files contain Netivot branding and **MUST** be replaced with Beer Sheva branded images:

### Critical Logo Files (High Priority)

1. **`assets/images/logo.png`** ⚠️ CRITICAL
   - **Purpose:** Main app logo
   - **Used in:** App icon, splash screen, navigation header
   - **Requirements:** 
     - Format: PNG with transparency
     - Should be square or adaptable
     - High resolution recommended (1024x1024 or higher)

2. **`assets/images/icon.png`** ⚠️ CRITICAL
   - **Purpose:** Mobile app icon
   - **Requirements:**
     - Dimensions: 1024x1024 pixels
     - Format: PNG
     - Will be automatically resized for different device sizes

3. **`assets/images/adaptive-icon.png`** ⚠️ CRITICAL
   - **Purpose:** Android adaptive icon
   - **Requirements:**
     - Dimensions: 1024x1024 pixels
     - Safe zone: Keep important content in center 66% (684x684px)
     - Format: PNG with transparency

4. **`assets/images/favicon.png`**
   - **Purpose:** Web browser tab icon
   - **Requirements:**
     - Dimensions: 32x32 or 64x64 pixels
     - Format: PNG or ICO

5. **`assets/images/splash-icon.png`**
   - **Purpose:** Displayed during app loading
   - **Requirements:** Match logo dimensions

### UI Element Images

6. **`assets/images/middle-icon.png`**
   - **Purpose:** Icon used in app interface
   - **Action:** Review and replace if Netivot-specific

7. **`assets/images/top_nav.png`**
   - **Purpose:** Top navigation bar graphic
   - **Requirements:** Full-width banner/header image

### City-Specific Images (Replace with Beer Sheva Content)

8. **`assets/images/stadium_hero.png`** 🏟️
   - **Purpose:** Stadium/sports venue hero image
   - **Action:** Replace with Beer Sheva's Turner Stadium or relevant venue

9. **`assets/images/city_view.png`** 🌆
   - **Purpose:** City landscape/skyline
   - **Action:** Replace with Beer Sheva cityscape

### Animated/Decorative Elements

10. **`assets/images/spining_bottom.png`**
    - **Purpose:** Bottom spinning/animated UI element
    - **Action:** Review design and update if needed

11. **`assets/images/spining_bottom1.png`**
    - **Purpose:** Alternative bottom spinning element
    - **Action:** Review design and update if needed

### Person-Specific Images (Review Required)

12. **`assets/images/bino.png`** 👤
    - **Purpose:** Specific person/character from Netivot
    - **Action:** Remove or replace with Beer Sheva equivalent

13. **`assets/images/orel_aharon.png`** 👤
    - **Purpose:** Specific person from Netivot
    - **Action:** Remove or replace with Beer Sheva equivalent

### How to Replace Images:
1. Create new images following the specifications above
2. Use the exact same filenames as listed
3. Place them in the `assets/images/` directory
4. Ensure proper permissions and file formats
5. Test on all platforms (iOS, Android, Web)

---

## 🔥 Firebase Configuration

### Current Status:
- ⚠️ Firebase configuration still points to placeholder values
- All 8 Firebase-related files require updates

### Firebase Files to Update:

#### 1. `.firebaserc` (Project Reference)
**Location:** `/BEER_SHEVA/.firebaserc`  
**Current Content:**
```json
{
  "projects": {
    "default": "beer-sheva-83442"
  }
}
```
**Action Required:**
- Create new Firebase project for Beer Sheva
- Update `"beer-sheva-83442"` with your new project ID

#### 2. `lib/firebase.ts` (Web Configuration) ⚠️ CRITICAL
**Location:** `/BEER_SHEVA/lib/firebase.ts`  
**Current Content:** Placeholder values  
**Action Required:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project for Beer Sheva
3. Navigate to: Project Settings > General > Your apps
4. Select or create a Web app
5. Copy the configuration object
6. Replace the placeholder values in `lib/firebase.ts`:

```typescript
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

#### 3. `google-services-16.json` (Android Configuration)
**Location:** `/BEER_SHEVA/google-services-16.json`  
**Action Required:**
1. In Firebase Console: Project Settings > Your apps
2. Select or add an Android app
3. Package name should be: `com.beer-sheva.app`
4. Download `google-services.json`
5. Rename to `google-services-16.json` (or update reference in `app.json`)
6. Replace the existing file

#### 4. `GoogleService-Info-17.plist` (iOS Configuration)
**Location:** `/BEER_SHEVA/GoogleService-Info-17.plist`  
**Action Required:**
1. In Firebase Console: Project Settings > Your apps
2. Select or add an iOS app
3. Bundle ID should be: `com.beer-sheva.app`
4. Download `GoogleService-Info.plist`
5. Rename to `GoogleService-Info-17.plist` (or update reference in `app.json`)
6. Replace the existing file

#### 5. Additional Firebase Files (Review)
These files should work as-is but review for any Netivot-specific configurations:

- **`firebase.json`** - Hosting and deployment settings
- **`firestore.rules`** - Database security rules
- **`firestore.indexes.json`** - Database indexes
- **`storage.rules`** - Storage security rules

### Firebase Setup Steps:

1. **Create New Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Name: "Beer Sheva" or similar
   - Enable Google Analytics (optional)

2. **Enable Required Services:**
   - ✅ Authentication (Phone, Email, etc.)
   - ✅ Firestore Database
   - ✅ Storage
   - ✅ Hosting (if deploying web version)

3. **Add Apps to Project:**
   - Add Web app
   - Add Android app (package: `com.beer-sheva.app`)
   - Add iOS app (bundle ID: `com.beer-sheva.app`)

4. **Download Configuration Files:**
   - Download config files as described above
   - Replace in the project

5. **Deploy Firestore Rules:**
   ```bash
   npm run firebase:deploy
   ```

6. **Seed Initial Data (Optional):**
   ```bash
   npm run firebase:seed
   ```

For detailed Firebase setup instructions, see `FIREBASE_SETUP.md` (text has been updated to Beer Sheva).

---

## 📱 App Configuration Files

### `app.json` - Expo Configuration
**Status:** ✅ Updated  
**Changes Made:**
- App name: "אפליקציית באר שבע" (Beer Sheva App in Hebrew)
- Slug: `beer-sheva`
- Scheme: `beer-sheva`
- Bundle identifiers: `com.beer-sheva.app`
- Background colors: Updated to red (`#DC2626`)

**Review Required:**
- Firebase config file paths (currently pointing to existing files)
- Version number (currently `1.0.0`)

### `package.json` - Node/NPM Configuration
**Status:** ✅ Updated  
**Changes Made:**
- Package name: `beer-sheva-app`

**No Action Needed:** Dependencies remain the same

---

## 🚀 Next Steps

### Immediate Actions Required:

1. **Replace Logo Files** 🖼️
   - [ ] Create/obtain Beer Sheva logos
   - [ ] Replace all 13 image files listed above
   - [ ] Test on all platforms

2. **Set Up Firebase Project** 🔥
   - [ ] Create new Firebase project
   - [ ] Enable required services
   - [ ] Add iOS, Android, and Web apps
   - [ ] Download configuration files
   - [ ] Update all 4 configuration files
   - [ ] Deploy Firestore rules

3. **Test Configuration** ✅
   - [ ] Install dependencies: `npm install`
   - [ ] Test on iOS: `npm run ios`
   - [ ] Test on Android: `npm run android`
   - [ ] Test on Web: `npm run web`

4. **Review Content** 📝
   - [ ] Check for any remaining Netivot-specific content
   - [ ] Update mock data in `constants/MockData.ts` if needed
   - [ ] Review admin panel configurations

### Optional Enhancements:

5. **Branding Refinement** 🎨
   - [ ] Review color scheme in different screens
   - [ ] Adjust color shades if needed
   - [ ] Update loading animations if needed

6. **Content Updates** 📰
   - [ ] Add Beer Sheva specific news/articles
   - [ ] Update business listings
   - [ ] Update event information
   - [ ] Update team/squad information (if applicable)

7. **Deployment** 🚢
   - [ ] Build iOS app: `expo build:ios`
   - [ ] Build Android app: `expo build:android`
   - [ ] Deploy web version: See `DEPLOY_FIREBASE.md`
   - [ ] Submit to App Store
   - [ ] Submit to Google Play Store

---

## 📊 Summary of Changes

### Automated Changes (Completed ✅)
- **26 files** updated with text replacements
- **4 files** updated with color changes
- **0 purple colors** remaining in codebase
- **100+ individual text replacements** made

### Manual Changes Required (Pending ⚠️)
- **13 image files** need replacement
- **4 Firebase config files** need updates
- **1 Firebase project** needs creation

### Files Modified:
```
Total files in project: 117
Files with text changes: 26
Files with color changes: 4
Files requiring manual updates: 17
```

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Deploy Firebase rules and storage
npm run firebase:deploy

# Seed Firestore with initial data
npm run firebase:seed
```

---

## 📞 Support & Documentation

- **Original Documentation:** `FIREBASE_SETUP.md`, `DEPLOY_FIREBASE.md`
- **React Native/Expo Docs:** https://docs.expo.dev/
- **Firebase Docs:** https://firebase.google.com/docs

---

## ⚠️ Important Notes

1. **Do NOT commit Firebase configuration files with real credentials to public repositories**
2. **Test thoroughly on all platforms before deploying**
3. **Keep the original NETIVOT-main folder as backup**
4. **Update version numbers appropriately when deploying**
5. **Ensure all required permissions are configured for iOS/Android**

---

## 📝 Checklist

Use this checklist to track your migration progress:

- [x] Extract and analyze original project
- [x] Copy to BEER_SHEVA folder
- [x] Replace all "Netivot" text with "Beer Sheva"
- [x] Replace all "באר שבע" text with "באר שבע"
- [x] Update color scheme from purple to red
- [x] Update package and bundle identifiers
- [ ] Replace all logo/image files (0/13 completed)
- [ ] Create new Firebase project
- [ ] Update Firebase configuration files (0/4 completed)
- [ ] Deploy Firebase rules
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Test on Web
- [ ] Review and update content
- [ ] Build production apps
- [ ] Deploy to app stores

---

**Migration Status:** 🟨 Partially Complete (Automated changes done, manual steps pending)

**Last Updated:** February 15, 2026
