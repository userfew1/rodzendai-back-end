import { Request, Response } from "express";
import caseCollection from "../models/case.model";

export const createCaseCRM = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { recorded_by, recorded_date, data } = req.body;

    // ตรวจสอบว่ามีข้อมูล data และเป็น array หรือไม่
    if (!data || !Array.isArray(data) || data.length === 0) {
      res.status(400).json({ message: "กรุณาใส่ข้อมูล data ให้ถูกต้อง" });
      return;
    }

    // วนลูปตรวจสอบและบันทึกแต่ละเคส
    for (const item of data) {
      const caseIdNumber = Number(item.case_id);

      // ✅ ตรวจสอบว่า case_id มีค่าและเป็นตัวเลข
      if (!caseIdNumber || isNaN(caseIdNumber)) {
        res
          .status(400)
          .json({
            message: `Invalid case_id: ${item.case_id}, must be a number`,
          });
        return;
      }

      // 🔍 ตรวจสอบว่า case_id นี้มีอยู่แล้วหรือไม่
      const existingCase = await caseCollection
        .where("case_id", "==", caseIdNumber)
        .get();
      if (!existingCase.empty) {
        res.status(400).json({ message: `case_id ${caseIdNumber} มีอยู่แล้ว` });
        return;
      }

      // 🔥 บันทึกข้อมูลลง Firestore (ถ้าไม่มีค่าให้ใส่ null)
      await caseCollection.add({
        case_id: caseIdNumber,
        recorded_by: recorded_by || null,
        recorded_date: recorded_date || null,
        reason: item.reason || null,
        cause: item.cause || null,
        patient_info: item.patient_info
          ? {
              full_name: item.patient_info.full_name || null,
              patient_type: item.patient_info.patient_type || null,
              service_type: item.patient_info.service_type || null,
              national_id: item.patient_info.national_id || null,
              date_of_birth: item.patient_info.date_of_birth || null,
              phone_number: item.patient_info.phone_number || null,
              photo_document: item.patient_info.photo_document || null,
              mobility_ability: item.patient_info.mobility_ability || null,
              medical_diagnosis: item.patient_info.medical_diagnosis || null,
            }
          : null,
        appointment_info: item.appointment_info
          ? {
              appointment_date: item.appointment_info.appointment_date || null,
              appointment_time: item.appointment_info.appointment_time || null,
              hospital_name: item.appointment_info.hospital_name || null,
              hospital_code: item.appointment_info.hospital_code || null,
              photo_document: item.appointment_info.photo_document || null,
              type_document: item.appointment_info.type_document || null,
            }
          : null,
        case_evaluation: item.case_evaluation
          ? {
              case_status: item.case_evaluation.case_status || null,
              service_type: item.case_evaluation.service_type || null,
              travel_mode: item.case_evaluation.travel_mode
                ? {
                    single_mode:
                      item.case_evaluation.travel_mode.single_mode || null,
                    single_mode_detail:
                      item.case_evaluation.travel_mode.single_mode_detail ||
                      null,
                    multi_mode:
                      item.case_evaluation.travel_mode.multi_mode || null,
                    multi_mode_detail:
                      item.case_evaluation.travel_mode.multi_mode_detail || [],
                  }
                : null,
            }
          : null,
        reporter_info: item.reporter_info
          ? {
              full_name: item.reporter_info.full_name || null,
              relation_to_patient:
                item.reporter_info.relation_to_patient || null,
              phone_number: item.reporter_info.phone_number || null,
            }
          : null,
        companions: item.companions
          ? item.companions.map(
              (companion: {
                full_name: any;
                relation_to_patient: any;
                phone_number: any;
              }) => ({
                full_name: companion.full_name || null,
                relation_to_patient: companion.relation_to_patient || null,
                phone_number: companion.phone_number || null,
              })
            )
          : null,
        transport_request: item.transport_request
          ? item.transport_request.map(
              (request: {
                departure_schedule: any;
                return_schedule: any;
                status: any;
                pickup_location: {
                  pickup_place: any;
                  province: any;
                  district: any;
                  subdistrict: any;
                  landmark: any;
                };
                dropoff_location: {
                  dropoff_place: any;
                  province: any;
                  district: any;
                  subdistrict: any;
                  landmark: any;
                };
              }) => ({
                departure_schedule: request.departure_schedule || null,
                return_schedule: request.return_schedule || null,
                status: request.status || null,
                pickup_location: request.pickup_location
                  ? {
                      pickup_place:
                        request.pickup_location.pickup_place || null,
                      province: request.pickup_location.province || null,
                      district: request.pickup_location.district || null,
                      subdistrict: request.pickup_location.subdistrict || null,
                      landmark: request.pickup_location.landmark || null,
                    }
                  : null,
                dropoff_location: request.dropoff_location
                  ? {
                      dropoff_place:
                        request.dropoff_location.dropoff_place || null,
                      province: request.dropoff_location.province || null,
                      district: request.dropoff_location.district || null,
                      subdistrict: request.dropoff_location.subdistrict || null,
                      landmark: request.dropoff_location.landmark || null,
                    }
                  : null,
              })
            )
          : null,
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
