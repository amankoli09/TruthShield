const express = require('express');
const router = express.Router();

// Simple in-memory storage for user data (in production, use a real database)
const userStats = new Map();
const userFactChecks = new Map();

// Helper function to verify token (same as in auth.js)
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

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
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

  req.userId = payload.userId;
  next();
};

// GET /api/dashboard - Get user dashboard data
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    
    // Get or create user stats
    let stats = userStats.get(userId);
    if (!stats) {
      stats = {
        totalChecks: 0,
        accurateChecks: 0,
        savedChecks: 0,
        streakDays: 0
      };
      userStats.set(userId, stats);
    }

    // Get recent fact checks
    let recentChecks = userFactChecks.get(userId) || [];

    const dashboardData = {
      stats,
      recentChecks: recentChecks.slice(0, 10), // Last 10 checks
      user: {
        id: userId,
        name: 'User',
        email: 'user@example.com',
        joinDate: new Date().toISOString().split('T')[0]
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/fact-checks/recent - Get user's recent fact-checks
router.get('/fact-checks/recent', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;
    
    let recentChecks = userFactChecks.get(userId) || [];
    
    res.json({
      success: true,
      data: recentChecks.slice(0, limit)
    });
    
  } catch (error) {
    console.error('Recent checks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/user/stats - Get user statistics
router.get('/user/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    
    let stats = userStats.get(userId);
    if (!stats) {
      stats = {
        totalChecks: 0,
        accurateChecks: 0,
        savedChecks: 0,
        streakDays: 0
      };
      userStats.set(userId, stats);
    }

    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/fact-checks/:id/save - Save/bookmark a fact-check
router.post('/fact-checks/:id/save', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const factCheckId = req.params.id;
    
    // Update user stats
    let stats = userStats.get(userId) || {
      totalChecks: 0,
      accurateChecks: 0,
      savedChecks: 0,
      streakDays: 0
    };
    
    stats.savedChecks += 1;
    userStats.set(userId, stats);

    res.json({
      success: true,
      message: 'Fact-check saved successfully'
    });
    
  } catch (error) {
    console.error('Save fact-check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/fact-checks/:id/save - Remove saved fact-check
router.delete('/fact-checks/:id/save', authenticateToken, (req, res) => {
  try {
    const userId = req.userId;
    const factCheckId = req.params.id;
    
    // Update user stats
    let stats = userStats.get(userId) || {
      totalChecks: 0,
      accurateChecks: 0,
      savedChecks: 0,
      streakDays: 0
    };
    
    if (stats.savedChecks > 0) {
      stats.savedChecks -= 1;
    }
    userStats.set(userId, stats);

    res.json({
      success: true,
      message: 'Fact-check removed from saved items'
    });
    
  } catch (error) {
    console.error('Remove fact-check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
