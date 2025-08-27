// Dashboard service for handling user stats and fact-check data
export interface FactCheck {
  id: string;
  url: string;
  title: string;
  status: 'verified' | 'fake' | 'warning' | 'pending';
  credibility: number;
  date: string;
  time: string;
  userId: string;
}

export interface UserStats {
  totalChecks: number;
  verifiedCount: number;
  fakeCount: number;
  warningCount: number;
  savedCount: number;
  credibilityScore: number;
}

export interface DashboardData {
  stats: UserStats;
  recentChecks: FactCheck[];
  user: {
    id: string;
    name: string;
    email: string;
    joinDate: string;
  };
}

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class DashboardService {
  // Get user's dashboard data
  async getDashboardData(): Promise<{ success: boolean; data?: DashboardData; message?: string }> {
    // Real API implementation
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Failed to fetch dashboard data' };
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // Get user's recent fact-checks
  async getRecentChecks(limit: number = 10): Promise<{ success: boolean; data?: FactCheck[]; message?: string }> {
    // Real API implementation
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/fact-checks/recent?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.checks };
      } else {
        return { success: false, message: data.message || 'Failed to fetch recent checks' };
      }
    } catch (error) {
      console.error('Recent checks fetch error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{ success: boolean; data?: UserStats; message?: string }> {
    // Real API implementation
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data.stats };
      } else {
        return { success: false, message: data.message || 'Failed to fetch user stats' };
      }
    } catch (error) {
      console.error('User stats fetch error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // Save/bookmark a fact-check result
  async saveFactCheck(factCheckId: string): Promise<{ success: boolean; message?: string }> {
    // Real API implementation
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/fact-checks/${factCheckId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Fact-check saved successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to save fact-check' };
      }
    } catch (error) {
      console.error('Save fact-check error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // Remove saved fact-check
  async unsaveFactCheck(factCheckId: string): Promise<{ success: boolean; message?: string }> {
    // Real API implementation
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'No authentication token found' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/fact-checks/${factCheckId}/save`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Fact-check removed from saved items' };
      } else {
        return { success: false, message: data.message || 'Failed to remove saved fact-check' };
      }
    } catch (error) {
      console.error('Unsave fact-check error:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }
}

export const dashboardService = new DashboardService();
