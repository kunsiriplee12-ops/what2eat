export default function FavoritesPage({ meals, onRemove }) {
  return (
    <section className="dashboard-section favorites-section" aria-labelledby="favoritesHeading">
      <h2 id="favoritesHeading">Favorites</h2>
      <div id="favoriteContainer">
        {meals.map((meal) => (
          <div className="mini-card" key={meal.id}>
            <div className="mini-card-image">
              <img src={meal.image} alt={meal.name} />
              <button
                className="mini-card-remove"
                type="button"
                aria-label="ลบรายการโปรด"
                title="ลบรายการโปรด"
                onClick={() => onRemove(meal.id)}
              >
                &times;
              </button>
            </div>
            <p>{meal.name}</p>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 5 - meals.length) }, (_, index) => (
          <div className="favorite-card-slot" aria-hidden="true" key={`empty-favorite-${index}`} />
        ))}
      </div>
    </section>
  );
}
