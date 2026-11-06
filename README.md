# What2Eat

What2Eat แบ่งการทำงานเป็น Frontend React + Vite และ Backend Express โดยย้ายหน้าจอเดิมจาก `public/index.html`, `public/style.css` และ `public/dashboard.js` มาเป็น React โดยคง class names, ลำดับองค์ประกอบ และ CSS เดิมไว้ ไฟล์เดิมยังคงอยู่ที่ `public/` เพื่อใช้อ้างอิง

## ตารางที่ 1: Project Architecture

| ส่วน | โฟลเดอร์/ไฟล์ | หน้าที่ |
|---|---|---|
| Frontend | `frontend/src/App.jsx` | จัดการข้อมูลเมนู หมวดอาหาร Favorites คิว และแผนรายสัปดาห์ด้วย React State |
| Frontend | `frontend/src/components/Navbar.jsx` | Hero เดิมและปุ่มหมวดอาหาร โดยรักษา class และโครงสร้างการแสดงผลเดิม |
| Frontend | `frontend/src/components/MealCard.jsx`, `MealModal.jsx`, `StateFeedback.jsx` | การ์ดอาหาร หน้าต่างรายละเอียด และข้อความสถานะ |
| Frontend | `frontend/src/pages/` | ส่วน Favorites, Weekly Meals/Planner และ Meal Catalog |
| Frontend | `frontend/src/utils/` | Graph, Queue และ Bubble Sort |
| Frontend | `frontend/src/App.css` | สำเนาตรงของ `public/style.css`; ไม่ปรับค่าสไตล์ |
| Backend | `backend/server.js` | Express API proxy, in-memory cache, ตรวจสอบ input และเสิร์ฟ production build |
| Backend | `backend/package.json` | dependencies และคำสั่งรัน Express |
| Legacy Reference | `public/` | เก็บ HTML/CSS/JS และ hero video ต้นฉบับไว้ |

## ตารางที่ 2: DSA Components

| โครงสร้าง/อัลกอริทึม | ไฟล์ | การใช้งาน |
|---|---|---|
| Graph (Adjacency List) | `frontend/src/utils/Graph.js` | เก็บการเชื่อมโยงหมวดอาหารและใช้สร้างปุ่มนำทางหมวดแบบ Dynamic ใน Navbar |
| Queue (FIFO) | `frontend/src/utils/Queue.js` | จัดคิวอาหารตามลำดับที่เพิ่ม และนำอาหารไปใส่วันว่างตามลำดับ |
| Bubble Sort | `frontend/src/utils/sorting.js` | เรียงการ์ดตามชื่อเมื่อกดปุ่ม A-Z/Z-A โดยไม่แก้ไข array ต้นฉบับ |

## ตารางที่ 3: Backend API & Features

| Endpoint/ความสามารถ | รายละเอียด |
|---|---|
| `GET /api/categories` | Proxy หมวดอาหารจาก TheMealDB |
| `GET /api/meals/:category` | Proxy รายการอาหาร; อนุญาตเฉพาะ Beef, Pasta, Chicken, Seafood และ Dessert |
| `GET /api/detail/:id` | Proxy รายละเอียดอาหาร; รับ ID ตัวเลข 1–10 หลัก |
| Proxy | Frontend ใช้ `/api` ผ่าน Vite proxy ไป Express ที่ port 3000 |
| In-Memory Cache | เก็บผลลัพธ์ 5 นาที จำกัด 100 รายการ และนำรายการเก่าสุดออกเมื่อเต็ม |
| Input Validation | ตรวจหมวดอาหารแบบ allowlist และตรวจรูปแบบ ID; input ไม่ถูกต้องตอบ HTTP 400 |
| Error Handling | upstream ล้มเหลวตอบ HTTP 502 โดยไม่เปิดเผยรายละเอียดภายใน |
| Production | เมื่อ build Frontend แล้ว Express เสิร์ฟไฟล์จาก `frontend/dist` บน port 3000 |

## ตารางที่ 4: Frontend UX States

| สถานะ | การแสดงผล |
|---|---|
| Loading | คงข้อความเริ่มต้น “กำลังโหลดหมวดอาหาร...” และแสดงสถานะโหลดรายละเอียดใน Modal; ระหว่างโหลดเมนูคงชื่อหมวดตาม UI เดิม |
| Empty | ข้อความแจ้งเมื่อไม่พบหมวด/เมนู/รายละเอียด |
| Error | ข้อความแจ้งเมื่อเรียก API ไม่สำเร็จ |
| Success | แสดงหมวด การ์ดเมนู รายการโปรด คิว และแผนอาหาร |

## เริ่มใช้งาน

ติดตั้ง dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

เริ่มโหมดพัฒนาใน Terminal แยกกัน:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

เปิด Vite URL ที่แสดงใน Terminal (ปกติ `http://localhost:5173`). สำหรับ production ใช้ `npm run build --prefix frontend` แล้ว `npm start --prefix backend`.
