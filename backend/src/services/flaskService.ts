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
  model3?: {
    prediction: number;
    category: string;
    confidence: number | null;
    probabilities?: { [key: string]: number };
  };
  model4?: {
    prediction: number;
    category: string;
    confidence: number | null;
    probabilities?: { [key: string]: number };
  };
}

export interface EvaluationResult {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  auc: number | null;
  top3_accuracy: number | null;
  confusion_matrix: number[][];
  labels: string[];
}

export interface EvaluationResponse {
  success: boolean;
  results: {
    model1?: EvaluationResult;
    model2?: EvaluationResult;
    model3?: EvaluationResult;
    model4?: EvaluationResult;
  };
  error?: string;
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

  async predictResume(text: string, model: 'clf1' | 'clf2' | 'clf3' | 'clf4' | 'both' | 'all' = 'all'): Promise<FlaskResponse> {
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

  async predictFromFile(text: string, model: 'clf1' | 'clf2' | 'clf3' | 'clf4' | 'both' | 'all' = 'all'): Promise<FlaskResponse> {
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

  async evaluateModels(model: 'clf1' | 'clf2' | 'clf3' | 'clf4' | 'all' = 'all'): Promise<EvaluationResponse> {
    try {
      const response = await axios.get<EvaluationResponse>(`${this.baseURL}/evaluate`, {
        params: { model }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to get evaluation from Flask API'
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

