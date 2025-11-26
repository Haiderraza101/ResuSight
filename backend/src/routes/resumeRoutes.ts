import express, { Request, Response } from "express";
import multer from "multer";
import PdfParse from "pdf-parse";
import flaskService from "../services/flaskService.js";

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
});

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await PdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to extract text from TXT
function extractTextFromTXT(buffer: Buffer): string {
  try {
    return buffer.toString('utf-8');
  } catch (error) {
    // Try latin-1 encoding if utf-8 fails
    return buffer.toString('latin-1');
  }
}

// Route: Upload and predict from file
router.post("/upload", upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    let resumeText = "";

    // Extract text based on file type
    if (file.mimetype === "application/pdf") {
      resumeText = await extractTextFromPDF(file.buffer);
    } else if (file.mimetype === "text/plain") {
      resumeText = extractTextFromTXT(file.buffer);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ error: "No text could be extracted from the file" });
    }

    // Get predictions from Flask API
    const model = (req.body.model as 'clf1' | 'clf2' | 'both') || 'both';
    const prediction = await flaskService.predictFromFile(resumeText, model);

    res.json({
      success: true,
      filename: file.originalname,
      fileSize: file.size,
      extractedTextLength: resumeText.length,
      predictions: prediction.results,
    });
  } catch (error: any) {
    console.error("Error processing file:", error);
    res.status(500).json({ 
      error: error.message || "Failed to process file" 
    });
  }
});

// Route: Predict from text
router.post("/predict", async (req: Request, res: Response) => {
  try {
    const { text, model } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const modelType = (model as 'clf1' | 'clf2' | 'both') || 'both';
    const prediction = await flaskService.predictResume(text, modelType);

    res.json({
      success: true,
      predictions: prediction.results,
    });
  } catch (error: any) {
    console.error("Error predicting:", error);
    res.status(500).json({ 
      error: error.message || "Failed to get prediction" 
    });
  }
});

// Route: Get all categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = await flaskService.getCategories();
    res.json(categories);
  } catch (error: any) {
    console.error("Error getting categories:", error);
    res.status(500).json({ 
      error: error.message || "Failed to get categories" 
    });
  }
});

export default router;

