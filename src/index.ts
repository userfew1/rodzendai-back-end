import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Route ตัวอย่าง
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript wdasdsdith Express!');
});

// เริ่มรันเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
