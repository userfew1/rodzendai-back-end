import express from "express";
import { createBatchData } from "../controllers/batch.controller";

const router = express.Router();

// เส้นทาง API สำหรับเพิ่มข้อมูลทั้งหมดในครั้งเดียว
router.post("/", createBatchData);

export default router;
