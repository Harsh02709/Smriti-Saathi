import { useState, useEffect } from "react";
import { translations } from "../../data/translations";
import { culturalGameCards } from "../../data/initialData";
import {
  Brain,
  Volume2,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Award,
  ChevronLeft,
  Coffee,
  Flame,
  Sun,
  Bell,
  Feather,
  Music
} from "lucide-react";
import confetti from "canvas-confetti";
export const PatientGame = ({
  task,
  profile,
  onComplete,
  onBack
}) => {
  const t = translations[profile.language];
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [finalScore, setFinalScore] = useState(82);
  const renderCardIcon = (iconName) => {
    const iconClass = "w-10 h-10 sm:w-12 sm:h-12 drop-shadow-xs";
    switch (iconName) {
      case "Coffee":
        return <Coffee className={iconClass} />;
      case "Flame":
        return <Flame className={iconClass} />;
      case "Sun":
        return <Sun className={iconClass} />;
      case "Bell":
        return <Bell className={iconClass} />;
      case "Feather":
        return <Feather className={iconClass} />;
      case "Music":
        return <Music className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };
  const initGameRound = () => {
    const activeSlice = culturalGameCards.slice(0, 8);
    const shuffled = [...activeSlice].sort(() => Math.random() - 0.5).map((item, index) => ({
      id: `${item.id}-${index}`,
      pairId: item.pairId,
      name: item.name,
      icon: item.icon,
      color: item.color,
      isFlipped: false,
      isMatched: false
    }));
    setTiles(shuffled);
    setSelectedTiles([]);
    setMatchedPairsCount(0);
    setIsCompleted(false);
    setIsPaused(false);
  };
  useEffect(() => {
    initGameRound();
  }, [task.id, currentStep]);
  useEffect(() => {
    if (isPaused || isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1e3);
    return () => clearInterval(interval);
  }, [isPaused, isCompleted]);
  const handleRepeatInstruction = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const lang = profile?.language || "en";
      const isHindi = lang === "hi";
      const textToSpeak = `${t.lookCarefully}. Step ${currentStep} of ${totalSteps}.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = isHindi ? "hi-IN" : "en-US";
      utterance.rate = isHindi ? 0.82 : 0.85;
      utterance.pitch = 1.05;
      // Select best matching voice for Hindi matra pronunciation
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const targetLang = isHindi ? "hi-IN" : "en-US";
        const preferred =
          voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
          voices.find((v) => v.lang === targetLang) ||
          voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2))) ||
          null;
        if (preferred) utterance.voice = preferred;
      }
      window.speechSynthesis.speak(utterance);
    }
  };
  const handleTileClick = (index) => {
    if (isPaused || isCompleted) return;
    if (tiles[index].isFlipped || tiles[index].isMatched) return;
    if (selectedTiles.length >= 2) return;
    const newTiles = [...tiles];
    newTiles[index].isFlipped = true;
    setTiles(newTiles);
    const newSelected = [...selectedTiles, index];
    setSelectedTiles(newSelected);
    if (newSelected.length === 2) {
      const firstIndex = newSelected[0];
      const secondIndex = newSelected[1];
      if (tiles[firstIndex].pairId === tiles[secondIndex].pairId) {
        setTimeout(() => {
          setTiles((prev) => {
            const updated = [...prev];
            updated[firstIndex].isMatched = true;
            updated[secondIndex].isMatched = true;
            return updated;
          });
          setSelectedTiles([]);
          const newMatchCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchCount);
          if (newMatchCount >= 4) {
            if (currentStep < totalSteps) {
              setTimeout(() => {
                setCurrentStep((s) => s + 1);
              }, 800);
            } else {
              finishGame();
            }
          }
        }, 500);
      } else {
        setErrorsCount((e) => e + 1);
        setTimeout(() => {
          setTiles((prev) => {
            const updated = [...prev];
            updated[firstIndex].isFlipped = false;
            updated[secondIndex].isFlipped = false;
            return updated;
          });
          setSelectedTiles([]);
        }, 1200);
      }
    }
  };
  const finishGame = () => {
    setIsCompleted(true);
    const accuracyCalculated = Math.max(65, Math.round(100 - errorsCount * 4));
    setFinalScore(accuracyCalculated);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
    }
    onComplete(task.id, accuracyCalculated, accuracyCalculated, elapsedSeconds + 120, errorsCount);
  };
  const formatMinutesSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins} min ${secs < 10 ? "0" : ""}${secs} sec`;
  };
  if (isCompleted) {
    return <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-[#0D7377]/20 text-center">
          
          {
      /* Badge */
    }
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-700 mb-6 shadow-inner">
            <Award className="w-12 h-12" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132A2F] font-display mb-1 tracking-tight">
            {t.greatJob}
          </h2>
          <p className="text-lg sm:text-xl text-[#0D7377] font-semibold mb-6">
            {task.title} completed.
          </p>

          {
      /* Simple Metrics summary */
    }
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#F3F8F7] p-3.5 sm:p-4 rounded-2xl border border-[#0D7377]/15">
              <span className="text-xs sm:text-sm font-bold text-slate-500 block uppercase">Accuracy</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0D7377]">{finalScore}%</span>
            </div>

            <div className="bg-[#F3F8F7] p-3.5 sm:p-4 rounded-2xl border border-[#0D7377]/15">
              <span className="text-xs sm:text-sm font-bold text-slate-500 block uppercase">Time</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#132A2F]">{formatMinutesSeconds(elapsedSeconds + 120)}</span>
            </div>

            <div className="bg-[#F3F8F7] p-3.5 sm:p-4 rounded-2xl border border-[#0D7377]/15">
              <span className="text-xs sm:text-sm font-bold text-slate-500 block uppercase">Errors</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">{errorsCount}</span>
            </div>
          </div>

          {
      /* Reassuring AI Message (Elderly Safe) */
    }
          <div className="bg-[#EAF6F4] rounded-2xl p-5 border border-[#0D7377]/25 text-left mb-8 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0D7377] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Brain className="w-5 h-5 text-[#9DF3C4]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0D7377] uppercase tracking-wider mb-1">
                MindSathi AI Companion
              </p>
              <p className="text-base sm:text-lg text-[#132A2F] font-medium leading-relaxed">
                "This level was comfortable and engaging! We'll keep your next activity relaxed and enjoyable."
              </p>
            </div>
          </div>

          {
      /* Large Navigation Actions */
    }
          <div className="space-y-3">
            <button
      id="btn-continue-tasks"
      onClick={onBack}
      className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-[#0D7377]/30 transition flex items-center justify-center gap-3 active:scale-98"
    >
              <span>{t.continueTasks}</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <button
      onClick={() => {
        setCurrentStep(1);
        initGameRound();
      }}
      className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition flex items-center justify-center gap-2"
    >
              <RotateCcw className="w-5 h-5" />
              <span>{t.playAgain}</span>
            </button>
          </div>

        </div>
      </div>;
  }
  return <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      
      {
    /* Top Game Bar */
  }
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs border border-[#0D7377]/15 mb-4">
        <button
    onClick={onBack}
    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-sm sm:text-base py-1 px-2.5 rounded-xl hover:bg-slate-100 transition"
  >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#132A2F]">
            {task.title}
          </h2>
          <span className="text-xs sm:text-sm font-semibold bg-[#EAF6F4] text-[#0D7377] px-3 py-0.5 rounded-full border border-[#0D7377]/20">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        <button
    onClick={() => setIsPaused(!isPaused)}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition ${isPaused ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? "RESUME" : t.pause}</span>
        </button>
      </div>

      {
    /* Spoken Instruction Banner */
  }
      <div className="bg-[#EBF7F5] rounded-2xl p-4 sm:p-5 border border-[#0D7377]/20 mb-5 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D7377] text-white flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6 text-[#9DF3C4]" />
          </div>
          <p className="text-base sm:text-lg font-bold text-[#132A2F] leading-snug">
            "{t.lookCarefully}"
          </p>
        </div>

        <button
    onClick={handleRepeatInstruction}
    className="p-3 bg-white hover:bg-slate-50 text-[#0D7377] rounded-xl border border-[#0D7377]/30 shadow-xs active:scale-95 transition shrink-0"
    title={t.repeatInstruction}
  >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {
    /* Paused Overlay State */
  }
      {isPaused ? <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-lg my-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <Pause className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#132A2F] mb-2">Game Paused</h3>
          <p className="text-slate-600 mb-6">Take your time. Whenever you are ready, press resume.</p>
          <button
    onClick={() => setIsPaused(false)}
    className="px-8 py-3.5 bg-[#0D7377] text-white font-extrabold rounded-2xl shadow-md text-lg hover:bg-[#0A5C5F] transition"
  >
            Resume Game
          </button>
        </div> : (
    /* Large Image Tiles Grid (Elderly Accessible: 4x2 grid with high visual clarity) */
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {tiles.map((tile, idx) => {
      const isRevealed = tile.isFlipped || tile.isMatched;
      return <button
        key={tile.id}
        onClick={() => handleTileClick(idx)}
        disabled={tile.isMatched}
        className={`h-28 sm:h-36 rounded-3xl transition-all duration-300 transform flex flex-col items-center justify-center p-3 text-center shadow-md relative overflow-hidden select-none active:scale-95 ${tile.isMatched ? "bg-emerald-100 border-3 border-emerald-400 opacity-90" : isRevealed ? `bg-gradient-to-br ${tile.color} border-3 border-[#0D7377] text-[#132A2F] scale-102` : "bg-white hover:bg-[#F3F8F7] border-3 border-slate-200 text-slate-400 hover:border-[#0D7377]/40"}`}
      >
                {isRevealed ? <div className="animate-in zoom-in-75 duration-200 flex flex-col items-center">
                    <div className="text-[#0D7377] mb-1.5">
                      {renderCardIcon(tile.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#132A2F] leading-tight line-clamp-1">
                      {tile.name}
                    </span>
                    {tile.isMatched && <span className="absolute top-2 right-2 text-emerald-600 bg-white/80 rounded-full p-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>}
                  </div> : <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F6F4] text-[#0D7377] flex items-center justify-center mb-1">
                      <Brain className="w-6 h-6 opacity-60" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tap Tile
                    </span>
                  </div>}
              </button>;
    })}
        </div>
  )}

      {
    /* Bottom Accessible Controls */
  }
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
    onClick={handleRepeatInstruction}
    className="flex-1 py-4 px-5 bg-white hover:bg-slate-50 text-[#0D7377] font-extrabold text-base rounded-2xl border-2 border-[#0D7377]/30 shadow-xs flex items-center justify-center gap-2.5 transition active:scale-98"
  >
          <Volume2 className="w-5 h-5 text-[#0D7377]" />
          <span>{t.repeatInstruction}</span>
        </button>

        <button
    onClick={() => finishGame()}
    className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition"
  >
          Skip to Result
        </button>
      </div>

    </div>;
};
