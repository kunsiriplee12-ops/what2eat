import { useEffect, useState } from "react";
import StateFeedback from "./StateFeedback.jsx";

function getInstructionSteps(instructions) {
  const text = String(instructions ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();

  let steps;
  if (/\b(?:step|ขั้นตอน)\s*\d+\b/i.test(text)) {
    steps = text.split(/(?=\b(?:step|ขั้นตอน)\s*\d+\b)/gi);
  } else if (/(?:^|\s)\d+[).:-]\s/.test(text)) {
    steps = text.split(/(?=(?:^|\s)\d+[).:-]\s)/g);
  } else {
    steps = text
      .split(/\r?\n+/)
      .flatMap((line) => line.split(/(?<=[.!?])\s+/));
  }

  return steps
    .map((step) =>
      step
        .replace(
          /^(?:(?:step|ขั้นตอน)\s*\d+\s*[:.)-]?|\d+[).:-])\s*/i,
          "",
        )
        .trim(),
    )
    .filter(Boolean);
}

export default function MealModal({ mealId, onClose }) {
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState("success");

  useEffect(() => {
    if (!mealId) return undefined;
    const controller = new AbortController();
    setMeal(null);
    setStatus("loading");

    fetch(`/api/detail/${encodeURIComponent(mealId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load meal details");
        return response.json();
      })
      .then((data) => {
        const foundMeal = data.meals?.[0] || null;
        setMeal(foundMeal);
        setStatus(foundMeal ? "success" : "empty");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [mealId]);

  useEffect(() => {
    if (!mealId) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mealId, onClose]);

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [meal, status]);

  if (!mealId) return null;

  return (
    <div id="mealModal" className="modal" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-content">
        <button
          className="close-btn"
          type="button"
          aria-label="Close meal details"
          title="Close"
          onClick={onClose}
        >
          X
        </button>
        <div id="mealDetail">
          {status === "loading" && (
            <StateFeedback status="loading" message="กำลังโหลดรายละเอียดอาหาร..." />
          )}
          {status === "empty" && (
            <StateFeedback status="empty" message="ไม่พบรายละเอียดอาหาร" />
          )}
          {status === "error" && (
            <StateFeedback status="error" message="โหลดรายละเอียดอาหารไม่สำเร็จ" />
          )}
          {meal && (
            <>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="meal-detail-content">
                <h2>{meal.strMeal}</h2>
                <div className="meal-meta">
                  <p><b>Category</b><span>{meal.strCategory}</span></p>
                  <p><b>Area</b><span>{meal.strArea}</span></p>
                </div>
                <section className="instruction-section" aria-labelledby="instructionTitle">
                  <h3 id="instructionTitle">Instructions</h3>
                  <ol className="instruction-list">
                    {getInstructionSteps(meal.strInstructions).map((step, index) => (
                      <li key={`${index}-${step}`}>{step}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
