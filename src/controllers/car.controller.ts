import { Request, Response } from "express";
import CarModel from "../models/car.model";

// 🔹 เพิ่มข้อมูลรถ
export const createCar = async (req: Request, res: Response) => {
    try {
        const newCar = new CarModel(req.body);
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(500).json({ message: "Error creating car", error });
    }
};

// 🔹 ดึงข้อมูลรถทั้งหมด
export const getAllCars = async (req: Request, res: Response) => {
    try {
        const cars = await CarModel.find().populate("transportTypeID", "status departureTime returnTime");
        res.status(200).json(cars);
    } catch (error) {
        console.error("Error retrieving cars:", error);
        res.status(500).json({ message: "Error retrieving cars", error });
    }
};

// 🔹 แก้ไขข้อมูลรถ
export const updateCar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedCar = await CarModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCar) {
            res.status(404).json({ message: "Car not found" });
            return;
        }

        res.status(200).json(updatedCar);
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({ message: "Error updating car", error });
    }
};
// 🔹 ลบข้อมูลรถ
export const deleteCar = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedCar = await CarModel.findByIdAndDelete(id);

        if (!deletedCar) {
            res.status(404).json({ message: "Car not found" });
            return;
        }

        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Error deleting car", error });
    }
};