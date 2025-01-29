import { Request, Response } from "express";
import RelativeModel from "../models/relative.model";

// เพิ่มข้อมูลญาติ
export const createRelative = async (req: Request, res: Response): Promise<void> => {
    try {
        const newRelative = new RelativeModel(req.body);
        const savedRelative = await newRelative.save();
        res.status(201).json(savedRelative);
    } catch (error) {
        console.error("Error creating relative:", error);
        res.status(500).json({ message: "Error creating relative", error });
    }
};

// ดึงข้อมูลญาติทั้งหมด
export const getAllRelatives = async (req: Request, res: Response) => {
    try {
        const relatives = await RelativeModel.find();
        res.status(200).json(relatives);
    } catch (error) {
        console.error("Error retrieving relatives:", error);
        res.status(500).json({ message: "Error retrieving relatives", error });
    }
};

// แก้ไขข้อมูลญาติ
export const updateRelative = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedRelative = await RelativeModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRelative) {
            res.status(404).json({ message: "Relative not found" });
            return;
        }

        res.status(200).json(updatedRelative);
    } catch (error) {
        console.error("Error updating relative:", error);
        res.status(500).json({ message: "Error updating relative", error });
    }
};

// ลบข้อมูลญาติ
export const deleteRelative = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedRelative = await RelativeModel.findByIdAndDelete(id);

        if (!deletedRelative) {
            res.status(404).json({ message: "Relative not found" });
            return;
        }

        res.status(200).json({ message: "Relative deleted successfully" });
    } catch (error) {
        console.error("Error deleting relative:", error);
        res.status(500).json({ message: "Error deleting relative", error });
    }
};
