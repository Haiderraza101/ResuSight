const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface TopPrediction {
  category: string;
  probability: number;
}

export interface ModelPrediction {
  prediction: number;
  category: string;
  confidence: number;
  top5: TopPrediction[];
}

// Response structure now has keys as model names instead of model1, model2 etc
export interface AllModelsPredictions {
  'Logistic Regression'?: ModelPrediction;
  'Linear SVM'?: ModelPrediction;
  'Random Forest'?: ModelPrediction;
  'BiLSTM+Attention'?: ModelPrediction;
  'BiLSTM+CNN'?: ModelPrediction;
  'BiLSTM+CNN+Attention'?: ModelPrediction;
  'DistilBERT Transformer'?: ModelPrediction;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  extractedTextLength: number;
  extractedText?: string;
  predictions: AllModelsPredictions;
  error?: string;
}

export interface PredictResponse {
  success: boolean;
  predictions: AllModelsPredictions;
  error?: string;
}

// Type alias for prediction results (can be from upload or text prediction)
export type PredictionResult = AllModelsPredictions;

export interface Category {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Upload a resume file and get predictions from all 7 models
   * @param file - The resume file (PDF or TXT)
   * @returns Upload response with predictions from all models
   */
  async uploadResume(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}/api/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to upload resume');
      }

      return data;
    } catch (error: any) {
      throw new Error(
        error.message || 'Network error while uploading resume'
      );
    }
  }

  /**
   * Get predictions from raw text using all 7 models
   * @param text - Resume text
   * @returns Prediction response with all model outputs
   */
  async predictFromText(text: string): Promise<PredictResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/resume/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to get prediction');
      }

      return data;
    } catch (error: any) {
      throw new Error(
        error.message || 'Network error while getting prediction'
      );
    }
  }

  /**
   * Get all available job categories
   * @returns Categories response
   */
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/resume/categories`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch categories');
      }

      return data;
    } catch (error: any) {
      throw new Error(
        error.message || 'Network error while fetching categories'
      );
    }
  }

  /**
   * Check API health status
   * @returns Health status
   */
  async health(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error('API is not available');
    }
  }
}

export default new ApiService();

