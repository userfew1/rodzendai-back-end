import { Request, Response } from "express";
import RoleModel from "../models/role.model";

// 🔹 เพิ่มบทบาทผู้ใช้งาน (พร้อม `permissions`)
export const createRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleName, permissions } = req.body;

        // ✅ ตรวจสอบว่า Role มีอยู่แล้วหรือไม่
        const existingRole = await RoleModel.findOne({ roleName });
        if (existingRole) {
            res.status(400).json({ message: "Role already exists" });
            return;
        }

        // ✅ ตรวจสอบว่ามี `permissions` หรือไม่ ถ้าไม่มีให้ใช้ค่า default
        const defaultPermissions = {
            dashboard: false,
            add_case: false,
            new_case: false,
            case_list: false,
            settings: false,
            profile: false
        };
        
        const newRole = new RoleModel({
            roleName,
            permissions: permissions || defaultPermissions
        });

        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ message: "Error creating role", error });
    }
};

// 🔹 ดึงข้อมูลบทบาททั้งหมด
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await RoleModel.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error retrieving roles:", error);
        res.status(500).json({ message: "Error retrieving roles", error });
    }
};

// 🔹 แก้ไขข้อมูลบทบาท (รวม `permissions`)
export const updateRole = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { roleName, permissions } = req.body;

        const updatedRole = await RoleModel.findByIdAndUpdate(
            id,
            { roleName, permissions },
            { new: true }
        );

        if (!updatedRole) {
            res.status(404).json({ message: "Role not found" });
            return;
        }

        res.status(200).json(updatedRole);
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Error updating role", error });
    }
};

// 🔹 ลบบทบาท
export const deleteRole = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedRole = await RoleModel.findByIdAndDelete(id);

        if (!deletedRole) {
            res.status(404).json({ message: "Role not found" });
            return;
        }

        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ message: "Error deleting role", error });
    }
};
