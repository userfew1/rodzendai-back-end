import { Request, Response } from "express";
import TransportModel from "../models/transport.model";

// เพิ่มประเภทการเดินทาง
export const createTransportType = async (req: Request, res: Response): Promise<void> => {
    try {
        const newTransport = new TransportModel(req.body);
        const savedTransport = await newTransport.save();
        res.status(201).json(savedTransport);
    } catch (error) {
        console.error("Error creating transport type:", error);
        res.status(500).json({ message: "Error creating transport type", error });
    }
};

// ดึงข้อมูลประเภทการเดินทางทั้งหมด
export const getAllTransportTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        const transports = await TransportModel.find();
        res.status(200).json(transports);
    } catch (error) {
        console.error("Error retrieving transport types:", error);
        res.status(500).json({ message: "Error retrieving transport types", error });
    }
};

// แก้ไขข้อมูลประเภทการเดินทาง
export const updateTransportType = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedTransport = await TransportModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTransport) {
            res.status(404).json({ message: "Transport type not found" });
            return;
        }

        res.status(200).json(updatedTransport);
    } catch (error) {
        console.error("Error updating transport type:", error);
        res.status(500).json({ message: "Error updating transport type", error });
    }
};

// ลบข้อมูลประเภทการเดินทาง
export const deleteTransportType = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedTransport = await TransportModel.findByIdAndDelete(id);

        if (!deletedTransport) {
            res.status(404).json({ message: "Transport type not found" });
            return;
        }

        res.status(200).json({ message: "Transport type deleted successfully" });
    } catch (error) {
        console.error("Error deleting transport type:", error);
        res.status(500).json({ message: "Error deleting transport type", error });
    }
};
