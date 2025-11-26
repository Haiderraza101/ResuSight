import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nlpRoutes from "./routes/nlpRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", nlpRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Express server is running" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Resume API: http://localhost:${PORT}/api/resume`);
});
