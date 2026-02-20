const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      // Also check cookie
      const cookieToken = req.cookies?.token;
      if (!cookieToken) {
        return res.status(401).json({ 
          success: false, 
          error: 'Access denied. No token provided.' 
        });
      }
      req.token = cookieToken;
    } else {
      req.token = token;
    }

    // Verify token
    const decoded = jwt.verify(req.token, JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired. Please login again.' 
      });
    }
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid token.' 
    });
  }
};

// Optional authentication - doesn't block if no token
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  JWT_SECRET
};
