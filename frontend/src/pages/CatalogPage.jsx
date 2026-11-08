import { useEffect } from "react";
import MealCard from "../components/MealCard.jsx";
import bubbleSortByName from "../utils/sorting.js";

export default function CatalogPage({
  meals,
  status,
  selectedCategory,
  favorites,
  queuedMeals,
  plannedIds,
  sortDirection,
  sortActive,
  onSort,
  onViewDetail,
  onToggleFavorite,
  onToggleQueue,
}) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [meals, favorites, queuedMeals]);

  const sortedMeals = sortDirection
    ? bubbleSortByName(meals, sortDirection === "desc")
    : meals;
  const message = {
    loading: "กำลังโหลดเมนูอาหาร...",
    empty: "ไม่พบเมนูอาหารในหมวดนี้",
    error: "โหลดเมนูอาหารไม่สำเร็จ",
  }[status];

  return (
    <section className="dashboard-section meal-catalog" aria-labelledby="catalogHeading">
      <h2 id="catalogHeading">Meal Catalog</h2>
      <button
        type="button"
        className={`sort-btn catalog-sort-btn${sortActive ? " is-active" : ""}`}
        onClick={onSort}
        aria-pressed={sortActive}
      >
        เรียงตามชื่อ ({sortDirection === "desc" ? "Z-A" : "A-Z"})
      </button>
      <p id="currentCategory" aria-live="polite">
        {selectedCategory && status !== "error" ? selectedCategory : message}
      </p>
      <div id="mealContainer" className="meal-grid">
        {status === "success" && sortedMeals.map((meal) => (
          <MealCard
            key={meal.idMeal}
            meal={meal}
            isFavorite={favorites.some((item) => item.id === String(meal.idMeal))}
            isQueued={
              queuedMeals.some((item) => item.id === String(meal.idMeal)) ||
              plannedIds.has(String(meal.idMeal))
            }
            onViewDetail={onViewDetail}
            onToggleFavorite={onToggleFavorite}
            onToggleQueue={onToggleQueue}
          />
        ))}
      </div>
    </section>
  );
}
