import express from "express";
import { createCase, getAllCases, updateCase, deleteCase } from "../controllers/case.controller";

const router = express.Router();

router.post("/", createCase); // เพิ่มข้อมูล
router.get("/", getAllCases); // แสดงข้อมูลทั้งหมด
router.put("/:id", updateCase); // แก้ไขข้อมูล
router.delete("/:id", deleteCase); // ลบข้อมูล

export default router;
