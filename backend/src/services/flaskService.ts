import axios from 'axios';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5001';

export interface PredictionResult {
  model1?: {
    prediction: number;
    category: string;
    confidence: number | null;
    probabilities?: { [key: string]: number };
  };
  model2?: {
    prediction: number;
    category: string;
    confidence: number | null;
    probabilities?: { [key: string]: number };
  };
}

export interface FlaskResponse {
  success: boolean;
  results: PredictionResult;
  error?: string;
}

class FlaskService {
  private baseURL: string;

  constructor() {
    this.baseURL = FLASK_API_URL;
  }

  async predictResume(text: string, model: 'clf1' | 'clf2' | 'both' = 'both'): Promise<FlaskResponse> {
    try {
      const response = await axios.post<FlaskResponse>(`${this.baseURL}/predict`, {
        text,
        model
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to get prediction from Flask API'
      );
    }
  }

  async predictFromFile(text: string, model: 'clf1' | 'clf2' | 'both' = 'both'): Promise<FlaskResponse> {
    try {
      const response = await axios.post<FlaskResponse>(`${this.baseURL}/predict/file`, {
        text,
        model
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to get prediction from Flask API'
      );
    }
  }

  async getCategories(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/categories`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to get categories from Flask API'
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default new FlaskService();

