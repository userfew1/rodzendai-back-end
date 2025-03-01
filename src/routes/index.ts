import express from "express";
import {
  createCase,
  createCaseCRM,
  getAllCases,
  getCaseById,
  updateCase,
} from "../controllers/case.controller";

const router = express.Router();

// 🟢 สร้างข้อมูลเคส
router.post("/cases", createCase);
// 🟢 สร้างข้อมูลเคส crm
router.post('/cases/crm', createCaseCRM);

// 🟢 ดึงข้อมูลเคสทั้งหมด (หรือกรองตาม `status`)
router.get("/cases", getAllCases);

// 🟢 ดึงข้อมูลเคสตาม `case_id`
router.get("/cases/:case_id", getCaseById);

// 🟢 อัปเดตข้อมูลเคสตาม `case_id`
router.put("/cases/:case_id", updateCase);

export default router;
