const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export interface UploadResponse {
  success: boolean;
  filename: string;
  fileSize: number;
  extractedTextLength: number;
  predictions: PredictionResult;
  error?: string;
}

export interface PredictResponse {
  success: boolean;
  predictions: PredictionResult;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async uploadResume(file: File, model: 'clf1' | 'clf2' | 'both' = 'both'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    const response = await fetch(`${this.baseURL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload resume');
    }

    return response.json();
  }

  async predictFromText(text: string, model: 'clf1' | 'clf2' | 'both' = 'both'): Promise<PredictResponse> {
    const response = await fetch(`${this.baseURL}/resume/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, model }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get prediction');
    }

    return response.json();
  }

  async getCategories(): Promise<any> {
    const response = await fetch(`${this.baseURL}/resume/categories`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get categories');
    }

    return response.json();
  }
}

export default new ApiService();

