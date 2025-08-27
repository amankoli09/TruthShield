const express = require('express');
const router = express.Router();
const verificationService = require('../services/verificationService');
const cache = require('../utils/cache');

// Verify content endpoint
router.post('/', async (req, res) => {
  try {
    console.log('Verification request received:', req.body);
    
    const { content, type = 'text' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    if (content.length > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Content too long. Maximum 10,000 characters allowed.'
      });
    }

    // Disable cache temporarily for testing
    // const cacheKey = `verify_${Buffer.from(content).toString('base64').slice(0, 50)}`;
    // const cachedResult = cache.get(cacheKey);
    
    // if (cachedResult) {
    //   console.log('Returning cached result');
    //   return res.json({
    //     success: true,
    //     data: {
    //       ...cachedResult,
    //       cached: true
    //     }
    //   });
    // }

    console.log('Performing verification...');
    // Perform verification
    const result = await verificationService.verifyContent(content, type);
    console.log('Verification completed:', result);
    
    // Cache disabled for testing
    // cache.set(cacheKey, result, 3600); // Cache for 1 hour
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Verification route error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to verify content. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get verification history (mock endpoint)
router.get('/history', (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  
  // Mock history data
  const history = [
    {
      id: '1',
      content: 'Breaking: Major earthquake predicted for California next week',
      result: 'false',
      confidence: 0.95,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sources: ['USGS', 'Seismological Society']
    },
    {
      id: '2',
      content: 'New COVID variant spreads via packaged food',
      result: 'false',
      confidence: 0.88,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sources: ['WHO', 'CDC']
    }
  ];

  const paginatedHistory = history.slice(offset, offset + parseInt(limit));

  res.json({
    success: true,
    data: {
      history: paginatedHistory,
      total: history.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

// Get trending misinformation
router.get('/trending', async (req, res) => {
  try {
    const trending = await verificationService.getTrendingMisinformation();
    
    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Trending fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending misinformation'
    });
  }
});

module.exports = router;
