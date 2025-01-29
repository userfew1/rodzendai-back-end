import express from "express";
import { createUser, getAllUsers, updateUser, deleteUser } from "../controllers/user.controller";

const router = express.Router();

router.post("/", createUser); // เพิ่มผู้ใช้งาน
router.get("/", getAllUsers); // ดูผู้ใช้งานทั้งหมด
router.put("/:id", updateUser); // แก้ไขผู้ใช้งาน
router.delete("/:id", deleteUser); // ลบผู้ใช้งาน

export default router;
