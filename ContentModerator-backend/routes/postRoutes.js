const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { db } = require('../config/firebase.js');
const { authenticateUser } = require('../middlewares/auth.js');
const { validate } = require('../middlewares/validation.js');
const { AppError } = require('../middlewares/errorHandler.js');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://content-moderator-16a65-default-rtdb.firebaseio.com",
  });
}

router.get('/feed', authenticateUser, async (req, res, next) => {
  try {
    const postsSnapshot = await db.collection('posts').limit(10).get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ posts });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Create post
router.post('/', 
  // authenticateUser,  
  validate('createPost'), 
  async (req, res, next) => {
    try {
      const { title, description, location, images, videos } = req.body;
      const userId = 'testUserId'; 
      
      const postData = {
        userId,
        title,
        description: description || '',
        postedTime: new Date().toISOString(),
        likes: 0,
        views: 0,
        location,
        images: images || [],
        videos: videos || [],
        commentCount: 0
      };
      
      const postRef = await db.collection('posts').add(postData);
      const newPost = { id: postRef.id, ...postData };

      // Return the newly created post data to the frontend
      res.status(201).json({ 
        message: 'Post created successfully', 
        post: newPost
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
});

module.exports = router;
