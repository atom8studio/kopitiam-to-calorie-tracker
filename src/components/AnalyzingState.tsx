import React, { useEffect, useState } from "react";
import { FUNNY_ANALYZING_MESSAGES } from "../data/samples";
import { Flame, Sparkles } from "lucide-react";

interface AnalyzingStateProps {
  imagePreviewUrl: string;
}

export const AnalyzingState: React.FC<AnalyzingStateProps> = ({ imagePreviewUrl }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % FUNNY_ANALYZING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center">
        {/* Preview image thumbnail with pulse ring */}
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-orange-500/20 relative z-10">
            <img
              src={imagePreviewUrl}
              alt="Uploaded meal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] flex items-center justify-center">
              <Flame className="w-10 h-10 text-orange-400 animate-bounce" />
            </div>
          </div>
          {/* Outer pulsing rings */}
          <div className="absolute -inset-3 rounded-3xl bg-orange-200/50 animate-ping opacity-75"></div>
          <div className="absolute -inset-6 rounded-3xl bg-orange-100/40 animate-pulse"></div>
        </div>

        {/* Spinner */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">
            Kopitiam AI Scanner
          </span>
        </div>

        {/* Dynamic Funny Loading Message */}
        <div className="min-h-[60px] flex items-center justify-center">
          <p className="text-lg sm:text-xl font-black text-slate-800 transition-all duration-300 animate-pulse">
            "{FUNNY_ANALYZING_MESSAGES[msgIndex]}"
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 rounded-full text-orange-800 text-xs font-semibold border border-orange-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Gemini Vision is analyzing portion & macros...</span>
        </div>
      </div>
    </div>
  );
};
