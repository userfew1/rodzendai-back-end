"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)()); // อนุญาตให้ทุกโดเมนเข้าถึง API
app.use(express_1.default.json()); // ใช้ JSON Middleware
app.use('/api', index_1.default); // ใช้ Router
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
