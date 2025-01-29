import express from "express";
import { createCar, getAllCars, updateCar, deleteCar } from "../controllers/car.controller";

const router = express.Router();

// เส้นทาง API สำหรับรถ
router.post("/", createCar); // เพิ่มข้อมูลรถ 🚗
router.get("/", getAllCars); // ดูข้อมูลรถทั้งหมด 📝
router.put("/:id", updateCar); // แก้ไขข้อมูลรถ 🔧
router.delete("/:id", deleteCar); // ลบข้อมูลรถ ❌

export default router;
