// 🔹 กำหนด Type สำหรับ Car
import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ Car
export interface ICar extends Document {
    licensePlate: string;
    driverName: string;
    contactNumber: string;
    carType: string;
    caseID: mongoose.Types.ObjectId; // เชื่อมกับ Case
}

// 🔹 กำหนด Schema สำหรับ Car
const CarSchema: Schema = new Schema({
    licensePlate: { type: String, required: true },
    driverName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    carType: { type: String, required: true },
    caseID: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true } // ✅ ใช้ caseID แทน transportTypeID
});

// 🔹 เช็คว่ามี Model อยู่แล้วหรือไม่ ก่อนที่จะสร้างใหม่
const CarModel = mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);

export default CarModel;
