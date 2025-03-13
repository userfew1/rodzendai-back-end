import { Request, Response } from "express";
import caseCollection from "../models/case.model";
import { getProvinceName, getDistrictName, getSubdistrictName } from '../utils/loadLocationData';


export const createCaseCRM = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recorded_by, recorded_date, data } = req.body;
    // ตรวจสอบว่ามีข้อมูล data และเป็น array หรือไม่
    if (!data || !Array.isArray(data) || data.length === 0) {
      res.status(400).json({ message: "กรุณาใส่ข้อมูล data ให้ถูกต้อง" });
      return;
    }

    // วนลูปตรวจสอบและบันทึกแต่ละเคส
    for (const item of data) {
      const caseId = item.case_id?.trim(); // ✅ ใช้ string เท่านั้น
      if (!caseId) {
        res.status(400).json({ message: "Invalid case_id, must be a non-empty string" });
        return;
      }
      // 🔍 ตรวจสอบว่า case_id นี้มีอยู่แล้วหรือไม่
      const existingCase = await caseCollection
        .where("case_id", "==", caseId)
        .get();
      if (!existingCase.empty) {
        res.status(400).json({ message: `case_id ${caseId} มีอยู่แล้ว` });
        return;
      }

      // 🔄 แปลงรหัสเป็นชื่อจริง
      const patientInfo = item.patient_info || {};
      const provinceId = patientInfo.province_name;
      const districtId = patientInfo.district_name;
      const subdistrictId = patientInfo.subdistrict_name;
      const locationNames = {
        province_name: getProvinceName(provinceId),
        district_name: getDistrictName(districtId),
        subdistrict_name: getSubdistrictName(subdistrictId),
      };

      // 🔥 บันทึกข้อมูลลง Firestore (ถ้าไม่มีค่าให้ใส่ null)
      await caseCollection.add({
        case_id: caseId,
        recorded_by: recorded_by?.trim() ? recorded_by : null,
        recorded_date: recorded_date || null,
        patient_info: {
          ...patientInfo, // ✅ ใส่รหัสจังหวัด/อำเภอ/ตำบล
          ...locationNames, // ✅ ใส่ชื่อจริงของจังหวัด/อำเภอ/ตำบล
        },
        appointment_info: item.appointment_info || null,
        case_evaluation: item.case_evaluation || null,
        reporter_info: item.reporter_info || null,
        companions: item.companions || null,
        transport_request: item.transport_request || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 🎯 ตอบกลับแค่ status 200 และ message
    res.status(200).json({ message: "บันทึกสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "Error creating cases", error });
  }
};


// 🟢 สร้างเคสใหม่
export const createCase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { case_id } = req.body;

    // 🔍 ตรวจสอบว่ามี case_id นี้อยู่แล้วหรือไม่
    const existingCase = await caseCollection
      .where("case_id", "==", case_id)
      .get();

    if (!existingCase.empty) {
      res.status(400).json({ message: "case_id นี้มีอยู่แล้ว" });
      return;
    }

    // 🔥 บันทึกลง Firestore
    const newCaseRef = caseCollection.doc();
    await newCaseRef.set({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ id: newCaseRef.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: "Error creating case", error });
  }
};

// 🟢 ดึงข้อมูลเคสทั้งหมด หรือกรองตาม status

export const getAllCases = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query = caseCollection.orderBy("createdAt", "desc");

    // กรองตาม status ถ้ามี
    if (status && status !== "") {
      query = query.where("case_evaluation.case_status", "==", status);
    }

    const snapshot = await query.get();
    const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลได้",
      total: cases.length,
      data: cases,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cases", error });
  }
};
// 🟢 ดึงข้อมูลเคสตาม case_id

export const getCaseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const caseId = Number(req.params.case_id);

    if (isNaN(caseId)) {
      res.status(400).json({ message: "Invalid case_id, must be a number" });
      return;
    }

    const caseSnapshot = await caseCollection
      .where("case_id", "==", caseId)
      .get();

    if (caseSnapshot.empty) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    const caseData = caseSnapshot.docs[0].data();

    res.status(200).json({
      status: "success",
      message: "ดึงข้อมูลสำเร็จ",
      data: caseData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching case by ID", error });
  }
};
// 🟢 อัปเดตข้อมูลเคสตาม case_id

export const updateCase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const caseId = Number(req.params.case_id);

    if (isNaN(caseId)) {
      res.status(400).json({ message: "Invalid case_id, must be a number" });
      return;
    }

    const updateData = req.body;
    // 🔍 ค้นหาเคสก่อนอัปเดต
    const caseSnapshot = await caseCollection
      .where("case_id", "==", caseId)
      .get();

    if (caseSnapshot.empty) {
      res.status(404).json({ message: "Case not found" });
      return;
    }
    const docId = caseSnapshot.docs[0].id;
    const caseRef = caseCollection.doc(docId);
    // 🔥 อัปเดตข้อมูล
    await caseRef.update({ ...updateData, updatedAt: new Date() });
    res.status(200).json({
      status: "success",
      message: "อัปเดตข้อมูลสำเร็จ",
      data: updateData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating case", error });
  }
};
// 🟢 ลบเคสตาม case_id

export const deleteCase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const caseId = Number(req.params.case_id);

    if (isNaN(caseId)) {
      res.status(400).json({ message: "Invalid case_id, must be a number" });
      return;
    }
    const caseSnapshot = await caseCollection
      .where("case_id", "==", caseId)
      .get();
    if (caseSnapshot.empty) {
      res.status(404).json({ message: "Case not found" });
      return;
    }
    const docId = caseSnapshot.docs[0].id;
    const caseRef = caseCollection.doc(docId);
    await caseRef.delete();
    res.status(200).json({ message: "Case deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting case", error });
  }
};
// 🟢 ดึงข้อมูลเคสสำหรับ CRM

export const getCaseForCRM = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { case_id, ticketId } = req.body;
    if (!case_id?.trim()) {
      res.status(400).json({ message: "กรุณาส่ง case_id" });
      return;
    }
    const caseSnapshot = await caseCollection
      .where("case_id", "==", case_id)
      .get();
    if (caseSnapshot.empty) {
      res.status(404).json({ message: "ไม่พบข้อมูลเคสนี้" });
      return;
    }
    const caseData = caseSnapshot.docs[0].data();
    // จัดรูปแบบข้อมูลให้รองรับโครงสร้าง JSON
    const response = {
      case_id: case_id,
      ticketId: ticketId || "ไม่ระบุ",
      status: caseData?.status || "ไม่ระบุ",
      transport_request: caseData?.transport_request?.map((request: any) => ({
        departure_schedule: request.departure_schedule || false,
        return_schedule: request.return_schedule || false,
        status: request.status || "ไม่ระบุ",
        driver: request.driver || {
          name: "ไม่ระบุ",
          carLicense: "ไม่ระบุ",
          carType: "ไม่ระบุ",
          description: "ไม่ระบุ",
        },
        pickup_location: request.pickup_location || {
          pickup_place: "ไม่ระบุ",
          province: "ไม่ระบุ",
          district: "ไม่ระบุ",
          subdistrict: "ไม่ระบุ",
          landmark: "ไม่ระบุ",
          map: "ไม่ระบุ",
        },
        dropoff_location: request.dropoff_location || {
          dropoff_place: "ไม่ระบุ",
          province: "ไม่ระบุ",
          district: "ไม่ระบุ",
          subdistrict: "ไม่ระบุ",
          landmark: "ไม่ระบุ",
          map: "ไม่ระบุ",
        },
        scheduled_time: request.scheduled_time || "ไม่ระบุ",
      })) || [],
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching case for CRM", error });
  }
};

export const updateCaseStatusFromCRM = async (req: Request, res: Response): Promise<void> => {
  try {
    const { case_id, new_status } = req.body;
    if (!case_id?.trim() || !new_status?.trim()) {
      res.status(400).json({ message: "กรุณาส่ง case_id และ new_status" });
      return;
    }
    const caseSnapshot = await caseCollection.where("case_id", "==", case_id).get();

    if (caseSnapshot.empty) {
      res.status(404).json({ message: "ไม่พบข้อมูลเคสนี้" });
      return;
    }
    const caseDocId = caseSnapshot.docs[0].id;
    await caseCollection.doc(caseDocId).update({ status: new_status, updatedAt: new Date() });
    res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", case_id, new_status });
  } catch (error) {
    res.status(500).json({ message: "Error updating case status", error });
  }
};

