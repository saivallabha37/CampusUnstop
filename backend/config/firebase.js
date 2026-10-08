const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Ensure literal newline characters are parsed correctly
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      })
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
  }
}

module.exports = admin;

