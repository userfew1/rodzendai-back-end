import { Request, Response } from "express";
import mongoose from "mongoose";
import UserModel from "../models/user.model";
import CarModel from "../models/car.model";
import PatientModel from "../models/patient.model";
import CaseModel from "../models/case.model";
import RelativeModel from "../models/relative.model";
import LocationModel from "../models/location.model";

// export const createBatchData = async (req: Request, res: Response): Promise<void> => {
//     try {
//         // ✅ เริ่มต้น Session (แต่ไม่ใช้ Transaction)
//         const session = await mongoose.startSession();

//         // 1️⃣ เพิ่มข้อมูลผู้ใช้งาน (User)
//         const newUser = new UserModel(req.body.user);
//         const savedUser = await newUser.save({ session });

//         // 2️⃣ เพิ่มข้อมูลรถ (Car)
//         const newCar = new CarModel({
//             licensePlate: req.body.car.licensePlate,
//             driverName: req.body.car.driverName,
//             contactNumber: req.body.car.contactNumber,
//             carType: req.body.car.carType,
//             transportTypeID: req.body.car.transportTypeID
//         });
//         const savedCar = await newCar.save({ session });

//         // 3️⃣ เพิ่มข้อมูลญาติ (Relative)
//         const savedRelatives = [];
//         for (const relative of req.body.patient.relatives) {
//             const newRelative = new RelativeModel(relative);
//             const savedRelative = await newRelative.save({ session });
//             savedRelatives.push(savedRelative._id);
//         }

//         // 4️⃣ เพิ่มข้อมูลสถานที่รับ-ส่งผู้ป่วย
//         const newPickupLocation = new LocationModel(req.body.patient.pickupLocation);
//         const savedPickupLocation = await newPickupLocation.save({ session });

//         const newDropoffLocation = new LocationModel(req.body.patient.dropoffLocation);
//         const savedDropoffLocation = await newDropoffLocation.save({ session });

//         // 5️⃣ เพิ่มข้อมูลผู้ป่วย (Patient)
//         const newPatient = new PatientModel({
//             name: req.body.patient.name,
//             phonePrimary: req.body.patient.phonePrimary,
//             phoneSecondary: req.body.patient.phoneSecondary,
//             pickupLocationID: savedPickupLocation._id,
//             dropoffLocationID: savedDropoffLocation._id,
//             relatives: savedRelatives,
//             patientType: req.body.patient.patientType,
//             mobility: req.body.patient.mobility,
//             diagnosis: req.body.patient.diagnosis,
//             appointmentDocument: req.body.patient.appointmentDocument
//         });
//         const savedPatient = await newPatient.save({ session });

//         // 6️⃣ เพิ่มข้อมูลเคส (Case)
//         const newCase = new CaseModel({
//             caseID: req.body.case.caseID,
//             userEditID: savedUser._id,
//             carID: savedCar._id,
//             patientID: savedPatient._id,
//             status: req.body.case.status,
//             description: req.body.case.description
//         });
//         const savedCase = await newCase.save({ session });

//         session.endSession(); // ✅ ปิด Session

//         res.status(201).json({
//             message: "Batch data created successfully",
//             user: savedUser,
//             car: savedCar,
//             patient: savedPatient,
//             case: savedCase,
//             relatives: savedRelatives,
//             pickupLocation: savedPickupLocation,
//             dropoffLocation: savedDropoffLocation
//         });
//     } catch (error) {
//         console.error("Error creating batch data:", error);
//         res.status(500).json({ message: "Error creating batch data", error });
//     }
// };
export const createBatchData = async (req: Request, res: Response): Promise<void> => {
    try {
        const session = await mongoose.startSession(); // ✅ เริ่ม session แต่ไม่ใช้ Transaction

        // ✅ 1. เพิ่มข้อมูลรถ (Car)
        const newCar = new CarModel(req.body.car);
        const savedCar = await newCar.save({ session });

        // ✅ 2. เพิ่มข้อมูลสถานที่รับ-ส่งผู้ป่วย
        const newPickupLocation = new LocationModel(req.body.patient.pickupLocation);
        const savedPickupLocation = await newPickupLocation.save({ session });

        const newDropoffLocation = new LocationModel(req.body.patient.dropoffLocation);
        const savedDropoffLocation = await newDropoffLocation.save({ session });

        // ✅ 3. เพิ่มข้อมูลผู้ป่วย (Patient)
        const newPatient = new PatientModel({
            name: req.body.patient.name,
            phonePrimary: req.body.patient.phonePrimary,
            phoneSecondary: req.body.patient.phoneSecondary,
            pickupLocationID: savedPickupLocation._id,
            dropoffLocationID: savedDropoffLocation._id
        });
        const savedPatient = await newPatient.save({ session });

        // ✅ 4. เพิ่มข้อมูลเคส (Case)
        const newCase = new CaseModel({
            caseID: req.body.case.caseID,
            carID: savedCar._id,
            patientID: savedPatient._id,
            status: req.body.case.status,
            description: req.body.case.description
        });
        const savedCase = await newCase.save({ session });

        session.endSession(); // ✅ ปิด session

        res.status(201).json({
            message: "Batch data created successfully",
            car: savedCar,
            patient: savedPatient,
            case: savedCase,
            pickupLocation: savedPickupLocation,
            dropoffLocation: savedDropoffLocation
        });
    } catch (error) {
        console.error("Error creating batch data:", error);
        res.status(500).json({ message: "Error creating batch data", error });
    }
};
