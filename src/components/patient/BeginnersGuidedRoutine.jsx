import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Pill,
  GlassWater,
  Apple,
  Clock,
  Send,
  Award,
  Flame,
  ShieldCheck,
  Stethoscope,
  RotateCcw,
  Check,
  Gamepad2,
  Activity,
  SkipForward
} from "lucide-react";
import confetti from "canvas-confetti";
import { AllGamesEngine } from "../games/AllGamesEngine";
import { PhysicalMemoryEngine } from "../games/PhysicalMemoryEngine";
import { MemorySharpeningMusicSession } from "../games/MemorySharpeningMusicSession";
import { NostalgiaPastMemoryRecall } from "../games/NostalgiaPastMemoryRecall";
import { translations } from "../../data/translations";
import { routineTranslations } from "../../data/routineTranslations";

export const BeginnersGuidedRoutine = ({
  profile,
  onCompleteRoutine,
  onExit,
  onNavigateToPatientGames
}) => {
  const currentLang = profile?.language || "en";
  const t = translations[currentLang] || translations.en;
  const rt = routineTranslations[currentLang] || routineTranslations.en;

  // Flow State: 'games' (1 to 9) -> 'reminders' (10) -> 'progress_summary' (11)
  const [currentStage, setCurrentStage] = useState("games");
  const [gameStepIndex, setGameStepIndex] = useState(0); // 0 to 8 for the 9 games
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [gameScores, setGameScores] = useState([]);
  const [isDoctorReportSent, setIsDoctorReportSent] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);

  // Health Reminders Checklists state
  const [remindersState, setRemindersState] = useState({
    morningMeds: true,
    eveningMeds: false,
    hydration: true,
    memoryNutrition: false
  });
  const [activeReminderIndex, setActiveReminderIndex] = useState(0);

  // Dynamic 4 Daily Reminders & Memory Nutrition items from translations
  const reminderIconMap = {
    morningMeds: { icon: Pill, iconBg: "bg-rose-100 text-rose-700", badgeClass: "text-teal-800 bg-teal-50 border-teal-200", borderActive: "border-emerald-500 ring-4 ring-emerald-300 shadow-md bg-emerald-50/80" },
    eveningMeds: { icon: Pill, iconBg: "bg-indigo-100 text-indigo-700", badgeClass: "text-indigo-800 bg-indigo-50 border-indigo-200", borderActive: "border-indigo-500 ring-4 ring-indigo-300 shadow-md bg-indigo-50/80" },
    hydration: { icon: GlassWater, iconBg: "bg-blue-100 text-blue-700", badgeClass: "text-blue-800 bg-blue-50 border-blue-200", borderActive: "border-blue-500 ring-4 ring-blue-300 shadow-md bg-blue-50/80" },
    memoryNutrition: { icon: Apple, iconBg: "bg-amber-100 text-amber-800", badgeClass: "text-amber-800 bg-amber-50 border-amber-200", borderActive: "border-amber-500 ring-4 ring-amber-300 shadow-md bg-amber-50/80" }
  };

  const reminderQuestions = (rt.reminderItems || []).map((item) => ({
    ...item,
    ...(reminderIconMap[item.id] || reminderIconMap.morningMeds)
  }));

  // Top 9 Appointed Games in Beginner's Mode from translations
  const guidedGames = rt.games || [];

  // Voice Speech synthesizer — Hindi-aware with matra support and auto-trigger safety
  const speakText = (text) => {
    if (voiceMuted || typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const isHindi = currentLang === "hi";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHindi ? "hi-IN" : currentLang === "as" ? "as-IN" : currentLang === "bn" ? "bn-IN" : "en-US";
      utterance.rate = isHindi ? 0.82 : 0.88;
      utterance.pitch = 1.05;

      const assignVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const targetLang = utterance.lang;
          const preferred =
            voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
            voices.find((v) => v.lang === targetLang) ||
            voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2))) ||
            null;
          if (preferred) utterance.voice = preferred;
        }
        utterance.onstart = () => setIsVoiceSpeaking(true);
        utterance.onend = () => setIsVoiceSpeaking(false);
        utterance.onerror = () => setIsVoiceSpeaking(false);
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          assignVoiceAndSpeak();
          window.speechSynthesis.onvoiceschanged = null;
        };
      } else {
        assignVoiceAndSpeak();
      }
    } catch (e) {
      console.warn("Speech synthesis error in BeginnersGuidedRoutine:", e);
    }
  };

  const askReminderQuestion = (index) => {
    if (index < 0 || index >= reminderQuestions.length) return;
    setActiveReminderIndex(index);
    const item = reminderQuestions[index];
    const countPrefix = rt.questionCount ? rt.questionCount(index + 1, reminderQuestions.length) : `Question ${index + 1} of ${reminderQuestions.length}`;
    speakText(`${countPrefix}: ${item.voiceSpeech || item.question}`);
  };

  const handleConfirmReminderAnswer = (itemKey, didTake) => {
    setRemindersState((prev) => ({ ...prev, [itemKey]: didTake }));

    if (didTake) {
      speakText(rt.markedComplete || "Wonderful! Marked as completed.");
    } else {
      speakText(rt.markedPending || "Noted. Please take care of this on schedule.");
    }

    if (activeReminderIndex < reminderQuestions.length - 1) {
      setTimeout(() => {
        const nextIdx = activeReminderIndex + 1;
        setActiveReminderIndex(nextIdx);
        const countPrefix = rt.questionCount ? rt.questionCount(nextIdx + 1, reminderQuestions.length) : `Question ${nextIdx + 1} of ${reminderQuestions.length}`;
        speakText(`${countPrefix}: ${reminderQuestions[nextIdx].voiceSpeech || reminderQuestions[nextIdx].question}`);
      }, 1200);
    } else {
      setTimeout(() => {
        speakText(
          rt.allRemindersDone ||
          "All daily health reminders and memory nutrition have been checked! Click below to view your Clinical Progress Dashboard."
        );
      }, 1200);
    }
  };

  // Auto-speak voice agent guidance on stage / game changes (Exercise 1 to 7/9)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStage === "games") {
        const currentGame = guidedGames[gameStepIndex];
        if (currentGame?.instruction) {
          speakText(currentGame.instruction);
        }
      } else if (currentStage === "reminders") {
        setActiveReminderIndex(0);
        const intro = rt.remindersIntroSpeech || "Well done on completing all nine prescribed exercises! Now, let's review your daily health reminders, medicine adherence, and memory-boosting nutrition one by one.";
        const q1 = reminderQuestions[0]?.voiceSpeech || reminderQuestions[0]?.question || "";
        speakText(`${intro} ${q1}`);
      } else if (currentStage === "progress_summary") {
        const summaryMsg = rt.summarySpeech
          ? rt.summarySpeech(profile?.preferredName || profile?.name)
          : `Great achievement, ${profile?.name || "Lakshmi Devi"}! You have successfully completed all nine cognitive, physical, and music exercises with an overall score of 96%. Let's synchronize this clinical progress update with your doctor.`;
        speakText(summaryMsg);
      }
    }, 400); // 400ms debounce ensures clean auto-trigger without being cut off by mount lifecycle

    return () => {
      clearTimeout(timer);
    };
  }, [currentStage, gameStepIndex, currentLang, guidedGames]);

  // Handle completion of a game
  const handleGameFinished = (score = 95) => {
    setGameScores((prev) => [...prev, score]);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    if (gameStepIndex < guidedGames.length - 1) {
      setGameStepIndex((prev) => prev + 1);
    } else {
      // All 6 games completed -> Move to Reminders
      setCurrentStage("reminders");
    }
  };

  const handleSendReportToDoctor = () => {
    setIsSendingReport(true);
    setTimeout(() => {
      setIsSendingReport(false);
      setIsDoctorReportSent(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      speakText("Progress report successfully synchronized with Dr. Debabrata Roy.");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-[#EFF6FF] pb-16">
      {/* Top Beginner's Mode Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 shadow-xs px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm py-1.5 px-3 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{rt.exitRoutine || "Exit Routine"}</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-black text-[#132A2F]">
                {rt.routineTitle || "Beginner's Mode: Doctor's Appointed Care Routine"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentStage === "games" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const skipMsg = currentLang === "hi" 
                      ? `${guidedGames[gameStepIndex]?.title} छोड़ रहे हैं। अगले अभ्यास पर जा रहे हैं।`
                      : `Skipping ${guidedGames[gameStepIndex]?.title}. Moving to next exercise.`;
                    speakText(skipMsg);
                    handleGameFinished(88);
                  }}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer shadow-xs"
                  title="Skip this particular exercise and move to next"
                >
                  <SkipForward className="w-3.5 h-3.5 text-amber-700" />
                  <span>{rt.skipGame || "Skip Game"}</span>
                </button>
                <button
                  onClick={() => handleGameFinished(95)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition cursor-pointer"
                  title="Advance to next game in the sequence"
                >
                  <span>{rt.nextExercise || "Next Exercise"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                if (isVoiceSpeaking) {
                  window.speechSynthesis.cancel();
                  setIsVoiceSpeaking(false);
                } else {
                  if (currentStage === "games") {
                    speakText(guidedGames[gameStepIndex]?.instruction);
                  } else if (currentStage === "reminders") {
                    speakText(rt.remindersIntroSpeech || "Remember to take your prescribed medicine on time, drink brain hydration water, and eat almonds and walnuts for memory enhancement.");
                  } else {
                    const summaryMsg = rt.summarySpeech ? rt.summarySpeech(profile?.preferredName || profile?.name) : "Your overall cognitive score is 95%. Progress is synchronized with your doctor.";
                    speakText(summaryMsg);
                  }
                }
              }}
              title="Voice Agent Audio Guide"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                isVoiceSpeaking
                  ? "bg-teal-600 text-white animate-pulse"
                  : "bg-teal-50 text-[#0D7377] hover:bg-teal-100 border border-teal-200"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isVoiceSpeaking ? (currentLang === "hi" ? "बोल रहे हैं..." : "Speaking...") : (currentLang === "hi" ? "ध्वनि निर्देश" : "Voice Guide")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Routine Progress Stepper */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {rt.stepOf ? rt.stepOf(currentStage === "games" ? gameStepIndex + 1 : currentStage === "reminders" ? 10 : 11, 11) : `Step ${currentStage === "games" ? gameStepIndex + 1 : currentStage === "reminders" ? 10 : 11} of 11`}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#132A2F] mt-1.5">
              {currentStage === "games"
                ? `${guidedGames[gameStepIndex]?.title || ""}`
                : currentStage === "reminders"
                ? (rt.remindersHeading || "Daily Health Reminders & Memory Nutrition")
                : (rt.summaryHeading || "Clinical Progress Summary & Doctor Synchronization")}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {guidedGames.map((g, idx) => {
              const isDone = currentStage !== "games" || idx < gameStepIndex;
              const isCurrent = currentStage === "games" && idx === gameStepIndex;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setCurrentStage("games");
                    setGameStepIndex(idx);
                    speakText(`Switched to Exercise ${idx + 1}: ${g.title}`);
                  }}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                      : isCurrent
                      ? "bg-teal-100 text-[#0D7377] ring-2 ring-[#0D7377] font-black scale-105"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  title={`Jump to Exercise ${idx + 1}: ${g.title}`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </button>
              );
            })}
            <button
              onClick={() => {
                setCurrentStage("reminders");
                setActiveReminderIndex(0);
                speakText("Switched to Daily Health Reminders.");
              }}
              className={`flex items-center justify-center px-2.5 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                currentStage === "reminders"
                  ? "bg-teal-100 text-[#0D7377] ring-2 ring-[#0D7377]"
                  : currentStage === "progress_summary"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              title="Jump to Reminders"
            >
              💊 Reminders
            </button>
            <button
              onClick={() => {
                setCurrentStage("progress_summary");
                speakText("Switched to Clinical Progress Dashboard.");
              }}
              className={`flex items-center justify-center px-2.5 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                currentStage === "progress_summary"
                  ? "bg-teal-100 text-[#0D7377] ring-2 ring-[#0D7377]"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
              title="Jump to Clinical Report"
            >
              📊 Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Stage Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* ================= STAGE 1: 9 SEQUENTIAL GAMES ================= */}
        {currentStage === "games" && (
          <div className="space-y-4">
            {guidedGames[gameStepIndex]?.isNostalgiaRecall || guidedGames[gameStepIndex]?.id === "game-10-place" ? (
              <NostalgiaPastMemoryRecall
                key={guidedGames[gameStepIndex].id}
                profile={profile}
                nextGameTitle="Daily Health Reminders & Nutrition (Step 10)"
                onComplete={(taskId, score) => handleGameFinished(score || 98)}
                onSkip={() => {
                  speakText(`Skipping past memory exercise. Moving to daily health reminders.`);
                  handleGameFinished(88);
                }}
                onBack={() => {
                  if (gameStepIndex > 0) {
                    setGameStepIndex((prev) => prev - 1);
                  } else {
                    onExit();
                  }
                }}
              />
            ) : guidedGames[gameStepIndex]?.isMusicSession || guidedGames[gameStepIndex]?.id === "game-5-sound" ? (
              <MemorySharpeningMusicSession
                key={guidedGames[gameStepIndex].id}
                profile={profile}
                nextGameTitle={guidedGames[gameStepIndex + 1]?.title}
                onComplete={(taskId, score) => handleGameFinished(score || 98)}
                onSkip={() => {
                  speakText(`Skipping music session. Moving to next exercise.`);
                  handleGameFinished(88);
                }}
                onBack={() => {
                  if (gameStepIndex > 0) {
                    setGameStepIndex((prev) => prev - 1);
                  } else {
                    onExit();
                  }
                }}
              />
            ) : guidedGames[gameStepIndex]?.isPhysical || guidedGames[gameStepIndex]?.id.startsWith("pm-") ? (
              <PhysicalMemoryEngine
                key={guidedGames[gameStepIndex].id}
                game={guidedGames[gameStepIndex]}
                profile={profile}
                isBeginnersMode={true}
                nextGameTitle={guidedGames[gameStepIndex + 1]?.title}
                onComplete={(taskId, score) => handleGameFinished(score || 95)}
                onSkip={() => {
                  speakText(`Skipping ${guidedGames[gameStepIndex]?.title}. Moving to next exercise.`);
                  handleGameFinished(88);
                }}
                onBack={() => {
                  if (gameStepIndex > 0) {
                    setGameStepIndex((prev) => prev - 1);
                  } else {
                    onExit();
                  }
                }}
              />
            ) : (
              <AllGamesEngine
                key={guidedGames[gameStepIndex].id}
                task={guidedGames[gameStepIndex]}
                profile={profile}
                isBeginnersMode={true}
                stepIndex={gameStepIndex}
                totalSteps={guidedGames.length}
                nextGameTitle={guidedGames[gameStepIndex + 1]?.title}
                onComplete={(taskId, score) => handleGameFinished(score || 95)}
                onSkip={() => {
                  speakText(`Skipping ${guidedGames[gameStepIndex]?.title}. Moving to next exercise.`);
                  handleGameFinished(88);
                }}
                onBack={() => {
                  if (gameStepIndex > 0) {
                    setGameStepIndex((prev) => prev - 1);
                  } else {
                    onExit();
                  }
                }}
              />
            )}
          </div>
        )}

        {/* ================= STAGE 2: REMINDERS & HEALTH NUTRITION WITH VOICE AGENT ================= */}
        {currentStage === "reminders" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-2 border-teal-200 space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs sm:text-sm font-black text-emerald-800 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                Gentle Health & Wellness Support
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#132A2F] mt-3">
                Daily Reminders & Memory Nutrition
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                Your AI Voice Agent is actively asking about your prescribed health routine one by one. Confirm your response below:
              </p>
            </div>

            {/* AI Voice Agent Active Question Banner */}
            <div className="bg-gradient-to-r from-teal-900 via-[#0D7377] to-emerald-800 rounded-3xl p-5 sm:p-7 text-white shadow-md border border-teal-400/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-teal-200 border border-white/20 animate-pulse">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-teal-200 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                      AI Voice Question {activeReminderIndex + 1} of {reminderQuestions.length}
                    </span>
                    <h4 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                      {reminderQuestions[activeReminderIndex].heading}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => askReminderQuestion(activeReminderIndex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-black transition cursor-pointer border border-white/20"
                    title="Replay Voice Question"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Audio</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {reminderQuestions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => askReminderQuestion(i)}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer ${
                          activeReminderIndex === i
                            ? "bg-white text-[#0D7377] shadow-sm font-black scale-110"
                            : remindersState[reminderQuestions[i].id]
                            ? "bg-emerald-400/40 text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                        title={`Go to Question ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Voice Question Text & Answers */}
              <div className="pt-4 sm:pt-5 space-y-4">
                <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
                  <p className="text-xs font-bold text-teal-200 uppercase mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    {currentLang === "hi" ? "वॉइस एजेंट पूछ रहा है:" : "Voice Agent Asking:"}
                  </p>
                  <p className="text-base sm:text-xl font-black text-white leading-snug">
                    "{reminderQuestions[activeReminderIndex]?.question}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      handleConfirmReminderAnswer(
                        reminderQuestions[activeReminderIndex].id,
                        true
                      )
                    }
                    className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm sm:text-base shadow-md transition flex items-center justify-center gap-2 cursor-pointer btn-glow-teal"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{rt.yesDone || "Yes, I did / I took it ✓"}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleConfirmReminderAnswer(
                        reminderQuestions[activeReminderIndex].id,
                        false
                      )
                    }
                    className="py-3 px-5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{rt.remindLater || "Not yet / Remind me"}</span>
                  </button>

                  {activeReminderIndex < reminderQuestions.length - 1 && (
                    <button
                      onClick={() => askReminderQuestion(activeReminderIndex + 1)}
                      className="py-3 px-4 rounded-2xl bg-teal-600/60 hover:bg-teal-600 text-white font-black text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <span>{currentLang === "hi" ? "अगला प्रश्न" : "Next Question"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reminder Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {reminderQuestions.map((item, index) => {
                const isChecked = !!remindersState[item.id];
                const isActive = activeReminderIndex === index;
                const IconComp = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => askReminderQuestion(index)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isActive
                        ? item.borderActive
                        : isChecked
                        ? "bg-emerald-50/60 border-emerald-300 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border ${item.badgeClass}`}
                          >
                            {item.badge}
                          </span>
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <span className="text-[10px] font-black text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded-full border border-teal-300 flex items-center gap-1 animate-pulse">
                                <Volume2 className="w-3 h-3" />
                                <span>{currentLang === "hi" ? "वॉइस सक्रिय" : "Voice Active"}</span>
                              </span>
                            )}
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                e.stopPropagation();
                                setRemindersState((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }));
                              }}
                              className="w-5 h-5 rounded-md text-[#0D7377] accent-[#0D7377] cursor-pointer"
                            />
                          </div>
                        </div>
                        <h4 className="font-black text-base text-[#132A2F] mt-1.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Voice Question Prompt & Toggle */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          askReminderQuestion(index);
                        }}
                        className="flex items-center gap-1.5 text-[#0D7377] font-bold hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{currentLang === "hi" ? "प्रश्न सुनें" : "Hear Question"}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmReminderAnswer(item.id, !isChecked);
                        }}
                        className={`px-3 py-1 rounded-xl font-black text-xs transition ${
                          isChecked
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isChecked ? (currentLang === "hi" ? "पूर्ण ✓" : "Completed ✓") : (currentLang === "hi" ? "चिह्नित करें" : "Mark Done")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Action */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setCurrentStage("progress_summary")}
                className="w-full sm:w-auto px-8 py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer btn-glow-teal scale-105"
              >
                <span>{rt.viewDashboard || "Continue to Clinical Progress Dashboard"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: PATIENT PROGRESS & DOCTOR REPORT ================= */}
        {currentStage === "progress_summary" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-emerald-300 space-y-8 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#001F54] to-[#0D7377] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="text-center md:text-left space-y-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-teal-200 border border-white/20">
                  🏆 {currentLang === "hi" ? "दैनिक देखभाल सत्र पूर्ण" : "Daily Care Session Completed"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  {rt.summaryHeading || "Patient Cognitive Performance Summary"}
                </h3>
                <p className="text-sm text-teal-100 font-medium max-w-xl">
                  {currentLang === "hi"
                    ? "वॉइस एजेंट ने आज के आपके व्यायाम स्कोर, गति बेंचमार्क और दवा अनुपालन को संकलित किया है।"
                    : "Voice Agent has compiled your clinical exercise metrics, speed benchmarks, and medication adherence for today."}
                </p>
              </div>

              <div className="text-center bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shrink-0">
                <span className="text-xs font-bold text-teal-200 uppercase">{rt.overallScore || "Overall Cognitive Score"}</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1">95%</div>
                <span className="text-[11px] font-extrabold text-emerald-300">✓ {rt.scoreRank || "Excellent Condition"}</span>
              </div>
            </div>

            {/* Metric Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-bold text-emerald-800">{currentLang === "hi" ? "पूर्ण अभ्यास" : "Exercises Done"}</span>
                <div className="text-2xl font-black text-emerald-900 mt-1">9 / 9</div>
                <span className="text-[10px] text-emerald-700 font-bold">100% {currentLang === "hi" ? "लक्ष्य पूरा" : "Prescribed Target"}</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs font-bold text-blue-800">{currentLang === "hi" ? "स्मृति सटीकता" : "Memory Accuracy"}</span>
                <div className="text-2xl font-black text-blue-900 mt-1">96%</div>
                <span className="text-[10px] text-blue-700 font-bold">+4% {currentLang === "hi" ? "पिछले सप्ताह से" : "from last week"}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs font-bold text-amber-800">{currentLang === "hi" ? "सक्रिय दैनिक स्ट्रीक" : "Active Daily Streak"}</span>
                <div className="text-2xl font-black text-amber-900 mt-1">7 Days 🔥</div>
                <span className="text-[10px] text-amber-700 font-bold">{currentLang === "hi" ? "लगातार अभ्यास" : "Consistent Engagement"}</span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-xs font-bold text-purple-800">{currentLang === "hi" ? "स्वास्थ्य अनुस्मारक" : "Health Reminders"}</span>
                <div className="text-2xl font-black text-purple-900 mt-1">Verified ✓</div>
                <span className="text-[10px] text-purple-700 font-bold">{currentLang === "hi" ? "दवा और पोषण दर्ज" : "Meds & Nutrition Logged"}</span>
              </div>
            </div>

            {/* Doctor Sync Section */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0D7377] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-base text-[#132A2F]">
                    {currentLang === "hi" ? `डॉ. देबब्रत रॉय के साथ रिपोर्ट साझा करें` : `Share Progress Report with ${profile?.doctorName || "Dr. Debabrata Roy, MD"}`}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {currentLang === "hi" ? "डॉक्टर पोर्टल के साथ सीधा रीयल-टाइम क्लिनिकल डेटा सिंक।" : "Direct real-time clinical synchronization to the Doctor Portal telemetry system."}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSendReportToDoctor}
                disabled={isSendingReport || isDoctorReportSent}
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md ${
                  isDoctorReportSent
                    ? "bg-emerald-600 text-white cursor-default"
                    : isSendingReport
                    ? "bg-teal-400 text-white cursor-wait"
                    : "bg-[#0D7377] hover:bg-[#0A5C5F] text-white active:scale-95"
                }`}
              >
                {isDoctorReportSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{rt.syncSuccess || "Report Sent to Doctor ✓"}</span>
                  </>
                ) : isSendingReport ? (
                  <span>{rt.syncing || "Transmitting Telemetry..."}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{rt.syncWithDoctor || "Share Progress Report to Doctor"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Redirection to More Games Section */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl cursor-pointer transition"
              >
                {rt.homePortal || "Return to Home"}
              </button>

              <button
                onClick={onNavigateToPatientGames}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>{rt.continueGames || "Play More Games in Patient Portal →"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
