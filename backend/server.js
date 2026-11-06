const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 100;
const MEAL_DB_API = "https://www.themealdb.com/api/json/v1/1";
const FRONTEND_DIST = path.resolve(__dirname, "..", "frontend", "dist");
const allowedCategories = new Set(["Beef", "Pasta", "Chicken", "Seafood", "Dessert"]);
const cache = new Map();

app.use(cors());
app.use(express.json());

async function fetchMealDb(endpoint) {
  const cached = cache.get(endpoint);
  if (cached && cached.expiresAt > Date.now()) return cached.data;
  if (cached) cache.delete(endpoint);

  const response = await fetch(`${MEAL_DB_API}${endpoint}`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`MealDB returned HTTP ${response.status}`);
  }

  const data = await response.json();
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(endpoint, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

function proxyError(res, error) {
  console.error("MealDB proxy request failed:", error);
  return res.status(502).json({ error: "The meal service is temporarily unavailable." });
}

app.get("/api/categories", async (_req, res) => {
  try {
    res.json(await fetchMealDb("/categories.php"));
  } catch (error) {
    proxyError(res, error);
  }
});

app.get("/api/meals/:category", async (req, res) => {
  const category = req.params.category.trim();
  if (!allowedCategories.has(category)) {
    return res.status(400).json({ error: "Invalid meal category." });
  }

  try {
    res.json(await fetchMealDb(`/filter.php?c=${encodeURIComponent(category)}`));
  } catch (error) {
    proxyError(res, error);
  }
});

app.get("/api/detail/:id", async (req, res) => {
  const { id } = req.params;
  if (!/^\d{1,10}$/.test(id)) {
    return res.status(400).json({ error: "Invalid meal ID." });
  }

  try {
    res.json(await fetchMealDb(`/lookup.php?i=${encodeURIComponent(id)}`));
  } catch (error) {
    proxyError(res, error);
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found." });
});

if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.status(503).send("Build the frontend with npm run build --prefix frontend.");
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`What2Eat API is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
