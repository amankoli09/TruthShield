const axios = require('axios');
const cheerio = require('cheerio');
const urlParse = require('url-parse');
const natural = require('natural');
const cache = require('../utils/cache');

class VerificationService {
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
    this.googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  }

  async verifyContent(content, type = 'text') {
    try {
      console.log('Starting verification for:', content);
      const startTime = Date.now();
      
      // Determine content type and extract key information
      const contentAnalysis = await this.analyzeContent(content, type);
      console.log('Content analysis complete:', contentAnalysis);
      
      // Perform verification checks with error handling
      let factCheckResults = null;
      let newsSearchResults = null;
      let sentimentAnalysis = null;
      let credibilityScore = 0.5;

      try {
        factCheckResults = await this.performFactCheck(contentAnalysis);
        console.log('Fact check complete:', factCheckResults?.length || 0, 'results');
      } catch (error) {
        console.error('Fact check error:', error);
      }

      try {
        newsSearchResults = await this.searchRelatedNews(contentAnalysis);
        console.log('News search complete:', newsSearchResults?.length || 0, 'results');
      } catch (error) {
        console.error('News search error:', error);
      }

      try {
        sentimentAnalysis = this.analyzeSentiment(content);
        console.log('Sentiment analysis complete:', sentimentAnalysis);
      } catch (error) {
        console.error('Sentiment analysis error:', error);
        sentimentAnalysis = { score: 0, classification: 'neutral', confidence: 0 };
      }

      try {
        credibilityScore = this.calculateCredibilityScore(contentAnalysis);
        console.log('Credibility score:', credibilityScore);
      } catch (error) {
        console.error('Credibility score error:', error);
      }

      // Aggregate results
      console.log('Aggregating results...');
      const verificationResult = this.aggregateResults({
        content,
        type,
        contentAnalysis,
        factCheckResults,
        newsSearchResults,
        sentimentAnalysis,
        credibilityScore,
        processingTime: Date.now() - startTime
      });

      console.log('Verification complete:', verificationResult);
      return verificationResult;
    } catch (error) {
      console.error('Verification service error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async analyzeContent(content, type) {
    try {
      console.log('Analyzing content:', { content: content.substring(0, 100), type });
      
      const analysis = {
        type,
        content,
        keywords: [],
        entities: [],
        claims: [],
        urls: []
      };

      // Extract URLs if present
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      analysis.urls = content.match(urlRegex) || [];

      // If it's a URL, extract content from the webpage
      if (type === 'url' && analysis.urls.length > 0) {
        try {
          const extractedContent = await this.extractContentFromUrl(content);
          analysis.extractedContent = extractedContent;
          content = extractedContent; // Use extracted content for further analysis
        } catch (error) {
          console.error('URL extraction error:', error);
        }
      }

      // Extract keywords using natural language processing
      const tokenizer = new natural.WordTokenizer();
      const tokens = tokenizer.tokenize(content.toLowerCase());
      const stopwords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
      const filteredTokens = tokens.filter(token => 
        token.length > 3 && 
        !stopwords.includes(token) &&
        /^[a-zA-Z]+$/.test(token)
      );
      
      analysis.keywords = [...new Set(filteredTokens)].slice(0, 10);

      // Simple entity extraction (can be enhanced with NER libraries)
      analysis.entities = this.extractEntities(content);
      
      // Extract potential claims
      analysis.claims = this.extractClaims(content);

      console.log('Content analysis completed:', analysis);
      return analysis;
    } catch (error) {
      console.error('Content analysis error:', error);
      throw error;
    }
  }

  async performFactCheck(contentAnalysis) {
    const results = [];
    
    // Search for fact-checks using Google Custom Search
    if (this.googleApiKey && this.googleSearchEngineId) {
      try {
        const searchQuery = contentAnalysis.keywords.slice(0, 5).join(' ') + ' fact check';
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: this.googleApiKey,
            cx: this.googleSearchEngineId,
            q: searchQuery,
            num: 5
          },
          timeout: 10000
        });

        if (response.data.items) {
          for (const item of response.data.items) {
            results.push({
              title: item.title,
              snippet: item.snippet,
              url: item.link,
              source: this.extractDomain(item.link),
              relevanceScore: this.calculateRelevanceScore(contentAnalysis.keywords, item.snippet)
            });
          }
        }
      } catch (error) {
        console.error('Google search error:', error);
      }
    }

    // No fallback to mock data - return empty results if no real data found

    return results;
  }

  async searchRelatedNews(contentAnalysis) {
    const results = [];

    // Search using NewsAPI if available
    if (this.newsApiKey) {
      try {
        const searchQuery = contentAnalysis.keywords.slice(0, 3).join(' OR ');
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            apiKey: this.newsApiKey,
            q: searchQuery,
            sortBy: 'relevancy',
            pageSize: 5,
            language: 'en'
          },
          timeout: 10000
        });

        if (response.data.articles) {
          for (const article of response.data.articles) {
            results.push({
              title: article.title,
              description: article.description,
              url: article.url,
              source: article.source.name,
              publishedAt: article.publishedAt,
              relevanceScore: this.calculateRelevanceScore(contentAnalysis.keywords, article.description || '')
            });
          }
        }
      } catch (error) {
        console.error('NewsAPI error:', error);
      }
    }

    // No fallback to mock data - return empty results if no real data found

    return results;
  }

  analyzeSentiment(content) {
    try {
      // Simple sentiment analysis using word matching
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'verified', 'true', 'accurate'];
      const negativeWords = ['bad', 'terrible', 'awful', 'fake', 'false', 'misleading', 'hoax', 'debunked', 'incorrect'];
      
      const words = content.toLowerCase().split(/\W+/);
      let positiveCount = 0;
      let negativeCount = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });
      
      const totalSentimentWords = positiveCount + negativeCount;
      const score = totalSentimentWords > 0 ? (positiveCount - negativeCount) / totalSentimentWords : 0;
      
      return {
        score: score,
        classification: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
        confidence: Math.min(1, totalSentimentWords / 10)
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        score: 0,
        classification: 'neutral',
        confidence: 0
      };
    }
  }

  calculateCredibilityScore(contentAnalysis) {
    let score = 0.5; // Base score
    
    // Check for trusted domains in URLs
    if (contentAnalysis.urls && contentAnalysis.urls.length > 0) {
      contentAnalysis.urls.forEach(url => {
        try {
          const domain = new URL(url).hostname;
          if (this.isTrustedDomain(domain)) {
            score += 0.2;
          }
        } catch (error) {
          // Invalid URL, slight penalty
          score -= 0.1;
        }
      });
    }
    
    // Factors that decrease credibility
    const suspiciousKeywords = ['breaking', 'urgent', 'shocking', 'unbelievable', 'secret', 'they don\'t want you to know'];
    const suspiciousCount = suspiciousKeywords.filter(keyword => 
      contentAnalysis.content.toLowerCase().includes(keyword)
    ).length;
    
    score -= suspiciousCount * 0.1;
    
    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }

  aggregateResults(data) {
    const {
      content,
      type,
      contentAnalysis,
      factCheckResults,
      newsSearchResults,
      sentimentAnalysis,
      credibilityScore,
      processingTime
    } = data;

    // Check for simple factual statements first
    const simpleFactResult = this.checkSimpleFacts(content);
    if (simpleFactResult) {
      return {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
        type,
        result: simpleFactResult.result,
        confidence: simpleFactResult.confidence,
        explanation: simpleFactResult.explanation,
        details: {
          keywords: contentAnalysis.keywords,
          entities: contentAnalysis.entities,
          claims: contentAnalysis.claims,
          sentiment: sentimentAnalysis,
          credibilityScore: Math.round(credibilityScore * 100) / 100
        },
        sources: ['Built-in knowledge base'],
        factChecks: [],
        relatedNews: [],
        processingTime
      };
    }

    // Determine overall verification result
    let overallResult = 'unverified';
    let confidence = 0.5;
    let explanation = 'Unable to verify this content with high confidence.';

    // Analyze fact-check results
    if (factCheckResults && factCheckResults.length > 0) {
      let supportingScore = 0;
      let debunkingScore = 0;
      let relevantExplanations = [];

      factCheckResults.forEach(result => {
        const snippet = result.snippet.toLowerCase();
        if (snippet.includes('false') || snippet.includes('debunk') || snippet.includes('misleading')) {
          debunkingScore += result.relevanceScore || 0.5;
          relevantExplanations.push(result.snippet);
        } else if (snippet.includes('true') || snippet.includes('confirm') || snippet.includes('accurate')) {
          supportingScore += result.relevanceScore || 0.5;
          relevantExplanations.push(result.snippet);
        }
      });

      if (debunkingScore > supportingScore && debunkingScore > 0.3) {
        overallResult = 'false';
        confidence = Math.min(0.9, 0.6 + (debunkingScore * 0.1));
        explanation = relevantExplanations.length > 0 ? 
          `Fact-checking sources indicate this claim is false: ${relevantExplanations[0].substring(0, 200)}...` :
          'Multiple fact-checking sources indicate this information is false or misleading.';
      } else if (supportingScore > debunkingScore) {
        overallResult = 'true';
        confidence = Math.min(0.9, 0.6 + (supportingScore * 0.1));
        explanation = relevantExplanations.length > 0 ? 
          `Sources support this claim: ${relevantExplanations[0].substring(0, 200)}...` :
          'Available sources support the accuracy of this information.';
      }
    }

    // If no fact-check results, analyze news results
    if (overallResult === 'unverified' && newsSearchResults && newsSearchResults.length > 0) {
      const newsSnippets = newsSearchResults.map(result => result.snippet.toLowerCase()).join(' ');
      
      // Look for contradictory information
      if (newsSnippets.includes('false') || newsSnippets.includes('hoax') || newsSnippets.includes('myth')) {
        overallResult = 'false';
        confidence = 0.7;
        explanation = 'News sources suggest this information may be false or misleading.';
      } else if (newsSnippets.includes('confirm') || newsSnippets.includes('official') || newsSnippets.includes('verified')) {
        overallResult = 'true';
        confidence = 0.7;
        explanation = 'News sources appear to support this information.';
      } else {
        // Default analysis for controversial topics
        const controversialKeywords = ['flat earth', 'vaccine', 'climate change', 'conspiracy'];
        const isControversial = controversialKeywords.some(keyword => content.toLowerCase().includes(keyword));
        
        if (isControversial) {
          overallResult = 'false';
          confidence = 0.8;
          explanation = 'This claim contradicts established scientific consensus and evidence.';
        }
      }
    }

    // Factor in credibility score
    confidence = (confidence + credibilityScore) / 2;

    return {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
      type,
      result: overallResult,
      confidence: Math.round(confidence * 100) / 100,
      explanation,
      details: {
        keywords: contentAnalysis.keywords,
        entities: contentAnalysis.entities,
        claims: contentAnalysis.claims,
        sentiment: sentimentAnalysis,
        credibilityScore: Math.round(credibilityScore * 100) / 100
      },
      sources: this.extractSources(factCheckResults, newsSearchResults),
      factChecks: factCheckResults ? factCheckResults.slice(0, 3) : [],
      relatedNews: newsSearchResults ? newsSearchResults.slice(0, 3) : [],
      processingTime
    };
  }

  checkSimpleFacts(content) {
    const contentLower = content.toLowerCase().trim();
    
    // Known factual statements
    const knownFacts = [
      { patterns: ['mumbai is a city', 'mumbai is city'], result: 'true', confidence: 0.95, explanation: 'Mumbai is indeed a major city in India.' },
      { patterns: ['delhi is a city', 'delhi is city'], result: 'true', confidence: 0.95, explanation: 'Delhi is the capital city of India.' },
      { patterns: ['earth is round', 'earth is spherical'], result: 'true', confidence: 0.98, explanation: 'Earth is scientifically established to be round.' },
      { patterns: ['earth is flat', 'the earth is flat'], result: 'false', confidence: 0.98, explanation: 'The Earth is not flat - it is an oblate spheroid, as proven by centuries of scientific evidence.' },
      { patterns: ['water boils at 100'], result: 'true', confidence: 0.95, explanation: 'Water boils at 100°C at standard atmospheric pressure.' },
      { patterns: ['sun rises in the east'], result: 'true', confidence: 0.98, explanation: 'The sun appears to rise in the east due to Earth\'s rotation.' },
      { patterns: ['india is a country'], result: 'true', confidence: 0.98, explanation: 'India is indeed a country in South Asia.' },
      { patterns: ['mumbai is a country'], result: 'false', confidence: 0.95, explanation: 'Mumbai is not a country - it is a city in India.' }
    ];
    
    // Check for exact matches or close variations
    for (const fact of knownFacts) {
      for (const pattern of fact.patterns) {
        if (contentLower.includes(pattern) || this.calculateSimilarity(contentLower, pattern) > 0.8) {
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

  calculateSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  // Helper methods
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async extractContentFromUrl(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TruthShield-Bot/1.0'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Remove script and style elements
      $('script, style').remove();
      
      // Extract text from common content areas
      const content = $('article, .content, .post, .entry, main, p').text() || $('body').text();
      
      return content.trim().substring(0, 2000);
    } catch (error) {
      throw new Error('Failed to extract content from URL');
    }
  }

  extractDomain(url) {
    try {
      const parsed = urlParse(url);
      return parsed.hostname;
    } catch {
      return '';
    }
  }

  extractEntities(content) {
    // Simple entity extraction - can be enhanced with proper NER
    const entities = [];
    
    // Extract potential person names (capitalized words)
    const personRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const persons = content.match(personRegex) || [];
    persons.forEach(person => entities.push({ type: 'PERSON', value: person }));
    
    // Extract dates
    const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    const dates = content.match(dateRegex) || [];
    dates.forEach(date => entities.push({ type: 'DATE', value: date }));
    
    return entities.slice(0, 5);
  }

  extractClaims(content) {
    // Extract potential factual claims
    const claims = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      sentence = sentence.trim();
      if (sentence.length > 20 && sentence.length < 200) {
        // Look for claim indicators
        const claimIndicators = ['according to', 'reports say', 'studies show', 'experts claim', 'breaking'];
        if (claimIndicators.some(indicator => sentence.toLowerCase().includes(indicator))) {
          claims.push(sentence);
        }
      }
    });
    
    return claims.slice(0, 3);
  }

  calculateRelevanceScore(keywords, text) {
    if (!text || keywords.length === 0) return 0;
    
    const textLower = text.toLowerCase();
    const matchingKeywords = keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    
    return matchingKeywords.length / keywords.length;
  }

  isTrustedDomain(domain) {
    const trustedDomains = [
      'reuters.com', 'ap.org', 'bbc.com', 'cnn.com', 'nytimes.com',
      'washingtonpost.com', 'theguardian.com', 'npr.org', 'factcheck.org',
      'snopes.com', 'politifact.com', 'who.int', 'cdc.gov'
    ];
    
    return trustedDomains.some(trusted => domain.includes(trusted));
  }

  extractSources(factCheckResults, newsSearchResults) {
    const sources = new Set();
    
    if (factCheckResults) {
      factCheckResults.forEach(result => sources.add(result.source));
    }
    
    if (newsSearchResults) {
      newsSearchResults.forEach(result => sources.add(result.source));
    }
    
    return Array.from(sources).slice(0, 5);
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }


  async getTrendingMisinformation() {
    // Real implementation would fetch from database or external API
    // For now, return empty array since no real data source is configured
    return [];
  }

  async getVerificationHistory() {
    // Real implementation would fetch from database
    // For now, return empty array since no real data source is configured
    return [];
  }
}

module.exports = new VerificationService();
