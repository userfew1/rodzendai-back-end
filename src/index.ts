import express from 'express';
import connectDB from './db';

const app = express();
const port = 5012;

// เรียกใช้ MongoDB
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, MongoDB with Express!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
