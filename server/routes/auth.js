const express = require('express');
const passport = require('passport');
const router = express.Router();

// Simple in-memory user storage (in production, use a real database)
const users = new Map();
let userIdCounter = 1;

// Helper function to generate a simple JWT-like token
const generateToken = (userId) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ 
    userId, 
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  })).toString('base64');
  const signature = Buffer.from('truthshield-secret').toString('base64');
  return `${header}.${payload}.${signature}`;
};

// Helper function to verify token
const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch {
    return null;
  }
};

// POST /api/auth/signup - Register new user
router.post('/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    for (const [id, user] of users) {
      if (user.email === email) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }
    }

    // Create new user
    const userId = userIdCounter++;
    const newUser = {
      id: userId.toString(),
      name,
      email,
      password, // In production, hash this password
      createdAt: new Date().toISOString()
    };

    users.set(userId.toString(), newUser);

    const token = generateToken(userId.toString());
    
    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    let foundUser = null;
    for (const [id, user] of users) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (foundUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(foundUser.id);
    
    res.json({
      success: true,
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/auth/verify - Verify token
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const user = users.get(payload.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', (req, res) => {
  // For demo purposes, create a mock Google user instead of real OAuth
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
    // Create a demo Google user
    const userId = userIdCounter++;
    const demoUser = {
      id: userId.toString(),
      name: 'Demo Google User',
      email: 'demo@gmail.com',
      picture: 'https://via.placeholder.com/150',
      provider: 'google',
      createdAt: new Date().toISOString()
    };
    
    users.set(userId.toString(), demoUser);
    const authToken = generateToken(userId.toString());
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/auth/callback?token=${authToken}&user=${encodeURIComponent(JSON.stringify({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      picture: demoUser.picture
    }))}`); 
  }
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res);
});

// GET /api/auth/google-status - Check if Google OAuth is configured
router.get('/google-status', (req, res) => {
  const isConfigured = process.env.GOOGLE_CLIENT_ID && 
                      process.env.GOOGLE_CLIENT_SECRET && 
                      process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
                      process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here';
  
  res.json({
    success: true,
    available: isConfigured
  });
});

// GET /api/auth/google/callback - Handle Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth?error=oauth_failed' }),
  (req, res) => {
    // Successful authentication
    const user = req.user;
    const authToken = generateToken(user.id);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${authToken}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture
    }))}`);
  }
);

// POST /api/auth/google - Google OAuth login (for frontend token exchange)
router.post('/google', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // In a real implementation, you would verify the Google token
    // For now, create a mock Google user
    const userId = userIdCounter++;
    const googleUser = {
      id: userId.toString(),
      name: 'Google User',
      email: 'googleuser@gmail.com',
      createdAt: new Date().toISOString()
    };

    users.set(userId.toString(), googleUser);

    const authToken = generateToken(userId.toString());
    
    res.json({
      success: true,
      token: authToken,
      user: {
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email
      }
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
