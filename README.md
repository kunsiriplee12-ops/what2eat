# What2Eat

What2Eat แบ่งการทำงานเป็น Frontend React + Vite และ Backend Express โดยย้ายหน้าจอเดิมจาก `public/index.html`, `public/style.css` และ `public/dashboard.js` มาเป็น React โดยคง class names, ลำดับองค์ประกอบ และ CSS เดิมไว้ ไฟล์เดิมยังคงอยู่ที่ `public/` เพื่อใช้อ้างอิง

## ตารางที่ 1: ตารางส่วนร่วม

| ชื่อ-สกุล | รหัสนักศึกษา | ชิ้นงานที่รับผิดชอบ (ไฟล์ / component / route / DSA) | ช่วงที่นำเสนอในคลิป |
|---|---|---|---|
| [กุลศิริ พลีขันธ์] | [681310004] | ทุกส่วนในระบบ (`Graph.js`, `Queue.js`, `sorting.js`, `server.js`, `App.jsx`, `PlannerPage.jsx`, `FavoritesPage.jsx`, `CatalogPage.jsx`) | 0:00 - 9:00 นำเสนอคนเดียวทั้งคลิป |

## ตารางที่ 2: ตารางข้อแนะนำจากงานแรก

| ข้อแนะนำจากงานแรก / ข้อจำกัดที่พบเดิม | สิ่งที่แก้ในงานนี้ (Self-Improvement) | หลักฐาน Before / After |
|---|---|---|
| 1. ระบบเดิมเป็น Single Page ไม่มี Navigation Graph ทำให้เปลี่ยนหน้าไม่ได้ | เพิ่มระบบ Routing แบบ Dynamic โดยใช้ Graph Data Structure (`Graph.js`) เชื่อมโยง 3 หน้าหลัก | [เปรียบเทียบ UI งานเดิมที่เป็นหน้าเดียว กับเวอร์ชันใหม่ที่มี Navbar/Graph Navigation] |
| 2. การดึง API จากภายนอกเปลือง Bandwidth และไม่มีการดักจับข้อผิดพลาด | สร้าง Backend Express Proxy พร้อม In-memory Cache (TTL 5 นาที) และ Input Validation | [แสดงรูป Network Tab หรือโค้ด server.js ที่มีระบบ Cache/Proxy] |
| 3. ไม่มีระบบวางแผนอาหารประจำสัปดาห์ที่โต้ตอบได้ง่าย | เพิ่มฟีเจอร์ Drag & Drop ลากเมนูลง Planner พร้อมสถาปัตยกรรม Hash Map $O(1)$ | [แสดงรูป UI เดิม เทียบกับหน้า Planner ใหม่ที่มี Drag and Drop และ Frosted Glass Cards] |

## ตารางที่ 3: ตาราง useState

| ชื่อ state | เก็บข้อมูลอะไร | อยู่ใน component | เปลี่ยนค่าเมื่อใด / โดยใคร | ทำไมต้องเป็น state |
|---|---|---|---|---|
| `activePage` | เส้นทางหน้าปัจจุบัน (`/catalog`, `/favorites`, `/planner`) | `App.jsx` | เมื่อผู้ใช้กดปุ่มเมนู Navbar หรือปุ่มใน Hero Landing | UI ต้องเปลี่ยนหน้าแบบ SPA และ Re-render ทันทีโดยไม่ต้อง Reload |
| `weeklyPlan` | ข้อมูลตารางอาหารประจำวัน (Hash Map) | `App.jsx` | เมื่อ Drop เมนูลงช่องวัน หรือกด Generate/Clear Planner | ข้อมูลตารางอาหารปรับเปลี่ยนตาม Action ผู้ใช้ และต้องส่ง Props ลงไปเรนเดอร์ใน PlannerPage |
| `queuedMeals` | คิวรายการอาหารที่เลือกไว้เตรียมลง Planner | `App.jsx` | เมื่อกดไอคอน `calendar-plus` บนการ์ดอาหาร หรือกดลบ | ต้องเก็บคิวชั่วคราวเพื่อส่งเข้า Queue DSA นำไปใส่ตารางอาหารตามลำดับ |
| `favorites` | รายการอาหารโปรด | `App.jsx` | เมื่อกดปุ่มหัวใจบนการ์ดอาหาร | UI ในหน้า Favorites ต้องแสดงแบบ 3D Coverflow และ Re-render ทันที |
| `meals` | รายการเมนูอาหารในหมวดหมู่ที่เลือก | `App.jsx` | เมื่อ `selectedCategory` เปลี่ยน และ Fetch ข้อมูลสำเร็จ | ใช้เก็บผลลัพธ์เมนูจาก Backend มาแสดงใน CatalogPage |
| `catalogStatus` | สถานะการโหลดของ Catalog (`loading`, `empty`, `error`, `success`) | `App.jsx` | เมื่อเริ่ม Fetch API, Fetch สำเร็จ, หรือเกิด Error | ควบคุมการแสดงผล UI Feedback (StateFeedback) ตามสภาวะต่างๆ |

## ตารางที่ 4: ตาราง useEffect

| component | effect ทำอะไร | dependency array | ทำงานตอนไหน |
|---|---|---|---|
| `App.jsx` | Fetch ข้อมูลหมวดหมู่อาหารจาก Backend (`/api/categories`) | `[]` | ทำงานครั้งเดียวเมื่อ Mount Component |
| `App.jsx` | Fetch รายการเมนูอาหารตามหมวดหมู่ที่เลือก (`/api/meals/:category`) | `[selectedCategory]` | ทำงานเมื่อผู้ใช้เปลี่ยน `selectedCategory` |
| `MealModal.jsx` | Fetch รายละเอียดอาหารตาม ID (`/api/detail/:id`) | `[mealId]` | ทำงานเมื่อ `mealId` มีการเปลี่ยนแปลง (เปิด Modal) |
| `App.jsx` | จัดการ Event Listener `popstate` สำหรับการกด Back/Forward บนเบราว์เซอร์ | `[]` | Mount Component และ Cleanup เมื่อ Unmount |

## ตารางที่ 5: Project Architecture

| ส่วน | โฟลเดอร์/ไฟล์ | หน้าที่ |
|---|---|---|
| Frontend | `frontend/src/App.jsx` | จัดการข้อมูลด้วย React State; `/` เป็น Landing แยก และ render เฉพาะหน้า `/catalog`, `/favorites` หรือ `/planner` |
| Frontend | `frontend/src/components/Navbar.jsx` | Full-screen video Hero ที่รับ wheel/touch เพื่อ fade ข้อความ, ปุ่ม yes และ Modal นำทาง; sub-pages มี Navbar และปุ่มกลับ Landing |
| Frontend | `frontend/src/components/MealCard.jsx`, `MealModal.jsx`, `StateFeedback.jsx` | การ์ดอาหาร หน้าต่างรายละเอียด และข้อความสถานะ |
| Frontend | `frontend/src/pages/` | ส่วน Favorites, Weekly Meals/Planner และ Meal Catalog |
| Frontend | `frontend/src/utils/` | Graph, Queue และ Bubble Sort |
| Frontend | `frontend/src/App.css` | ใช้สไตล์เดิมจาก `public/style.css` พร้อมกฎเพิ่มเติมสำหรับ Landing และ Navbar layout |
| Backend | `backend/server.js` | Express API proxy, in-memory cache, ตรวจสอบ input และเสิร์ฟ production build |
| Backend | `backend/package.json` | dependencies และคำสั่งรัน Express |
| Legacy Reference | `public/` | เก็บ HTML/CSS/JS และ hero video ต้นฉบับไว้ |

## ตารางที่ 6: DSA Components

| โครงสร้าง/อัลกอริทึม | ไฟล์ | การใช้งาน |
|---|---|---|
| Graph (Adjacency List) | `frontend/src/utils/Graph.js` | เก็บ Node `/catalog`, `/favorites`, `/planner` และ Edge สำหรับการเปลี่ยนเส้นทางจากปุ่มใน Hero Modal; Navbar และ Router ใช้กราฟเดียวกัน |
| Queue (FIFO) | `frontend/src/utils/Queue.js` | จัดคิวอาหารตามลำดับที่เพิ่ม และนำอาหารไปใส่วันว่างตามลำดับ |
| Bubble Sort | `frontend/src/utils/sorting.js` | เรียงการ์ดตามชื่อเมื่อกดปุ่ม A-Z/Z-A โดยไม่แก้ไข array ต้นฉบับ |

## ตารางที่ 7: Backend API & Features

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

## ตารางที่ 8: Frontend UX States

| สถานะ | การแสดงผล |
|---|---|
| Loading | คงข้อความเริ่มต้น “กำลังโหลดหมวดอาหาร...” และแสดงสถานะโหลดรายละเอียดใน Modal; Landing แสดง Hero ขณะโหลด API |
| Empty | ข้อความแจ้งเมื่อไม่พบหมวด/เมนู/รายละเอียด |
| Error | ข้อความแจ้งเมื่อเรียก API ไม่สำเร็จ |
| Success | แสดงหมวด การ์ดเมนู รายการโปรด คิว และแผนอาหาร |

## เริ่มใช้งาน

ติดตั้ง dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

เริ่มโหมดพัฒนาใน Terminal แยกกัน โดย Vite proxy `/api` ไปยัง Express port `3000`:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

เปิด Vite URL ที่แสดงใน Terminal (ปกติ `http://localhost:5173`). หน้า `/` เป็น Landing แบบเต็มจอ: เลื่อน wheel หรือ swipe ขึ้นเพื่อแสดงคำถามและปุ่ม `yes`; เลือกหน้าได้จาก Modal. หน้าเว็บยังเข้าโดยตรงได้ที่ `/catalog`, `/favorites` และ `/planner`; Navbar รองรับสลับหน้า/กลับ Landing รวมทั้ง browser back/forward และ deep link. สำหรับ production ใช้ `npm run build --prefix frontend` แล้ว `npm start --prefix backend`.
