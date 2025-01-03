const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const { db } = require('../config/firebase.js');
const { authenticateUser } = require('../middlewares/auth.js');
const { validate } = require('../middlewares/validation.js');
const { AppError } = require('../middlewares/errorHandler.js');

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require('fs').promises;



if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://content-moderator-16a65-default-rtdb.firebaseio.com",
  });
}

router.get('/feed', authenticateUser, async (req, res, next) => {
  try {
    const postsSnapshot = await db.collection('posts')
      .orderBy('postedTime', 'desc')
      .limit(10)
      .get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ posts });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Create post


router.post(
  '/',
  authenticateUser,
  upload.single('image'),
  validate('createPost'),
  async (req, res, next) => {
    try {
      const { title, description, location } = req.body;
      const userId = req.user.uid;

      if (!req.file) {
        throw new AppError('Image is required', 400);
      }

      // Convert the image buffer to a base64 string
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      // Prepare the post data
      const postData = {
        userId,
        title,
        description: description || '',
        postedTime: new Date().toISOString(),
        likes: 0,
        views: 0,
        location,
        image: base64Image, // Save the base64 string
        commentCount: 0,
      };

      // Add the post to the database
      const postRef = await db.collection('posts').add(postData);

      res.status(201).json({
        message: 'Post created successfully',
        postId: postRef.id,
        post: {
          id: postRef.id,
          ...postData,
        },
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
  }
);
// Get single post with comments
router.get('/:postId', authenticateUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const postDoc = await db.collection('posts').doc(postId).get();
    
    if (!postDoc.exists) {
      throw new AppError('Post not found', 404);
    }

    const post = postDoc.data();
    
    const commentsSnapshot = await db.collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
      
    const comments = [];
    for (const doc of commentsSnapshot.docs) {
      comments.push({ id: doc.id, ...doc.data() });
    }
    
    res.json({ 
      post: { id: postId, ...post },
      comments 
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Add comment to post
router.post('/:postId/comments', 
  authenticateUser,
  validate('createComment'),
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.user.uid;
      
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      const commentData = {
        content,
        userId,
        userName: userData.userName,
        profilePicture: userData.profilePicture,
        createdAt: new Date().toISOString()
      };
      
      const commentRef = await db.collection('posts')
        .doc(postId)
        .collection('comments')
        .add(commentData);
        
      await db.collection('posts').doc(postId).update({
        commentCount: admin.firestore.FieldValue.increment(1)
      });
      
      res.status(201).json({ 
        message: 'Comment added successfully',
        commentId: commentRef.id,
        comment: commentData
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
});

// Like/Unlike post
router.post('/:postId/like', authenticateUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;
    
    const likeRef = db.collection('posts')
      .doc(postId)
      .collection('likes')
      .doc(userId);
      
    const likeDoc = await likeRef.get();
    
    if (!likeDoc.exists) {
      await likeRef.set({
        userId,
        createdAt: new Date().toISOString()
      });
      
      await db.collection('posts').doc(postId).update({
        likes: admin.firestore.FieldValue.increment(1)
      });
      
      res.json({ message: 'Post liked successfully' });
    } else {
      await likeRef.delete();
      
      await db.collection('posts').doc(postId).update({
        likes: admin.firestore.FieldValue.increment(-1)
      });
      
      res.json({ message: 'Post unliked successfully' });
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Get post likes
router.get('/:postId/likes', authenticateUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const likesSnapshot = await db.collection('posts')
      .doc(postId)
      .collection('likes')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();
      
    const likes = [];
    for (const doc of likesSnapshot.docs) {
      const userData = await db.collection('users').doc(doc.id).get();
      likes.push({
        userId: doc.id,
        userName: userData.data().userName,
        profilePicture: userData.data().profilePicture,
        createdAt: doc.data().createdAt
      });
    }
    
    res.json({ likes });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

module.exports = router;
