// =========================
// WHAT2EAT
// Backend Server
// =========================

const express = require("express");

const app = express();

const PORT = 3000;

// ใช้ไฟล์ใน public
app.use(express.static("public"));

app.use(express.json());

// =======================================
// API URL
// =======================================

const CATEGORY_API =
  "https://www.themealdb.com/api/json/v1/1/categories.php";

// =======================================
// Route : ดึงหมวดอาหารทั้งหมด
// =======================================

app.get("/api/categories", async (req, res) => {
  try {

    const response = await fetch(CATEGORY_API);

    const data = await response.json();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

// =======================================
// Route : ดึงอาหารตามหมวด
// ตัวอย่าง
// /api/meals/Seafood
// =======================================

app.get("/api/meals/:category", async (req, res) => {

  try {

    const category =
      req.params.category;

    const response =
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );

    const data =
      await response.json();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// =======================================
// Route : ค้นหาอาหาร
// ตัวอย่าง
// /api/search/chicken
// =======================================

app.get("/api/search/:keyword", async (req, res) => {

  try {

    const keyword =
      req.params.keyword;

    const response =
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`
      );

    const data =
      await response.json();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// =======================================
// Route : ดูรายละเอียดอาหาร
// =======================================

app.get("/api/detail/:id", async (req, res) => {

  try {

    const id =
      req.params.id;

    const response =
      await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

    const data =
      await response.json();

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

// =======================================
// Start Server
// =======================================

app.listen(PORT, () => {

  console.log(
    `🚀 WHAT2EAT Running : http://localhost:${PORT}`
  );

});