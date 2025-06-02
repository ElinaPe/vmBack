require('dotenv').config();
const admin = require('firebase-admin');
// const serviceAccount = require('./bulmerinstructions-firebase-adminsdk-3581j-b9e63e8cc7.json');

// Lue base64-koodattu ympäristömuuttuja ja dekoodaa se
const serviceAccountBuffer = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64');
const serviceAccount = JSON.parse(serviceAccountBuffer.toString('utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "vierumaki-42bc7.appspot.com",
});

const db = admin.firestore();
const storage = admin.storage().bucket();

module.exports = db;

