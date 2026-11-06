import { Fragment } from "react";
import Queue from "../utils/Queue.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerPage({
  meals,
  weeklyPlan,
  onRemove,
  onGenerate,
  onClear,
}) {
  const queue = new Queue(meals);

  return (
    <>
      <section className="dashboard-section queue-section" aria-labelledby="queueHeading">
        <h2 id="queueHeading">Weekly Meals</h2>
        <div id="queueContainer">
          {queue.toArray().map((meal, index) => (
            <div className="mini-card" key={`${meal.id}-${index}`}>
              <div className="mini-card-image">
                <img src={meal.image} alt={meal.name} />
                <button
                  className="mini-card-remove"
                  type="button"
                  aria-label="ลบรายการจาก Weekly Meal"
                  title="ลบรายการจาก Weekly Meal"
                  onClick={() => onRemove(index)}
                >
                  &times;
                </button>
              </div>
              <p>{meal.name}</p>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 5 - queue.size) }, (_, index) => (
            <div className="meal-card-slot" aria-hidden="true" key={`empty-queue-${index}`} />
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
            const dayMeals = weeklyPlan[day];
            return (
              <div className="day-card" key={day}>
                <div className={`mini-card planner-card${dayMeals.length ? " is-filled" : ""}`}>
                  <h3>{day}</h3>
                  <div id={day} className="planner-day-content">
                    {dayMeals.map((meal, index) => (
                      <Fragment key={`${meal.id}-${index}`}>
                        <div className="mini-card-image">
                          <img src={meal.image} alt={meal.name} />
                        </div>
                        <p>{meal.name}</p>
                      </Fragment>
                    ))}
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
