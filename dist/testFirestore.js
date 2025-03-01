"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_Firestore_1 = __importDefault(require("./connect_Firestore"));
async function testConnection() {
    try {
        const docRef = connect_Firestore_1.default.collection("test").doc("testDoc");
        await docRef.set({ message: "Firestore Connected Successfully!" });
        console.log("✅ Firestore Connection Test Passed!");
    }
    catch (error) {
        console.error("❌ Firestore Connection Failed!", error);
    }
}
testConnection();
