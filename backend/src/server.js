"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const nlpRoutes_js_1 = __importDefault(require("./routes/nlpRoutes.js"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use("/api", nlpRoutes_js_1.default);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
