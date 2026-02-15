const functions = require('firebase-functions');
const admin = require('firebase-admin');

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
