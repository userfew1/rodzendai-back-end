import express from "express";
import { createLocation, getAllLocations, updateLocation, deleteLocation } from "../controllers/location.controller";

const router = express.Router();

router.post("/", createLocation); // เพิ่ม Location
router.get("/", getAllLocations); // ดูข้อมูล Location ทั้งหมด
router.put("/:id", updateLocation); // แก้ไข Location
router.delete("/:id", deleteLocation); // ลบ Location

export default router;
