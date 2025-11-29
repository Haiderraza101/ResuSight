const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ModelPrediction {
  prediction: number;
  category: string;
  confidence: number | null;
  probabilities?: { [key: string]: number };
}

export interface PredictionResult {
  model1?: ModelPrediction;
  model2?: ModelPrediction;
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
   * Upload a resume file and get predictions
   * @param file - The resume file (PDF or TXT)
   * @param model - Which model(s) to use: 'clf1', 'clf2', or 'both' (default: 'both')
   * @returns Upload response with predictions
   */
  async uploadResume(
    file: File,
    model: 'clf1' | 'clf2' | 'both' = 'both'
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

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
   * Get predictions from raw text
   * @param text - Resume text
   * @param model - Which model(s) to use: 'clf1', 'clf2', or 'both' (default: 'both')
   * @returns Prediction response
   */
  async predictFromText(
    text: string,
    model: 'clf1' | 'clf2' | 'both' = 'both'
  ): Promise<PredictResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/resume/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, model }),
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

