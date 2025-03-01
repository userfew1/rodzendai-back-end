"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const case_controller_1 = require("../controllers/case.controller");
const router = express_1.default.Router();
// 🟢 สร้างข้อมูลเคส
router.post("/cases", case_controller_1.createCase);
// 🟢 สร้างข้อมูลเคส crm
router.post('/cases/crm', case_controller_1.createCaseCRM);
// 🟢 ดึงข้อมูลเคสทั้งหมด (หรือกรองตาม `status`)
router.get("/cases", case_controller_1.getAllCases);
// 🟢 ดึงข้อมูลเคสตาม `case_id`
router.get("/cases/:case_id", case_controller_1.getCaseById);
// 🟢 อัปเดตข้อมูลเคสตาม `case_id`
router.put("/cases/:case_id", case_controller_1.updateCase);
exports.default = router;
