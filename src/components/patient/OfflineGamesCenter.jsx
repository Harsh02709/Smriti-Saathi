import { useState, useEffect } from "react";
import { initialOfflineGames, initialOfflineGameRecords } from "../../data/initialData";
import { translations } from "../../data/translations";
import {
  Wifi,
  WifiOff,
  RotateCw,
  CheckCircle2,
  Clock,
  Award,
  ChevronLeft,
  Play,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";
const FAMILIAR_OBJECTS = [
  { id: "mango", name: "Mango (Aam)", icon: "\u{1F96D}", category: "Fruit" },
  { id: "banana", name: "Banana (Kela)", icon: "\u{1F34C}", category: "Fruit" },
  { id: "apple", name: "Apple (Seb)", icon: "\u{1F34E}", category: "Fruit" },
  { id: "tea", name: "Tea Cup (Chai)", icon: "\u2615", category: "Drink" },
  { id: "flower", name: "Marigold (Genda)", icon: "\u{1F33C}", category: "Flower" },
  { id: "rose", name: "Rose (Gulab)", icon: "\u{1F339}", category: "Flower" },
  { id: "lamp", name: "Oil Lamp (Diya)", icon: "\u{1FA94}", category: "Home" },
  { id: "bell", name: "Temple Bell (Ghanti)", icon: "\u{1F514}", category: "Home" },
  { id: "pot", name: "Clay Pot (Matka)", icon: "\u{1F3FA}", category: "Home" },
  { id: "book", name: "Holy Book (Granth)", icon: "\u{1F4D6}", category: "Reading" },
  { id: "umbrella", name: "Umbrella (Chhata)", icon: "\u2602\uFE0F", category: "Utility" },
  { id: "peacock", name: "Peacock (Mor)", icon: "\u{1F99A}", category: "Bird" }
];
const ROUTINE_STEPS = [
  { id: "wake", order: 1, label: "Wake Up & Wash Up", icon: "\u{1F305}", time: "06:00 AM" },
  { id: "breakfast", order: 2, label: "Warm Breakfast & Tea", icon: "\u{1F963}", time: "08:30 AM" },
  { id: "medicine", order: 3, label: "Morning Medicine & Water", icon: "\u{1F48A}", time: "09:00 AM" },
  { id: "walk", order: 4, label: "Gentle Garden Walk", icon: "\u{1F6B6}", time: "10:30 AM" }
];
const SHAPES_LIST = [
  { id: "circle", name: "Circle", symbol: "\u{1F534}", color: "text-rose-500" },
  { id: "square", name: "Square", symbol: "\u{1F7E6}", color: "text-blue-500" },
  { id: "triangle", name: "Triangle", symbol: "\u{1F53A}", color: "text-amber-500" },
  { id: "star", name: "Star", symbol: "\u2B50", color: "text-yellow-500" },
  { id: "diamond", name: "Diamond", symbol: "\u{1F536}", color: "text-orange-500" }
];
export const OfflineGamesCenter = ({
  profile,
  onBack,
  onRecordGameResult,
  onOpenCaregiverCall
}) => {
  const t = translations[profile.language];
  const [gamesList] = useState(initialOfflineGames);
  const [activeGameId, setActiveGameId] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [savedRecords, setSavedRecords] = useState(() => {
    try {
      const stored = localStorage.getItem("brainboost_offline_records");
      return stored ? JSON.parse(stored) : initialOfflineGameRecords;
    } catch {
      return initialOfflineGameRecords;
    }
  });
  const [gameState, setGameState] = useState("intro");
  const [gameTimer, setGameTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [wrongMatches, setWrongMatches] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [recallTargetList, setRecallTargetList] = useState([]);
  const [recallOptionsList, setRecallOptionsList] = useState([]);
  const [recallSelectedIds, setRecallSelectedIds] = useState([]);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [targetNumberSeq, setTargetNumberSeq] = useState("");
  const [enteredNumberSeq, setEnteredNumberSeq] = useState("");
  const [targetPattern, setTargetPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  const [findTarget, setFindTarget] = useState(null);
  const [findGrid, setFindGrid] = useState([]);
  const [shuffledRoutine, setShuffledRoutine] = useState([]);
  const [userRoutineOrder, setUserRoutineOrder] = useState([]);
  const [puzzlePieces, setPuzzlePieces] = useState([3, 1, 4, 2]);
  const [targetShape, setTargetShape] = useState(null);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [wordPicTarget, setWordPicTarget] = useState(null);
  const [wordPicOptions, setWordPicOptions] = useState([]);
  const [countObject, setCountObject] = useState(null);
  const [countActualNumber, setCountActualNumber] = useState(4);
  const [countOptions, setCountOptions] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const lang = profile?.language || "en";
      const isHindi = lang === "hi";
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = isHindi ? "hi-IN" : "en-US";
      utt.rate = isHindi ? 0.82 : 0.85;
      utt.pitch = 1.05;
      // Select best matching voice for Hindi matra pronunciation
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const targetLang = isHindi ? "hi-IN" : "en-US";
        const preferred =
          voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
          voices.find((v) => v.lang === targetLang) ||
          voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2))) ||
          null;
        if (preferred) utt.voice = preferred;
      }
      window.speechSynthesis.speak(utt);
    }
  };
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setGameTimer((prev) => prev + 1);
      }, 1e3);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);
  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncMessage("\u{1F504} Syncing your activities...");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage("\u2705 All activities synced");
      setSavedRecords((prev) => prev.map((r) => ({ ...r, synced: true })));
      try {
        localStorage.setItem(
          "brainboost_offline_records",
          JSON.stringify(savedRecords.map((r) => ({ ...r, synced: true })))
        );
      } catch {
      }
      setTimeout(() => setSyncMessage(""), 4e3);
    }, 1500);
  };
  const toggleNetwork = (offline) => {
    setIsSimulatedOffline(offline);
    if (!offline) {
      handleSyncNow();
    }
  };
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const formatSummaryTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s} sec`;
    return `${m} min ${s} sec`;
  };
  const saveGameRecord = (score, accuracy, errs, atts) => {
    const activeGame = gamesList.find((g) => g.id === activeGameId);
    const newRec = {
      id: `off-rec-${Date.now()}`,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      gameId: activeGameId || "off-1-mem",
      gameTitle: activeGame?.title || "Memory Match",
      difficulty: selectedDifficulty,
      score,
      accuracy,
      errors: errs,
      attempts: atts,
      completionTimeSeconds: gameTimer,
      reactionTimeMs: 1400 + Math.floor(Math.random() * 500),
      synced: !isSimulatedOffline
    };
    const updated = [newRec, ...savedRecords];
    setSavedRecords(updated);
    try {
      localStorage.setItem("brainboost_offline_records", JSON.stringify(updated));
    } catch {
    }
    onRecordGameResult(newRec);
    if (accuracy < 55) {
      setShowAlertModal(true);
    }
  };
  const finishGameSession = (score, accuracy, errs, atts) => {
    setTimerRunning(false);
    setFinalScore(score);
    setFinalAccuracy(accuracy);
    setGameState("finished");
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch {
    }
    saveGameRecord(score, accuracy, errs, atts);
  };
  const startMemoryMatch = () => {
    let pairCount = 3;
    if (selectedDifficulty === "Medium") pairCount = 6;
    if (selectedDifficulty === "Hard") pairCount = 8;
    const chosen = FAMILIAR_OBJECTS.slice(0, pairCount);
    const cardDeck = [...chosen, ...chosen].sort(() => Math.random() - 0.5).map((item, idx) => ({
      id: idx,
      objId: item.id,
      icon: item.icon,
      name: item.name,
      isFlipped: false,
      isMatched: false
    }));
    setCards(cardDeck);
    setFlippedIndices([]);
    setAttempts(0);
    setCorrectMatches(0);
    setWrongMatches(0);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText("Find two matching pictures. Take your time.");
  };
  const handleCardClick = (idx) => {
    if (cards[idx].isFlipped || cards[idx].isMatched || flippedIndices.length >= 2) return;
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);
    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      setAttempts((prev) => prev + 1);
      if (cards[firstIdx].objId === cards[secondIdx].objId) {
        setTimeout(() => {
          setCards(
            (prev) => prev.map(
              (c, i) => i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setCorrectMatches((m) => {
            const nextM = m + 1;
            const totalPairs = cards.length / 2;
            if (nextM >= totalPairs) {
              const acc = Math.max(50, Math.round(totalPairs / (attempts + 1) * 100));
              const score = Math.round(acc * 0.9 + 10);
              finishGameSession(score, acc, wrongMatches, attempts + 1);
            }
            return nextM;
          });
        }, 500);
      } else {
        setWrongMatches((w) => w + 1);
        setTimeout(() => {
          setCards(
            (prev) => prev.map(
              (c, i) => i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };
  const startPictureRecall = () => {
    const count = selectedDifficulty === "Easy" ? 4 : selectedDifficulty === "Medium" ? 6 : 8;
    const shuffled = [...FAMILIAR_OBJECTS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, count);
    const extra = shuffled.slice(count, count + 4);
    const options = [...targets, ...extra].sort(() => Math.random() - 0.5);
    setRecallTargetList(targets);
    setRecallOptionsList(options);
    setRecallSelectedIds([]);
    setCountdownSeconds(count + 2);
    setGameState("memorizing");
    setGameTimer(0);
    setTimerRunning(true);
    speakText(`Remember these ${count} objects.`);
    let timer = count + 2;
    const cd = setInterval(() => {
      timer -= 1;
      setCountdownSeconds(timer);
      if (timer <= 0) {
        clearInterval(cd);
        setGameState("playing");
        speakText("Select the objects you saw.");
      }
    }, 1e3);
  };
  const startNumberRecall = () => {
    const len = selectedDifficulty === "Easy" ? 3 : selectedDifficulty === "Medium" ? 4 : 5;
    let seq = "";
    for (let i = 0; i < len; i++) {
      seq += Math.floor(Math.random() * 9 + 1).toString();
    }
    setTargetNumberSeq(seq);
    setEnteredNumberSeq("");
    setGameState("memorizing");
    setCountdownSeconds(4);
    setGameTimer(0);
    setTimerRunning(true);
    speakText(`Remember these numbers: ${seq.split("").join(" ")}`);
    let timer = 4;
    const cd = setInterval(() => {
      timer -= 1;
      setCountdownSeconds(timer);
      if (timer <= 0) {
        clearInterval(cd);
        setGameState("playing");
        speakText("Enter the numbers in the same order.");
      }
    }, 1e3);
  };
  const startPatternRecall = () => {
    const count = selectedDifficulty === "Easy" ? 3 : selectedDifficulty === "Medium" ? 4 : 5;
    const pattern = [];
    while (pattern.length < count) {
      const cell = Math.floor(Math.random() * 9);
      if (!pattern.includes(cell)) pattern.push(cell);
    }
    setTargetPattern(pattern);
    setUserPattern([]);
    setGameState("memorizing");
    setCountdownSeconds(4);
    setGameTimer(0);
    setTimerRunning(true);
    speakText("Remember the highlighted colored squares.");
    let timer = 4;
    const cd = setInterval(() => {
      timer -= 1;
      setCountdownSeconds(timer);
      if (timer <= 0) {
        clearInterval(cd);
        setGameState("playing");
        speakText("Recreate the pattern by tapping the squares.");
      }
    }, 1e3);
  };
  const startFindTheObject = () => {
    const shuffled = [...FAMILIAR_OBJECTS].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const gridCount = selectedDifficulty === "Easy" ? 6 : selectedDifficulty === "Medium" ? 9 : 12;
    const grid = [...shuffled.slice(0, gridCount)].sort(() => Math.random() - 0.5);
    setFindTarget(target);
    setFindGrid(grid);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText(`Find the ${target.name}.`);
  };
  const startDailyRoutineRecall = () => {
    const shuffled = [...ROUTINE_STEPS].sort(() => Math.random() - 0.5);
    setShuffledRoutine(shuffled);
    setUserRoutineOrder([]);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText("Put the daily activities in order from morning to afternoon.");
  };
  const startSimplePuzzle = () => {
    setPuzzlePieces([3, 1, 4, 2]);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText("Tap pieces to put them in the correct 1, 2, 3, 4 order.");
  };
  const startShapeMatching = () => {
    const target = SHAPES_LIST[Math.floor(Math.random() * SHAPES_LIST.length)];
    const options = [...SHAPES_LIST].sort(() => Math.random() - 0.5);
    setTargetShape(target);
    setShapeOptions(options);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText(`Find the matching shape: ${target.name}.`);
  };
  const startWordPicMatch = () => {
    const shuffled = [...FAMILIAR_OBJECTS].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    const otherNames = shuffled.slice(1, 4).map((o) => o.name);
    const allOptions = [target.name, ...otherNames].sort(() => Math.random() - 0.5);
    setWordPicTarget(target);
    setWordPicOptions(allOptions);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText(`Look at the picture and select the matching word.`);
  };
  const startSimpleCounting = () => {
    const obj = FAMILIAR_OBJECTS[Math.floor(Math.random() * FAMILIAR_OBJECTS.length)];
    const count = selectedDifficulty === "Easy" ? 3 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 4);
    const opts = [count, count - 1, count + 1, count + 2].sort(() => Math.random() - 0.5);
    setCountObject(obj);
    setCountActualNumber(count);
    setCountOptions(opts);
    setGameTimer(0);
    setTimerRunning(true);
    setGameState("playing");
    speakText(`Count how many ${obj.name.split(" ")[0]}s are on the screen.`);
  };
  const handleLaunchGame = (gameId) => {
    setActiveGameId(gameId);
    setGameState("intro");
    if (gameId === "off-1-mem") startMemoryMatch();
    else if (gameId === "off-2-pic") startPictureRecall();
    else if (gameId === "off-3-num") startNumberRecall();
    else if (gameId === "off-4-pat") startPatternRecall();
    else if (gameId === "off-5-find") startFindTheObject();
    else if (gameId === "off-6-routine") startDailyRoutineRecall();
    else if (gameId === "off-7-puzzle") startSimplePuzzle();
    else if (gameId === "off-8-shape") startShapeMatching();
    else if (gameId === "off-9-wordpic") startWordPicMatch();
    else if (gameId === "off-10-count") startSimpleCounting();
  };
  const handleRestartActive = () => {
    if (activeGameId) handleLaunchGame(activeGameId);
  };
  if (gameState === "finished") {
    return <div className="max-w-md mx-auto px-4 py-8 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-200 text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-700 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#0A2540] tracking-tight uppercase">
              🎉 GREAT JOB!
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">
              {gamesList.find((g) => g.id === activeGameId)?.title || "Game Completed"}
            </p>
          </div>

          {
      /* Key Summary Stats */
    }
          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-600">Time:</span>
              <span className="text-base font-black text-[#0D7377]">
                {formatSummaryTime(gameTimer)}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-600">Accuracy:</span>
              <span className="text-base font-black text-[#28B463]">
                {finalAccuracy}%
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-600">Attempts:</span>
              <span className="text-base font-black text-slate-800">
                {attempts || 1}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">Difficulty:</span>
              <span className="text-xs font-black uppercase bg-teal-100 text-[#0D7377] px-2.5 py-1 rounded-full">
                {selectedDifficulty}
              </span>
            </div>
          </div>

          {
      /* Offline Sync Confirmation Badge */
    }
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 flex items-center gap-3 text-left">
            <ShieldCheck className="w-6 h-6 text-[#0D7377] shrink-0" />
            <p className="text-xs font-bold text-[#0D7377] leading-relaxed">
              {isSimulatedOffline ? "Your score is safely saved locally on this device. It will automatically sync when internet reconnects." : "Your score has been safely saved and synced to your wellness record."}
            </p>
          </div>

          {
      /* Action Buttons */
    }
          <div className="space-y-2.5">
            <button
      onClick={() => {
        setActiveGameId(null);
        setGameState("intro");
      }}
      className="w-full py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white rounded-2xl font-black text-lg shadow-md transition active:scale-98 cursor-pointer"
    >
              CONTINUE
            </button>

            <button
      onClick={handleRestartActive}
      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition cursor-pointer"
    >
              Play Again
            </button>
          </div>
        </div>
      </div>;
  }
  if (activeGameId) {
    const activeGame = gamesList.find((g) => g.id === activeGameId);
    return <div className="max-w-lg mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200 select-none">
        
        {
      /* Game Navigation Header */
    }
        <div className="flex items-center justify-between bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200">
          <button
      onClick={() => setActiveGameId(null)}
      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-sm py-1 px-2.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
    >
            <ChevronLeft className="w-5 h-5" />
            Games
          </button>

          <div className="text-center">
            <span className="text-[10px] font-black uppercase bg-teal-50 text-[#0D7377] px-2 py-0.5 rounded-md border border-teal-200">
              {activeGame?.domain || "Cognitive"}
            </span>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {activeGame?.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 font-mono font-bold text-sm text-[#0D7377] bg-[#F3F8F7] px-3 py-1.5 rounded-xl border border-teal-200">
            <Clock className="w-4 h-4" />
            {formatTime(gameTimer)}
          </div>
        </div>

        {
      /* Difficulty Selector */
    }
        <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-500 pl-2">Difficulty:</span>
          <div className="flex items-center gap-1.5">
            {["Easy", "Medium", "Hard"].map((diff) => <button
      key={diff}
      onClick={() => {
        setSelectedDifficulty(diff);
        setTimeout(() => handleLaunchGame(activeGameId), 50);
      }}
      className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${selectedDifficulty === diff ? "bg-[#0D7377] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
    >
                {diff}
              </button>)}
          </div>
        </div>

        {
      /* ---------------- 1. MEMORY MATCH ---------------- */
    }
        {activeGameId === "off-1-mem" && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-slate-600">
                "Find two matching pictures."
              </p>
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
                <span>Pairs: {correctMatches} / {cards.length / 2}</span>
                <span>Attempts: {attempts}</span>
              </div>
            </div>

            <div
      className={`grid gap-2.5 ${cards.length <= 6 ? "grid-cols-3" : cards.length <= 12 ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-4"}`}
    >
              {cards.map((card, idx) => <button
      key={card.id}
      onClick={() => handleCardClick(idx)}
      disabled={card.isFlipped || card.isMatched}
      className={`h-24 sm:h-28 rounded-2xl font-black text-3xl sm:text-4xl flex flex-col items-center justify-center border-2 transition-all transform active:scale-95 cursor-pointer shadow-xs ${card.isMatched ? "bg-emerald-50 border-emerald-300 opacity-90" : card.isFlipped ? "bg-teal-50 border-[#0D7377] scale-102" : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-teal-400"}`}
    >
                  {card.isFlipped || card.isMatched ? <>
                      <span>{card.icon}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-700 mt-1 text-center px-1 truncate max-w-full">
                        {card.name.split(" ")[0]}
                      </span>
                    </> : <span className="text-2xl text-slate-400">❓</span>}
                </button>)}
            </div>
          </div>}

        {
      /* ---------------- 2. PICTURE RECALL ---------------- */
    }
        {activeGameId === "off-2-pic" && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            {gameState === "memorizing" ? <div className="text-center space-y-4 py-4">
                <span className="text-xs font-black uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full animate-pulse">
                  Memorize These ({countdownSeconds}s remaining)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recallTargetList.map((obj) => <div
      key={obj.id}
      className="p-3 bg-teal-50 border-2 border-teal-300 rounded-2xl flex flex-col items-center justify-center"
    >
                      <span className="text-4xl">{obj.icon}</span>
                      <span className="text-xs font-bold text-slate-800 mt-1">{obj.name}</span>
                    </div>)}
                </div>
              </div> : <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-600">
                    Which objects did you see earlier? ({recallSelectedIds.length} / {recallTargetList.length} selected)
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {recallOptionsList.map((obj) => {
      const isSelected = recallSelectedIds.includes(obj.id);
      return <button
        key={obj.id}
        onClick={() => {
          const updated = isSelected ? recallSelectedIds.filter((id) => id !== obj.id) : [...recallSelectedIds, obj.id];
          setRecallSelectedIds(updated);
        }}
        className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer ${isSelected ? "bg-[#0D7377] text-white border-[#0D7377]" : "bg-white border-slate-200 text-slate-800 hover:border-teal-300"}`}
      >
                        <span className="text-3xl">{obj.icon}</span>
                        <span className="text-xs font-bold mt-1 text-center truncate max-w-full">
                          {obj.name}
                        </span>
                      </button>;
    })}
                </div>

                <button
      onClick={() => {
        const correctCount = recallSelectedIds.filter(
          (id) => recallTargetList.some((t2) => t2.id === id)
        ).length;
        const acc = Math.round(correctCount / recallTargetList.length * 100);
        finishGameSession(acc, acc, recallTargetList.length - correctCount, 1);
      }}
      className="w-full py-3.5 bg-[#28B463] text-white font-black text-base rounded-2xl shadow-sm transition active:scale-98 cursor-pointer"
    >
                  CHECK MY CHOICES
                </button>
              </div>}
          </div>}

        {
      /* ---------------- 3. NUMBER RECALL ---------------- */
    }
        {activeGameId === "off-3-num" && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            {gameState === "memorizing" ? <div className="text-center space-y-4 py-8">
                <span className="text-xs font-black uppercase bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Memorize the Numbers ({countdownSeconds}s)
                </span>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-[#0D7377]">
                  {targetNumberSeq}
                </div>
              </div> : <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-500">Enter in same order:</span>
                  <div className="h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl font-mono font-black text-[#0D7377] tracking-widest border border-slate-300 mt-1">
                    {enteredNumberSeq || "\u2014"}
                  </div>
                </div>

                {
      /* Keypad */
    }
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => <button
      key={num}
      onClick={() => {
        if (enteredNumberSeq.length < targetNumberSeq.length) {
          setEnteredNumberSeq((prev) => prev + num);
        }
      }}
      className="h-12 bg-slate-50 hover:bg-slate-200 rounded-xl text-xl font-black text-slate-800 border border-slate-200 transition cursor-pointer active:scale-95"
    >
                      {num}
                    </button>)}
                  <button
      onClick={() => setEnteredNumberSeq("")}
      className="h-12 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-700 border border-rose-200 cursor-pointer"
    >
                    CLEAR
                  </button>
                  <button
      onClick={() => {
        if (enteredNumberSeq.length < targetNumberSeq.length) {
          setEnteredNumberSeq((prev) => prev + "0");
        }
      }}
      className="h-12 bg-slate-50 hover:bg-slate-200 rounded-xl text-xl font-black text-slate-800 border border-slate-200 cursor-pointer"
    >
                    0
                  </button>
                  <button
      onClick={() => {
        const isCorrect = enteredNumberSeq === targetNumberSeq;
        const acc = isCorrect ? 100 : 50;
        finishGameSession(acc, acc, isCorrect ? 0 : 1, 1);
      }}
      className="h-12 bg-[#28B463] hover:bg-emerald-600 rounded-xl text-xs font-black text-white cursor-pointer"
    >
                    DONE ✓
                  </button>
                </div>
              </div>}
          </div>}

        {
      /* ---------------- 4. PATTERN RECALL ---------------- */
    }
        {activeGameId === "off-4-pat" && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-600">
                {gameState === "memorizing" ? `Remember the lit squares (${countdownSeconds}s)` : "Tap the squares that were lit"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto py-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
      const isTarget = targetPattern.includes(idx);
      const isUserSelected = userPattern.includes(idx);
      const isLit = gameState === "memorizing" && isTarget || isUserSelected;
      return <button
        key={idx}
        disabled={gameState === "memorizing"}
        onClick={() => {
          const nextPattern = userPattern.includes(idx) ? userPattern.filter((i) => i !== idx) : [...userPattern, idx];
          setUserPattern(nextPattern);
        }}
        className={`h-20 sm:h-22 rounded-2xl border-2 transition-all cursor-pointer ${isLit ? "bg-amber-400 border-amber-500 shadow-md scale-102" : "bg-slate-100 border-slate-200 hover:border-amber-300"}`}
      />;
    })}
            </div>

            {gameState === "playing" && <button
      onClick={() => {
        const correctCount = userPattern.filter(
          (idx) => targetPattern.includes(idx)
        ).length;
        const acc = Math.round(correctCount / targetPattern.length * 100);
        finishGameSession(acc, acc, targetPattern.length - correctCount, 1);
      }}
      className="w-full py-3.5 bg-[#28B463] text-white font-black text-base rounded-2xl shadow-sm transition active:scale-98 cursor-pointer"
    >
                CHECK PATTERN
              </button>}
          </div>}

        {
      /* ---------------- 5. FIND THE OBJECT ---------------- */
    }
        {activeGameId === "off-5-find" && findTarget && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center bg-teal-50 p-3 rounded-2xl border border-teal-200">
              <span className="text-[11px] font-bold text-[#0D7377] uppercase block">
                Target To Find
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-3xl">{findTarget.icon}</span>
                <span className="text-base font-black text-slate-800">{findTarget.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {findGrid.map((item, idx) => <button
      key={idx}
      onClick={() => {
        if (item.id === findTarget.id) {
          finishGameSession(100, 100, 0, 1);
        } else {
          speakText("Try looking again gently.");
        }
      }}
      className="h-20 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer active:scale-95"
    >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-bold text-slate-600 mt-1 truncate max-w-full px-1">
                    {item.name.split(" ")[0]}
                  </span>
                </button>)}
            </div>
          </div>}

        {
      /* ---------------- 6. DAILY ROUTINE RECALL ---------------- */
    }
        {activeGameId === "off-6-routine" && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-600">
                Arrange daily activities from morning to afternoon:
              </p>
            </div>

            {
      /* Selected Sequence */
    }
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500">Your Chosen Order:</span>
              <div className="min-h-[60px] bg-slate-50 border border-slate-200 rounded-2xl p-2 flex flex-wrap gap-2">
                {userRoutineOrder.length === 0 ? <span className="text-xs text-slate-400 italic m-auto">
                    Tap the cards below in correct sequence
                  </span> : userRoutineOrder.map((step, idx) => <div
      key={step.id}
      className="bg-[#0D7377] text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
    >
                      <span>{idx + 1}.</span>
                      <span>{step.icon}</span>
                      <span>{step.label}</span>
                    </div>)}
              </div>
            </div>

            {
      /* Available Choices */
    }
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500">Tap to Select:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {shuffledRoutine.map((step) => {
      const isSelected = userRoutineOrder.some((s) => s.id === step.id);
      return <button
        key={step.id}
        disabled={isSelected}
        onClick={() => {
          setUserRoutineOrder((prev) => [...prev, step]);
        }}
        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${isSelected ? "bg-slate-100 border-slate-200 opacity-50" : "bg-white border-slate-200 hover:border-teal-300"}`}
      >
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{step.label}</h4>
                        <p className="text-[10px] text-slate-500">{step.time}</p>
                      </div>
                    </button>;
    })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
      onClick={() => setUserRoutineOrder([])}
      className="py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
    >
                Reset Order
              </button>
              <button
      disabled={userRoutineOrder.length < ROUTINE_STEPS.length}
      onClick={() => {
        const correctCount = userRoutineOrder.filter(
          (step, idx) => step.order === idx + 1
        ).length;
        const acc = Math.round(correctCount / ROUTINE_STEPS.length * 100);
        finishGameSession(acc, acc, ROUTINE_STEPS.length - correctCount, 1);
      }}
      className="flex-1 py-3.5 bg-[#28B463] disabled:bg-slate-300 text-white font-black text-sm rounded-2xl shadow-sm cursor-pointer"
    >
                SUBMIT ROUTINE
              </button>
            </div>
          </div>}

        {
      /* ---------------- 7. SIMPLE PUZZLE ---------------- */
    }
        {activeGameId === "off-7-puzzle" && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-600">
                Tap adjacent pieces to sort into order: 1, 2, 3, 4
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              {puzzlePieces.map((val, idx) => <button
      key={idx}
      onClick={() => {
        const next = [...puzzlePieces];
        const swapIdx = (idx + 1) % 4;
        const temp = next[idx];
        next[idx] = next[swapIdx];
        next[swapIdx] = temp;
        setPuzzlePieces(next);
        if (next.join("") === "1234") {
          finishGameSession(100, 100, 0, 1);
        }
      }}
      className="h-28 bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer"
    >
                  <span className="text-3xl font-black text-[#0D7377]">Piece #{val}</span>
                  <span className="text-[10px] text-slate-500 font-bold mt-1">Tap to Shift</span>
                </button>)}
            </div>

            <button
      onClick={() => {
        const isSolved = puzzlePieces.join("") === "1234";
        const acc = isSolved ? 100 : 75;
        finishGameSession(acc, acc, isSolved ? 0 : 1, 1);
      }}
      className="w-full py-3.5 bg-[#28B463] text-white font-black text-sm rounded-2xl shadow-sm cursor-pointer"
    >
              DONE
            </button>
          </div>}

        {
      /* ---------------- 8. SHAPE MATCHING ---------------- */
    }
        {activeGameId === "off-8-shape" && targetShape && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-[11px] font-bold text-[#0D7377] uppercase block">
                Target Shape
              </span>
              <div className="text-5xl mt-2">{targetShape.symbol}</div>
              <span className="text-base font-black text-slate-800 mt-1 block">
                {targetShape.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shapeOptions.map((shp) => <button
      key={shp.id}
      onClick={() => {
        const isMatch = shp.id === targetShape.id;
        const acc = isMatch ? 100 : 50;
        finishGameSession(acc, acc, isMatch ? 0 : 1, 1);
      }}
      className="h-24 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer"
    >
                  <span className="text-3xl">{shp.symbol}</span>
                  <span className="text-xs font-bold text-slate-700 mt-1">{shp.name}</span>
                </button>)}
            </div>
          </div>}

        {
      /* ---------------- 9. WORD / PICTURE MATCH ---------------- */
    }
        {activeGameId === "off-9-wordpic" && wordPicTarget && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center bg-teal-50 p-5 rounded-2xl border border-teal-200">
              <span className="text-[11px] font-bold text-[#0D7377] uppercase block">
                Which word matches this picture?
              </span>
              <div className="text-6xl my-2">{wordPicTarget.icon}</div>
            </div>

            <div className="space-y-2.5">
              {wordPicOptions.map((opt, idx) => <button
      key={idx}
      onClick={() => {
        const isMatch = opt === wordPicTarget.name;
        const acc = isMatch ? 100 : 50;
        finishGameSession(acc, acc, isMatch ? 0 : 1, 1);
      }}
      className="w-full py-4 px-5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-2xl font-black text-base text-slate-800 text-left flex items-center justify-between transition cursor-pointer"
    >
                  <span>{opt}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </button>)}
            </div>
          </div>}

        {
      /* ---------------- 10. SIMPLE COUNTING ---------------- */
    }
        {activeGameId === "off-10-count" && countObject && <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-600">
                Count how many items are shown:
              </p>
            </div>

            <div className="bg-teal-50 p-6 rounded-2xl border border-teal-200 flex flex-wrap items-center justify-center gap-3 min-h-[140px]">
              {Array.from({ length: countActualNumber }).map((_, i) => <span key={i} className="text-4xl animate-in zoom-in duration-150">
                  {countObject.icon}
                </span>)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {countOptions.map((val) => <button
      key={val}
      onClick={() => {
        const isCorrect = val === countActualNumber;
        const acc = isCorrect ? 100 : 50;
        finishGameSession(acc, acc, isCorrect ? 0 : 1, 1);
      }}
      className="py-4 rounded-2xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-400 font-black text-2xl text-[#0D7377] transition cursor-pointer"
    >
                  {val}
                </button>)}
            </div>
          </div>}

      </div>;
  }
  return <div className="max-w-md mx-auto px-4 py-4 space-y-5 pb-28 select-none animate-in fade-in duration-200">
      
      {
    /* Top Header */
  }
      <div className="flex items-center justify-between">
        <button
    onClick={onBack}
    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-sm py-1.5 px-3 rounded-xl hover:bg-slate-100 transition cursor-pointer"
  >
          <ChevronLeft className="w-5 h-5" />
          Dashboard
        </button>

        <div className="flex items-center gap-2">
          {
    /* Offline / Online Network Simulator Switch */
  }
          <button
    onClick={() => toggleNetwork(!isSimulatedOffline)}
    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${isSimulatedOffline ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-emerald-100 text-emerald-900 border-emerald-300"}`}
  >
            {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isSimulatedOffline ? "Offline Mode" : "Online Mode"}</span>
          </button>
        </div>
      </div>

      {
    /* Main Hero Card for Offline Center */
  }
      <div className="bg-gradient-to-br from-[#0D7377] to-[#148A85] rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-[#0D7377]/25 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-[#9DF3C4]">
              OFFLINE GAME CENTER
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
              🎮 PLAY OFFLINE
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed mt-1">
              "No internet? You can still play these games. Your results will be saved and synced automatically when internet returns."
            </p>
          </div>
        </div>

        {
    /* Sync Status Banner */
  }
        {syncMessage ? <div className="bg-white/20 rounded-2xl p-2.5 flex items-center gap-2 text-xs font-bold text-[#9DF3C4]">
            <RotateCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{syncMessage}</span>
          </div> : isSimulatedOffline ? <div className="bg-white/15 rounded-2xl p-2.5 flex items-center justify-between text-xs font-semibold text-teal-100">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-300" />
              <span>📶 OFFLINE MODE · Saving on this device</span>
            </div>
            <button
    onClick={handleSyncNow}
    className="px-2.5 py-1 rounded-lg bg-white text-[#0D7377] font-extrabold text-[11px] hover:bg-teal-50 transition cursor-pointer"
  >
              Sync Now
            </button>
          </div> : <div className="bg-white/15 rounded-2xl p-2.5 flex items-center gap-2 text-xs font-bold text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>✅ All activities synced</span>
          </div>}
      </div>

      {
    /* 10 Large Offline Game Cards */
  }
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#0A2540] uppercase tracking-tight">
            AVAILABLE OFFLINE GAMES (10)
          </h3>
          <span className="text-[11px] font-bold text-[#0D7377]">
            NO INTERNET NEEDED
          </span>
        </div>

        <div className="space-y-3">
          {gamesList.map((game, idx) => <div
    key={game.id}
    className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200 flex items-center justify-between gap-3 hover:border-teal-300 hover:shadow-md transition group"
  >
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-teal-50 text-[#0D7377] flex items-center justify-center font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {idx === 0 ? "\u{1F9E0}" : idx === 1 ? "\u{1F5BC}\uFE0F" : idx === 2 ? "\u{1F522}" : idx === 3 ? "\u{1F3A8}" : idx === 4 ? "\u{1F440}" : idx === 5 ? "\u{1F4C5}" : idx === 6 ? "\u{1F9E9}" : idx === 7 ? "\u{1F537}" : idx === 8 ? "\u{1F524}" : "\u{1F9EE}"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      OFFLINE AVAILABLE
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {game.domain}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    {game.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[200px] sm:max-w-xs">
                    {game.description}
                  </p>
                </div>
              </div>

              <button
    onClick={() => handleLaunchGame(game.id)}
    className="py-3 px-5 rounded-2xl bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-xs shrink-0 transition active:scale-95 cursor-pointer"
  >
                <span>PLAY</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>)}
        </div>
      </div>

      {
    /* AI Longitudinal Performance Change Alert Modal (Requirement 6) */
  }
      {showAlertModal && <div className="fixed inset-0 z-[20000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  AI Wellness Observation
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  PERFORMANCE CHANGE DETECTED
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Memory performance is below the patient's recent personal baseline.
            </p>

            {
    /* Comparison Metrics */
  }
            <div className="grid grid-cols-2 gap-2.5 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">Accuracy</span>
                <span className="text-lg font-black text-amber-900">45%</span>
                <span className="text-[10px] text-slate-500 block">Recent baseline: 70–80%</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">Completion time</span>
                <span className="text-lg font-black text-amber-900">10 minutes</span>
                <span className="text-[10px] text-slate-500 block">Recent baseline: 6–8 min</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              * Note: This is an assistive cognitive trend observation and does not provide medical diagnosis. Please review persistent changes with caregiver or doctor.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
    onClick={() => {
      setShowAlertModal(false);
      onBack();
    }}
    className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition cursor-pointer"
  >
                VIEW ANALYSIS
              </button>
              <button
    onClick={() => {
      setShowAlertModal(false);
      onOpenCaregiverCall();
    }}
    className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-md transition cursor-pointer"
  >
                CONTACT CAREGIVER
              </button>
            </div>
          </div>
        </div>}

    </div>;
};
