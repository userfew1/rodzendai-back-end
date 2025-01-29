import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ Role
export interface IRole extends Document {
    roleName: string;
    permissions: {
        dashboard: boolean;
        add_case: boolean;
        new_case: boolean;
        case_list: boolean;
        settings: boolean;
        profile: boolean;
    };
}

// 🔹 กำหนด Schema สำหรับ Role
const RoleSchema: Schema = new Schema({
    roleName: { type: String, enum: ["Admin", "Doctor", "Nurse", "Dispatcher"], required: true },
    permissions: {
        dashboard: { type: Boolean, default: false },
        add_case: { type: Boolean, default: false },
        new_case: { type: Boolean, default: false },
        case_list: { type: Boolean, default: false },
        settings: { type: Boolean, default: false },
        profile: { type: Boolean, default: false }
    }
});

// 🔹 สร้าง Model
const RoleModel = mongoose.model<IRole>("Role", RoleSchema);

export default RoleModel;
