import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ Patient
export interface IPatient extends Document {
    name: string;
    phonePrimary: string;
    phoneSecondary?: string;
    pickupLocationID: mongoose.Types.ObjectId;
    dropoffLocationID: mongoose.Types.ObjectId;
    relatives?: mongoose.Types.ObjectId[];
    patientType?: string;
    mobility?: string;
    diagnosis?: string;
    appointmentDocument?: string;
}

// 🔹 กำหนด Schema สำหรับ Patient
const PatientSchema: Schema = new Schema({
    name: { type: String, required: true },
    phonePrimary: { type: String, required: true },
    phoneSecondary: { type: String },
    pickupLocationID: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    dropoffLocationID: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    relatives: [{ type: mongoose.Schema.Types.ObjectId, ref: "Relative" }],
    patientType: { type: String, required: false }, // ✅ เปลี่ยนเป็น `required: false`
    mobility: { type: String, required: false }, // ✅ เปลี่ยนเป็น `required: false`
    diagnosis: { type: String, required: false }, // ✅ เปลี่ยนเป็น `required: false`
    appointmentDocument: { type: String }
});

// 🔹 เช็คว่ามี Model อยู่แล้วหรือไม่ ก่อนสร้างใหม่
const PatientModel = mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

export default PatientModel;
