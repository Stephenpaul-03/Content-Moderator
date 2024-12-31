const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
