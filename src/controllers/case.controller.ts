import { Request, Response } from "express";
import CaseModel from "../models/case.model";
import { log } from "console";



// เพิ่มข้อมูลเคสใหม่
export const createCase = async (req: Request, res: Response) => {
    log(req.body);
    try {
        const newCase = new CaseModel(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        res.status(500).json({ message: "Error creating case", error });
    }
};

// แสดงข้อมูลทั้งหมด
export const getAllCases = async (req: Request, res: Response): Promise<void> => {
    try {
        // ✅ ใช้ populate() เพื่อดึงข้อมูล FK ที่เกี่ยวข้อง
        const cases = await CaseModel.find()
            .populate("userEditID", "username") // 🔹 ดึง `username` จาก User
            .populate({
                path: "carID",
                populate: { path: "transportTypeID", select: "status" } // 🔹 ดึงข้อมูล TransportType
            })
            .populate({
                path: "patientID",
                populate: [
                    { path: "pickupLocationID", select: "address district province" }, // 🔹 ดึงจุดรับ
                    { path: "dropoffLocationID", select: "address district province" }, // 🔹 ดึงจุดส่ง
                    { path: "relatives", select: "name relationship phonePrimary" } // 🔹 ดึงญาติ
                ]
            });

        res.status(200).json(cases);
    } catch (error) {
        console.error("Error retrieving cases:", error);
        res.status(500).json({ message: "Error retrieving cases", error });
    }
};

// แก้ไขข้อมูลเคส
export const updateCase = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedCase = await CaseModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCase) {
            res.status(404).json({ message: "Case not found" });
            return; // ใส่ return เพื่อบอก TypeScript ว่าไม่มีโอกาสคืน undefined
        }

        res.status(200).json(updatedCase);
    } catch (error) {
        res.status(500).json({ message: "Error updating case", error });
    }
};

// ลบข้อมูลเคส
export const deleteCase = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // รับ ID จากพารามิเตอร์

        const deletedCase = await CaseModel.findByIdAndDelete(id); // ลบข้อมูลเคส

        if (!deletedCase) {
            res.status(404).json({ message: "Case not found" });
            return; // ใส่ return เพื่อหยุดการทำงาน
        }

        res.status(200).json({ message: "Case deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting case", error });
    }
};
