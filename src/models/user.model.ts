import mongoose, { Schema, Document } from "mongoose";

// 🔹 กำหนด Type สำหรับ User
export interface IUser extends Document {
    username: string;
    password: string;
    roleID: mongoose.Types.ObjectId; // ✅ ObjectId จะเชื่อมกับ Role
}

// 🔹 กำหนด Schema สำหรับ User
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true } // ✅ FK ไปที่ Role
});


// 🔹 สร้าง Model
const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
