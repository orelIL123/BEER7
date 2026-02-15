# 🏙️ BEER SHEVA - City App

A modern React Native mobile application for the city of Beer Sheva, built with Expo, Firebase, and Cloud Functions.

## ✨ Features

### 📱 User Features
- **SMS Authentication** - Quick phone-based login
- **Community Posts** - Share with other residents
- **Events** - Stay updated on city events
- **Local Businesses** - Discover local shops and restaurants
- **News** - Latest city news and updates
- **Gallery** - City photos and memories
- **Real Estate** - Property listings
- **Youth Programs** - Activities for young people
- **Sports** - Matches and sports events

### 👨‍💼 Admin Features
- **Content Management** - Create and edit articles
- **Event Management** - Manage city events
- **Business Directory** - Add and edit businesses
- **Coupons** - Create promotional coupons
- **User Management** - Ban/unban users
- **Analytics** - Track app usage

## 🚀 Tech Stack

### Frontend
- **React Native** with Expo
- **Expo Router** for navigation
- **TypeScript** for type safety
- **React Native Reanimated** for animations

### Backend
- **Firebase** (beer7-b898d)
- **Firestore** database
- **Cloud Storage** for files
- **Cloud Functions** (Node.js 20)
- **Firebase Authentication**

### Deployment
- **GitHub** for version control
- **Firebase Hosting** for web
- **Google Play** for Android
- **App Store** for iOS

## 📊 Project Structure

```
BEER_SHEVA/
├── app/                          # React Native screens
│   ├── (tabs)/                   # Main tab navigation
│   ├── auth/                     # Authentication flows
│   └── admin/                    # Admin panel
├── functions/                    # Cloud Functions
│   └── index.js                  # 5 deployed functions
├── lib/                          # Utilities & config
│   ├── firebase.ts               # Firebase setup
│   ├── users.ts                  # User operations
│   ├── articles.ts               # Article operations
│   └── ...
├── components/                   # Reusable UI components
├── constants/                    # App constants
├── context/                      # React context (Auth, Toast)
├── firestore.rules              # Database security rules
├── storage.rules                # Storage security rules
└── functions/                   # Cloud Functions
```

## 🔐 Cloud Functions

The app uses 5 Cloud Functions for automatic user management:

### 1. `createAuthUserOnUserCreate`
Automatically creates a user in Firebase Authentication when a new user document is created in Firestore.

### 2. `updateAuthUserOnUserUpdate`
Syncs user updates from Firestore to Authentication (name, phone, role changes).

### 3. `deleteAuthUserOnUserDelete`
Removes users from Authentication when deleted from Firestore.

### 4. `createAdminUser`
Callable function to create new admin users (admin only).

### 5. `syncUsersWithAuth`
Scheduled daily job to verify all Firestore users exist in Authentication.

## 🔑 Admin User

**Default Admin Phone**: `0523985505`

Use this phone number to log in as an admin and access the admin panel.

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Expo CLI
- Firebase CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/orelIL123/BEER7.git
cd BEER_SHEVA

# Install dependencies
npm install

# Install Firebase Functions dependencies
cd functions && npm install && cd ..
```

### Development

```bash
# Start the Expo development server
npm start

# Run on web
npm run web

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios
```

### Firebase Setup

```bash
# Initialize Firebase
firebase init

# Deploy Cloud Functions
firebase deploy --only functions

# Deploy Firestore and Storage rules
firebase deploy --only firestore:rules,storage

# View function logs
firebase functions:log
```

## 📱 User Registration

1. User enters phone number
2. App sends SMS verification code
3. User enters code
4. Cloud Function automatically:
   - Creates user in Authentication
   - Creates user document in Firestore
   - Assigns role: 'user'
5. User can now use the app

## 👨‍💼 Admin Operations

Only users with `role: 'admin'` can:
- Create and edit articles
- Manage events
- Edit business listings
- Create coupons
- Ban/unban users
- Access admin panel

## 📚 Documentation

Comprehensive documentation is included:

- **PROJECT_COMPLETE.md** - Complete project overview
- **USER_SYSTEM_GUIDE.md** - User management explained
- **SETUP_COMPLETE.md** - Setup guide
- **FIREBASE_COMMANDS_REFERENCE.md** - All Firebase commands
- **DEPLOYMENT_REPORT.md** - Deployment details
- **QUICK_REFERENCE.md** - Quick start guide

## 🚀 Deployment

### Web Hosting
```bash
npm run build:web
firebase deploy --only hosting
```

### Android
```bash
npm run build:android
# Submit APK/AAB to Google Play
```

### iOS
```bash
npm run build:ios
# Submit IPA to App Store
```

## 🔐 Security

- **Authentication**: Phone-based SMS verification
- **Database**: Firestore rules restrict access by role
- **Storage**: Storage rules protect file access
- **Cloud Functions**: Triggered by database events
- **Admin Role**: Protects sensitive operations

### Important Security Notes

- Service account keys are in `.gitignore` and not on GitHub
- API keys are safely stored in Firebase
- Cloud Functions run with restricted permissions
- All user data is encrypted in transit

## 📊 Database Schema

### Users Collection
```javascript
users/{uid}
  - phone: string
  - name: string
  - email: string
  - role: 'admin' | 'user'
  - status: 'active' | 'banned'
  - createdAt: timestamp
  - profileImage: string (optional)
```

### Articles Collection
```javascript
articles/{id}
  - title: string
  - content: string
  - author: reference
  - createdAt: timestamp
  - updatedAt: timestamp
  - published: boolean
```

### Events Collection
```javascript
events/{id}
  - title: string
  - description: string
  - startDate: timestamp
  - endDate: timestamp
  - location: string
  - image: string
```

## 🐛 Troubleshooting

### Users not appearing in Authentication
```bash
# Run the sync function
firebase functions:call syncUsersWithAuth
```

### Cloud Functions not running
```bash
# Check logs
firebase functions:log --limit=50

# Redeploy functions
firebase deploy --only functions
```

### Firestore rules errors
```bash
# Validate rules before deploying
firebase deploy --dry-run --only firestore:rules
```

## 📞 Support

- **Firebase Console**: https://console.firebase.google.com/project/beer7-b898d
- **GitHub Issues**: https://github.com/orelIL123/BEER7/issues
- **Firebase Documentation**: https://firebase.google.com/docs

## 📄 License

This project is proprietary and owned by the City of Beer Sheva.

## 👨‍💻 Author

**orelIL123**

---

## 🎯 Status

- ✅ Firebase configured
- ✅ Cloud Functions deployed
- ✅ User system automated
- ✅ Documentation complete
- ✅ Code on GitHub

**Status**: 🟢 Ready to launch!

---

**Last Updated**: February 15, 2026  
**Version**: 1.0.0  
**Firebase Project**: beer7-b898d
