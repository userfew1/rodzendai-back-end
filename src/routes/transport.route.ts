import express from "express";
import {
    createTransportType,
    getAllTransportTypes,
    updateTransportType,
    deleteTransportType
} from "../controllers/transport.controller";

const router = express.Router();

// เส้นทาง API สำหรับ TransportType
router.post("/", createTransportType); // เพิ่มประเภทการเดินทาง
router.get("/", getAllTransportTypes); // ดึงข้อมูลประเภทการเดินทางทั้งหมด
router.put("/:id", updateTransportType); // แก้ไขข้อมูลประเภทการเดินทาง
router.delete("/:id", deleteTransportType); // ลบข้อมูลประเภทการเดินทาง

export default router;
