import React, { useState } from "react";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import {
  Brain,
  Sparkles,
  Coffee,
  CheckCircle2,
  Clock,
  ChevronUp,
  ChevronDown,
  Activity,
  Heart,
  Smile,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

export const LiveGameIndicator = ({
  gameTitle = "Cognitive Game",
  currentStep = 1,
  totalSteps = 10,
  difficulty = "Medium",
  onTakeBreak
}) => {
  const { activeSession } = useRealtimeTracking();
  const [isExpanded, setIsExpanded] = useState(false);
  const [breakDismissed, setBreakDismissed] = useState(false);

  // Compute values from activeSession or fallbacks
  const accuracy = activeSession?.currentAccuracy ?? 100;
  const avgResponse = activeSession?.avgResponseTime ? `${activeSession.avgResponseTime}s` : "3.8s";
  const correct = activeSession?.correctCount ?? 0;
  const incorrect = activeSession?.incorrectCount ?? 0;
  const step = activeSession?.currentStep || currentStep;
  const total = activeSession?.totalSteps || totalSteps;
  const currentDiff = activeSession?.difficulty || difficulty;

  // Elderly-friendly AI status description
  let aiStatusText = "🟢 Performing Normally";
  let aiStatusBg = "bg-emerald-50 text-emerald-800 border-emerald-200";

  if (activeSession?.baselineStatus === "ABOVE_BASELINE" || accuracy >= 90) {
    aiStatusText = "✨ Excellent Focus & Rhythm";
    aiStatusBg = "bg-teal-50 text-teal-800 border-teal-200";
  } else if (activeSession?.baselineStatus === "SLIGHTLY_BELOW" || accuracy <= 70) {
    aiStatusText = "🟡 Steady Pace · In Safe Range";
    aiStatusBg = "bg-amber-50 text-amber-800 border-amber-200";
  }

  const showFatigueBanner = activeSession?.fatigueDetected && !breakDismissed;

  return (
    <div className="w-full max-w-2xl mx-auto my-2 space-y-2 select-none">
      {/* 1. Friendly Cognitive Fatigue Alert Banner (Elderly Safe) */}
      {showFatigueBanner && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-amber-950">
                You're doing wonderfully today!
              </p>
              <p className="text-xs text-amber-800 font-medium">
                Would you like to rest your eyes or take a gentle 2-minute tea break?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onTakeBreak && (
              <button
                onClick={onTakeBreak}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Rest Now</span>
              </button>
            )}
            <button
              onClick={() => setBreakDismissed(true)}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* 2. Compact Elderly-Friendly Performance Panel */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#0D7377]/20 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Left: Game & Step Indicator */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0D7377] text-white flex items-center justify-center shadow-xs">
              <Brain className="w-4 h-4 text-[#9DF3C4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-[#132A2F] uppercase tracking-wide">
                  {activeSession?.gameTitle || gameTitle}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Step {step} of {total}
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Simple Live Metrics */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Accuracy */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                Accuracy:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#0D7377]">
                {accuracy}%
              </span>
            </div>

            {/* Avg Response */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                Response:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                {avgResponse}
              </span>
            </div>

            {/* Score Counts */}
            <div className="flex items-center gap-2 text-xs font-black">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                ✓ {correct}
              </span>
              <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                ✗ {incorrect}
              </span>
            </div>

            {/* AI Status Badge */}
            <div
              className={`text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${aiStatusBg}`}
            >
              <span>{aiStatusText}</span>
            </div>

            {/* Toggle extra details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="Toggle Telemetry Details"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3. Expandable Encouraging Insights Bar */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs animate-in fade-in">
            <div className="bg-[#F4F9F8] p-2 rounded-xl border border-[#0D7377]/10">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Difficulty</span>
              <span className="font-extrabold text-[#0D7377] capitalize">{currentDiff} Tier</span>
            </div>
            <div className="bg-[#F4F9F8] p-2 rounded-xl border border-[#0D7377]/10">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Current Streak</span>
              <span className="font-extrabold text-teal-700">{activeSession?.currentStreak || 0} In a Row 🔥</span>
            </div>
            <div className="bg-[#F4F9F8] p-2 rounded-xl border border-[#0D7377]/10">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Personal Baseline</span>
              <span className="font-extrabold text-slate-700">{activeSession?.baselineAccuracy || 88}%</span>
            </div>
            <div className="bg-[#F4F9F8] p-2 rounded-xl border border-[#0D7377]/10">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Supportive Hints</span>
              <span className="font-extrabold text-slate-700">{activeSession?.hintsCount || 0} Used</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
