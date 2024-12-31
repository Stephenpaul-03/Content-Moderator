const { auth } = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Extracted Token:', token);

    if (!token) throw new Error('No token provided');
    
    const decodedToken = await auth.verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateUser };
