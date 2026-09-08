import { useState, useEffect } from "react";
import { translations } from "../../data/translations";
import { PoseCameraVerification } from "../games/PoseCameraVerification";
import {
  Footprints,
  Armchair,
  Hand,
  Heart,
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  ChevronLeft,
  ShieldAlert,
  Camera,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobotAvatar } from "../common/GraphicAssets";

export const PhysicalActivityEngine = ({
  activity,
  profile,
  onComplete,
  onBack
}) => {
  const t = translations[profile.language] || translations.en;
  const [secondsRemaining, setSecondsRemaining] = useState(activity.durationMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [repsCount, setRepsCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [useCameraVerification, setUseCameraVerification] = useState(false);

  const speakInstruction = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.85;
        window.speechSynthesis.speak(utt);
      } catch {
        // Ignore synthesis errors
      }
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  useEffect(() => {
    if (activity.id !== "phys-4" || !isActive) return;
    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === "Inhale") return "Hold";
        if (prev === "Hold") return "Exhale";
        return "Inhale";
      });
    }, 4000);
    return () => clearInterval(breathInterval);
  }, [activity.id, isActive]);

  useEffect(() => {
    speakInstruction(
      `${activity.title}. ${activity.tagline}. Remember: ${activity.safetyMessage}`
    );
  }, [activity.id]);

  const handleFinish = () => {
    setIsCompleted(true);
    setIsActive(false);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti errors
    }
    const completedMins = Math.max(1, Math.ceil(elapsedSeconds / 60) || activity.durationMinutes);
    onComplete(activity.id, completedMins, repsCount || activity.repetitions);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const renderActivityIcon = (sizeClass = "w-16 h-16") => {
    switch (activity.iconName) {
      case "Footprints":
        return <Footprints className={sizeClass} />;
      case "Armchair":
        return <Armchair className={sizeClass} />;
      case "Hand":
        return <Hand className={sizeClass} />;
      case "Heart":
        return <Heart className={sizeClass} />;
      default:
        return <Activity className={sizeClass} />;
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-emerald-200 text-center space-y-5">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-700 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              WELLNESS ACTIVITY COMPLETED
            </span>
            <h2 className="text-3xl font-extrabold text-[#132A2F] font-display mt-2">
              Great Job, {profile.preferredName || profile.name}!
            </h2>
            <p className="text-base text-slate-600 font-medium mt-1">
              You completed your <span className="font-bold text-[#0D7377]">{activity.title}</span>.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Duration</span>
              <span className="text-xl font-black text-[#0D7377]">
                {Math.max(1, Math.ceil(elapsedSeconds / 60))} min
              </span>
            </div>

            {activity.repetitions ? (
              <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Reps Done</span>
                <span className="text-xl font-black text-[#132A2F]">
                  {repsCount || activity.repetitions} Reps
                </span>
              </div>
            ) : (
              <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Pace</span>
                <span className="text-xl font-black text-[#132A2F]">Comfortable</span>
              </div>
            )}

            <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">Status</span>
              <span className="text-lg font-black text-emerald-700">Verified & Saved ✓</span>
            </div>
          </div>

          {/* AI Observation Message */}
          <div className="bg-[#EAF6F4] rounded-2xl p-4 sm:p-5 border border-[#0D7377]/25 text-left flex items-start gap-3.5">
            <RobotAvatar size="w-10 h-10" />
            <div>
              <p className="text-xs font-extrabold text-[#0D7377] uppercase tracking-wider mb-0.5">
                AI PHYSICAL WELLNESS NOTE
              </p>
              <p className="text-sm text-[#132A2F] font-medium leading-relaxed">
                "Movement promotes oxygenation and cognitive alertness. Daily consistency supports mobility and joint flexibility."
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 px-6 rounded-2xl bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs border border-[#0D7377]/15">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-sm py-1 px-3 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Physical Wellness
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#132A2F] mt-0.5">
            {activity.title}
          </h2>
        </div>

        <button
          onClick={() =>
            speakInstruction(
              `${activity.title}. ${activity.instructions[currentStepIndex] || activity.tagline}. Safety reminder: ${activity.safetyMessage}`
            )
          }
          title="Read instructions aloud"
          className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0D7377] transition cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Prominent Mandatory Safety Message */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-center gap-3 text-amber-900 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center shrink-0 text-amber-900">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider block text-amber-800">
            Safety Guidance
          </span>
          <p className="text-xs sm:text-sm font-bold leading-tight">
            "{activity.safetyMessage}"
          </p>
        </div>
      </div>

      {/* Camera Verification Toggle Bar */}
      <div className="flex items-center justify-between bg-teal-50/80 border border-teal-200 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#0D7377]" />
          <span className="text-xs font-bold text-teal-950">
            Camera Movement Verification
          </span>
        </div>
        <button
          onClick={() => setUseCameraVerification(!useCameraVerification)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
            useCameraVerification
              ? "bg-[#0D7377] text-white"
              : "bg-white border border-teal-300 text-teal-800 hover:bg-teal-100"
          }`}
        >
          {useCameraVerification ? "Camera Active ✓" : "Enable Camera"}
        </button>
      </div>

      {/* Optional Live Camera Verification HUD */}
      {useCameraVerification && (
        <PoseCameraVerification
          commandText={activity.instructions[currentStepIndex] || activity.title}
          gameId={activity.id}
          activityId={activity.id}
          patientId={profile.id || "PT-7241"}
          onVerified={() => {
            setRepsCount((r) => r + 1);
            if (currentStepIndex < activity.instructions.length - 1) {
              setCurrentStepIndex((idx) => idx + 1);
            }
          }}
          onCancel={() => setUseCameraVerification(false)}
        />
      )}

      {/* Main Activity Player Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 text-center">
        {/* Animated / Illustrative Display */}
        <div className="relative py-6 px-4 bg-gradient-to-b from-[#F3F8F7] to-white rounded-3xl border border-[#0D7377]/15 overflow-hidden flex flex-col items-center justify-center min-h-[190px]">
          {/* Breathing visualizer for Breathing activity */}
          {activity.id === "phys-4" ? (
            <div className="flex flex-col items-center space-y-3">
              <div
                className={`w-32 h-32 rounded-full border-8 border-teal-400 bg-teal-100 flex items-center justify-center text-[#0D7377] transition-all duration-3000 ${
                  isActive && breathPhase === "Inhale"
                    ? "scale-125 bg-teal-200"
                    : isActive && breathPhase === "Hold"
                    ? "scale-115 bg-teal-100 ring-8 ring-teal-200"
                    : "scale-90 bg-teal-50"
                }`}
              >
                <span className="text-lg font-black">{isActive ? breathPhase : "Ready"}</span>
              </div>
              <p className="text-xs font-bold text-slate-500">
                {isActive ? "Follow the gentle rhythm" : "Press START to begin calming breath"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 rounded-3xl bg-[#0D7377]/10 text-[#0D7377] flex items-center justify-center shadow-inner">
                {renderActivityIcon("w-12 h-12")}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
                {activity.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
                {activity.tagline}
              </p>
            </div>
          )}

          {/* Reps counter if applicable */}
          {activity.repetitions && (
            <div className="mt-4 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600">Completed Reps:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRepsCount((r) => Math.max(0, r - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 cursor-pointer"
                >
                  -
                </button>
                <span className="text-lg font-black text-[#0D7377] min-w-[32px]">
                  {repsCount} / {activity.repetitions}
                </span>
                <button
                  onClick={() => setRepsCount((r) => r + 1)}
                  className="w-8 h-8 rounded-lg bg-[#0D7377] text-white font-black text-sm hover:bg-[#0A5C5F] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Large Timer Display */}
        <div className="space-y-3">
          <div className="text-5xl sm:text-6xl font-black font-mono text-[#0D7377] tracking-wider">
            {formatTime(secondsRemaining)}
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Target Duration: {activity.durationMinutes} Minutes
          </p>

          {/* Play / Pause / Reset Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-8 py-3.5 rounded-2xl font-black text-base flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer ${
                isActive
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-[#0D7377] hover:bg-[#0A5C5F] text-white"
              }`}
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isActive ? "PAUSE TIMER" : "START TIMER"}</span>
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setSecondsRemaining(activity.durationMinutes * 60);
                setElapsedSeconds(0);
              }}
              title="Reset Timer"
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="text-left bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Step-by-Step Instructions
            </h4>
            <span className="text-xs font-bold text-[#0D7377]">
              Elderly Gentle Pace
            </span>
          </div>

          <ol className="space-y-2.5">
            {activity.instructions.map((step, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  speakInstruction(`Step ${idx + 1}. ${step}`);
                }}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                  currentStepIndex === idx
                    ? "bg-teal-50 border-[#0D7377] shadow-xs text-[#132A2F]"
                    : "bg-white border-slate-200 text-slate-700 hover:border-teal-200"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-[#0D7377] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Big Done Button */}
        <button
          onClick={handleFinish}
          className="w-full py-4.5 rounded-2xl bg-[#28B463] hover:bg-[#239B56] text-white font-black text-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          <span>Complete Physical Activity ✓</span>
        </button>
      </div>
    </div>
  );
};
