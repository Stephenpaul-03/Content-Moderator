const express = require('express');
const router = express.Router();
const { db, auth } = require('../config/firebase.js');
const { validate } = require('../middlewares/validation.js');
const { AppError } = require('../middlewares/errorHandler.js');

router.post('/register', 
  validate('register'),
  async (req, res, next) => {
    try {
      const { email, password, userName, profilePicture } = req.body;
      
      console.log('Request body:', req.body);
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: userName
      });
      
      await db.collection('users').doc(userRecord.uid).set({
        userName,
        email,
        userId: userRecord.uid,
        profilePicture: profilePicture || '',
        verified: false,
        createdAt: new Date().toISOString()
      });
      
      res.status(201).json({ 
        message: 'User created successfully', 
        userId: userRecord.uid 
      });
    } catch (error) {
      console.log('Detailed error:', error);
      next(new AppError(error.message, 400));
    }
});

module.exports = router;
