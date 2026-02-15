#!/usr/bin/env node

/**
 * Create simple admin user with phone and password
 * Admin: Phone 0523985505, Password 112233
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../beer7-b898d-firebase-adminsdk-fbsvc-3c030460a1.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'beer7-b898d',
});

const auth = admin.auth();
const db = admin.firestore();

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...\n');

    // Admin credentials
    const phone = '0523985505';
    const password = '112233';
    const firstName = 'Admin';
    const lastName = 'Beer7';

    console.log('📱 Phone: ' + phone);
    console.log('🔑 Password: ' + password);
    console.log('👤 Name: ' + firstName + ' ' + lastName + '\n');

    // Create user in Firebase Authentication with custom claims
    const userRecord = await auth.createUser({
      uid: 'admin_user_' + phone.replace(/\D/g, ''),
      displayName: firstName + ' ' + lastName,
    });

    // Set custom password using custom token (workaround for phone-only auth)
    // Store hashed password in Firestore for verification
    const uid = userRecord.uid;

    // Create user document in Firestore
    await db.collection('users').doc(uid).set({
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      fullName: firstName + ' ' + lastName,
      role: 'admin',
      isResident: true,
      password: password, // In production, use proper hashing!
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      authStatus: 'active',
    });

    // Set admin custom claim
    await auth.setCustomUserClaims(uid, { role: 'admin' });

    console.log('✅ Admin user created successfully!\n');
    console.log('═'.repeat(60));
    console.log('✅ ADMIN CREATED');
    console.log('═'.repeat(60));
    console.log('\n📋 Login Details:');
    console.log('   Phone: 0523985505');
    console.log('   Password: 112233');
    console.log('   UID: ' + uid);
    console.log('\n⚡ Now create registration form with:');
    console.log('   - First Name');
    console.log('   - Last Name');
    console.log('   - Phone (must be unique)');
    console.log('   - Are you a resident? (Yes/No)');
    console.log('   - Password');
    console.log('\n' + '═'.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
