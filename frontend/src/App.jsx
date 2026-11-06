import { useCallback, useEffect, useMemo, useState } from "react";
import MealModal from "./components/MealModal.jsx";
import Navbar from "./components/Navbar.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import PlannerPage from "./pages/PlannerPage.jsx";
import { navigationGraph } from "./utils/Graph.js";
import Queue from "./utils/Queue.js";

const allowedCategories = ["Beef", "Pasta", "Chicken", "Seafood", "Dessert"];
const categoryThai = {
  Beef: "เนื้อวัว",
  Chicken: "เนื้อไก่",
  Seafood: "อาหารทะเล",
  Dessert: "ของหวาน",
  Pasta: "พาสต้า",
};
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const initialWeeklyPlan = () => Object.fromEntries(weekDays.map((day) => [day, []]));
const getRoute = () => window.location.pathname;

function normalizeRoute(pathname) {
  return pathname === "/" || navigationGraph.hasNode(pathname) ? pathname : "/";
}

export default function App() {
  const [activePage, setActivePage] = useState(() => normalizeRoute(getRoute()));
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [meals, setMeals] = useState([]);
  const [catalogStatus, setCatalogStatus] = useState("loading");
  const [favorites, setFavorites] = useState([]);
  const [queuedMeals, setQueuedMeals] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState(initialWeeklyPlan);
  const [sortDirection, setSortDirection] = useState(null);
  const [sortActive, setSortActive] = useState(false);
  const [mealModalId, setMealModalId] = useState(null);
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  useEffect(() => {
    const route = normalizeRoute(getRoute());
    if (route !== getRoute()) {
      window.history.replaceState({}, "", route);
      setActivePage(route);
    }

    const handlePopState = () => {
      const nextRoute = normalizeRoute(getRoute());
      if (nextRoute !== getRoute()) window.history.replaceState({}, "", nextRoute);
      setActivePage(nextRoute);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (activePage !== "/") return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [activePage]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/categories", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load categories");
        return response.json();
      })
      .then((data) => {
        const nextCategories = (data.categories || []).filter((category) =>
          allowedCategories.includes(category.strCategory),
        );
        setCategories(nextCategories);
        if (nextCategories.length === 0) {
          setCatalogStatus("empty");
          return;
        }
        setSelectedCategory(nextCategories[0].strCategory);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setCatalogStatus("error");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return undefined;
    const controller = new AbortController();
    setCatalogStatus("loading");
    fetch(`/api/meals/${encodeURIComponent(selectedCategory)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load meals");
        return response.json();
      })
      .then((data) => {
        const nextMeals = data.meals || [];
        setMeals(nextMeals);
        setCatalogStatus(nextMeals.length ? "success" : "empty");
        setSortDirection(null);
        setSortActive(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setCatalogStatus("error");
      });
    return () => controller.abort();
  }, [selectedCategory]);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [backToTopVisible]);

  useEffect(() => {
    const catalog = document.querySelector(".meal-catalog");
    if (!catalog) {
      setBackToTopVisible(false);
      return undefined;
    }
    const updateVisibility = () => {
      const catalogTop = catalog.getBoundingClientRect().top + window.scrollY;
      setBackToTopVisible(window.scrollY >= catalogTop - window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    updateVisibility();
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [activePage, catalogStatus]);

  const favoriteIds = useMemo(() => new Set(favorites.map((meal) => meal.id)), [favorites]);
  const plannedIds = useMemo(
    () => new Set(Object.values(weeklyPlan).flat().map((meal) => meal.id)),
    [weeklyPlan],
  );

  const selectCategory = useCallback((category) => {
    setSelectedCategory(category);
    document.getElementById("catalogHeading")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navigateTo = useCallback((route) => {
    if (!navigationGraph.hasNode(route)) return;
    if (activePage !== "/" && route !== activePage && !navigationGraph.hasEdge(activePage, route)) return;

    if (route !== activePage) {
      window.history.pushState({}, "", route);
      setActivePage(route);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  const navigateHome = useCallback(() => {
    if (activePage !== "/") {
      window.history.pushState({}, "", "/");
      setActivePage("/");
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activePage]);

  const toggleFavorite = (meal) => {
    const id = String(meal.idMeal);
    if (favoriteIds.has(id)) {
      return;
    }
    setFavorites((current) => [
      ...current,
      { id, name: meal.strMeal, image: meal.strMealThumb },
    ]);
  };

  const toggleQueue = (meal) => {
    const id = String(meal.idMeal);
    setQueuedMeals((current) => [
      ...current,
      { id, name: meal.strMeal, image: meal.strMealThumb },
    ]);
  };

  const generateWeeklyPlan = () => {
    const queue = new Queue(queuedMeals);
    const nextPlan = { ...weeklyPlan };
    for (const day of weekDays) {
      if (queue.isEmpty()) break;
      if (nextPlan[day].length === 0) {
        nextPlan[day] = [...nextPlan[day], queue.dequeue()];
      }
    }
    setWeeklyPlan(nextPlan);
    setQueuedMeals(queue.toArray());
  };

  const clearPlanner = () => setWeeklyPlan(initialWeeklyPlan());

  const sortMeals = () => {
    setSortDirection((current) => (current === "desc" ? "asc" : "desc"));
    setSortActive(true);
  };

  const openMealDetail = (mealId) => setMealModalId(String(mealId));
  const closeMealDetail = useCallback(() => setMealModalId(null), []);

  return (
    <>
      <Navbar
        isLanding={activePage === "/"}
        activePage={activePage}
        onNavigate={navigateTo}
        onHome={navigateHome}
        categories={categories}
        selectedCategory={selectedCategory}
        categoryThai={categoryThai}
        onSelectCategory={selectCategory}
      />
      {activePage !== "/" && (
        <>
          <main className="dashboard-layout">
            {activePage === "/catalog" && (
              <CatalogPage
                meals={meals}
                status={catalogStatus}
                selectedCategory={categoryThai[selectedCategory] || selectedCategory}
                favorites={favorites}
                queuedMeals={queuedMeals}
                plannedIds={plannedIds}
                sortDirection={sortDirection}
                sortActive={sortActive}
                onSort={sortMeals}
                onViewDetail={openMealDetail}
                onToggleFavorite={toggleFavorite}
                onToggleQueue={toggleQueue}
              />
            )}
            {activePage === "/favorites" && (
              <FavoritesPage
                meals={favorites}
                onRemove={(id) => setFavorites((current) => current.filter((meal) => meal.id !== id))}
              />
            )}
            {activePage === "/planner" && (
              <PlannerPage
                meals={queuedMeals}
                weeklyPlan={weeklyPlan}
                onRemove={(index) => setQueuedMeals((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                onGenerate={generateWeeklyPlan}
                onClear={clearPlanner}
              />
            )}
          </main>
          <button
            id="backToTop"
            className={`back-to-top${backToTopVisible ? " is-visible" : ""}`}
            type="button"
            aria-label="Back to top"
            title="Back to top"
            aria-hidden={!backToTopVisible}
            tabIndex={backToTopVisible ? 0 : -1}
            onClick={() => {
              const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth";
              window.scrollTo({ top: 0, behavior });
            }}
          >
            <i data-lucide="arrow-up" aria-hidden="true"></i>
          </button>
          {activePage === "/catalog" && (
            <MealModal mealId={mealModalId} onClose={closeMealDetail} />
          )}
        </>
      )}
    </>
  );
}
