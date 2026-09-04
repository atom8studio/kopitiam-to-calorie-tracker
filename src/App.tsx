import React, { useState, useEffect } from "react";
import { MealAnalysis, DailyLog } from "./types";
import { SampleMealPreset } from "./data/samples";
import {
  getTodayLog,
  saveMealToToday,
  deleteMealFromToday,
  getTodayDateString
} from "./utils/storage";
import { compressImageBase64 } from "./utils/imageUtils";

import { CaptureSection } from "./components/CaptureSection";
import { AnalyzingState } from "./components/AnalyzingState";
import { ResultsSection } from "./components/ResultsSection";
import { NonFoodAlertModal } from "./components/NonFoodAlertModal";
import { EditMacrosModal } from "./components/EditMacrosModal";
import { DailyTrackerBar } from "./components/DailyTrackerBar";
import { ApiKeyModal } from "./components/ApiKeyModal";

// Default placeholder variable as requested in specification
export const YOUR_GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

type AppViewState = "capture" | "analyzing" | "results";

export default function App() {
  const [viewState, setViewState] = useState<AppViewState>("capture");
  const [currentMeal, setCurrentMeal] = useState<MealAnalysis | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [todayLog, setTodayLog] = useState<DailyLog>(() => getTodayLog());

  // Modals
  const [isNonFoodModalOpen, setIsNonFoodModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Custom API key override from localStorage
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem("kopitiam_custom_gemini_key") || YOUR_GEMINI_API_KEY;
  });

  // Track if current meal is saved in today's log
  const [isMealSavedToday, setIsMealSavedToday] = useState(false);

  useEffect(() => {
    // Refresh today log on mount
    setTodayLog(getTodayLog());
  }, []);

  const handleSaveCustomKey = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem("kopitiam_custom_gemini_key", key);
    } else {
      localStorage.removeItem("kopitiam_custom_gemini_key");
    }
  };

  // Process and analyze meal image via Gemini API (/api/analyze)
  const analyzeMealImage = async (imageBase64: string, mimeType: string) => {
    setImagePreviewUrl(imageBase64);
    setViewState("analyzing");
    setIsMealSavedToday(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          apiKeyOverride: customApiKey !== YOUR_GEMINI_API_KEY ? customApiKey : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "API_KEY_MISSING") {
          setIsApiKeyModalOpen(true);
          setViewState("capture");
          return;
        }
        throw new Error(data.message || "Failed to analyze image");
      }

      // Check guardrail for non-food images
      if (!data.isFood) {
        setViewState("capture");
        setIsNonFoodModalOpen(true);
        return;
      }

      // Valid food result
      const newMeal: MealAnalysis = {
        id: "meal_" + Date.now(),
        timestamp: new Date().toISOString(),
        date: getTodayDateString(),
        isFood: true,
        foodName: data.foodName || "Malaysian Dish",
        calories: Number(data.calories) || 550,
        protein: Number(data.protein) || 20,
        carbs: Number(data.carbs) || 65,
        fat: Number(data.fat) || 22,
        funnyComment: data.funnyComment || "Wah, looks super tasty boss! Don't forget to walk it off!",
        workoutRecommendation: data.workoutRecommendation || "Climb Batu Caves stairs 4 times",
        imageUrl: imageBase64,
      };

      setCurrentMeal(newMeal);
      setViewState("results");
    } catch (error: any) {
      console.error("Error analyzing meal:", error);
      alert(error.message || "Alamak! Failed to analyze the meal. Please try again.");
      setViewState("capture");
    }
  };

  // Sample preset handler
  const handleSamplePresetSelected = async (preset: SampleMealPreset) => {
    // Convert sample preset image URL or analyze it
    setImagePreviewUrl(preset.imageUrl);
    setViewState("analyzing");
    setIsMealSavedToday(false);

    // Fetch preset image to base64 or pass preset directly
    try {
      const res = await fetch(preset.imageUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        analyzeMealImage(base64data, blob.type || "image/jpeg");
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      // Fallback fallback preset analysis if fetch CORS fails
      const fallbackMeal: MealAnalysis = {
        id: "preset_" + Date.now(),
        timestamp: new Date().toISOString(),
        date: getTodayDateString(),
        isFood: true,
        foodName: preset.name,
        calories: preset.suggestedCalories,
        protein: Math.round(preset.suggestedCalories * 0.12 / 4),
        carbs: Math.round(preset.suggestedCalories * 0.55 / 4),
        fat: Math.round(preset.suggestedCalories * 0.33 / 9),
        funnyComment: "Wah, extra delicious choice lah! Perfect Kopitiam comfort food!",
        workoutRecommendation: "Jog 3 loops around KLCC Park",
        imageUrl: preset.imageUrl,
      };
      setCurrentMeal(fallbackMeal);
      setViewState("results");
    }
  };

  const handleSaveToDailyLog = async () => {
    if (!currentMeal) return;
    let mealToSave = currentMeal;
    if (currentMeal.imageUrl && currentMeal.imageUrl.startsWith("data:image")) {
      const compressedUrl = await compressImageBase64(currentMeal.imageUrl, 400, 400, 0.6);
      mealToSave = { ...currentMeal, imageUrl: compressedUrl };
    }
    const updated = saveMealToToday(mealToSave);
    setTodayLog(updated);
    setIsMealSavedToday(true);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updated = deleteMealFromToday(mealId);
    setTodayLog(updated);
    if (currentMeal?.id === mealId) {
      setIsMealSavedToday(false);
    }
  };

  const handleUpdateMealMacros = (updatedMeal: MealAnalysis) => {
    setCurrentMeal(updatedMeal);
    setIsEditModalOpen(false);

    // If already saved in today's log, update it there too
    if (isMealSavedToday) {
      const updated = saveMealToToday(updatedMeal);
      setTodayLog(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 flex flex-col justify-between selection:bg-emerald-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewState("capture")}>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-orange-500/20">
              K
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">
                Kopitiam<span className="text-orange-500 underline decoration-2 underline-offset-4">Track</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                Calorie & Burn-Off AI 🇲🇾
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-orange-50 rounded-full text-orange-700 border border-orange-100 shadow-2xs">
              <span>Hello, Boss! Apa khabar today? 👋</span>
            </div>

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <span>⚙️ API Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content View Switcher (3 States) */}
      <main className="flex-1 flex flex-col justify-center py-4">
        {viewState === "capture" && (
          <CaptureSection
            onImageSelected={analyzeMealImage}
            onSamplePresetSelected={handleSamplePresetSelected}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            hasCustomKey={customApiKey !== YOUR_GEMINI_API_KEY && customApiKey.length > 0}
          />
        )}

        {viewState === "analyzing" && (
          <AnalyzingState imagePreviewUrl={imagePreviewUrl} />
        )}

        {viewState === "results" && currentMeal && (
          <ResultsSection
            meal={currentMeal}
            onEditRequested={() => setIsEditModalOpen(true)}
            onSaveToDailyLog={handleSaveToDailyLog}
            onSnapAnother={() => setViewState("capture")}
            isSavedToday={isMealSavedToday}
          />
        )}
      </main>

      {/* Persistent Bottom Today's Total Tracker Bar */}
      <DailyTrackerBar
        todayLog={todayLog}
        onDeleteMeal={handleDeleteMeal}
        onSelectMeal={(meal) => {
          setCurrentMeal(meal);
          setIsMealSavedToday(true);
          setViewState("results");
        }}
        onSnapNewMeal={() => setViewState("capture")}
      />

      {/* Modals & Guardrails */}
      {isNonFoodModalOpen && (
        <NonFoodAlertModal
          onDismiss={() => setIsNonFoodModalOpen(false)}
          onSnapAgain={() => {
            setIsNonFoodModalOpen(false);
            setViewState("capture");
          }}
        />
      )}

      {isEditModalOpen && currentMeal && (
        <EditMacrosModal
          meal={currentMeal}
          onSave={handleUpdateMealMacros}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isApiKeyModalOpen && (
        <ApiKeyModal
          currentKey={customApiKey}
          onSaveKey={handleSaveCustomKey}
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}
    </div>
  );
}
