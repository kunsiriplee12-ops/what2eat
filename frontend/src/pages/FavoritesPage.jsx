import { useEffect, useRef, useState } from "react";

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
  const [isDragging, setIsDragging] = useState(false);
  const pointerStart = useRef(null);
  const dragged = useRef(false);
  const wheelDistance = useRef(0);
  const wheelFrame = useRef(null);
  const wheelCooldownUntil = useRef(0);
  const dragFrame = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [meals, activeIndex]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(meals.length - 1, 0)));
  }, [meals.length]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(wheelFrame.current);
      window.cancelAnimationFrame(dragFrame.current);
    },
    [],
  );

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

  const handlePointerDown = (event) => {
    if (event.target.closest("button")) return;
    pointerStart.current = { id: event.pointerId, x: event.clientX, distance: 0 };
    dragged.current = false;
    if (stageRef.current) stageRef.current.style.transition = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (pointerStart.current?.id !== event.pointerId) return;
    const distance = event.clientX - pointerStart.current.x;
    pointerStart.current.distance = distance;
    if (Math.abs(distance) > 8) {
      if (!dragged.current) {
        dragged.current = true;
        setIsDragging(true);
      }
      event.preventDefault();
      if (dragFrame.current === null) {
        dragFrame.current = window.requestAnimationFrame(() => {
          if (stageRef.current && pointerStart.current) {
            stageRef.current.style.transform = `translate3d(${pointerStart.current.distance * 0.65}px, 0, 0)`;
          }
          dragFrame.current = null;
        });
      }
    }
  };

  const handlePointerEnd = (event) => {
    if (pointerStart.current?.id !== event.pointerId) return;
    const distance = pointerStart.current.distance;
    window.cancelAnimationFrame(dragFrame.current);
    dragFrame.current = null;
    if (stageRef.current) {
      stageRef.current.style.removeProperty("transform");
      stageRef.current.style.removeProperty("transition");
    }
    if (Math.abs(distance) > 64 && meals.length > 1) {
      moveActive(distance < 0 ? 1 : -1);
    }
    pointerStart.current = null;
    setIsDragging(false);
  };

  const scheduleWheelFrame = () => {
    if (wheelFrame.current !== null) return;
    wheelFrame.current = window.requestAnimationFrame(() => {
      if (Date.now() < wheelCooldownUntil.current) {
        wheelDistance.current = 0;
      } else if (Math.abs(wheelDistance.current) >= 90) {
        const direction = wheelDistance.current > 0 ? 1 : -1;
        wheelDistance.current = 0;
        moveActive(direction);
        wheelCooldownUntil.current = Date.now() + 450;
      }
      wheelFrame.current = null;
    });
  };

  const handleWheel = (event) => {
    if (meals.length < 2 || event.target.closest("button")) return;

    const horizontalDelta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (horizontalDelta === 0) return;

    event.preventDefault();
    if (Date.now() < wheelCooldownUntil.current) return;
    if (wheelDistance.current !== 0 && Math.sign(wheelDistance.current) !== Math.sign(horizontalDelta)) {
      wheelDistance.current = 0;
    }
    wheelDistance.current += horizontalDelta;
    scheduleWheelFrame();
  };

  return (
    <section className="dashboard-section favorites-section" aria-labelledby="favoritesHeading">
      <h2 id="favoritesHeading">Favorites</h2>
      <div className={`favorites-coverflow${meals.length ? "" : " is-empty"}${isDragging ? " is-dragging" : ""}`}>
        <div
          className="favorites-coverflow-stage"
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onWheel={handleWheel}
          onClickCapture={(event) => {
            if (!dragged.current) return;
            event.stopPropagation();
            event.preventDefault();
            dragged.current = false;
          }}
        >
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
      </div>
    </section>
  );
}
