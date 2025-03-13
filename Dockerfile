# ใช้ Node.js 18 บน Alpine (ขนาดเล็กและเร็ว)
FROM node:18-alpine

# ตั้งค่าโฟลเดอร์ทำงานใน Container
WORKDIR /app

# คัดลอก package.json และ package-lock.json ก่อนติดตั้ง dependencies
COPY package.json package-lock.json ./

# ติดตั้ง Node.js dependencies (รวม devDependencies ด้วย)
RUN npm ci

# **📌 ติดตั้ง TypeScript (แก้ปัญหา tsc: not found)**
RUN npm install -g typescript

# คัดลอกโค้ดทั้งหมด
COPY . .

# คัดลอกไฟล์ .env.prod ไปเป็น .env
RUN cp .env.prod .env

# คอมไพล์ TypeScript เป็น JavaScript
RUN npm run build

# ตั้งค่า PORT และเปิดพอร์ต
ENV PORT=8080
EXPOSE 8080

# ใช้ไฟล์ .env.prod เป็นค่าเริ่มต้น
ENV NODE_ENV=production

# **📌 รันแอป (ใช้ node dist/index.js ถ้า script เป็นแบบนั้น)**
CMD ["npm", "run", "start"]
