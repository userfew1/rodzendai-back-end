import db from "./connect_Firestore";

async function testConnection() {
  try {
    const docRef = db.collection("test").doc("testDoc");
    await docRef.set({ message: "Firestore Connected Successfully!" });

    console.log("✅ Firestore Connection Test Passed!");
  } catch (error) {
    console.error("❌ Firestore Connection Failed!", error);
  }
}

testConnection();
