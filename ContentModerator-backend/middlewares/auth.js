const { auth } = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      throw new Error('Invalid token format');
    }

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'Please provide a valid ID token, not a custom token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized', message: error.message });
  }
};

module.exports = { authenticateUser };
