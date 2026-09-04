import React, { useState } from "react";
import { MealAnalysis, LocalizedWorkout } from "../types";
import { getRandomMalaysianWorkout } from "../utils/storage";
import {
  Flame,
  Edit3,
  RotateCcw,
  Check,
  Dumbbell,
  MessageSquare,
  Sparkles,
  Share2,
  Calendar,
  Utensils
} from "lucide-react";

interface ResultsSectionProps {
  meal: MealAnalysis;
  onEditRequested: () => void;
  onSaveToDailyLog: () => void;
  onSnapAnother: () => void;
  isSavedToday: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  meal,
  onEditRequested,
  onSaveToDailyLog,
  onSnapAnother,
  isSavedToday,
}) => {
  // Localized workout state with shuffle capability
  const [workoutData, setWorkoutData] = useState<{ workout: LocalizedWorkout; durationMinutes: number }>(() =>
    getRandomMalaysianWorkout(meal.calories)
  );
  const [currentRecommendation, setCurrentRecommendation] = useState<string>(
    meal.workoutRecommendation || workoutData.workout.title
  );

  const handleShuffleWorkout = () => {
    const nextWorkout = getRandomMalaysianWorkout(meal.calories);
    setWorkoutData(nextWorkout);
    setCurrentRecommendation(nextWorkout.workout.title);
  };

  const handleShareResult = async () => {
    const text = `I just ate ${meal.foodName} (${meal.calories} kcal)! ${meal.funnyComment} To burn it off: ${currentRecommendation}! Tracked with KopitiamTrack 🇲🇾`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kopitiam Calorie Result",
          text,
        });
      } catch (err) {
        navigator.clipboard.writeText(text);
        alert("Copied summary to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied summary to clipboard!");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Sleek Result Card */}
      <div className="relative bg-white rounded-[32px] shadow-2xl shadow-slate-300/40 border border-slate-100 p-6 sm:p-8 flex flex-col space-y-6 overflow-hidden">
        {/* Top Right "MEAL DETECTED!" Pill Badge */}
        <div className="absolute top-0 right-6 sm:right-10 bg-orange-500 text-white px-5 py-1.5 rounded-b-2xl font-black text-xs shadow-md tracking-wider uppercase">
          MEAL DETECTED! ✨
        </div>

        {/* Top Row: Image & Analysis */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 pt-2">
          {/* Food Image Preview */}
          <div className="w-full md:w-1/3 aspect-4/3 md:aspect-square rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-md relative group shrink-0">
            <img
              src={meal.imageUrl}
              alt={meal.foodName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Full Plate Combined</span>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
                  {meal.foodName || "Malaysian Dish"}
                </h1>
                <button
                  onClick={handleShareResult}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  title="Share result"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-base sm:text-lg italic text-orange-600 font-semibold mt-2 leading-relaxed">
                "{meal.funnyComment || "Wah, extra sambal lah! Steady Boss, don't worry we calculate for you."}"
              </p>
            </div>

            {/* Total Calories Display */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">
                  Total Energy
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-5xl sm:text-6xl font-black tracking-tighter text-slate-900">
                    {meal.calories}
                  </span>
                  <span className="text-lg font-bold text-slate-400 uppercase">
                    kcal
                  </span>
                </div>
              </div>

              <button
                onClick={onEditRequested}
                className="text-xs font-extrabold py-2 px-3.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Numbers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Macros Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
              Protein
            </p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {meal.protein}g
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
              Carbs
            </p>
            <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
              {meal.carbs}g
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">
              Fats
            </p>
            <p className="text-2xl sm:text-3xl font-black text-red-600 mt-1">
              {meal.fat}g
            </p>
          </div>
        </div>

        {/* Burn It Off Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 rounded-3xl p-6 border border-emerald-100 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏃‍♂️</span>
              <h3 className="text-xl font-extrabold text-emerald-950 uppercase italic tracking-tighter">
                Time to Burn It Off!
              </h3>
            </div>

            <button
              onClick={handleShuffleWorkout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-extrabold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle Exercise</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl shrink-0 p-2 bg-white rounded-2xl shadow-2xs border border-emerald-200/60">
                {workoutData.workout.emoji}
              </span>
              <div>
                <p className="text-emerald-800 text-base sm:text-lg leading-snug">
                  To burn off these calories, try{" "}
                  <span className="font-black text-emerald-950 text-lg sm:text-xl underline decoration-emerald-400 underline-offset-4">
                    {currentRecommendation}
                  </span>
                </p>
                <p className="text-emerald-700/80 text-xs sm:text-sm mt-1">
                  {workoutData.workout.description} • 📍 {workoutData.workout.location}
                </p>
              </div>
            </div>

            <div className="shrink-0 bg-emerald-800 text-white px-4 py-2.5 rounded-2xl text-center shadow-md w-full sm:w-auto">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-200 block">
                Duration
              </span>
              <span className="text-xl sm:text-2xl font-black leading-tight block">
                ~{workoutData.durationMinutes} mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onSaveToDailyLog}
          disabled={isSavedToday}
          className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-base shadow-lg transition cursor-pointer active:scale-[0.98] ${
            isSavedToday
              ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
              : "bg-slate-900 hover:bg-orange-600 text-white shadow-slate-900/10"
          }`}
        >
          {isSavedToday ? (
            <>
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Saved to Today's Log!</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              <span>Save to Today's Daily Log 💾</span>
            </>
          )}
        </button>

        <button
          onClick={onSnapAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-300 shadow-2xs transition cursor-pointer active:scale-[0.98]"
        >
          <RotateCcw className="w-5 h-5 text-slate-500" />
          <span>Snap Another Meal</span>
        </button>
      </div>
    </div>
  );
};
