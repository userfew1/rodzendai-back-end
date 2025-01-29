import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ Location
export interface ILocation extends Document {
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    landmark?: string;
    googleMapUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// 🔹 กำหนด Schema สำหรับ Location
const LocationSchema: Schema = new Schema(
    {
        address: { type: String, required: true },
        subDistrict: { type: String, required: true }, // 🔹 เพิ่ม แขวง/ตำบล
        district: { type: String, required: true },
        province: { type: String, required: true },
        landmark: { type: String }, // 🔹 เพิ่ม จุดสังเกต
        googleMapUrl: { type: String }
    },
    { timestamps: true } // 🔹 เพิ่ม `createdAt` และ `updatedAt`
);

// 🔹 สร้าง Model
const LocationModel = mongoose.model<ILocation>("Location", LocationSchema);

export default LocationModel;
