import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ Car
export interface ICar extends Document {
    licensePlate: string;
    driverName: string;
    contactNumber: string;
    carType: string;
    transportTypeID: mongoose.Types.ObjectId;
}

// 🔹 กำหนด Schema สำหรับ Car
const CarSchema: Schema = new Schema({
    licensePlate: { type: String, required: true, unique: false }, 
    driverName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    carType: { type: String, required: true },
    transportTypeID: { type: mongoose.Schema.Types.ObjectId, ref: "TransportType", required: true }
});

// 🔹 เช็คว่ามี Model อยู่แล้วหรือไม่ ก่อนที่จะสร้างใหม่
const CarModel = mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);

export default CarModel;
