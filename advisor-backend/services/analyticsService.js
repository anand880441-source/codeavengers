const axios = require('axios');

class AnalyticsService {
  constructor() {
    this.baseURL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getFundMetrics(schemeCode) {
    try {
      const response = await this.client.post('/api/funds/metrics', {
        scheme_code: schemeCode
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching fund metrics:', error.message);
      throw error;
    }
  }

  async analyzeFund(schemeCode) {
    try {
      const response = await this.client.post('/api/funds/analyze', {
        scheme_code: schemeCode
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing fund:', error.message);
      throw error;
    }
  }

  async getRiskProfile(riskTolerance, investmentHorizon) {
    try {
      const response = await this.client.post('/api/funds/risk-profile', {
        risk_tolerance: riskTolerance,
        investment_horizon: investmentHorizon
      });
      return response.data;
    } catch (error) {
      console.error('Error getting risk profile:', error.message);
      throw error;
    }
  }

  async getRecommendations(schemes, riskTolerance, investmentHorizon) {
    try {
      const response = await this.client.post('/api/analytics/recommend', {
        schemes: schemes,
        risk_tolerance: riskTolerance,
        investment_horizon: investmentHorizon
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error.message);
      throw error;
    }
  }

  async searchSchemes(query) {
    try {
      const response = await this.client.get('/api/funds/schemes', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching schemes:', error.message);
      throw error;
    }
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Analytics service health check failed:', error.message);
      return { status: 'unhealthy' };
    }
  }
}

module.exports = new AnalyticsService();
