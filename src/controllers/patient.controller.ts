import { Request, Response } from "express";
import PatientModel from "../models/patient.model";

// เพิ่มผู้ป่วยใหม่
export const createPatient = async (req: Request, res: Response) => {
    try {
        const newPatient = new PatientModel(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        res.status(500).json({ message: "Error creating patient", error });
    }
};

// ดึงข้อมูลผู้ป่วยทั้งหมด
export const getAllPatients = async (req: Request, res: Response) => {
    try {
        const patients = await PatientModel.find()
            .populate("pickupLocationID", "address province district subDistrict")
            .populate("dropoffLocationID", "address province district subDistrict")
            .populate("relatives", "name relationship phonePrimary phoneSecondary");

        res.status(200).json(patients);
    } catch (error) {
        console.error("Error retrieving patients:", error);
        res.status(500).json({ message: "Error retrieving patients", error });
    }
};

// แก้ไขข้อมูลผู้ป่วย
export const updatePatient = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedPatient = await PatientModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPatient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }

        res.status(200).json(updatedPatient);
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Error updating patient", error });
    }
};
// ลบผู้ป่วย
export const deletePatient = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedPatient = await PatientModel.findByIdAndDelete(id);

        if (!deletedPatient) {
            res.status(404).json({ message: "Patient not found" });
            return;
        }

        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Error deleting patient", error });
    }
};