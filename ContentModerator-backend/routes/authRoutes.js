// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { db, auth } = require('../config/firebase.js');
const { validate } = require('../middlewares/validation.js');
const { AppError } = require('../middlewares/errorHandler.js');

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Sign in with Firebase Auth
    const userCredential = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userCredential.uid).get();
    const userData = userDoc.data();

    // Create a custom token
    const customToken = await auth.createCustomToken(userCredential.uid);
    
    // Note: The client needs to exchange this custom token for an ID token
    res.json({
      customToken,
      user: {
        uid: userCredential.uid,
        email: userCredential.email,
        ...userData
      }
    });
  } catch (error) {
    next(new AppError(error.message, 401));
  }
});

module.exports = router;
// Register route
router.post('/register', 
  validate('register'),
  async (req, res, next) => {
    try {
      const { email, password, userName, profilePicture } = req.body;
      
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: userName
      });
      
      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        userName,
        email,
        userId: userRecord.uid,
        profilePicture: profilePicture || '',
        verified: false,
        createdAt: new Date().toISOString()
      });
      
      // Generate token
      const token = await auth.createCustomToken(userRecord.uid);
      
      res.status(201).json({
        token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          userName,
          profilePicture: profilePicture || ''
        }
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
});

module.exports = router;
