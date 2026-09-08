import React, { useState, useEffect } from "react";
import { Mic, Sparkles, Volume2, X } from "lucide-react";
import { translations } from "../../data/translations";

export const FloatingVoiceButton = ({
  isOpen,
  onClick,
  profile,
  currentRole = "home"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const lang = profile?.language || "en";
  const t = translations[lang] || translations.en;
  const assistantLabel = t.voiceAssistant || "Voice Assistant";

  // Auto-hide the initial greeting tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Determine bottom offset based on whether mobile bottom bar is active in patient views
  const hasBottomNavOnMobile =
    currentRole === "patient" || currentRole === "desktop";
  const bottomPositionClass = hasBottomNavOnMobile
    ? "bottom-20 sm:bottom-6 right-4 sm:right-6"
    : "bottom-5 sm:bottom-6 right-4 sm:right-6";

  return (
    <div
      className={`fixed ${bottomPositionClass} z-[999] flex flex-col items-end pointer-events-none select-none transition-all duration-300`}
      id="floating-voice-assistant-container"
    >
      {/* Floating Helper Tooltip (Elder Accessibility Guide) */}
      {(showTooltip || isHovered) && !isOpen && (
        <div
          className="pointer-events-auto mb-2.5 mr-1 px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white shadow-xl border border-slate-700/60 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
          role="tooltip"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>
            {lang === "hi"
              ? "आवाज़ से मदद लें • यहाँ दबाएं"
              : lang === "bn"
              ? "ভয়েস সাহায্য • এখানে চাপুন"
              : lang === "as"
              ? "কণ্ঠ সহায়ক • ইয়াত টিপক"
              : "Voice Assistant • Tap to Speak"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5 ml-1 transition"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating Action Button */}
      <button
        id="floating-voice-assistant-btn"
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open AI Voice Assistant"
        className={`pointer-events-auto group relative flex items-center gap-2.5 sm:gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-full text-white shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
          isOpen
            ? "bg-gradient-to-r from-[#001438] via-[#001F54] to-[#1E3A8A] ring-4 ring-blue-400/40 shadow-blue-900/50 scale-105"
            : "bg-gradient-to-r from-[#001F54] via-[#003580] to-[#0072B5] hover:from-[#001438] hover:via-[#002B6D] hover:to-[#0084CE] ring-2 ring-white/30 hover:ring-4 hover:ring-[#00B8EB]/40 shadow-xl shadow-[#001F54]/35 hover:shadow-2xl hover:shadow-[#0072B5]/40 hover:-translate-y-0.5"
        }`}
      >
        {/* Ambient Pulsing Glow Ring */}
        <span
          className={`absolute -inset-1 rounded-full bg-gradient-to-r from-[#001F54] via-[#0091D5] to-[#00B8EB] opacity-30 blur-md transition-opacity duration-300 ${
            isOpen ? "opacity-60 animate-pulse" : "group-hover:opacity-60 animate-pulse"
          }`}
          aria-hidden="true"
        />

        {/* Microphone Icon Container with Dual Hemisphere Styling */}
        <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-inner">
          <Mic className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${isOpen ? "text-[#9DF3C4] animate-bounce" : "text-white"}`} />

          {/* Active Live Audio Status Beacon */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>
        </div>

        {/* Audio Equalizer Animated Waves (Subtle Voice Indicator) */}
        <div className="relative z-10 flex items-center gap-0.5 h-4 px-1 py-0.5" aria-hidden="true">
          <span
            className="w-1 bg-cyan-300 rounded-full animate-[pulse_1s_ease-in-out_infinite]"
            style={{ height: "60%" }}
          />
          <span
            className="w-1 bg-white rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.2s]"
            style={{ height: "100%" }}
          />
          <span
            className="w-1 bg-cyan-200 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s]"
            style={{ height: "40%" }}
          />
          <span
            className="w-1 bg-emerald-300 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.1s]"
            style={{ height: "80%" }}
          />
        </div>

        {/* Label & AI Badge (Visible on all screens, compact on mobile) */}
        <div className="relative z-10 flex items-center gap-2 pr-1">
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs sm:text-sm tracking-wide leading-tight text-white drop-shadow-xs whitespace-nowrap">
              {isOpen ? "Listening..." : assistantLabel}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-cyan-200/90 leading-tight hidden xs:block">
              {isOpen ? "Saathi AI Active" : "Tap to Speak"}
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px] font-bold text-white uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            AI
          </span>
        </div>
      </button>
    </div>
  );
};
