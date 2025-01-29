import express from "express";
import { createPatient, getAllPatients, updatePatient, deletePatient } from "../controllers/patient.controller";

const router = express.Router();

router.post("/", createPatient); // เพิ่มผู้ป่วย
router.get("/", getAllPatients); // ดูผู้ป่วยทั้งหมด
router.put("/:id", updatePatient); // แก้ไขผู้ป่วย
router.delete("/:id", deletePatient); // ลบผู้ป่วย

export default router;
