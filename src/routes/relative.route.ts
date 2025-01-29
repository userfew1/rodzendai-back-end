import express from "express";
import {
    createRelative,
    getAllRelatives,
    updateRelative,
    deleteRelative
} from "../controllers/relative.controller";

const router = express.Router();

// เส้นทาง API สำหรับ Relative
router.post("/", createRelative); // เพิ่มข้อมูลญาติ
router.get("/", getAllRelatives); // ดึงข้อมูลญาติทั้งหมด
router.put("/:id", updateRelative); // แก้ไขข้อมูลญาติ
router.delete("/:id", deleteRelative); // ลบข้อมูลญาติ

export default router;
