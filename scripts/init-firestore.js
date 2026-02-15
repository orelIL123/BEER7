#!/usr/bin/env node
/**
 * Firestore Initialization Script
 * Creates initial admin user and test data in Firebase
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, '../beer7-b898d-firebase-adminsdk-fbsvc-3c030460a1.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'beer7-b898d',
});

const db = admin.firestore();

async function initializeFirestore() {
  console.log('🔥 Starting Firestore initialization...\n');

  try {
    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const adminRef = db.collection('users').doc('admin_0523985505');
    
    await adminRef.set({
      uid: 'admin_0523985505',
      phoneNumber: '+972523985505',
      name: 'Admin Beer Sheva',
      email: 'admin@beersheva.app',
      role: 'admin',
      isAdmin: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      profilePicture: null,
      status: 'active',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content'],
      lastLogin: null,
      verified: true,
    });
    console.log('✅ Admin user created: admin@beersheva.app (0523985505)\n');

    // 2. Create City Config
    console.log('🏙️  Creating city configuration...');
    const cityConfigRef = db.collection('cityConfig').doc('main');
    
    await cityConfigRef.set({
      name: 'באר שבע',
      englishName: 'Beer Sheva',
      description: 'אפליקציית באר שבע - כל מה שצריך לדעת על העיר',
      location: {
        lat: 31.2461,
        lng: 34.7913,
      },
      population: 220000,
      foundedYear: 1900,
      colors: {
        primary: '#DC2626',
        primaryLight: '#EF4444',
        primaryDark: '#991B1B',
        secondary: '#F87171',
      },
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });
    console.log('✅ City configuration created\n');

    // 3. Create Initial Collections Structure
    console.log('📂 Creating collection structure...');
    
    const collections = [
      'users',
      'articles',
      'article_submissions',
      'gallery_items',
      'events',
      'persons',
      'businesses',
      'coupons',
      'matches',
      'cityConfig',
    ];

    for (const collection of collections) {
      const exists = await db.collection(collection).limit(1).get();
      if (exists.empty) {
        // Create a placeholder document to ensure collection exists
        if (collection !== 'cityConfig') {
          await db.collection(collection).doc('_placeholder').set({
            _placeholder: true,
            createdAt: admin.firestore.Timestamp.now(),
          });
          console.log(`  ✅ ${collection} collection created`);
        }
      } else {
        console.log(`  ✅ ${collection} collection already exists`);
      }
    }
    console.log('');

    // 4. Create Sample Article
    console.log('📰 Creating sample article...');
    await db.collection('articles').add({
      title: 'ברוכים הבאים לאפליקציית באר שבע',
      titleHe: 'ברוכים הבאים לאפליקציית באר שבע',
      titleEn: 'Welcome to Beer Sheva App',
      content: 'זו אפליקציה חדשה עבור עיר באר שבע',
      author: 'Admin',
      authorId: 'admin_0523985505',
      category: 'news',
      imageUrl: null,
      views: 0,
      likes: 0,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      published: true,
      status: 'active',
    });
    console.log('✅ Sample article created\n');

    // 5. Create Sample Event
    console.log('📅 Creating sample event...');
    await db.collection('events').add({
      name: 'אירוע ברוכים הבאים לאפליקציית באר שבע',
      nameEn: 'Welcome Event - Beer Sheva App Launch',
      description: 'אירוע הצגת האפליקציה החדשה',
      date: admin.firestore.Timestamp.fromDate(new Date('2026-02-20')),
      location: 'מרכז העיר',
      organizer: 'Admin',
      organizerId: 'admin_0523985505',
      image: null,
      attendees: 0,
      category: 'community',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      published: true,
      status: 'active',
    });
    console.log('✅ Sample event created\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 FIRESTORE INITIALIZATION COMPLETE! 🎉');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('✅ Created:');
    console.log('   • Admin User: 0523985505 (admin@beersheva.app)');
    console.log('   • City Configuration: באר שבע');
    console.log('   • Collections: users, articles, events, etc.');
    console.log('   • Sample Article: Welcome article');
    console.log('   • Sample Event: App launch event\n');

    console.log('📊 You can now view data at:');
    console.log('   https://console.firebase.google.com/project/beer7-b898d/firestore\n');

    console.log('🚀 Next steps:');
    console.log('   1. Start the app: npm start');
    console.log('   2. Login with: 0523985505');
    console.log('   3. You will have admin permissions\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  }
}

// Run initialization
initializeFirestore();
