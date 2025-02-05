import express from "express";
import cors from "cors"; // 🔹 เพิ่ม CORS เพื่อแก้ปัญหา Cross-Origin Resource Sharing
import connectDB from "./db"; // ฟังก์ชันเชื่อมต่อ MongoDB
import caseRoutes from "./routes/case.route"; // เส้นทาง API สำหรับ Case
import userRoutes from "./routes/user.route"; // เส้นทาง API สำหรับ User
import carRoutes from "./routes/car.route"; // เส้นทาง API สำหรับ Car
import patientRoutes from "./routes/patient.route"; // เส้นทาง API สำหรับ Patient
import relativeRoutes from "./routes/relative.route"; // เส้นทาง API สำหรับ Relative
import roleRoutes from "./routes/role.route"; // เส้นทาง API สำหรับ Role
import transportRoutes from "./routes/transport.route"; // เส้นทาง API สำหรับ TransportType
import { createBatchData } from "./controllers/batch.controller"; // นำเข้า Controller
import { Request, Response, NextFunction } from "express";
const app = express();
const port = 5012; // พอร์ตสำหรับรันเซิร์ฟเวอร์

// ✅ เชื่อมต่อ MongoDB
connectDB();

// ✅ Middleware รองรับ JSON, Form Data และ CORS
app.use(cors({ origin: "*" })); // 🔹 อนุญาตให้ทุก Origin เข้าถึง API ได้
app.use(express.json()); // 🔹 รองรับ JSON Body
app.use(express.urlencoded({ extended: true })); // 🔹 รองรับ Form Data

// ✅ เชื่อมต่อเส้นทาง API
app.use("/api/cases", caseRoutes); // เส้นทาง API สำหรับ Case
app.use("/api/users", userRoutes); // เส้นทาง API สำหรับ User
app.use("/api/cars", carRoutes); // เส้นทาง API สำหรับ Car
app.use("/api/patients", patientRoutes); // เส้นทาง API สำหรับ Patient
app.use("/api/relatives", relativeRoutes); // เส้นทาง API สำหรับ Relative
app.use("/api/roles", roleRoutes); // เส้นทาง API สำหรับ Role
app.use("/api/transports", transportRoutes); // เส้นทาง API สำหรับ TransportType

// ✅ เพิ่ม API สำหรับ `createBatchData`
app.post("/api/batch", createBatchData);

// ✅ Global Error Handling Middleware (สำหรับจัดการ Error)


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
    });
});


// ✅ เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
