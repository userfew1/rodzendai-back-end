import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ Relative
export interface IRelative extends Document {
    name: string;
    relationship: string;
    phonePrimary: string;
    phoneSecondary?: string;
    createdAt: Date;
    updatedAt: Date;
}

// 🔹 กำหนด Schema สำหรับ Relative
const RelativeSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phonePrimary: { type: String, required: true },
        phoneSecondary: { type: String }
    },
    { timestamps: true } // 🔹 เพิ่ม `createdAt` และ `updatedAt`
);

// 🔹 สร้าง Model
const RelativeModel = mongoose.model<IRelative>("Relative", RelativeSchema);

export default RelativeModel;
