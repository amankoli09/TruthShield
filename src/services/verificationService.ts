const API_BASE_URL = 'http://localhost:3001/api';

export interface VerificationResult {
  id: string;
  timestamp: string;
  content: string;
  type: string;
  result: 'true' | 'false' | 'unverified' | 'partially-false';
  confidence: number;
  explanation: string;
  details: {
    keywords: string[];
    entities: Array<{ type: string; value: string }>;
    claims: string[];
    sentiment: {
      score: number;
      classification: 'positive' | 'negative' | 'neutral';
      confidence: number;
    };
    credibilityScore: number;
  };
  sources: string[];
  factChecks: Array<{
    title: string;
    snippet: string;
    url: string;
    source: string;
    relevanceScore: number;
  }>;
  relatedNews: Array<{
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
    relevanceScore: number;
  }>;
  processingTime: number;
  cached: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class VerificationService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  async verifyContent(content: string, type: 'text' | 'url' = 'text'): Promise<VerificationResult | null> {
    console.log('Frontend service: Making request for:', content);
    
    const response = await this.makeRequest<VerificationResult>('/verify', {
      method: 'POST',
      body: JSON.stringify({ content, type }),
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    console.log('Frontend service: API response:', response);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to verify content');
  }

  async getVerificationHistory(limit: number = 10, offset: number = 0) {
    const response = await this.makeRequest<{
      history: VerificationResult[];
      total: number;
      limit: number;
      offset: number;
    }>(`/verify/history?limit=${limit}&offset=${offset}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch history');
  }

  async getTrendingMisinformation() {
    const response = await this.makeRequest<Array<{
      id: string;
      content: string;
      status: string;
      shares: number;
      verifiedAt: string;
    }>>('/verify/trending');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch trending data');
  }

  async checkApiHealth() {
    const response = await this.makeRequest<{
      message: string;
      timestamp: string;
      uptime: number;
      environment: string;
    }>('/health');

    return response.success;
  }

  // Utility method to format verification results for display
  formatResult(result: VerificationResult): {
    statusColor: string;
    statusIcon: string;
    statusText: string;
    confidenceLevel: 'Low' | 'Medium' | 'High';
  } {
    const confidence = result.confidence;
    const confidenceLevel = confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';

    switch (result.result) {
      case 'true':
        return {
          statusColor: 'text-green-600',
          statusIcon: '✅',
          statusText: 'Verified as True',
          confidenceLevel
        };
      case 'false':
        return {
          statusColor: 'text-red-600',
          statusIcon: '❌',
          statusText: 'Identified as False',
          confidenceLevel
        };
      case 'partially-false':
        return {
          statusColor: 'text-orange-600',
          statusIcon: '⚠️',
          statusText: 'Partially False',
          confidenceLevel
        };
      default:
        return {
          statusColor: 'text-blue-600',
          statusIcon: '🔍',
          statusText: 'Unverified',
          confidenceLevel
        };
    }
  }
}

export default new VerificationService();
