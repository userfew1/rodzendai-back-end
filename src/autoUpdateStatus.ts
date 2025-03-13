import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";
dotenv.config();

const API_URL = process.env.API_URL || "https://db.rodzendai-api-v1/"||"https://rodzendai-api-v1-1021402286333.us-central1.run.app"

console.log("✅ API_URL:", API_URL);



// ฟังก์ชันตรวจสอบว่า appointment_date เป็นวันพรุ่งนี้หรือไม่
const isTomorrow = (appointmentDate: string): boolean => {
  if (!appointmentDate) return false;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const formattedTomorrow = tomorrow.toISOString().split("T")[0];
  return appointmentDate === formattedTomorrow;
};

// ฟังก์ชันดึงข้อมูลและอัปเดต status
const updateCasesStatus = async () => {
  try {
    console.log("🔄 กำลังดึงข้อมูลเคส...");
    const response = await axios.get(API_URL);

    if (response.data.status !== "success") throw new Error("API Error");

    const cases = response.data.data;
    console.log(`📊 พบเคสทั้งหมด: ${cases.length} รายการ`);

    for (const caseData of cases) {
      const { case_id, appointment_date, status } = caseData;

      console.log(`📝 ตรวจสอบ case_id: ${case_id}, วันที่นัดหมาย: ${appointment_date}, สถานะ: ${status}`);

      // ข้ามเคสที่ไม่มีวันนัดหมาย
      if (!appointment_date) {
        console.log(`⚠️ case_id ${case_id} ไม่มี appointment_date ข้าม...`);
        continue;
      }

      if (isTomorrow(appointment_date) && status === "รอดำเนินการ") {
        console.log(`✅ case_id ${case_id} เป็นวันพรุ่งนี้และมีสถานะ "รอดำเนินการ"!`);
        console.log(`📌 อัปเดต case_id ${case_id} -> "ติดตามล่วงหน้า"`);
        await axios.put(`${API_URL}/${case_id}`, { status: "ติดตามล่วงหน้า" });
        console.log(`✅ อัปเดตสำเร็จ: case_id ${case_id}`);
      } else {
        console.log(`⏩ case_id ${case_id} ไม่เข้าเงื่อนไข ข้าม...`);
      }
    }
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการอัปเดตเคส:", error);
  }
};

// ทำให้ฟังก์ชันทำงานทันที (สำหรับทดสอบ)
updateCasesStatus();

// ตั้งเวลาให้ทำงานอัตโนมัติทุก **1 นาที**
cron.schedule("0 1 * * *", () => {
  console.log("⏳ กำลังตรวจสอบและอัปเดตสถานะเคส (รันทุกตี 1)...");
  updateCasesStatus();
});

