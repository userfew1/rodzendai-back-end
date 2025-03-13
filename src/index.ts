import cors from 'cors';
import express from 'express';
import caseRoutes from './routes/index';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors()); // อนุญาตให้ทุกโดเมนเข้าถึง API
app.use(express.json()); // ใช้ JSON Middleware
app.use('/api', caseRoutes); // ใช้ Router

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
