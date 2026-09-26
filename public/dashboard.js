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
      <div
        class="category-card"
        onclick="openDashboard('${category.strCategory}')"
      >

        <h3>
            ${categoryThai[category.strCategory]
            || category.strCategory}
        </h3>

      </div>
    `;
  });
}
async function openDashboard(category){

  document
    .getElementById("categoryPage")
    .classList.add("hidden");

  document
    .getElementById("dashboardPage")
    .classList.remove("hidden");

  document
    .getElementById("currentCategory")
    .textContent =
      categoryThai[category];

  await loadMeals(category);

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

async function loadMeals(category) {

  const res =
    await fetch(
      `/api/meals/${category}`
    );

  const data =
    await res.json();

  renderMeals(data.meals.slice(0,12));

  document
    .getElementById("mealContainer")
    .scrollIntoView({
      behavior: "smooth"
    });
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
              onclick="addFavorite('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')"
            >
              <i data-lucide="heart" aria-hidden="true"></i>
            </button>

            <button
              class="meal-action"
              type="button"
              aria-label="เพิ่มลงแผนอาหาร"
              title="เพิ่มลงแผนอาหาร"
              onclick="addQueue('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')"
            >
              <i data-lucide="calendar-plus" aria-hidden="true"></i>
            </button>
          </div>

        </div>

      </div>
    `;

  });

  if (window.lucide) {
    window.lucide.createIcons();
  }

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

  if (exists) return;

  favorites.push({
    id,
    name,
    image
  });

  renderFavorites();

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

}

function clearPlanner() {

  Object.keys(
    weeklyPlan
  ).forEach(day => {

    weeklyPlan[day] = [];

  });

  renderWeeklyPlan();

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

async function viewDetail(id) {

  const res =
    await fetch(
      `/api/detail/${id}`
    );

  const data =
    await res.json();

  const meal =
    data.meals[0];

  document
    .getElementById(
      "mealDetail"
    )
    .innerHTML = `
      <h2>
        ${meal.strMeal}
      </h2>

      <img
        src="${meal.strMealThumb}"
        width="300"
      >

      <p>
        <b>Category:</b>
        ${meal.strCategory}
      </p>

      <p>
        <b>Area:</b>
        ${meal.strArea}
      </p>

      <h3>
        Instructions
      </h3>

      <p>
        ${meal.strInstructions}
      </p>
    `;

  document
    .getElementById(
      "mealModal"
    )
    .classList
    .remove("hidden");

}

function backToCategories(){

  document
    .getElementById("dashboardPage")
    .classList.add("hidden");

  document
    .getElementById("categoryPage")
    .classList.remove("hidden");

}

function closeModal() {

  document
    .getElementById(
      "mealModal"
    )
    .classList
    .add("hidden");

}