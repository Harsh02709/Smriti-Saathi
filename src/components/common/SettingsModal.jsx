import React from "react";
import {
  Settings,
  User,
  LogOut,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  Brain,
  Shield,
  Stethoscope,
  Globe,
  Sliders,
  X,
  Play,
  RotateCcw,
  HeartPulse
} from "lucide-react";
import { translations } from "../../data/translations";

export const SettingsModal = ({
  isOpen,
  onClose,
  currentUser,
  profile,
  onProfileUpdate,
  appMode = "expert",
  onModeChange,
  voiceGuidanceEnabled = true,
  onToggleVoiceGuidance,
  onStartBeginnersRoutine,
  onOpenAuthModal,
  onLogout
}) => {
  if (!isOpen) return null;

  const t = translations[profile?.language] || translations.en;
  const isDoctor = currentUser?.role === "doctor";

  return (
    <div className="fixed inset-0 z-[10060] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#001F54] to-[#0D7377] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Settings className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Platform Settings</h3>
              <p className="text-xs text-teal-100 font-medium">Experience Modes, Profile & Voice Guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          {/* User Profile Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#001F54] to-[#0D7377] text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-white">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : (profile?.name ? profile.name.charAt(0).toUpperCase() : "U")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-base text-[#001F54] leading-tight">
                    {currentUser?.name || profile?.name || "Patient Lakshmi Devi"}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                    {currentUser?.role || "Patient"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  ID: <span className="font-mono font-bold text-slate-700">{currentUser?.patientCode || profile?.patientCode || "PT-7241"}</span> · {profile?.age || "68"} Yrs
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onOpenAuthModal) onOpenAuthModal({ mode: "profile" });
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
            >
              Edit Profile
            </button>
          </div>

          {/* Operating Modes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#0D7377]" />
                <span>Select Platform Mode</span>
              </label>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Active: <strong className="uppercase">{appMode === "expert" ? "Expert Mode (Default)" : appMode === "beginners" ? "Beginner's Mode" : "Advanced Mode"}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Mode 1: Expert Mode (DEFAULT) */}
              <div
                onClick={() => onModeChange("expert")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                  appMode === "expert"
                    ? "bg-gradient-to-br from-teal-50 to-emerald-50 border-[#0D7377] ring-2 ring-teal-400 shadow-md"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {appMode === "expert" && (
                  <div className="absolute top-3 right-3 text-[#0D7377]">
                    <CheckCircle2 className="w-5 h-5 fill-teal-100" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">🏆</span>
                    <h5 className="font-black text-sm text-[#001F54]">Expert Mode</h5>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-teal-600 text-white text-[9px] font-black uppercase tracking-wider mb-2">
                    Default Mode ★
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    All tutorials and the voice agent trigger on demand when clicking respected buttons. Full flexible access with interactive speech assistance.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-teal-100/60 text-center">
                  <span className="text-[10px] font-extrabold text-[#0D7377]">
                    Interactive On-Click Guidance
                  </span>
                </div>
              </div>

              {/* Mode 2: Beginner's Mode */}
              <div
                onClick={() => onModeChange("beginners")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                  appMode === "beginners"
                    ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-600 ring-2 ring-emerald-300 shadow-md"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {appMode === "beginners" && (
                  <div className="absolute top-3 right-3 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">🌱</span>
                    <h5 className="font-black text-sm text-[#132A2F]">Beginner's Mode</h5>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase mb-2">
                    Guided Doctor Routine
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Runs top 6 doctor-appointed games sequentially with auto voice narration, followed by health reminders and progress sharing to your doctor.
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onModeChange("beginners");
                    onClose();
                    if (onStartBeginnersRoutine) onStartBeginnersRoutine();
                  }}
                  className="mt-3 w-full py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Start Routine</span>
                </button>
              </div>

              {/* Mode 3: Advanced Mode */}
              <div
                onClick={() => onModeChange("advanced")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                  appMode === "advanced"
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-600 ring-2 ring-blue-300 shadow-md"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {appMode === "advanced" && (
                  <div className="absolute top-3 right-3 text-blue-600">
                    <CheckCircle2 className="w-5 h-5 fill-blue-100" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">⚡</span>
                    <h5 className="font-black text-sm text-[#001F54]">Advanced Mode</h5>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[9px] font-black uppercase mb-2">
                    Independent Free Play
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Freely explore all games, clinical memory screening assessments, and physical therapy with minimal prompt overlays.
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-500">
                    Self-Guided Direct Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Guidance Agent Settings */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0D7377] text-white flex items-center justify-center">
                  {voiceGuidanceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <h5 className="font-black text-xs sm:text-sm text-[#132A2F]">Voice Agent Guidance</h5>
                  <p className="text-[11px] text-slate-500 font-medium">Spoken instructions in exercises & reminders</p>
                </div>
              </div>

              <button
                onClick={onToggleVoiceGuidance}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  voiceGuidanceEnabled ? "bg-[#0D7377]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    voiceGuidanceEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sign Out Action Button */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              Smriti Saathi Cognitive Care v2.4
            </div>

            <button
              onClick={() => {
                onClose();
                if (onLogout) onLogout();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-black text-xs transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
