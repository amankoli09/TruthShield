# TruthShield Backend API

A real-time fact verification API that analyzes content for misinformation and provides credibility scores.

## Features

- **Real-time Content Verification**: Analyze text, URLs, and social media posts
- **Multi-source Fact Checking**: Integrates with NewsAPI, Google Search, and fact-checking databases
- **Sentiment Analysis**: Natural language processing for content sentiment
- **Credibility Scoring**: AI-powered credibility assessment
- **Caching System**: Redis-like caching for improved performance
- **Rate Limiting**: Protection against abuse
- **RESTful API**: Clean, documented endpoints

## Quick Start

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test the API**
   ```bash
   curl http://localhost:3001/api/health
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system information

### Verification
- `POST /api/verify` - Verify content for misinformation
- `GET /api/verify/history` - Get verification history
- `GET /api/verify/trending` - Get trending misinformation

## Environment Variables

### Quick Setup
Run the interactive setup script:
```bash
node setup-env.js
```

### Manual Setup
Create a `.env` file with these variables:

```env
# Required API Keys
NEWS_API_KEY=your_news_api_key
GOOGLE_SEARCH_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id

# Server Configuration
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL_SECONDS=3600
```

### Getting API Keys

**NewsAPI (Free: 1,000 requests/day)**
1. Visit https://newsapi.org/
2. Register for free account
3. Copy API key from dashboard

**Google Custom Search API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project and enable "Custom Search API"
3. Create API key in "APIs & Services" → "Credentials"
4. Go to [Google Custom Search](https://cse.google.com/cse/)
5. Create new search engine with fact-checking sites:
   - `factcheck.org`
   - `snopes.com` 
   - `politifact.com`
   - `reuters.com/fact-check`
   - `apnews.com/hub/ap-fact-check`
6. Copy your Search Engine ID

## API Usage Examples

### Verify Text Content
```bash
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Breaking: Major earthquake predicted for California next week",
    "type": "text"
  }'
```

### Verify URL
```bash
curl -X POST http://localhost:3001/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "content": "https://example.com/news-article",
    "type": "url"
  }'
```

## Response Format

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "content": "Breaking: Major earthquake...",
    "type": "text",
    "result": "false",
    "confidence": 0.85,
    "explanation": "Multiple fact-checking sources indicate this information is false or misleading.",
    "details": {
      "keywords": ["earthquake", "california", "prediction"],
      "entities": [{"type": "LOCATION", "value": "California"}],
      "sentiment": {"score": -0.2, "classification": "negative"},
      "credibilityScore": 0.3
    },
    "sources": ["FactCheck.org", "Snopes", "Reuters"],
    "factChecks": [...],
    "relatedNews": [...],
    "processingTime": 1250,
    "cached": false
  }
}
```

## Getting API Keys

1. **NewsAPI**: Visit [newsapi.org](https://newsapi.org) to get a free API key
2. **Google Custom Search**: 
   - Create a project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable Custom Search API
   - Create a Custom Search Engine at [cse.google.com](https://cse.google.com)

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Start production server
npm start
```

## Architecture

```
server/
├── routes/           # API route handlers
├── services/         # Business logic services
├── utils/           # Utility functions and helpers
├── server.js        # Main application entry point
└── package.json     # Dependencies and scripts
```

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: Request throttling
- **Input Validation**: Content length and format validation
- **Error Handling**: Secure error responses

## Performance

- **Caching**: Intelligent caching of verification results
- **Async Processing**: Non-blocking verification pipeline
- **Connection Pooling**: Efficient external API usage
- **Response Compression**: Reduced bandwidth usage

## Monitoring

The API provides detailed health checks and logging:

- Memory usage monitoring
- Uptime tracking
- Cache hit/miss statistics
- API response times

## License

MIT License - see LICENSE file for details
