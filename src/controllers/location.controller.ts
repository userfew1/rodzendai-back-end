import { Request, Response } from "express";
import LocationModel from "../models/location.model";

// เพิ่มจุด Location ใหม่
export const createLocation = async (req: Request, res: Response) => {
    try {
        const newLocation = new LocationModel(req.body);
        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        res.status(500).json({ message: "Error creating location", error });
    }
};

// ดึงข้อมูล Location ทั้งหมด
export const getAllLocations = async (req: Request, res: Response) => {
    try {
        const locations = await LocationModel.find();
        res.status(200).json(locations);
    } catch (error) {
        console.error("Error retrieving locations:", error);
        res.status(500).json({ message: "Error retrieving locations", error });
    }
};
// แก้ไขข้อมูล Location
export const updateLocation = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedLocation = await LocationModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedLocation) {
            res.status(404).json({ message: "Location not found" });
            return;
        }

        res.status(200).json(updatedLocation);
    } catch (error) {
        console.error("Error updating location:", error);
        res.status(500).json({ message: "Error updating location", error });
    }
};

// ลบ Location
export const deleteLocation = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedLocation = await LocationModel.findByIdAndDelete(id);

        if (!deletedLocation) {
            res.status(404).json({ message: "Location not found" });
            return;
        }

        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).json({ message: "Error deleting location", error });
    }
};