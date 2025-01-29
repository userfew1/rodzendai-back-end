import mongoose, { Schema, Document } from "mongoose";

interface ICase extends Document {
    caseID: string;
    userEditID?: mongoose.Types.ObjectId | null;
    carID: mongoose.Schema.Types.ObjectId;
    patientID: mongoose.Schema.Types.ObjectId;
    status: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const CaseSchema: Schema = new Schema(
    {
        caseID: { type: String, required: true, unique: true },
        userEditID: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // 🔹 เชื่อมกับ User
        carID: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true }, // 🔹 เชื่อมกับ Car
        patientID: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }, // 🔹 เชื่อมกับ Patient
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Canceled"],
            default: "Pending",
        },
        description: { type: String, required: true },
    },
    { timestamps: true } // 🔹 เพิ่ม `createdAt` และ `updatedAt` อัตโนมัติ
);

const CaseModel = mongoose.model<ICase>("Case", CaseSchema);

export default CaseModel;
