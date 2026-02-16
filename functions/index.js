const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

/**
 * Cloud Function: תופעל כאשר משתמש חדש נוסף לאוסף 'users' בFirestore
 * יוצר משתמש חדש ב-Firebase Authentication
 */
exports.createAuthUserOnUserCreate = functions
  .region('us-central1')
  .firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;

    console.log(`Creating auth user for: ${userData.phone}`);

    try {
      // בדוק אם המשתמש כבר קיים ב-Authentication
      let authUser;
      try {
        authUser = await auth.getUser(userId);
        console.log(`User ${userId} already exists in Authentication`);
        return;
      } catch (error) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }

      // יצור משתמש חדש ב-Authentication עם מספר הטלפון
      const createUserResult = await auth.createUser({
        uid: userId,
        phoneNumber: userData.phone,
        displayName: userData.name || '',
        disabled: userData.role === 'banned' || false,
      });

      console.log(`Successfully created auth user: ${createUserResult.uid}`);

      // סמן ב-Firestore שהמשתמש נוצר בSuccess
      await db.collection('users').doc(userId).update({
        authCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
        authStatus: 'active',
      });

      console.log(`Updated user doc for: ${userId}`);
    } catch (error) {
      console.error(`Error creating auth user: ${error.message}`);
      
      // עדכן את ה-Firestore עם שגיאה
      await db.collection('users').doc(userId).update({
        authStatus: 'error',
        authError: error.message,
      });

      throw error;
    }
  });

/**
 * Cloud Function: כאשר משתמש משתנה בFirestore, עדכן ב-Authentication
 */
exports.updateAuthUserOnUserUpdate = functions
  .region('us-central1')
  .firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    const userId = context.params.userId;

    console.log(`Updating auth user: ${userId}`);

    try {
      const updates = {};

      // אם השם התחנה, עדכן ב-Authentication
      if (newData.name !== oldData.name) {
        updates.displayName = newData.name || '';
      }

      // אם מספר הטלפון התחנה, עדכן ב-Authentication
      if (newData.phone !== oldData.phone) {
        updates.phoneNumber = newData.phone;
      }

      // אם ה-role התחנה ל-banned, בטל את המשתמש
      if (newData.role === 'banned' && oldData.role !== 'banned') {
        updates.disabled = true;
      }

      // אם ה-role לא עוד banned, הפעל את המשתמש
      if (newData.role !== 'banned' && oldData.role === 'banned') {
        updates.disabled = false;
      }

      // אם יש עדכונים, עדכן ב-Authentication
      if (Object.keys(updates).length > 0) {
        await auth.updateUser(userId, updates);
        console.log(`Successfully updated auth user: ${userId}`);
      }
    } catch (error) {
      console.error(`Error updating auth user: ${error.message}`);
      throw error;
    }
  });

/**
 * Cloud Function: כאשר משתמש נמחק מFirestore, מחק מAuthentication
 */
exports.deleteAuthUserOnUserDelete = functions
  .region('us-central1')
  .firestore
  .document('users/{userId}')
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;

    console.log(`Deleting auth user: ${userId}`);

    try {
      await auth.deleteUser(userId);
      console.log(`Successfully deleted auth user: ${userId}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User ${userId} not found in Authentication (already deleted)`);
        return;
      }
      console.error(`Error deleting auth user: ${error.message}`);
      throw error;
    }
  });

/**
 * API Function: ליצור משתמש אדמין דרך HTTP
 */
exports.createAdminUser = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
  // אימות - רק admins יכולים ליצור admins
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can create admin users'
    );
  }

  const { phone, name } = data;

  if (!phone) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Phone number is required'
    );
  }

  try {
    // יצור UID בהתאם למספר הטלפון (בלי +972)
    const uid = phone.replace(/^(\+972|0)/, '').replace(/\D/g, '');

    // בדוק אם המשתמש כבר קיים
    const existingUser = await db.collection('users').doc(uid).get();
    if (existingUser.exists) {
      throw new functions.https.HttpsError(
        'already-exists',
        'User with this phone number already exists'
      );
    }

    // יצור משתמש ב-Authentication
    const authUser = await auth.createUser({
      uid: uid,
      phoneNumber: phone.startsWith('+') ? phone : `+972${phone.slice(1)}`,
      displayName: name || '',
    });

    // יצור משתמש ב-Firestore
    await db.collection('users').doc(uid).set({
      phone: phone,
      name: name || '',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      authCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      authStatus: 'active',
      createdBy: context.auth.uid,
    });

    console.log(`Admin user created: ${uid}`);

    return {
      success: true,
      message: `Admin user created: ${phone}`,
      uid: uid,
      phone: phone,
    };
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create admin user: ${error.message}`
    );
  }
});

/**
 * API Function: Create admin user with email and password
 * תיצור משתמש אדמין עם סיסמא
 */
exports.createAdminUserWithPassword = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  // Check if caller is admin
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can create admin users'
    );
  }

  const { email, password, phone, name } = data;

  // Validate inputs
  if (!email || !password) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Email and password are required'
    );
  }

  if (password.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 6 characters'
    );
  }

  try {
    // Create auth user with email and password
    const authUser = await auth.createUser({
      email: email,
      password: password,
      displayName: name || email,
      phoneNumber: phone || '',
      disabled: false,
    });

    // Create user document in Firestore
    await db.collection('users').doc(authUser.uid).set({
      email: email,
      phone: phone || '',
      name: name || email,
      role: 'admin',
      authMethod: 'email-password',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      authCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      authStatus: 'active',
      createdBy: context.auth.uid,
    });

    console.log(`Admin user created with email: ${email}`);

    return {
      success: true,
      message: `Admin user created with email: ${email}`,
      uid: authUser.uid,
      email: email,
    };
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create admin user: ${error.message}`
    );
  }
});

/**
 * Scheduled Function: בדיקה שלוקית שכל המשתמשים ב-Firestore קיימים בAuthentication
 */
exports.syncUsersWithAuth = functions
  .region('us-central1')
  .pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('Starting users sync with Authentication...');

    try {
      const usersSnapshot = await db.collection('users').get();
      let synced = 0;
      let errors = 0;

      for (const doc of usersSnapshot.docs) {
        const userId = doc.id;
        const userData = doc.data();

        try {
          // בדוק אם המשתמש קיים ב-Authentication
          const authUser = await auth.getUser(userId);

          // עדכן אם נדרש
          const updates = {};
          if (authUser.displayName !== userData.name) {
            updates.displayName = userData.name || '';
          }
          if (authUser.disabled !== (userData.role === 'banned')) {
            updates.disabled = userData.role === 'banned';
          }

          if (Object.keys(updates).length > 0) {
            await auth.updateUser(userId, updates);
            synced++;
          }
        } catch (error) {
          if (error.code === 'auth/user-not-found') {
            // משתמש קיים ב-Firestore אבל לא ב-Authentication, צור אותו
            try {
              await auth.createUser({
                uid: userId,
                phoneNumber: userData.phone,
                displayName: userData.name || '',
                disabled: userData.role === 'banned',
              });
              synced++;
            } catch (createError) {
              console.error(`Failed to create auth user ${userId}: ${createError.message}`);
              errors++;
            }
          } else {
            console.error(`Error syncing user ${userId}: ${error.message}`);
            errors++;
          }
        }
      }

      console.log(`Sync complete. Synced: ${synced}, Errors: ${errors}`);
      return null;
    } catch (error) {
      console.error(`Fatal error during sync: ${error.message}`);
      throw error;
    }
  });

/**
 * Helper function: Send SMS via sms4free API
 */
async function sendSMS(recipient, message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      key: 'mgfwkoRBI',
      user: '0523985505',
      pass: '73960779',
      sender: 'אפליקציית באר שבע',
      recipient: recipient,
      msg: message,
    });

    const options = {
      hostname: 'api.sms4free.co.il',
      path: '/ApiSMS/v2/SendSMS',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        console.log(`SMS API Response: ${body}`);
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true, response: body });
        } else {
          reject(new Error(`SMS API returned status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`SMS API Error: ${error.message}`);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

/**
 * Cloud Function: שליחת קוד OTP באמצעות SMS
 */
exports.sendOtp = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    const { phone } = data;

    if (!phone) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Phone number is required'
      );
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/[^\d]/g, '');
    
    try {
      // Check for rate limiting - max 3 attempts per 10 minutes
      const otpRef = db.collection('otpCodes').doc(normalizedPhone);
      const otpDoc = await otpRef.get();
      
      if (otpDoc.exists) {
        const data = otpDoc.data();
        const now = admin.firestore.Timestamp.now();
        const timeSinceFirst = now.toMillis() - data.firstAttempt.toMillis();
        
        // If less than 10 minutes since first attempt and already 3 attempts
        if (timeSinceFirst < 10 * 60 * 1000 && data.attempts >= 3) {
          throw new functions.https.HttpsError(
            'resource-exhausted',
            'Too many attempts. Please try again later.'
          );
        }
        
        // Reset if more than 10 minutes passed
        if (timeSinceFirst >= 10 * 60 * 1000) {
          await otpRef.delete();
        }
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send SMS
      const message = `קוד האימות שלך באפליקציית באר שבע: ${otp}`;
      await sendSMS(normalizedPhone, message);

      // Store OTP in Firestore
      const expiresAt = admin.firestore.Timestamp.fromMillis(
        Date.now() + 10 * 60 * 1000 // 10 minutes
      );

      const existingDoc = await otpRef.get();
      if (existingDoc.exists) {
        const data = existingDoc.data();
        await otpRef.update({
          code: otp,
          expiresAt: expiresAt,
          attempts: data.attempts + 1,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await otpRef.set({
          phone: normalizedPhone,
          code: otp,
          expiresAt: expiresAt,
          verified: false,
          attempts: 1,
          firstAttempt: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      console.log(`OTP sent to ${normalizedPhone}`);
      
      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      console.error(`Error sending OTP: ${error.message}`);
      throw new functions.https.HttpsError(
        'internal',
        `Failed to send OTP: ${error.message}`
      );
    }
  });

/**
 * Cloud Function: אימות קוד OTP
 */
exports.verifyOtp = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    const { phone, code } = data;

    if (!phone || !code) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Phone number and code are required'
      );
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/[^\d]/g, '');
    
    try {
      const otpRef = db.collection('otpCodes').doc(normalizedPhone);
      const otpDoc = await otpRef.get();

      if (!otpDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'No OTP found for this phone number'
        );
      }

      const otpData = otpDoc.data();
      const now = admin.firestore.Timestamp.now();

      // Check if OTP has expired
      if (now.toMillis() > otpData.expiresAt.toMillis()) {
        await otpRef.delete();
        throw new functions.https.HttpsError(
          'deadline-exceeded',
          'OTP has expired'
        );
      }

      // Check if OTP matches
      if (otpData.code !== code) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid OTP code'
        );
      }

      // Mark as verified
      await otpRef.update({
        verified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`OTP verified for ${normalizedPhone}`);

      return {
        success: true,
        message: 'OTP verified successfully',
        phone: normalizedPhone,
      };
    } catch (error) {
      console.error(`Error verifying OTP: ${error.message}`);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        'internal',
        `Failed to verify OTP: ${error.message}`
      );
    }
  });
