#!/usr/bin/env node

/**
 * Script to create admin user with email and password
 * Usage: node scripts/create-admin-password.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../beer7-b898d-firebase-adminsdk-fbsvc-3c030460a1.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'beer7-b898d',
});

const auth = admin.auth();
const db = admin.firestore();

async function createAdminWithPassword() {
  try {
    console.log('🔐 Creating admin user with email and password...');

    // Admin credentials
    const email = 'admin@beer7.app';
    const password = '112233';
    const displayName = 'Admin Beer Sheva';

    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      disabled: false,
    });

    console.log(`✅ Auth user created: ${userRecord.uid}`);

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      name: displayName,
      role: 'admin',
      authMethod: 'email-password',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      authCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      authStatus: 'active',
    });

    console.log(`✅ Firestore user document created: ${userRecord.uid}`);

    // Also keep the phone-based admin for backward compatibility
    console.log('\n📱 Phone-based admin (0523985505) is also available for SMS login');

    console.log('\n' + '='.repeat(60));
    console.log('✅ ADMIN USER CREATED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log('\n📋 Admin Login Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log('\n📱 Backup Admin (SMS):');
    console.log(`   Phone: 0523985505`);
    console.log(`   Method: SMS code verification`);
    console.log('\n' + '='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminWithPassword();
