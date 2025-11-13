import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nlpRoutes from "./routes/nlpRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", nlpRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
