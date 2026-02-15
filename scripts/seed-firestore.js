/**
 * Seed Firestore so collections appear in Firebase Console.
 * Run once: GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json node scripts/seed-firestore.js
 *
 * Get the key: Firebase Console → Project Settings → Service accounts → Generate new private key
 * Save as beer-sheva-service-account.json (do not commit).
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const defaultPaths = [
  path.join(projectRoot, 'beer-sheva-service-account.json'),
  path.join(projectRoot, 'beer-sheva-83442-firebase-adminsdk-fbsvc-d0802d28dc.json'),
  path.join(projectRoot, 'google-services-16.json'),
  path.join(projectRoot, 'google-services.json'),
];

// אפשרות 1: path כפרמטר – node scripts/seed-firestore.js path/to/key.json
const argPath = process.argv[2];
const possiblePaths = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  argPath ? path.resolve(process.cwd(), argPath) : null,
  ...defaultPaths,
].filter(Boolean);

function loadServiceAccountKey() {
  for (const keyPath of possiblePaths) {
    if (!keyPath) continue;
    const resolved = path.resolve(keyPath);
    if (!fs.existsSync(resolved)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(resolved, 'utf8'));
      if (data.type === 'service_account' && data.private_key) return data;
    } catch (_) {}
  }
  return null;
}

const key = loadServiceAccountKey();
let app;
try {
  app = admin.app();
} catch {
  if (!key) {
    console.error('Missing service account key (type: service_account, with private_key).');
    console.error('');
    console.error('Tried:');
    possiblePaths.forEach((p) => console.error('  -', path.resolve(p), fs.existsSync(p) ? '(exists)' : '(not found)'));
    console.error('');
    console.error('Do this:');
    console.error('  1. Firebase Console → Project Settings → Service accounts → Generate new private key');
    console.error('  2. Save the downloaded JSON in the project root as: beer-sheva-service-account.json');
    console.error('  3. Run again: npm run firebase:seed');
    console.error('');
    console.error('Or pass the key file path:');
    console.error('  node scripts/seed-firestore.js ./path/to/your-key.json');
    process.exit(1);
  }
  app = admin.initializeApp({ credential: admin.credential.cert(key) });
}

const db = admin.firestore();

async function seed() {
  const batch = db.batch();

  // One doc in article_submissions so the collection appears
  const subRef = db.collection('article_submissions').doc('_seed_');
  batch.set(subRef, {
    title: 'דוגמה – למחיקה',
    summary: 'מסמך seed כדי שהקולקציה תופיע ב-Console.',
    content: 'אפשר למחוק.',
    image: 'bino',
    category: 'news',
    submittedByPhone: '+972000000000',
    submittedAt: new Date().toISOString(),
    status: 'pending',
  });

  // One doc in gallery_items so the collection appears
  const galRef = db.collection('gallery_items').doc('_seed_');
  batch.set(galRef, {
    type: 'image',
    url: 'https://via.placeholder.com/400',
    thumbnail: 'https://via.placeholder.com/400',
    title: 'דוגמה – למחיקה',
    category: 'אתם משתפים',
    date: new Date().toISOString(),
    uploadedByPhone: '+972000000000',
  });

  // One doc in users so the collection appears (phone-only auth)
  const userRef = db.collection('users').doc('+972000000000');
  batch.set(userRef, { phone: '+972000000000', createdAt: new Date().toISOString() });

  await batch.commit();
  console.log('Done. Collections users, article_submissions and gallery_items now visible in Firebase Console.');
  console.log('You can delete the _seed_ documents from the console.');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
