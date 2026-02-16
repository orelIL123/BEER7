/**
 * Set/Update the Admin User password in Firestore.
 * After running this, the admin can log in with phone 0523985505 and password 112233.
 *
 * Usage: npm run firebase:admin
 * (Requires service account key in root as beer-sheva-service-account.json)
 */

const admin = require('firebase-admin');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const ADMIN_PHONE = '+972523985505'; // Normalized
const ADMIN_PASSWORD = '112233';

const projectRoot = path.join(__dirname, '..');
const possiblePaths = [
    path.join(projectRoot, 'beer-sheva-service-account.json'),
    path.join(projectRoot, 'beer-sheva-83442-firebase-adminsdk-fbsvc-d0802d28dc.json'),
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
].filter(Boolean);

function loadServiceAccountKey() {
    for (const keyPath of possiblePaths) {
        const resolved = path.resolve(keyPath);
        if (!fs.existsSync(resolved)) continue;
        try {
            const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
            if (data.type === 'service_account' && data.private_key) return data;
        } catch (_) { }
    }
    return null;
}

const key = loadServiceAccountKey();
if (!key) {
    console.error('❌ Missing service account key JSON file.');
    console.error('Please download your service account key from Firebase Console and save it as beer-sheva-service-account.json');
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(key)
});

const db = admin.firestore();

async function setAdminPassword() {
    console.log(`🚀 Setting admin password for ${ADMIN_PHONE}...`);

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.createHash('sha256').update(salt + ADMIN_PASSWORD).digest('hex');

    const userRef = db.collection('users').doc(ADMIN_PHONE);

    await userRef.set({
        phone: ADMIN_PHONE,
        firstName: 'Admin',
        lastName: 'System',
        fullName: 'Admin System',
        role: 'admin',
        passwordHash: passwordHash,
        salt: salt,
        updatedAt: new Date().toISOString()
    }, { merge: true });

    console.log('✅ Success! Admin password is now set to 112233.');
    console.log('You can now log in using the app with:');
    console.log('Phone: 052-3985505');
    console.log('Password: 112233');
    process.exit(0);
}

setAdminPassword().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
