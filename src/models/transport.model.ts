import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ TransportType
export interface ITransportType extends Document {
    departureTime: Date;
    returnTime: Date;
    status: string;
}

// 🔹 กำหนด Schema สำหรับ TransportType
const TransportTypeSchema: Schema = new Schema({
    departureTime: { type: Date },
    returnTime: { type: Date },
    status: { type: String, enum: ["Scheduled", "Completed", "Canceled"], default: "Scheduled" }
});

// 🔹 เช็คว่ามี Model อยู่แล้วหรือไม่ ก่อนที่จะสร้างใหม่
const TransportTypeModel =
    mongoose.models.TransportType || mongoose.model<ITransportType>("TransportType", TransportTypeSchema);

export default TransportTypeModel;
