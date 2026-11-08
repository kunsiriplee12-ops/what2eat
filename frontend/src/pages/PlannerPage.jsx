import { useEffect } from "react";
import Queue from "../utils/Queue.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage({
  meals,
  weeklyPlan,
  onPlanMeal,
  onRemove,
  onRemovePlanned,
  onGenerate,
  onClear,
  onViewDetail,
  onNavigate,
}) {
  const queue = new Queue(meals);
  const queuedMeals = queue.toArray();

  const handleDrop = (event) => {
    event.preventDefault();
    const day = event.currentTarget.dataset.dayKey;
    const serializedMeal = event.dataTransfer.getData("application/json");
    if (!days.includes(day) || !serializedMeal) return;

    let meal;
    try {
      meal = JSON.parse(serializedMeal);
    } catch {
      return;
    }

    if (
      !meal ||
      typeof meal.id !== "string" ||
      typeof meal.name !== "string" ||
      typeof meal.image !== "string"
    ) {
      return;
    }
    onPlanMeal(day, meal);
  };

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [meals, weeklyPlan]);

  return (
    <>
      <section className="dashboard-section queue-section" aria-labelledby="queueHeading">
        <h2 id="queueHeading">Weekly Meals</h2>
        <div id="queueContainer">
          {queuedMeals.map((meal, index) => (
            <article
              className="planner-meal-card"
              key={`${meal.id}-${index}`}
              draggable="true"
              onDragStart={(event) => {
                event.dataTransfer.setData("application/json", JSON.stringify(meal));
                event.dataTransfer.setData("text/plain", JSON.stringify(meal));
                event.dataTransfer.effectAllowed = "move";
              }}
            >
              <img src={meal.image} alt={meal.name} />
              <div className="planner-meal-card-content">
                <h3>{meal.name}</h3>
                <div className="planner-meal-actions">
                  <button
                    className="planner-meal-action"
                    type="button"
                    aria-label={`ดูรายละเอียด ${meal.name}`}
                    title="ดูรายละเอียด"
                    onClick={() => onViewDetail(meal.id)}
                  >
                    <i data-lucide="eye" aria-hidden="true"></i>
                  </button>
                  <button
                    className="planner-meal-action"
                    type="button"
                    aria-label={`ลบ ${meal.name} จาก Weekly Meals`}
                    title="นำออกจาก Weekly Meals"
                    onClick={() => onRemove(index)}
                  >
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </article>
          ))}
          {Array.from({ length: Math.max(0, 3 - queuedMeals.length) }, (_, index) => (
            <button
              className="planner-meal-card planner-empty-card"
              key={`empty-slot-${index}`}
              type="button"
              aria-label="ไปยัง Meal Catalog"
              onClick={() => onNavigate("/catalog")}
            >
              <i data-lucide="plus" aria-hidden="true"></i>
            </button>
          ))}
        </div>
        <div className="queue-actions">
          <button
            className="queue-action queue-action-add"
            type="button"
            onClick={onGenerate}
            aria-label="เพิ่มเข้าตาราง"
            title="เพิ่มเข้าตาราง"
          >
            <i data-lucide="calendar-plus" aria-hidden="true"></i>
          </button>
          <button
            className="queue-action queue-action-clear"
            type="button"
            onClick={onClear}
            aria-label="ล้างตารางอาหาร"
            title="ล้างตารางอาหาร"
          >
            <i data-lucide="calendar-x" aria-hidden="true"></i>
          </button>
        </div>
      </section>

      <section className="dashboard-section planner-section" aria-labelledby="plannerHeading">
        <h2 id="plannerHeading">Weekly Meal Planner</h2>
        <div className="week-grid">
          {days.map((day) => {
            const meal = weeklyPlan[day];
            return (
              <div
                className="day-card"
                key={day}
                data-day-key={day}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={handleDrop}
              >
                <div className={`mini-card planner-card${meal ? " is-filled" : ""}`}>
                  <h3 className="planner-day-title">{day}</h3>
                  <div id={day} className="planner-day-content">
                    {meal && (
                      <article className="planner-meal-card planner-day-meal" key={meal.id}>
                        <img src={meal.image} alt={meal.name} />
                        <div className="planner-meal-card-content">
                          <h4>{meal.name}</h4>
                          <div className="planner-meal-actions">
                            <button
                              className="planner-meal-action"
                              type="button"
                              aria-label={`ดูรายละเอียด ${meal.name}`}
                              title="ดูรายละเอียด"
                              onClick={() => onViewDetail(meal.id)}
                            >
                              <i data-lucide="eye" aria-hidden="true"></i>
                            </button>
                            <button
                              className="planner-meal-action"
                              type="button"
                              aria-label={`ลบ ${meal.name} จาก ${day}`}
                              title={`นำออกจาก ${day}`}
                              onClick={() => onRemovePlanned(day)}
                            >
                              <i data-lucide="trash-2" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                      </article>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
