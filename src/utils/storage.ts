import { DailyLog, MealAnalysis, LocalizedWorkout } from "../types";
import { LOCALIZED_MALAYSIAN_WORKOUTS } from "../data/samples";

const STORAGE_KEY = "kopitiam_calorie_tracker_log_v1";

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function loadAllDailyLogs(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse local storage logs:", err);
    return {};
  }
}

export function saveAllDailyLogs(logs: Record<string, DailyLog>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.warn("localStorage quota exceeded. Cleaning up large image payloads...", err);
    try {
      // Fallback 1: Replace heavy base64 data URLs in historical meals with placeholder URLs
      const sanitizedLogs: Record<string, DailyLog> = {};

      for (const [date, log] of Object.entries(logs)) {
        sanitizedLogs[date] = {
          ...log,
          meals: log.meals.map((meal) => {
            // If meal image is a large base64 data URL (> 20KB)
            if (meal.imageUrl && meal.imageUrl.startsWith("data:image") && meal.imageUrl.length > 20000) {
              return {
                ...meal,
                imageUrl: "https://images.unsplash.com/photo-1590333746438-281fd6f96316?auto=format&fit=crop&q=80&w=200"
              };
            }
            return meal;
          })
        };
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedLogs));
    } catch (fallbackErr) {
      console.warn("Storage quota still exceeded. Keeping only recent logs without images...", fallbackErr);
      try {
        // Fallback 2: Keep only recent logs with stripped images
        const recentLogs: Record<string, DailyLog> = {};
        const dates = Object.keys(logs).sort().reverse().slice(0, 7);
        for (const date of dates) {
          recentLogs[date] = {
            ...logs[date],
            meals: logs[date].meals.map((m) => ({
              ...m,
              imageUrl: m.imageUrl && m.imageUrl.startsWith("data:image")
                ? "https://images.unsplash.com/photo-1590333746438-281fd6f96316?auto=format&fit=crop&q=80&w=200"
                : m.imageUrl
            }))
          };
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentLogs));
      } catch (finalErr) {
        console.error("Critical storage error:", finalErr);
      }
    }
  }
}

export function getTodayLog(): DailyLog {
  const dateStr = getTodayDateString();
  const logs = loadAllDailyLogs();
  if (logs[dateStr]) {
    return logs[dateStr];
  }
  return {
    date: dateStr,
    meals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  };
}

export function saveMealToToday(meal: MealAnalysis): DailyLog {
  const dateStr = getTodayDateString();
  const logs = loadAllDailyLogs();
  const currentToday = logs[dateStr] || {
    date: dateStr,
    meals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  };

  // Avoid duplicates if updating existing meal
  const existingIdx = currentToday.meals.findIndex((m) => m.id === meal.id);
  let updatedMeals = [...currentToday.meals];

  if (existingIdx >= 0) {
    updatedMeals[existingIdx] = meal;
  } else {
    updatedMeals.unshift(meal);
  }

  // Recalculate totals
  const totalCalories = updatedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = updatedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbs = updatedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalFat = updatedMeals.reduce((acc, m) => acc + (m.fat || 0), 0);

  const updatedLog: DailyLog = {
    date: dateStr,
    meals: updatedMeals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat
  };

  logs[dateStr] = updatedLog;
  saveAllDailyLogs(logs);
  return updatedLog;
}

export function deleteMealFromToday(mealId: string): DailyLog {
  const dateStr = getTodayDateString();
  const logs = loadAllDailyLogs();
  const currentToday = logs[dateStr];
  if (!currentToday) return getTodayLog();

  const updatedMeals = currentToday.meals.filter((m) => m.id !== mealId);
  const totalCalories = updatedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = updatedMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalCarbs = updatedMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const totalFat = updatedMeals.reduce((acc, m) => acc + (m.fat || 0), 0);

  const updatedLog: DailyLog = {
    date: dateStr,
    meals: updatedMeals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat
  };

  logs[dateStr] = updatedLog;
  saveAllDailyLogs(logs);
  return updatedLog;
}

export function getRandomMalaysianWorkout(calories: number): { workout: LocalizedWorkout; durationMinutes: number } {
  const randomIndex = Math.floor(Math.random() * LOCALIZED_MALAYSIAN_WORKOUTS.length);
  const workout = LOCALIZED_MALAYSIAN_WORKOUTS[randomIndex];
  // Calculate approx duration in minutes needed to burn `calories`
  const caloriesPerMinute = workout.caloriesPer30Min / 30;
  const rawMin = Math.round(calories / caloriesPerMinute);
  const durationMinutes = Math.max(15, Math.min(180, Math.round(rawMin / 5) * 5)); // round to nearest 5 mins
  return { workout, durationMinutes };
}
