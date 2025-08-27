const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple fact checker for basic statements
function checkSimpleFacts(content) {
  const contentLower = content.toLowerCase().trim();
  
  // Known factual statements
  const knownFacts = [
    { patterns: ['mumbai is a city', 'mumbai is city'], result: 'true', confidence: 0.95, explanation: 'Mumbai is indeed a major city in India and the financial capital of the country.' },
    { patterns: ['delhi is a city', 'delhi is city'], result: 'true', confidence: 0.95, explanation: 'Delhi is the capital city of India.' },
    { patterns: ['earth is round', 'earth is spherical'], result: 'true', confidence: 0.98, explanation: 'Earth is scientifically established to be round.' },
    { patterns: ['water boils at 100'], result: 'true', confidence: 0.95, explanation: 'Water boils at 100°C at standard atmospheric pressure.' },
    { patterns: ['sun rises in the east'], result: 'true', confidence: 0.98, explanation: 'The sun appears to rise in the east due to Earth\'s rotation.' }
  ];
  
  // Check for exact matches or close variations
  for (const fact of knownFacts) {
    for (const pattern of fact.patterns) {
      if (contentLower.includes(pattern)) {
        return {
          result: fact.result,
          confidence: fact.confidence,
          explanation: fact.explanation
        };
      }
    }
  }
  
  return null;
}

// Verification endpoint
app.post('/api/verify', (req, res) => {
  try {
    console.log('Verification request received:', req.body);
    
    const { content, type = 'text' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Check for simple facts first
    const simpleFactResult = checkSimpleFacts(content);
    
    let result;
    if (simpleFactResult) {
      result = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        content: content,
        type: type,
        result: simpleFactResult.result,
        confidence: simpleFactResult.confidence,
        explanation: simpleFactResult.explanation,
        details: {
          keywords: content.toLowerCase().split(/\s+/).filter(word => word.length > 3),
          entities: [],
          claims: [content],
          sentiment: { score: 0, classification: 'neutral', confidence: 0.5 },
          credibilityScore: 0.8
        },
        sources: ['Built-in knowledge base'],
        factChecks: [],
        relatedNews: [],
        processingTime: 50
      };
    } else {
      // Default response for unknown content
      result = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        content: content,
        type: type,
        result: 'unverified',
        confidence: 0.5,
        explanation: 'Unable to verify this content with available sources. Please check with authoritative sources.',
        details: {
          keywords: content.toLowerCase().split(/\s+/).filter(word => word.length > 3),
          entities: [],
          claims: [content],
          sentiment: { score: 0, classification: 'neutral', confidence: 0.5 },
          credibilityScore: 0.5
        },
        sources: [],
        factChecks: [],
        relatedNews: [],
        processingTime: 30
      };
    }

    console.log('Returning result:', result);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify content'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TruthShield API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 TruthShield Test Server running on port ${port}`);
  console.log(`📊 Ready to handle verification requests`);
});
