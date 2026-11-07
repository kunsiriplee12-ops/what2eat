import { useEffect, useState } from "react";
import { navigationGraph } from "../utils/Graph.js";

const pageLabels = {
  "/catalog": "Meal Catalog",
  "/favorites": "Favorites",
  "/planner": "Weekly Meal Planner",
};

const categoryBackgrounds = {
  Beef: "/images/beef-bg.jpg",
  Pasta: "/images/pasta-bg.jpg",
  Chicken: "/images/chicken-bg.jpg",
  Seafood: "/images/seafood-bg.jpg",
  Dessert: "/images/dessert-bg.jpg",
};

export default function Navbar({
  isLanding,
  activePage,
  onNavigate,
  onHome,
  categories,
  selectedCategory,
  categoryThai,
  onSelectCategory,
}) {
  const [hasScrolledDown, setHasScrolledDown] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    if (!isLanding) {
      setHasScrolledDown(false);
      setIsNavigationOpen(false);
      return undefined;
    }

    let touchStartY = null;
    const handleWheel = (event) => {
      if (isNavigationOpen) return;
      event.preventDefault();
      if (event.deltaY > 0) setHasScrolledDown(true);
      if (event.deltaY < 0) setHasScrolledDown(false);
    };
    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event) => {
      if (isNavigationOpen) return;
      event.preventDefault();
    };
    const handleTouchEnd = (event) => {
      const endY = event.changedTouches[0]?.clientY;
      if (touchStartY === null || endY === undefined || isNavigationOpen) return;
      if (touchStartY - endY > 12) setHasScrolledDown(true);
      if (endY - touchStartY > 12) setHasScrolledDown(false);
      touchStartY = null;
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsNavigationOpen(false);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isLanding, isNavigationOpen]);

  const handleNavigate = (route) => {
    setIsNavigationOpen(false);
    onNavigate(route);
  };

  if (isLanding) {
    return (
      <div className={`landing-page${isNavigationOpen ? " is-navigation-open" : ""}`}>
        <header className="hero-header hero-landing">
          <video className="hero-background" autoPlay loop muted playsInline aria-hidden="true" tabIndex="-1">
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <h1
            className={`landing-title${hasScrolledDown ? " landing-title-hidden" : ""}`}
            aria-hidden={hasScrolledDown}
          >
            WHAT2EAT
          </h1>
          <div
            className={`landing-question${hasScrolledDown ? " landing-question-visible" : ""}`}
            aria-hidden={!hasScrolledDown}
          >
            <h1>You Hungry?</h1>
            <button
              className="hero-yes-button"
              type="button"
              tabIndex={hasScrolledDown ? 0 : -1}
              onClick={() => setIsNavigationOpen(true)}
            >
              yes
            </button>
          </div>
        </header>

        {isNavigationOpen && (
          <div
            className="modal hero-navigation-overlay"
            role="presentation"
            onMouseDown={(event) => event.target === event.currentTarget && setIsNavigationOpen(false)}
          >
            <section
              className="modal-content hero-navigation-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="navigationModalTitle"
            >
              <h2 id="navigationModalTitle">Where to?</h2>
              <nav className="hero-navigation-options" aria-label="Choose a page">
                {navigationGraph.getNodes().map((route) => (
                  <button
                    key={route}
                    className="hero-navigation-option"
                    type="button"
                    onClick={() => handleNavigate(route)}
                  >
                    {pageLabels[route]}
                  </button>
                ))}
              </nav>
            </section>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={activePage === "/catalog" ? "catalog-hero" : "subpage-top"}
      style={
        activePage === "/catalog"
          ? {
              "--catalog-hero-image":
                `url("${categoryBackgrounds[selectedCategory] || categoryBackgrounds.Beef}")`,
            }
          : undefined
      }
    >
      {activePage === "/catalog" && (
        <div
          key={selectedCategory || "Beef"}
          className="catalog-hero-background"
          aria-hidden="true"
        />
      )}
      <header className="subpage-navigation">
        <button className="subpage-home-button" type="button" onClick={onHome}>
          WHAT2EAT
        </button>
        <nav className="subpage-route-links" aria-label="Main navigation">
          {navigationGraph.getNodes().map((route) => (
            <button
              key={route}
              className={`sort-btn hero-navigation-option${activePage === route ? " is-active" : ""}`}
              type="button"
              aria-current={activePage === route ? "page" : undefined}
              aria-pressed={activePage === route}
              onClick={() => handleNavigate(route)}
            >
              {pageLabels[route]}
            </button>
          ))}
        </nav>
      </header>

      {activePage === "/catalog" && (
        <section className="category-section subpage-category-section" aria-label="หมวดหมู่อาหาร">
          <div id="categoryContainer" className="category-grid">
            {categories.map((category) => (
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
      )}
    </div>
  );
}
