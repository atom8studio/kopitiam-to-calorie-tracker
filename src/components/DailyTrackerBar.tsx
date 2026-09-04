import React, { useState } from "react";
import { DailyLog, MealAnalysis } from "../types";
import { formatDisplayDate } from "../utils/storage";
import {
  ChevronUp,
  ChevronDown,
  Flame,
  Trash2,
  Calendar,
  Utensils,
  Plus
} from "lucide-react";

interface DailyTrackerBarProps {
  todayLog: DailyLog;
  onDeleteMeal: (mealId: string) => void;
  onSelectMeal: (meal: MealAnalysis) => void;
  onSnapNewMeal: () => void;
}

export const DailyTrackerBar: React.FC<DailyTrackerBarProps> = ({
  todayLog,
  onDeleteMeal,
  onSelectMeal,
  onSnapNewMeal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Suggested daily target e.g. 2,200 kcal
  const targetCalories = 2200;
  const progressPercent = Math.min(100, Math.round((todayLog.totalCalories / targetCalories) * 100));
  const remainingCalories = Math.max(0, targetCalories - todayLog.totalCalories);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white border-t border-slate-800 shadow-2xl transition-all duration-300">
      {/* Expanded Meal Log Drawer */}
      {isExpanded && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-3 border-b border-slate-800 max-h-[60vh] overflow-y-auto bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <h4 className="font-extrabold text-sm text-white">
                Today's Meals ({formatDisplayDate(todayLog.date)})
              </h4>
            </div>

            <button
              onClick={onSnapNewMeal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Meal</span>
            </button>
          </div>

          {todayLog.meals.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs italic bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 my-2">
              No Kopitiam meals logged for today yet. Snap your first dish above! 📸
            </div>
          ) : (
            <div className="space-y-2 mb-2">
              {todayLog.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-slate-700/80 transition"
                >
                  <button
                    onClick={() => onSelectMeal(meal)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    <img
                      src={meal.imageUrl}
                      alt={meal.foodName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                        {meal.foodName}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate">
                        {meal.protein}g P • {meal.carbs}g C • {meal.fat}g F
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="font-black text-xs sm:text-sm text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2.5 py-1 rounded-lg">
                      {meal.calories} kcal
                    </span>

                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/80 rounded-lg transition cursor-pointer"
                      title="Delete meal entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Sleek Footer Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Today's Total Damage */}
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
            Today's Total Damage
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {todayLog.totalCalories.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-semibold">
              / {targetCalories.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* Middle: Sleek Progress Bar & Remaining (Hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-xs mx-auto">
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="h-full bg-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex flex-col shrink-0 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Remaining
            </span>
            <span className="text-sm font-extrabold text-orange-400">
              {remainingCalories.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* Right: Expand / Collapse Drawer Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700/80 cursor-pointer shadow-xs"
        >
          <Utensils className="w-3.5 h-3.5 text-orange-400" />
          <span>{isExpanded ? "Hide Meals" : "Today's Bites"}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
