import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

// โหลดไฟล์ Excel และแปลงเป็น JSON
const loadExcelFile = (filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
};

// กำหนดตำแหน่งไฟล์
const provinceFilePath = path.join(__dirname, '../data/L_PROVINCE.xlsx');
const catmFilePath = path.join(__dirname, '../data/L_CATM.xlsx');

// โหลดข้อมูลจังหวัด
const provinceData = loadExcelFile(provinceFilePath);
export const provinceMap: Record<string, string> = {};
provinceData.forEach((row: any) => {
    provinceMap[row.PROVINCE_ID] = row.PROVINCE_NAME;
});

// โหลดข้อมูลตำบล อำเภอ จังหวัด
const catmData = loadExcelFile(catmFilePath);
export const districtMap: Record<string, string> = {};
export const subdistrictMap: Record<string, string> = {};

catmData.forEach((row: any) => {
    districtMap[row.CATM] = row.AMPHUR_NAME;  // รหัสอำเภอ -> ชื่ออำเภอ
    subdistrictMap[row.CATM] = row.TUMBON_NAME; // รหัสตำบล -> ชื่อตำบล
});

// 🔹 เพิ่มฟังก์ชันแปลงรหัสเป็นชื่อ
export const getProvinceName = (provinceId: string) => provinceMap[provinceId] || 'ไม่พบข้อมูล';
export const getDistrictName = (districtId: string) => districtMap[districtId] || 'ไม่พบข้อมูล';
export const getSubdistrictName = (subdistrictId: string) => subdistrictMap[subdistrictId] || 'ไม่พบข้อมูล';

console.log('📌 Province, District, Subdistrict data loaded successfully!');
