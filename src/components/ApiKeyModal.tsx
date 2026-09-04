import React, { useState } from "react";
import { Key, X, Check, Info } from "lucide-react";

interface ApiKeyModalProps {
  currentKey: string;
  onSaveKey: (key: string) => void;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  currentKey,
  onSaveKey,
  onClose,
}) => {
  const [inputKey, setInputKey] = useState(currentKey === "YOUR_GEMINI_API_KEY" ? "" : currentKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Gemini API Key Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure your API credentials
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

        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              By default, AI Studio injects the server-side <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">process.env.GEMINI_API_KEY</code>. You can also paste your custom API key here to override it.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Gemini API Key (<span className="font-mono text-emerald-700">YOUR_GEMINI_API_KEY</span>)
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Key</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInputKey("");
                onSaveKey("");
                onClose();
              }}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              Reset to Server Default
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
