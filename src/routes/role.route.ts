import express from "express";
import {
    createRole,
    getAllRoles,
    updateRole,
    deleteRole
} from "../controllers/role.controller";

const router = express.Router();

// เส้นทาง API สำหรับ Role
router.post("/", createRole); // เพิ่มบทบาทผู้ใช้งาน
router.get("/", getAllRoles); // ดึงข้อมูลบทบาททั้งหมด
router.put("/:id", updateRole); // แก้ไขบทบาทผู้ใช้งาน
router.delete("/:id", deleteRole); // ลบบทบาท

export default router;
