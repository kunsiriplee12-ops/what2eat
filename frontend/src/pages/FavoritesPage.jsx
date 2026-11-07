import { useEffect } from "react";

export default function FavoritesPage({ meals, onRemove, onViewDetail }) {
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [meals]);

  return (
    <section className="dashboard-section favorites-section" aria-labelledby="favoritesHeading">
      <h2 id="favoritesHeading">Favorites</h2>
      <div id="favoriteContainer">
        {meals.map((meal) => (
          <div className="favorite-meal-card" key={meal.id}>
            <img className="favorite-meal-image" src={meal.image} alt={meal.name} />
            <div className="favorite-meal-content">
              <h3>{meal.name}</h3>
              <div className="favorite-meal-actions">
                <button
                  className="favorite-meal-action"
                  type="button"
                  aria-label={`ดูรายละเอียด ${meal.name}`}
                  title="ดูรายละเอียด"
                  onClick={() => onViewDetail(meal.id)}
                >
                  <i data-lucide="eye" aria-hidden="true"></i>
                </button>
                <button
                  className="favorite-meal-action"
                  type="button"
                  aria-label={`ลบ ${meal.name} จากรายการโปรด`}
                  title="ลบรายการโปรด"
                  onClick={() => onRemove(meal.id)}
                >
                  <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
