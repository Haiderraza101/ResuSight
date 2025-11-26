const API_BASE_URL = 'http://localhost:5000/api';

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

 async uploadResume(file: File, model: 'clf1' | 'clf2' | 'clf3' | 'clf4' | 'both' | 'all' = 'all'): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', model);

 const response = await fetch(`${this.baseURL}/resume/upload`, {
  method: 'POST',
  body: formData,
});

const text = await response.text(); // always read as text first
let data: any;
try {
  data = JSON.parse(text); // try to parse JSON
} catch (err) {
  throw new Error(`Server returned invalid JSON: ${text}`);
}

if (!response.ok) {
  throw new Error(data?.error || 'Failed to upload resume');
}

return data;

}

  async predictFromText(text: string, model: 'clf1' | 'clf2' | 'clf3' | 'clf4' | 'both' | 'all' = 'all'): Promise<PredictResponse> {
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

  async getEvaluation(model: 'clf1' | 'clf2' | 'clf3' | 'clf4' | 'all' = 'all'): Promise<EvaluationResponse> {
    const response = await fetch(`${this.baseURL}/resume/evaluate?model=${model}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get evaluation');
    }

    return response.json();
  }
}

export default new ApiService();

