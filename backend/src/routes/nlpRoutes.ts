import express, { Request, Response } from "express";
import { analyzeText } from "../nlp/analyze.js";

const router = express.Router();

router.post("/analyze", async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const result = await analyzeText(text);
  res.json(result);
});

export default router;
