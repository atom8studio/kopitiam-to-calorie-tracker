import React, { useState } from "react";
import { MealAnalysis } from "../types";
import { X, Check, Edit3, Flame } from "lucide-react";

interface EditMacrosModalProps {
  meal: MealAnalysis;
  onSave: (updatedMeal: MealAnalysis) => void;
  onClose: () => void;
}

export const EditMacrosModal: React.FC<EditMacrosModalProps> = ({
  meal,
  onSave,
  onClose,
}) => {
  const [foodName, setFoodName] = useState(meal.foodName);
  const [calories, setCalories] = useState(meal.calories);
  const [protein, setProtein] = useState(meal.protein);
  const [carbs, setCarbs] = useState(meal.carbs);
  const [fat, setFat] = useState(meal.fat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...meal,
      foodName: foodName.trim() || meal.foodName,
      calories: Math.max(0, Number(calories) || 0),
      protein: Math.max(0, Number(protein) || 0),
      carbs: Math.max(0, Number(carbs) || 0),
      fat: Math.max(0, Number(fat) || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Edit Meal & Portion
              </h3>
              <p className="text-xs text-slate-500">
                Override calorie or macro values manually
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Food Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Dish Name
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900 text-sm"
              placeholder="e.g. Nasi Lemak Special"
              required
            />
          </div>

          {/* Calories */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Total Combined Calories (kcal)
            </label>
            <div className="relative">
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-extrabold text-slate-900 text-lg bg-amber-50/30"
                min="0"
                max="5000"
                required
              />
              <Flame className="w-5 h-5 text-amber-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Macros 3-Grid */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 text-sm text-center"
                min="0"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 text-sm text-center"
                min="0"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800 text-sm text-center"
                min="0"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
