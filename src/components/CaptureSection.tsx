import React, { useRef, useState } from "react";
import { Camera, Upload, Sparkles, Key, Utensils, Flame } from "lucide-react";
import { SAMPLE_MEAL_PRESETS, SampleMealPreset } from "../data/samples";
import { compressImageBase64 } from "../utils/imageUtils";

interface CaptureSectionProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  onSamplePresetSelected: (preset: SampleMealPreset) => void;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
}

export const CaptureSection: React.FC<CaptureSectionProps> = ({
  onImageSelected,
  onSamplePresetSelected,
  onOpenApiKeyModal,
  hasCustomKey,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const rawResult = reader.result as string;
      // Compress the image to max 800x800 to avoid huge payload and localStorage quota errors
      const compressed = await compressImageBase64(rawResult, 800, 800, 0.7);
      onImageSelected(compressed, "image/jpeg");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* App Header & Hero Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs sm:text-sm font-bold border border-orange-200/80 shadow-2xs mb-4">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Malaysian AI Vision Calorie Estimator 🇲🇾</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
          Kopitiam-to-Calorie Tracker
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Snap your <span className="font-bold text-orange-600">Nasi Lemak</span>,{" "}
          <span className="font-bold text-amber-600">Roti Canai</span>, or{" "}
          <span className="font-bold text-slate-800">Teh Tarik</span>. Gemini AI calculates calories and tells you how to burn it off Malaysian style!
        </p>

        {/* Optional Custom API Key Pill */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={onOpenApiKeyModal}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-2xs transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-orange-500" />
            <span>{hasCustomKey ? "Custom API Key Active" : "Settings / API Key"}</span>
          </button>
        </div>
      </div>

      {/* Main Snap Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-200 p-8 sm:p-12 text-center bg-white shadow-xl shadow-slate-200/50 ${
          isDragging
            ? "border-orange-500 bg-orange-50/40 scale-[1.01]"
            : "border-slate-100 hover:border-orange-300"
        }`}
      >
        <div className="max-w-md mx-auto space-y-6 flex flex-col items-center">
          {/* Dashed Camera Icon Badge */}
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center border-2 border-dashed border-orange-300 text-orange-500 shadow-2xs">
            <Camera className="w-9 h-9 text-orange-500" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Snap Your Meal</h2>
            <p className="text-slate-500 text-sm mt-1">Point your camera at that delicious plate of Nasi Lemak or Roti Canai!</p>
          </div>

          {/* Main Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Camera Snap Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg shadow-slate-900/10 transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>

            {/* Gallery Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl transition-colors cursor-pointer active:scale-[0.98]"
            >
              <Upload className="w-5 h-5 text-slate-500" />
              <span>Upload File</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Supports camera capture or drop any Malaysian food image (JPG, PNG, WebP)
          </p>

          {/* Hidden File Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="camera-input"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="gallery-input"
          />
        </div>
      </div>

      {/* Quick Sample Presets */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Or Try A Popular Malaysian Dish
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Instant test</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SAMPLE_MEAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSamplePresetSelected(preset)}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all text-left cursor-pointer active:scale-[0.98]"
            >
              <div className="h-28 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                  <span>~{preset.suggestedCalories} kcal</span>
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-orange-600 transition line-clamp-1">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                    {preset.subtitle}
                  </p>
                </div>
                <div className="mt-2 text-[11px] font-bold text-orange-500 flex items-center gap-1">
                  <span>Analyze now &rarr;</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
