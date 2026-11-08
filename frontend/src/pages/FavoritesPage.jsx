import { useEffect, useState } from "react";

export default function FavoritesPage({
  meals,
  queuedMeals,
  plannedIds,
  onRemove,
  onViewDetail,
  onToggleQueue,
  onNavigate,
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [meals, activeIndex]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(meals.length - 1, 0)));
  }, [meals.length]);

  const visibleMeals = meals.length >= 3
    ? [-1, 0, 1].map((offset) => {
        const index = (activeIndex + offset + meals.length) % meals.length;
        return { meal: meals[index], index, offset };
      })
    : meals.map((meal, index) => ({
        meal,
        index,
        offset: index === activeIndex ? 0 : 1,
      }));

  const moveActive = (direction) => {
    setActiveIndex((current) => (current + direction + meals.length) % meals.length);
  };

  return (
    <section className="dashboard-section favorites-section" aria-labelledby="favoritesHeading">
      <h2 id="favoritesHeading">Favorites</h2>
      <div className={`favorites-coverflow${meals.length ? "" : " is-empty"}`}>
        {meals.length > 1 && (
          <button
            className="favorites-coverflow-control is-previous"
            type="button"
            aria-label="รายการโปรดก่อนหน้า"
            onClick={() => moveActive(-1)}
          >
            <i data-lucide="chevron-left" aria-hidden="true"></i>
          </button>
        )}
        <div className="favorites-coverflow-stage">
          {meals.length === 0
            ? [-1, 0, 1].map((offset) => (
                <button
                  className={`favorite-meal-card favorite-empty-card${offset === 0 ? " is-active" : ` is-side is-side-${offset < 0 ? "left" : "right"}`}`}
                  key={offset}
                  type="button"
                  aria-label="ไปยัง Meal Catalog"
                  onClick={() => onNavigate("/catalog")}
                >
                  <i data-lucide="plus" aria-hidden="true"></i>
                </button>
              ))
            : visibleMeals.map(({ meal, index, offset }) => {
                const isQueued =
                  queuedMeals.some((queuedMeal) => queuedMeal.id === meal.id) ||
                  plannedIds.has(meal.id);

                return (
                  <article
                    className={`favorite-meal-card${offset === 0 ? " is-active" : ` is-side is-side-${offset < 0 ? "left" : "right"}`}`}
                    key={meal.id}
                    onClick={() => offset !== 0 && setActiveIndex(index)}
                  >
                    <img className="favorite-meal-image" src={meal.image} alt={meal.name} />
                    <div className="favorite-meal-content">
                      <h3>{meal.name}</h3>
                      <div className="favorite-meal-actions">
                        <button
                          className="favorite-meal-action"
                          type="button"
                          aria-label={`ดูรายละเอียด ${meal.name}`}
                          title="ดูรายละเอียด"
                          onClick={(event) => {
                            event.stopPropagation();
                            onViewDetail(meal.id);
                          }}
                        >
                          <i data-lucide="eye" aria-hidden="true"></i>
                        </button>
                        <button
                          className={`favorite-meal-action${isQueued ? " is-active" : ""}`}
                          type="button"
                          aria-label={`เพิ่ม ${meal.name} ลงแผนอาหาร`}
                          title={isQueued ? "เพิ่มลงแผนอาหารแล้ว" : "เพิ่มลงแผนอาหาร"}
                          aria-pressed={isQueued}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (!isQueued) {
                              onToggleQueue({
                                idMeal: meal.id,
                                strMeal: meal.name,
                                strMealThumb: meal.image,
                              });
                            }
                          }}
                        >
                          <i data-lucide="calendar-plus" aria-hidden="true"></i>
                        </button>
                        <button
                          className="favorite-meal-action"
                          type="button"
                          aria-label={`ลบ ${meal.name} จากรายการโปรด`}
                          title="ลบรายการโปรด"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRemove(meal.id);
                          }}
                        >
                          <i data-lucide="trash-2" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
        {meals.length > 1 && (
          <button
            className="favorites-coverflow-control is-next"
            type="button"
            aria-label="รายการโปรดถัดไป"
            onClick={() => moveActive(1)}
          >
            <i data-lucide="chevron-right" aria-hidden="true"></i>
          </button>
        )}
      </div>
    </section>
  );
}
