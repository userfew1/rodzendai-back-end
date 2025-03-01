import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// โหลดไฟล์ Service Account ที่ดาวน์โหลดมา
const serviceAccount = require("../service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();
console.log("✅ Firestore Connected (Production Mode)");

export default db;
