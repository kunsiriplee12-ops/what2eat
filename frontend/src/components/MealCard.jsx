export default function MealCard({
  meal,
  isFavorite,
  isQueued,
  onViewDetail,
  onToggleFavorite,
  onToggleQueue,
}) {
  return (
    <div className="meal-card">
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <div className="meal-card-content">
        <h3>{meal.strMeal}</h3>
        <div className="meal-actions">
          <button
            className="meal-action"
            type="button"
            aria-label="ดูรายละเอียด"
            title="ดูรายละเอียด"
            onClick={() => onViewDetail(meal.idMeal)}
          >
            <i data-lucide="eye" aria-hidden="true"></i>
          </button>
          <button
            className={`meal-action${isFavorite ? " is-active" : ""}`}
            type="button"
            aria-label="เพิ่มรายการโปรด"
            title="เพิ่มรายการโปรด"
            data-action="favorite"
            data-meal-id={meal.idMeal}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(meal)}
          >
            <i data-lucide="heart" aria-hidden="true"></i>
          </button>
          <button
            className={`meal-action${isQueued ? " is-active" : ""}`}
            type="button"
            aria-label="เพิ่มลงแผนอาหาร"
            title="เพิ่มลงแผนอาหาร"
            data-action="queue"
            data-meal-id={meal.idMeal}
            aria-pressed={isQueued}
            onClick={() => !isQueued && onToggleQueue(meal)}
          >
            <i data-lucide="calendar-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
