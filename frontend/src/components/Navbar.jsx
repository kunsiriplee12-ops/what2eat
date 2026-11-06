import { navigationGraph } from "../utils/Graph.js";

export default function Navbar({
  activePage,
  onNavigate,
  categories,
  selectedCategory,
  categoryThai,
  onSelectCategory,
}) {
  const pageLabels = {
    "/catalog": "Meal Catalog",
    "/favorites": "Favorites",
    "/planner": "Weekly Meal Planner",
  };

  return (
    <>
      <header className="hero-header">
        <video className="hero-background" autoPlay loop muted playsInline aria-hidden="true" tabIndex="-1">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <h1>WHAT2EAT</h1>
        <p>Weekly Meal Planner &amp; Favorites</p>
      </header>

      <section className="category-section" aria-label="หมวดหมู่อาหาร">
        <div id="categoryContainer" className="category-grid">
          {navigationGraph.getNodes().map((route) => (
            <button
              key={route}
              className={`category-card${activePage === route ? " is-active" : ""}`}
              type="button"
              aria-current={activePage === route ? "page" : undefined}
              aria-pressed={activePage === route}
              onClick={() => onNavigate(route)}
            >
              <span>{pageLabels[route]}</span>
            </button>
          ))}
          {activePage === "/catalog" && categories.map((category) => (
            <button
              key={category.strCategory}
              className={`category-card${selectedCategory === category.strCategory ? " is-active" : ""}`}
              type="button"
              aria-pressed={selectedCategory === category.strCategory}
              onClick={() => onSelectCategory(category.strCategory)}
            >
              <span>{categoryThai[category.strCategory] || category.strCategory}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
