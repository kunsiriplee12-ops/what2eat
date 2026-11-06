import { useMemo } from "react";
import Graph from "../utils/Graph.js";

export default function Navbar({
  categories,
  selectedCategory,
  categoryThai,
  onSelectCategory,
}) {
  const categoryGraph = useMemo(() => {
    const graph = new Graph();
    categories.forEach((category, index) => {
      graph.addVertex(category.strCategory);
      if (index > 0) {
        graph.addEdge(
          categories[index - 1].strCategory,
          category.strCategory,
        );
        graph.addEdge(
          category.strCategory,
          categories[index - 1].strCategory,
        );
      }
    });
    return graph;
  }, [categories]);

  const orderedCategories = categoryGraph
    .getVertices()
    .map((name) => categories.find((category) => category.strCategory === name))
    .filter(Boolean);

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
          {orderedCategories.map((category) => (
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
