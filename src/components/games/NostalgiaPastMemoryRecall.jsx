import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Eye,
  Clock,
  Home,
  Check,
  RotateCcw,
  SkipForward,
  Heart
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobotAvatar } from "../common/GraphicAssets";

import { routineTranslations } from "../../data/routineTranslations";

// Base scene images
const SCENE_IMAGES = {
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
  curtains: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
  kettle: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
  bicycle: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
  dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
  redCurtains: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
  yellowCurtains: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80",
  radio: "https://images.unsplash.com/photo-1593078166039-c9878df5c520?auto=format&fit=crop&w=600&q=80",
  paint: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80"
};

export const NostalgiaPastMemoryRecall = ({
  profile,
  onComplete,
  onBack,
  onSkip,
  nextGameTitle = "Daily Health Reminders & Nutrition (Step 10)"
}) => {
  const currentLang = profile?.language || "en";
  const rt = routineTranslations[currentLang] || routineTranslations.en;
  const nData = rt.nostalgia || routineTranslations.en.nostalgia;

  const [phase, setPhase] = useState("observe"); // 'observe' | 'questions' | 'completed'
  const [observeSeconds, setObserveSeconds] = useState(10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecking, setIsAnswerChecking] = useState(false);
  const [userScore, setUserScore] = useState(98);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic Scene Items
  const sceneItems = (nData.items || []).map((item) => ({
    ...item,
    image: SCENE_IMAGES[item.id] || SCENE_IMAGES.cat
  }));

  // Dynamic Recall Questions with exact image mappings
  const recallQuestions = (nData.questions || []).map((q, qIdx) => {
    let options = [];
    if (qIdx === 0) {
      options = [
        { id: "opt-cat", ...(q.options[0] || {}), image: SCENE_IMAGES.cat, isCorrect: true },
        { id: "opt-bicycle", ...(q.options[1] || {}), image: SCENE_IMAGES.bicycle, isCorrect: false },
        { id: "opt-dog", ...(q.options[2] || {}), image: SCENE_IMAGES.dog, isCorrect: false }
      ];
    } else if (qIdx === 1) {
      options = [
        { id: "opt-red", ...(q.options[0] || {}), image: SCENE_IMAGES.redCurtains, isCorrect: false },
        { id: "opt-blue", ...(q.options[1] || {}), image: SCENE_IMAGES.curtains, isCorrect: true },
        { id: "opt-yellow", ...(q.options[2] || {}), image: SCENE_IMAGES.yellowCurtains, isCorrect: false }
      ];
    } else {
      options = [
        { id: "opt-kettle", ...(q.options[0] || {}), image: SCENE_IMAGES.kettle, isCorrect: true },
        { id: "opt-radio", ...(q.options[1] || {}), image: SCENE_IMAGES.radio, isCorrect: false },
        { id: "opt-paint", ...(q.options[2] || {}), image: SCENE_IMAGES.paint, isCorrect: false }
      ];
    }

    return {
      ...q,
      correctIndex: qIdx === 1 ? 1 : 0,
      options
    };
  });

  // Voice speech synthesis — Hindi-aware with matra support
  const speakText = (text) => {
    if (voiceMuted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const isHindi = currentLang === "hi";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isHindi ? "hi-IN" : currentLang === "as" ? "as-IN" : currentLang === "bn" ? "bn-IN" : "en-US";
    utterance.rate = isHindi ? 0.82 : 0.88;
    utterance.pitch = 1.05;
    // Select best matching voice for Hindi matra pronunciation
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetLang = utterance.lang;
      const preferred =
        voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
        voices.find((v) => v.lang === targetLang) ||
        voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2))) ||
        null;
      if (preferred) utterance.voice = preferred;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Play audio chime
  const playChime = (freq = 659.25, type = "triangle", duration = 0.3) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  };

  // On mount in observation phase
  useEffect(() => {
    const welcomeSpeech = currentLang === "hi"
      ? "चरण 9 में आपका स्वागत है: पुरानी यादें और स्मरण। इस शांत सुबह के बरामदे के दृश्य को ध्यान से देखें।"
      : "Welcome to Step 9: Nostalgia and Past Memory Recall. Look carefully at this peaceful morning veranda scene.";
    speakText(welcomeSpeech);
  }, [currentLang]);

  // Observation Timer countdown
  useEffect(() => {
    if (phase !== "observe") return;
    const timer = setInterval(() => {
      setObserveSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startQuestionsPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const startQuestionsPhase = () => {
    setPhase("questions");
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecking(false);
    if (recallQuestions[0]) {
      speakText(recallQuestions[0].voiceSpeech || recallQuestions[0].question);
    }
  };

  const handleSelectOption = (optIndex) => {
    if (isAnswerChecking || phase !== "questions") return;
    setSelectedOption(optIndex);
    setIsAnswerChecking(true);

    const currQ = recallQuestions[currentQuestionIndex];
    const isCorrect = optIndex === currQ.correctIndex;

    if (isCorrect) {
      playChime(784, "triangle", 0.4);
      speakText(nData.correctPraise || "Wonderful! That is exactly correct.");
    } else {
      playChime(260, "sawtooth", 0.3);
      speakText(nData.tryAgain || `The correct item was: ${currQ.options[currQ.correctIndex].name}.`);
    }

    setTimeout(() => {
      if (currentQuestionIndex < recallQuestions.length - 1) {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        setSelectedOption(null);
        setIsAnswerChecking(false);
        speakText(recallQuestions[nextIdx].voiceSpeech || recallQuestions[nextIdx].question);
      } else {
        // Complete Game
        setPhase("completed");
        playChime(880, "sine", 0.6);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        const doneSpeech = currentLang === "hi"
          ? "शानदार! आपने पुरानी यादों का स्मरण अभ्यास सफलतापूर्वक पूरा कर लिया है। शुरुआती मोड के सभी 9 खेल पूर्ण हुए!"
          : "Outstanding! You have successfully completed the Nostalgia and Past Memory Recall exercise. All 9 appointed games in Beginner's Mode are complete!";
        speakText(doneSpeech);
      }
    }, 1600);
  };

  const currentQ = recallQuestions[currentQuestionIndex] || recallQuestions[0];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-teal-200 text-left space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="Go to previous step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-0.5 rounded-full border border-teal-200">
                Step 9 of 9 · Reminiscence & Past Memory
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Beginner's Mode Prescribed
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#132A2F] mt-1">
              9. NOSTALGIA & PAST MEMORY RECALL
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => {
              if (phase === "observe") {
                speakText(
                  "Look at the peaceful morning veranda scene. Notice the sleeping ginger cat on the mat, ocean blue curtains by the window, and brass tea kettle on the table."
                );
              } else if (phase === "questions") {
                speakText(currentQ.voiceSpeech);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
              isSpeaking
                ? "bg-teal-600 text-white border-teal-700 animate-pulse"
                : "bg-teal-50 text-[#0D7377] border-teal-200 hover:bg-teal-100"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? "Voice Speaking..." : "Read Aloud"}</span>
          </button>

          {onSkip && phase !== "completed" && (
            <button
              onClick={onSkip}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= PHASE 1: OBSERVE SCENE & VISUAL HIGHLIGHTS ================= */}
      {phase === "observe" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Hero Scene Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-teal-200 bg-slate-900 group">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
              alt="Peaceful Sunny Veranda and Living Space"
              className="w-full h-56 sm:h-72 object-cover object-center opacity-90 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 sm:p-7 text-white">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-teal-500/80 backdrop-blur-md text-[11px] font-black uppercase text-white border border-teal-300/40">
                    Familiar Morning Veranda Scene
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Observe the 3 Nostalgic Items Below
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-100 font-medium max-w-xl">
                    "The warm morning sun illuminates the quiet veranda. A gentle cat sleeps on the porch mat, soft blue curtains sway by the window, and a steaming brass tea kettle sits on the wooden table."
                  </p>
                </div>

                <div className="bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
                  <span className="text-[10px] font-bold text-teal-200 uppercase">Memory Timer</span>
                  <div className="text-2xl sm:text-3xl font-black text-white">{observeSeconds}s</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Explicit Visual Reference Cards matching the exact questions */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-3">
              {currentLang === "hi" ? "याद रखने वाली 3 वस्तुएं (इन्हीं पर प्रश्न पूछे जाएंगे):" : "Exact Items to Memorize (These will be asked in the questions):"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sceneItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-teal-50/70 border-2 border-teal-200 rounded-2xl p-3.5 space-y-3 shadow-xs hover:border-teal-400 transition"
                >
                  <div className="relative rounded-xl overflow-hidden h-32 bg-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md border border-teal-200">
                      {item.location}
                    </span>
                    <h5 className="font-extrabold text-sm text-[#132A2F] mt-1">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Questions CTA */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={startQuestionsPhase}
              className="w-full sm:w-auto px-8 py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer btn-glow-teal scale-105"
            >
              <Eye className="w-5 h-5" />
              <span>{nData.startRecallNow || "I Have Memorized The Scene · Start Questions"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PHASE 2: IMAGE RECALL QUESTIONS ================= */}
      {phase === "questions" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Question Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-[#0D7377] to-teal-800 rounded-3xl p-5 sm:p-7 text-white shadow-md border border-teal-400/30">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-teal-200 border border-white/20">
                  {currentLang === "hi" ? `प्रश्न ${currentQuestionIndex + 1} / ${recallQuestions.length}` : `Question ${currentQuestionIndex + 1} of ${recallQuestions.length}`}
                </span>
                <span className="text-xs text-teal-100 font-medium">
                  {nData.recallTitle || "Past Scene Memory Recall"}
                </span>
              </div>
              <button
                onClick={() => speakText(currentQ.voiceSpeech || currentQ.question)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition border border-white/20 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{currentLang === "hi" ? "प्रश्न सुनें" : "Hear Question"}</span>
              </button>
            </div>

            <div className="pt-4 space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                "{currentQ.question}"
              </h3>
              <p className="text-xs text-teal-200 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentLang === "hi" ? `संकेत: ${currentQ.hint}` : `Hint: ${currentQ.hint}`}</span>
              </p>
            </div>
          </div>

          {/* 3 Visual Image Options - EXACT MATCHING PICTURES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const showResult = isAnswerChecking && isSelected;
              const isCorrect = option.isCorrect;

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`rounded-3xl border-3 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                    showResult
                      ? isCorrect
                        ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-300 scale-102"
                        : "bg-rose-50 border-rose-500 ring-4 ring-rose-300 scale-102"
                      : "bg-white hover:border-[#0D7377] hover:bg-teal-50/40 border-slate-200"
                  }`}
                >
                  {/* Option Image */}
                  <div className="relative h-44 sm:h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-black text-xs px-2.5 py-1 rounded-lg">
                      {currentLang === "hi" ? `विकल्प ${optIdx + 1}` : `Option ${optIdx + 1}`}
                    </span>

                    {showResult && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center backdrop-blur-xs ${
                          isCorrect ? "bg-emerald-900/60" : "bg-rose-900/60"
                        }`}
                      >
                        <div className="p-3 rounded-full bg-white shadow-lg animate-bounce">
                          {isCorrect ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                          ) : (
                            <span className="text-xl font-black text-rose-600">✕</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option Text & Tap Button */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-black text-base text-[#132A2F]">
                        {option.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {option.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-3 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                        showResult
                          ? isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-rose-600 text-white"
                          : "bg-slate-100 hover:bg-[#0D7377] hover:text-white text-slate-700"
                      }`}
                    >
                      {showResult ? (
                        isCorrect ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>{currentLang === "hi" ? "सही उत्तर ✓" : "Correct Match ✓"}</span>
                          </>
                        ) : (
                          <span>{currentLang === "hi" ? "गलत उत्तर" : "Incorrect Match"}</span>
                        )
                      ) : (
                        <span>{currentLang === "hi" ? "यह विकल्प चुनें" : "Tap to Select This Item"}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= PHASE 3: COMPLETED STAGE ================= */}
      {phase === "completed" && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 sm:p-10 border-2 border-emerald-300 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-emerald-200/70 text-xs font-black text-emerald-900 border border-emerald-300">
              🎉 {currentLang === "hi" ? "9वाँ खेल सफलतापूर्वक पूर्ण हुआ!" : "🎉 9th Game Completed Successfully!"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#132A2F]">
              {nData.congratsTitle || "Nostalgia & Past Memory Recall Mastered"}
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              {nData.congratsDesc || "You accurately identified all items from the familiar morning veranda scene. All 9 appointed games in Beginner's Mode are complete!"}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 py-2">
            <div className="px-5 py-3 rounded-2xl bg-white border border-emerald-200 text-center shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">{currentLang === "hi" ? "स्मृति स्कोर" : "Memory Score"}</span>
              <div className="text-2xl font-black text-emerald-800">98%</div>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white border border-emerald-200 text-center shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">{currentLang === "hi" ? "पूर्ण खेल" : "Games Completed"}</span>
              <div className="text-2xl font-black text-teal-800">9 / 9 {currentLang === "hi" ? "खेल" : "Games"}</div>
            </div>
          </div>

          {/* Next Step CTA */}
          <div className="pt-3 flex justify-center">
            <button
              onClick={() => onComplete && onComplete("game-10-place", userScore)}
              className="w-full sm:w-auto px-8 py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-base rounded-2xl shadow-xl transition flex items-center justify-center gap-2.5 cursor-pointer btn-glow-teal scale-105"
            >
              <span>{nData.nextToReminders || "Continue to Step 10 (Daily Health Reminders)"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NostalgiaPastMemoryRecall;
