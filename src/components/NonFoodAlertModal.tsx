import React from "react";
import { AlertTriangle, Camera, X } from "lucide-react";

interface NonFoodAlertModalProps {
  onDismiss: () => void;
  onSnapAgain: () => void;
}

export const NonFoodAlertModal: React.FC<NonFoodAlertModalProps> = ({
  onDismiss,
  onSnapAgain,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-red-100 text-center relative space-y-5 transform scale-100 transition-all">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-amber-600 shadow-inner">
          <AlertTriangle className="w-10 h-10 animate-bounce" />
        </div>

        {/* Title & Malaysian Slang Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Alamak, that's not food! 🐈👟
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Please snap your Kopitiam plate or hawker meal again. We need a real food picture to estimate your calories!
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSnapAgain}
            className="w-full flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-[0.98] cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Plate Again</span>
          </button>

          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
