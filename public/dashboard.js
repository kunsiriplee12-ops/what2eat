// ======================================
// WHAT2EAT
// Frontend Logic
// ======================================

// ==========================
// Array
// Favorites
// ==========================

let favorites = [];

// ==========================
// Queue
// ==========================

class Queue {

  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

}

const mealQueue = new Queue();

// ==========================
// Hash Map
// Weekly Planner
// ==========================

const weeklyPlan = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

// ==========================
// Categories
// ==========================

let categories = [];
let selectedCategory = null;

const allowedCategories = [
  "Beef",
  "Pasta",
  "Chicken",
  "Seafood",
  "Dessert"
];

const categoryThai = {
  Beef: "เนื้อวัว",
  Chicken: "เนื้อไก่",
  Seafood: "อาหารทะเล",
  Dessert: "ของหวาน",
  Pasta: "พาสต้า",
};

// ==========================
// Load Categories
// ==========================

async function loadCategories() {

  const res =
    await fetch("/api/categories");

  const data =
    await res.json();

  categories =
  data.categories.filter(
    c =>
      allowedCategories.includes(
        c.strCategory
      )
  );

  renderCategories();

  if (categories.length > 0) {
    await openDashboard(categories[0].strCategory, false);
  }
}

loadCategories();

// ==========================
// Render Categories
// ==========================

function renderCategories() {

  const container =
    document.getElementById(
      "categoryContainer"
    );

  container.innerHTML = "";

  categories.forEach(category => {

    container.innerHTML += `
      <button
        class="category-card${selectedCategory === category.strCategory ? " is-active" : ""}"
        type="button"
        aria-pressed="${selectedCategory === category.strCategory}"
        onclick="openDashboard('${category.strCategory}')"
      >

        <span>
            ${categoryThai[category.strCategory]
            || category.strCategory}
        </span>

      </button>
    `;
  });
}
async function openDashboard(category, scrollToCatalog = true){
  selectedCategory = category;
  renderCategories();

  document
    .getElementById("currentCategory")
    .textContent =
      categoryThai[category] || category;

  await loadMeals(category, scrollToCatalog);

}

// ==========================
// Bubble Sort A-Z
// ==========================

//function sortAZ() {

  //const arr = [...categories];

  //for (let i = 0; i < arr.length - 1; i++) {

    //for (
      //let j = 0;
      //j < arr.length - i - 1;
      //j++
    //) {

      //if (
        //arr[j].strCategory >
        //arr[j + 1].strCategory
      //) {

        //[
          //arr[j],
          //arr[j + 1]
        //] =
        //[
          //arr[j + 1],
          //arr[j]
        //];

      //}

    //}

  //}

  //categories = arr;

  //renderCategories();

//}

// ==========================
// Bubble Sort Description
// ==========================

//function sortDescriptionLength() {

  //const arr = [...categories];

  //for (let i = 0; i < arr.length - 1; i++) {

    //for (
      //let j = 0;
      //j < arr.length - i - 1;
      //j++
    //) {

      //if (
        //arr[j]
          //.strCategoryDescription
          //.length
        //>
        //arr[j + 1]
          //.strCategoryDescription
          //.length
      //) {

        //[
          //arr[j],
          //arr[j + 1]
        //] =
        //[
          //arr[j + 1],
          //arr[j]
        //];

      //}

    //}

  //}

  //categories = arr;

  //renderCategories();

//}

// ==========================
// Load Meals
// ==========================

//async function loadMeals(category) {

  //const res =
    //await fetch(
      //`/api/meals/${category}`
    //);

  //const data =
    //await res.json();

  //renderMeals(data.meals);

async function loadMeals(category, scrollToCatalog = false) {

  const res =
    await fetch(
      `/api/meals/${category}`
    );

  const data =
    await res.json();

  if (selectedCategory !== category) return;

  renderMeals(data.meals || []);

  if (scrollToCatalog) {
    document
      .getElementById("catalogHeading")
      .scrollIntoView({ behavior: "smooth" });
  }
}
//}

// ==========================
// Render Meals
// ==========================

function renderMeals(meals) {

  const container =
    document.getElementById(
      "mealContainer"
    );

  container.innerHTML = "";

  meals.forEach(meal => {

    container.innerHTML += `
      <div class="meal-card">

        <img
          src="${meal.strMealThumb}"
        >

        <div
          class="meal-card-content"
        >

          <h3>
            ${meal.strMeal}
          </h3>

          <div class="meal-actions">
            <button
              class="meal-action"
              type="button"
              aria-label="ดูรายละเอียด"
              title="ดูรายละเอียด"
              onclick="viewDetail('${meal.idMeal}')"
            >
              <i data-lucide="eye" aria-hidden="true"></i>
            </button>

            <button
              class="meal-action"
              type="button"
              aria-label="เพิ่มรายการโปรด"
              title="เพิ่มรายการโปรด"
              data-action="favorite"
              data-meal-id="${meal.idMeal}"
              aria-pressed="false"
              onclick="addFavorite('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')"
            >
              <i data-lucide="heart" aria-hidden="true"></i>
            </button>

            <button
              class="meal-action"
              type="button"
              aria-label="เพิ่มลงแผนอาหาร"
              title="เพิ่มลงแผนอาหาร"
              data-action="queue"
              data-meal-id="${meal.idMeal}"
              aria-pressed="false"
              onclick="addQueue('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')"
            >
              <i data-lucide="calendar-plus" aria-hidden="true"></i>
            </button>
          </div>

        </div>

      </div>
    `;

  });

  syncAllMealActionStates();

  if (window.lucide) {
    window.lucide.createIcons();
  }

}

function syncMealActionState(id) {
  const mealId = String(id);
  const isFavorite = favorites.some(
    meal => String(meal.id) === mealId
  );
  const isQueued = mealQueue.items.some(
    meal => String(meal.id) === mealId
  );
  const isPlanned = Object.values(weeklyPlan).some(
    meals => meals.some(meal => String(meal.id) === mealId)
  );

  document
    .querySelectorAll(".meal-action[data-meal-id]")
    .forEach(button => {
      if (button.dataset.mealId !== mealId) return;

      const isActive = button.dataset.action === "favorite"
        ? isFavorite
        : isQueued || isPlanned;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
}

function syncAllMealActionStates() {
  const mealIds = new Set(
    Array.from(
      document.querySelectorAll(".meal-action[data-meal-id]"),
      button => button.dataset.mealId
    )
  );

  mealIds.forEach(syncMealActionState);
}

// ==========================
// Search
// ==========================

///async function searchMeal() {

  //const keyword =
    //document
      //.getElementById(
      //  "searchInput"
      //)
      //.value;

  //if (!keyword) return;

  //const res =
    //await fetch(
   //   `/api/search/${keyword}`
   // );

  //const data =
    //await res.json();

  //if (data.meals) {
    //renderMeals(data.meals);
  //}

//}

// ==========================
// Favorite
// Array
// ==========================

function addFavorite(id, name, image) {

  const exists =
    favorites.find(
      meal => meal.id === id
    );

  if (exists) {
    syncMealActionState(id);
    return;
  }

  favorites.push({
    id,
    name,
    image
  });

  renderFavorites();
  syncMealActionState(id);

}

function renderFavorites() {

  const container =
    document.getElementById(
      "favoriteContainer"
    );

  container.innerHTML = "";

  favorites.forEach(meal => {

    container.innerHTML += `
  <div class="mini-card">

      <div class="mini-card-image">
        <img
          src="${meal.image}"
          alt="${meal.name}"
        >

        <button
          class="mini-card-remove"
          type="button"
          aria-label="ลบรายการโปรด"
          title="ลบรายการโปรด"
          onclick="removeFavorite('${meal.id}')"
        >
          &times;
        </button>
      </div>

    <p>${meal.name}</p>

  </div>
    `;

  });

}
function removeFavorite(id) {

  const index =
    favorites.findIndex(
      meal => meal.id === id
    );

  if (index !== -1) {

    favorites.splice(index, 1);

  }

  renderFavorites();
  syncMealActionState(id);

}

// ==========================
// Queue
// ==========================

function addQueue(id, name, image) {

  mealQueue.enqueue({
    id,
    name,
    image
  });

  renderQueue();
  syncMealActionState(id);
}

function renderQueue() {

  const container =
    document.getElementById(
      "queueContainer"
    );

  container.innerHTML = "";

  mealQueue.items.forEach(meal => {

    container.innerHTML += `
      <div class="mini-card">

        <div class="mini-card-image">
          <img
            src="${meal.image}"
            alt="${meal.name}"
          >

          <button
            class="mini-card-remove"
            type="button"
            aria-label="ลบรายการจาก Weekly Meal"
            title="ลบรายการจาก Weekly Meal"
            onclick="removeQueue('${meal.id}')"
          >
            &times;
          </button>
        </div>

        <p>${meal.name}</p>

      </div>
    `;

  });

}

function removeQueue(id) {

  const index =
    mealQueue.items.findIndex(
      meal => meal.id === id
    );

  if (index !== -1) {

    mealQueue.items.splice(
      index,
      1
    );

  }

  renderQueue();
  syncMealActionState(id);

}

// ==========================
// Generate Weekly Plan
// Queue -> Hash Map
// ==========================

function generateWeeklyPlan() {

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  while (!mealQueue.isEmpty()) {

    const meal =
      mealQueue.dequeue();

    const emptyDay =
      days.find(
        day =>
          weeklyPlan[day].length === 0
      );

    if (!emptyDay) {
      break;
    }

    weeklyPlan[emptyDay]
      .push(meal);

  }

  renderQueue();

  renderWeeklyPlan();
  syncAllMealActionStates();

}

function clearPlanner() {

  Object.keys(
    weeklyPlan
  ).forEach(day => {

    weeklyPlan[day] = [];

  });

  renderWeeklyPlan();
  syncAllMealActionStates();

}

// ==========================
// Render Weekly Plan
// ==========================

function renderWeeklyPlan() {

  Object.keys(
    weeklyPlan
  ).forEach(day => {

    const container =
      document.getElementById(
        day
      );

    container.innerHTML = "";

    weeklyPlan[day]
      .forEach(meal => {

        container.innerHTML += `
          <div class="mini-card">

            <div class="mini-card-image">
              <img
                src="${meal.image}"
                alt="${meal.name}"
              >
            </div>

            <p>
              ${meal.name}
            </p>

          </div>
        `;

      });

  });

}


// ==========================
// Detail Modal
// ==========================

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getInstructionSteps(instructions) {
  const text = String(instructions ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();

  let steps;

  if (/\b(?:step|ขั้นตอน)\s*\d+\b/i.test(text)) {
    steps = text.split(/(?=\b(?:step|ขั้นตอน)\s*\d+\b)/gi);
  } else if (/(?:^|\s)\d+[).:-]\s/.test(text)) {
    steps = text.split(/(?=(?:^|\s)\d+[).:-]\s)/g);
  } else {
    steps = text
      .split(/\r?\n+/)
      .flatMap(line => line.split(/(?<=[.!?])\s+/));
  }

  return steps
    .map(step => step.replace(/^(?:(?:step|ขั้นตอน)\s*\d+\s*[:.)-]?|\d+[).:-])\s*/i, "").trim())
    .filter(Boolean);
}

async function viewDetail(id) {

  const res =
    await fetch(
      `/api/detail/${id}`
    );

  const data =
    await res.json();

  const meal =
    data.meals[0];

  const instructionSteps =
    getInstructionSteps(meal.strInstructions);

  document
    .getElementById(
      "mealDetail"
    )
    .innerHTML = `
      <h2>
        ${escapeHtml(meal.strMeal)}
      </h2>

      <img
        src="${escapeHtml(meal.strMealThumb)}"
        alt="${escapeHtml(meal.strMeal)}"
      >

      <p>
        <b>Category:</b>
        ${escapeHtml(meal.strCategory)}
      </p>

      <p>
        <b>Area:</b>
        ${escapeHtml(meal.strArea)}
      </p>

      <section class="instruction-section" aria-labelledby="instructionTitle">
        <h3 id="instructionTitle">Instructions</h3>
        <ol class="instruction-list">
          ${instructionSteps.map(step => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </section>
    `;

  document
    .getElementById(
      "mealModal"
    )
    .classList
    .remove("hidden");

}

function closeModal() {

  document
    .getElementById(
      "mealModal"
    )
    .classList
    .add("hidden");

}