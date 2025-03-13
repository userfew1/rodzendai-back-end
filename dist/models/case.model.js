"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_Firestore_1 = __importDefault(require("../connect_Firestore"));
const caseCollection = connect_Firestore_1.default.collection("cases");
exports.default = caseCollection;
