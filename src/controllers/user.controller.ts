import { Request, Response } from "express";
import UserModel from "../models/user.model";

// เพิ่มผู้ใช้งานใหม่
export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

// ดึงข้อมูลผู้ใช้งานทั้งหมด
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
};

// แก้ไขข้อมูลผู้ใช้งาน

export const updateUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};

// ลบผู้ใช้งาน
export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
};