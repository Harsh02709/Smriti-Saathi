import { useState, useEffect, useRef } from "react";
import { translations } from "../../data/translations";
import {
  Brain,
  Volume2,
  Pause,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Award,
  Sun,
  Flame,
  Coffee,
  Bell,
  Feather,
  Music,
  Check,
  BookOpen,
  Umbrella,
  Key,
  Utensils,
  CloudRain,
  Home,
  ArrowUp,
  ArrowDown,
  Circle,
  Square,
  Triangle,
  Star,
  Glasses,
  Footprints,
  Pill,
  Flower2,
  HelpCircle,
  Video,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";
import { allUnifiedGames } from "../../data/unifiedGamesData";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import { LiveGameIndicator } from "../patient/LiveGameIndicator";
import {
  MorningStretchGraphic,
  MeditationGraphic,
  RobotAvatar
} from "../common/GraphicAssets";
import { MemoryArtGallery } from "./MemoryArtGallery";
import { HowToPlayModal } from "./HowToPlayModal";
export const AllGamesEngine = ({
  task,
  profile,
  onComplete,
  onBack,
  onSkip,
  isBeginnersMode = false,
  stepIndex = 0,
  totalSteps = 6,
  nextGameTitle = ""
}) => {
  const t = translations[profile.language];
  const {
    startLiveGame,
    recordEvent,
    pauseGame,
    resumeGame,
    completeGame,
    abandonGame,
    TRACKING_EVENT_TYPES
  } = useRealtimeTracking();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [score, setScore] = useState(92);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // How to Play and 30s Inactivity Auto-Guide States
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isHowToPlayAutoTriggered, setIsHowToPlayAutoTriggered] = useState(false);
  const lastInteractionTimeRef = useRef(Date.now());
  const hasAutoPromptedRef = useRef(false);

  // Register any user activity to reset the 30-second inactivity counter
  const registerUserActivity = () => {
    lastInteractionTimeRef.current = Date.now();
  };

  const handleOpenHowToPlay = () => {
    registerUserActivity();
    setIsHowToPlayAutoTriggered(false);
    setIsHowToPlayOpen(true);
  };

  // 30-Second Inactivity Watcher: Auto-open guide & voice assistance if inactive
  useEffect(() => {
    lastInteractionTimeRef.current = Date.now();
    hasAutoPromptedRef.current = false;

    const interval = setInterval(() => {
      if (isPaused || isCompleted || isHowToPlayOpen || hasAutoPromptedRef.current) return;
      const inactiveMs = Date.now() - lastInteractionTimeRef.current;
      if (inactiveMs >= 30000) {
        // 30 seconds of inactivity reached
        hasAutoPromptedRef.current = true;
        setIsHowToPlayAutoTriggered(true);
        setIsHowToPlayOpen(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCompleted, isHowToPlayOpen, task?.id]);

  // Initialize real-time telemetry tracking on mount
  useEffect(() => {
    startLiveGame(task, profile, {
      totalSteps: 10,
      difficulty: task.difficulty || "Medium"
    });

    return () => {
      // If unmounted without completion, mark abandoned
      if (!isCompleted) {
        abandonGame();
      }
    };
  }, [task.id]);

  const getGameType = () => {
    const id = (task.id || "").toLowerCase();
    const title = (task.title || "").toLowerCase();

    // 1. Strict ID Check First
    if (id.startsWith("game-5") || id === "game-5-sound") return "sound";
    if (id.startsWith("game-10") || id === "game-10-place") return "place";
    if (id.startsWith("game-11") || id === "game-11-story") return "story";
    if (id.startsWith("game-16") || id === "game-16-gallery") return "art_gallery";
    if (id.startsWith("game-12") || id === "game-12-stretch") return "stretch";
    if (id.startsWith("game-13") || id === "game-13-meditation") return "meditation";
    if (id.startsWith("game-14") || id === "game-14-crossword") return "crossword";
    if (id.startsWith("game-15") || id === "game-15-sudoku") return "sudoku";
    if (id.startsWith("game-9") || id === "game-9-routine") return "routine";
    if (id.startsWith("game-8") || id === "game-8-color") return "color_shape";
    if (id.startsWith("game-7") || id === "game-7-object") return "find_object";
    if (id.startsWith("game-4") || id === "game-4-pattern") return "pattern";
    if (id.startsWith("game-3") || id === "game-3-pic") return "picture";
    if (id.startsWith("game-2") || id === "game-2-num") return "number";
    if (id.startsWith("game-6") || id === "game-6-puzzle") return "puzzle";
    if (id.startsWith("game-1") || id === "game-1-mem") return "memory_match";

    // 2. Exact Title Keyword Matching with Strict Mutual Exclusion
    if (title.includes("sound") || title.includes("audio match") || title.includes("acoustic")) return "sound";
    if (title.includes("familiar place") || title.includes("nostalgia") || title.includes("place memory")) return "place";
    if (title.includes("story recall") || title.includes("cultural tale")) return "story";
    if (title.includes("art gallery") || title.includes("photo album") || title.includes("memory gallery")) return "art_gallery";
    if (title.includes("routine sequencing") || title.includes("daily routine") || title.includes("routine steps")) return "routine";
    if (title.includes("color & shape") || title.includes("color and shape") || title.includes("color match")) return "color_shape";
    if (title.includes("find the object") || title.includes("object identification") || title.includes("spot object")) return "find_object";
    if (title.includes("pattern recall") || title.includes("pattern recognition") || title.includes("pattern puzzle")) return "pattern";
    if (title.includes("picture recall") || title.includes("photo recall") || title.includes("picture memory")) return "picture";
    if (title.includes("number recall") || title.includes("digit recall") || title.includes("number memory")) return "number";
    if (title.includes("simple puzzle") || title.includes("shape puzzle") || title.includes("jigsaw")) return "puzzle";
    if (title.includes("morning stretch") || title.includes("stretch")) return "stretch";
    if (title.includes("meditation") || title.includes("breathing")) return "meditation";
    if (title.includes("crossword") || title.includes("words")) return "crossword";
    if (title.includes("sudoku")) return "sudoku";
    if (title.includes("memory match") || title.includes("memory cards")) return "memory_match";

    return "memory_match"; // Safe fallback
  };

  const activeGameType = getGameType();
  const isGame1Memory = activeGameType === "memory_match";
  const isGame2Number = activeGameType === "number";
  const isGame3Picture = activeGameType === "picture";
  const isGame4Pattern = activeGameType === "pattern";
  const isGame5Sound = activeGameType === "sound";
  const isGame6Puzzle = activeGameType === "puzzle";
  const isGame7FindObject = activeGameType === "find_object";
  const isGame8ColorShape = activeGameType === "color_shape";
  const isGame9Routine = activeGameType === "routine";
  const isGame10Place = activeGameType === "place";
  const isStoryRecall = activeGameType === "story";
  const isStretch = activeGameType === "stretch";
  const isMeditation = activeGameType === "meditation";
  const isCrossword = activeGameType === "crossword";
  const isSudoku = activeGameType === "sudoku";
  const isMemoryArtGallery = activeGameType === "art_gallery";
  const activeIsMemory = isGame1Memory;
  const playSoundEffect = (freq = 440, type = "sine", duration = 0.3) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
    }
  };
  useEffect(() => {
    if (isPaused || isCompleted) return;
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1e3);
    return () => clearInterval(timer);
  }, [isPaused, isCompleted]);
  const speakInstruction = (text) => {
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
  const finishGameWithScore = (finalScore, finalErrors = 0) => {
    setScore(finalScore);
    setErrorsCount(finalErrors);
    playSoundEffect(587.33, "sine", 0.6);
    try {
      confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
    } catch {
    }
    completeGame({
      finalScore,
      finalErrors,
      elapsedSeconds
    });

    if (isBeginnersMode) {
      if (onComplete) {
        onComplete(task.id, finalScore, finalScore, elapsedSeconds + 30, finalErrors);
      }
    } else {
      setIsCompleted(true);
      if (onComplete) {
        onComplete(task.id, finalScore, finalScore, elapsedSeconds + 30, finalErrors);
      }
    }
  };
  const initialMemTiles = [
    {
      id: 1,
      pairId: 1,
      name: "Warm Chai Tea",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
      bg: "bg-amber-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 2,
      pairId: 1,
      name: "Warm Chai Tea",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
      bg: "bg-amber-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 3,
      pairId: 2,
      name: "Golden Clay Diya",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80",
      bg: "bg-orange-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 4,
      pairId: 2,
      name: "Golden Clay Diya",
      image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80",
      bg: "bg-orange-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 5,
      pairId: 3,
      name: "Marigold Flowers",
      image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80",
      bg: "bg-yellow-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 6,
      pairId: 3,
      name: "Marigold Flowers",
      image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80",
      bg: "bg-yellow-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 7,
      pairId: 4,
      name: "Brass Temple Bell",
      image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80",
      bg: "bg-teal-50",
      isFlipped: false,
      isMatched: false
    },
    {
      id: 8,
      pairId: 4,
      name: "Brass Temple Bell",
      image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80",
      bg: "bg-teal-50",
      isFlipped: false,
      isMatched: false
    }
  ];
  const [memTiles, setMemTiles] = useState(() => [...initialMemTiles].sort(() => Math.random() - 0.5));
  const [selectedMemIndices, setSelectedMemIndices] = useState([]);
  const [memAttempts, setMemAttempts] = useState(0);
  const handleMemTileClick = (index) => {
    if (isPaused || isCompleted) return;
    if (memTiles[index].isFlipped || memTiles[index].isMatched) return;
    if (selectedMemIndices.length >= 2) return;
    playSoundEffect(440, "sine", 0.15);
    const newTiles = [...memTiles];
    newTiles[index].isFlipped = true;
    setMemTiles(newTiles);
    const newSelected = [...selectedMemIndices, index];
    setSelectedMemIndices(newSelected);
    if (newSelected.length === 2) {
      setMemAttempts((a) => a + 1);
      const idx1 = newSelected[0];
      const idx2 = newSelected[1];
      if (memTiles[idx1].pairId === memTiles[idx2].pairId) {
        playSoundEffect(659.25, "triangle", 0.3);
        recordEvent({
          eventType: TRACKING_EVENT_TYPES.ANSWER_CORRECT,
          stepNumber: memAttempts + 1,
          correct: true,
          instructionType: "IMAGE",
          description: `Matched pair: ${memTiles[idx1].name}`
        });
        setTimeout(() => {
          setMemTiles((prev) => {
            const updated = [...prev];
            updated[idx1].isMatched = true;
            updated[idx2].isMatched = true;
            return updated;
          });
          setSelectedMemIndices([]);
          const remaining = memTiles.filter((t2) => !t2.isMatched && t2.id !== memTiles[idx1].id && t2.id !== memTiles[idx2].id);
          if (remaining.length === 0) {
            const finalAcc = Math.max(70, Math.round(4 / Math.max(memAttempts + 1, 4) * 100));
            finishGameWithScore(finalAcc, errorsCount);
          }
        }, 350);
      } else {
        setErrorsCount((e) => e + 1);
        recordEvent({
          eventType: TRACKING_EVENT_TYPES.ANSWER_INCORRECT,
          stepNumber: memAttempts + 1,
          correct: false,
          instructionType: "IMAGE",
          description: `Mismatched: ${memTiles[idx1].name} & ${memTiles[idx2].name}`
        });
        setTimeout(() => {
          setMemTiles((prev) => {
            const updated = [...prev];
            updated[idx1].isFlipped = false;
            updated[idx2].isFlipped = false;
            return updated;
          });
          setSelectedMemIndices([]);
        }, 850);
      }
    }
  };
  const [numberRound, setNumberRound] = useState(1);
  const numberSeries = [
    { target: "7 3 9", clean: "739", label: "Level 1: 3 Digits" },
    { target: "5 8 2 4", clean: "5824", label: "Level 2: 4 Digits" }
  ];
  const [numberPhase, setNumberPhase] = useState("show");
  const [enteredNumber, setEnteredNumber] = useState("");
  const [numberSeconds, setNumberSeconds] = useState(4);
  useEffect(() => {
    if (!isGame2Number || numberPhase !== "show" || isCompleted) return;
    const interval = setInterval(() => {
      setNumberSeconds((s) => {
        if (s <= 1) {
          setNumberPhase("input");
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [isGame2Number, numberPhase, isCompleted, numberRound]);
  const handleNumberTap = (digit) => {
    if (numberPhase !== "input" || isCompleted) return;
    playSoundEffect(400 + parseInt(digit) * 40, "sine", 0.15);
    const next = enteredNumber + digit;
    setEnteredNumber(next);
    const currentTarget = numberSeries[numberRound - 1];
    if (next === currentTarget.clean) {
      playSoundEffect(784, "triangle", 0.3);
      if (numberRound < numberSeries.length) {
        setTimeout(() => {
          setNumberRound((r) => r + 1);
          setEnteredNumber("");
          setNumberSeconds(5);
          setNumberPhase("show");
        }, 500);
      } else {
        finishGameWithScore(96, errorsCount);
      }
    } else if (next.length >= currentTarget.clean.length) {
      setErrorsCount((e) => e + 1);
      playSoundEffect(220, "sawtooth", 0.2);
      setTimeout(() => setEnteredNumber(""), 600);
    }
  };
  const pictureObjects = [
    { id: "p1", name: "Brass Tea Kettle", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80", isShown: true },
    { id: "p2", name: "Traditional Umbrella", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80", isShown: true },
    { id: "p3", name: "Vintage Brass Key", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80", isShown: true },
    { id: "p4", name: "Clay Rice Bowl", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80", isShown: true },
    { id: "p5", name: "Temple Brass Bell", image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80", isShown: false },
    { id: "p6", name: "Peacock Feather", image: "https://images.unsplash.com/photo-1516715094483-75da7dee9758?auto=format&fit=crop&w=400&q=80", isShown: false },
    { id: "p7", name: "Reading Spectacles", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80", isShown: false },
    { id: "p8", name: "Morning Lotus", image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=400&q=80", isShown: false }
  ];
  const [picturePhase, setPicturePhase] = useState("memorize");
  const [selectedPictureIds, setSelectedPictureIds] = useState([]);
  const [pictureSecondsLeft, setPictureSecondsLeft] = useState(6);
  useEffect(() => {
    if (!isGame3Picture || picturePhase !== "memorize" || isCompleted) return;
    const interval = setInterval(() => {
      setPictureSecondsLeft((s) => {
        if (s <= 1) {
          setPicturePhase("select");
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [isGame3Picture, picturePhase, isCompleted]);
  const handleTogglePictureSelect = (id) => {
    if (picturePhase !== "select" || isCompleted) return;
    playSoundEffect(520, "sine", 0.15);
    const next = selectedPictureIds.includes(id) ? selectedPictureIds.filter((i) => i !== id) : [...selectedPictureIds, id];
    setSelectedPictureIds(next);
    const shownIds = pictureObjects.filter((p) => p.isShown).map((p) => p.id);
    if (shownIds.every((sid) => next.includes(sid)) && next.length === shownIds.length) {
      finishGameWithScore(98, errorsCount);
    }
  };
  const [patternSequence, setPatternSequence] = useState([0, 2, 1]);
  const [playerInputSequence, setPlayerInputSequence] = useState([]);
  const [activeLamp, setActiveLamp] = useState(null);
  const [isShowingPattern, setIsShowingPattern] = useState(true);
  const [patternRound, setPatternRound] = useState(1);
  useEffect(() => {
    if (!isGame4Pattern || isCompleted) return;
    setIsShowingPattern(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < patternSequence.length) {
        setActiveLamp(patternSequence[step]);
        playSoundEffect(300 + patternSequence[step] * 100, "sine", 0.2);
        setTimeout(() => setActiveLamp(null), 450);
        step++;
      } else {
        clearInterval(interval);
        setIsShowingPattern(false);
      }
    }, 850);
    return () => clearInterval(interval);
  }, [isGame4Pattern, isCompleted, patternRound]);
  const handleLampClick = (idx) => {
    if (isShowingPattern || isPaused || isCompleted) return;
    setActiveLamp(idx);
    playSoundEffect(300 + idx * 100, "sine", 0.2);
    setTimeout(() => setActiveLamp(null), 250);
    const nextInput = [...playerInputSequence, idx];
    setPlayerInputSequence(nextInput);
    const currentCheckIndex = nextInput.length - 1;
    if (nextInput[currentCheckIndex] !== patternSequence[currentCheckIndex]) {
      setErrorsCount((e) => e + 1);
      setPlayerInputSequence([]);
      speakInstruction("Let us try that sequence once more.");
      setIsShowingPattern(true);
      setTimeout(() => {
        let step = 0;
        const interval = setInterval(() => {
          if (step < patternSequence.length) {
            setActiveLamp(patternSequence[step]);
            setTimeout(() => setActiveLamp(null), 450);
            step++;
          } else {
            clearInterval(interval);
            setIsShowingPattern(false);
          }
        }, 850);
      }, 400);
    } else if (nextInput.length === patternSequence.length) {
      if (patternRound >= 2) {
        finishGameWithScore(94, errorsCount);
      } else {
        setPatternRound(2);
        setTimeout(() => {
          setPatternSequence([0, 2, 1, 3]);
          setPlayerInputSequence([]);
        }, 500);
      }
    }
  };
  const soundRounds = [
    {
      id: "bell",
      title: "Sound #1",
      correctId: "bell",
      freq: 880,
      choices: [
        { id: "bell", name: "Temple Bell", icon: Bell, desc: "A peaceful bell chime" },
        { id: "rain", name: "Monsoon Rain", icon: CloudRain, desc: "Gentle raindrops" },
        { id: "flute", name: "Bamboo Flute", icon: Music, desc: "A melodious tune" }
      ]
    },
    {
      id: "rain",
      title: "Sound #2",
      correctId: "rain",
      freq: 220,
      choices: [
        { id: "sun", name: "Morning Bird", icon: Sun, desc: "Sweet chirp" },
        { id: "rain", name: "Monsoon Rain", icon: CloudRain, desc: "Gentle raindrops" },
        { id: "kettle", name: "Boiling Kettle", icon: Coffee, desc: "Warm tea kettle" }
      ]
    },
    {
      id: "flute",
      title: "Sound #3",
      correctId: "flute",
      freq: 523.25,
      choices: [
        { id: "flute", name: "Bamboo Flute", icon: Music, desc: "A melodious tune" },
        { id: "bell", name: "Temple Bell", icon: Bell, desc: "Chime" },
        { id: "clock", name: "Grandfather Clock", icon: Clock, desc: "Steady tick" }
      ]
    }
  ];
  const [currentSoundRoundIndex, setCurrentSoundRoundIndex] = useState(0);
  const [isPlayingSoundAnim, setIsPlayingSoundAnim] = useState(false);
  const playCurrentSound = () => {
    const currentRound = soundRounds[currentSoundRoundIndex];
    setIsPlayingSoundAnim(true);
    playSoundEffect(currentRound.freq, "sine", 1);
    setTimeout(() => setIsPlayingSoundAnim(false), 1e3);
  };
  const handlePickSound = (choiceId) => {
    if (isCompleted) return;
    const currentRound = soundRounds[currentSoundRoundIndex];
    if (choiceId === currentRound.correctId) {
      playSoundEffect(784, "triangle", 0.3);
      if (currentSoundRoundIndex < soundRounds.length - 1) {
        setCurrentSoundRoundIndex((i) => i + 1);
      } else {
        finishGameWithScore(98, errorsCount);
      }
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(250, "sawtooth", 0.2);
    }
  };
  const puzzlePieces = [
    { id: 0, title: "Top-Left (Golden Sun)", color: "bg-amber-500", icon: Sun },
    { id: 1, title: "Top-Right (Tea Garden)", color: "bg-emerald-600", icon: Feather },
    { id: 2, title: "Bottom-Left (Lotus Pond)", color: "bg-teal-500", icon: Flower2 },
    { id: 3, title: "Bottom-Right (Village Home)", color: "bg-orange-500", icon: Home }
  ];
  const [placedSlots, setPlacedSlots] = useState([null, null, null, null]);
  const [selectedPuzzlePiece, setSelectedPuzzlePiece] = useState(null);
  const handleSelectTrayPiece = (pieceId) => {
    setSelectedPuzzlePiece(pieceId);
    playSoundEffect(440, "sine", 0.15);
  };
  const handlePlaceInSlot = (slotIdx) => {
    if (selectedPuzzlePiece === null) return;
    if (selectedPuzzlePiece === slotIdx) {
      playSoundEffect(659.25, "triangle", 0.25);
      const next = [...placedSlots];
      next[slotIdx] = selectedPuzzlePiece;
      setPlacedSlots(next);
      setSelectedPuzzlePiece(null);
      if (next.every((val, i) => val === i)) {
        finishGameWithScore(96, errorsCount);
      }
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(261, "sawtooth", 0.2);
    }
  };
  const findObjectTargets = [
    { id: "lamp", name: "Golden Clay Diya", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80" },
    { id: "kettle", name: "Warm Chai Tea", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80" },
    { id: "bell", name: "Brass Temple Bell", image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80" },
    { id: "glasses", name: "Reading Spectacles", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80" }
  ];
  const [findRoundIndex, setFindRoundIndex] = useState(0);
  const currentFindTarget = findObjectTargets[findRoundIndex];
  const sceneItemsGrid = [
    { id: "s1", image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80", name: "Black Umbrella" },
    { id: "s2", image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80", name: "Vintage Key" },
    { id: "lamp", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80", name: "Golden Clay Diya" },
    { id: "glasses", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80", name: "Reading Spectacles" },
    { id: "s4", image: "https://images.unsplash.com/photo-1516715094483-75da7dee9758?auto=format&fit=crop&w=400&q=80", name: "Peacock Feather" },
    { id: "kettle", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80", name: "Warm Chai Tea" },
    { id: "s5", image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=400&q=80", name: "Pink Lotus" },
    { id: "s6", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80", name: "Open Book" },
    { id: "bell", image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80", name: "Brass Temple Bell" },
    { id: "s7", image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=400&q=80", name: "Vintage Clock" },
    { id: "s8", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80", name: "Marigold Flowers" },
    { id: "s9", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80", name: "Fresh Fruit Bowl" }
  ];
  const handleSpotItem = (itemId) => {
    if (isCompleted) return;
    if (itemId === currentFindTarget.id) {
      playSoundEffect(784, "triangle", 0.3);
      if (findRoundIndex < findObjectTargets.length - 1) {
        setFindRoundIndex((r) => r + 1);
      } else {
        finishGameWithScore(98, errorsCount);
      }
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(260, "sawtooth", 0.2);
    }
  };
  const colorShapeRounds = [
    {
      ruleType: "COLOR",
      ruleText: "MATCH COLOR: Tap the RED card",
      targetCriteria: "red",
      cards: [
        { id: "c1", color: "bg-rose-500", shape: "Circle", shapeIcon: Circle, label: "Red Circle", matches: true },
        { id: "c2", color: "bg-emerald-500", shape: "Square", shapeIcon: Square, label: "Green Square", matches: false },
        { id: "c3", color: "bg-blue-500", shape: "Triangle", shapeIcon: Triangle, label: "Blue Triangle", matches: false }
      ]
    },
    {
      ruleType: "SHAPE",
      ruleText: "MATCH SHAPE: Tap the STAR shape",
      targetCriteria: "star",
      cards: [
        { id: "c4", color: "bg-amber-500", shape: "Circle", shapeIcon: Circle, label: "Amber Circle", matches: false },
        { id: "c5", color: "bg-purple-600", shape: "Star", shapeIcon: Star, label: "Purple Star", matches: true },
        { id: "c6", color: "bg-emerald-500", shape: "Triangle", shapeIcon: Triangle, label: "Green Triangle", matches: false }
      ]
    },
    {
      ruleType: "COLOR",
      ruleText: "MATCH COLOR: Tap the GREEN card",
      targetCriteria: "green",
      cards: [
        { id: "c7", color: "bg-emerald-500", shape: "Square", shapeIcon: Square, label: "Green Square", matches: true },
        { id: "c8", color: "bg-rose-500", shape: "Triangle", shapeIcon: Triangle, label: "Red Triangle", matches: false },
        { id: "c9", color: "bg-amber-500", shape: "Star", shapeIcon: Star, label: "Amber Star", matches: false }
      ]
    },
    {
      ruleType: "SHAPE",
      ruleText: "MATCH SHAPE: Tap the TRIANGLE shape",
      targetCriteria: "triangle",
      cards: [
        { id: "c10", color: "bg-blue-500", shape: "Square", shapeIcon: Square, label: "Blue Square", matches: false },
        { id: "c11", color: "bg-amber-500", shape: "Triangle", shapeIcon: Triangle, label: "Golden Triangle", matches: true },
        { id: "c12", color: "bg-rose-500", shape: "Circle", shapeIcon: Circle, label: "Red Circle", matches: false }
      ]
    }
  ];
  const [colorShapeIndex, setColorShapeIndex] = useState(0);
  const handlePickColorShapeCard = (matches) => {
    if (isCompleted) return;
    if (matches) {
      playSoundEffect(784, "triangle", 0.25);
      if (colorShapeIndex < colorShapeRounds.length - 1) {
        setColorShapeIndex((i) => i + 1);
      } else {
        finishGameWithScore(97, errorsCount);
      }
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(260, "sawtooth", 0.2);
    }
  };
  const correctRoutineSequence = [
    {
      id: "r1",
      stepNum: 1,
      title: "Wake Up & Morning Gentle Stretch",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80",
      time: "7:00 AM",
      desc: "Seated morning deep breath and gentle neck stretch"
    },
    {
      id: "r2",
      stepNum: 2,
      title: "Nutritious Breakfast & Warm Chai Tea",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80",
      time: "8:00 AM",
      desc: "Healthy morning meal with warm cardamom ginger tea"
    },
    {
      id: "r3",
      stepNum: 3,
      title: "Take Morning Daily Medicine",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
      time: "9:00 AM",
      desc: "Doctor-prescribed morning blood pressure tablets"
    },
    {
      id: "r4",
      stepNum: 4,
      title: "Pleasant Garden Walk with Family",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
      time: "10:00 AM",
      desc: "Fresh air stroll along shaded green garden pathways"
    }
  ];
  const [userRoutineOrder, setUserRoutineOrder] = useState(() => [
    correctRoutineSequence[1],
    correctRoutineSequence[3],
    correctRoutineSequence[0],
    correctRoutineSequence[2]
  ]);
  const [routineChecked, setRoutineChecked] = useState(false);
  const moveRoutineItem = (index, direction) => {
    if (isCompleted) return;
    const newOrder = [...userRoutineOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setUserRoutineOrder(newOrder);
    playSoundEffect(440, "sine", 0.15);
  };
  const handleVerifyRoutine = () => {
    const isCorrect = userRoutineOrder.every((item, i) => item.id === correctRoutineSequence[i].id);
    setRoutineChecked(true);
    if (isCorrect) {
      playSoundEffect(784, "triangle", 0.4);
      finishGameWithScore(98, errorsCount);
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(260, "sawtooth", 0.3);
      speakInstruction("Let us check the routine order: Wake up first, then breakfast, then medicine, then walk.");
    }
  };
  const placeQuestions = [
    {
      q: "What was resting peacefully on the veranda porch mat?",
      options: ["A sleeping ginger cat", "A bicycle", "A stray dog"],
      correct: 0
    },
    {
      q: "What color were the soft curtains near the window?",
      options: ["Bright Red", "Ocean Blue", "Golden Yellow"],
      correct: 1
    },
    {
      q: "What object was placed on the central wooden table?",
      options: ["A brass tea kettle & cup", "A radio set", "A box of paints"],
      correct: 0
    }
  ];
  const [placePhase, setPlacePhase] = useState("observe");
  const [placeSeconds, setPlaceSeconds] = useState(8);
  const [placeQuestionIndex, setPlaceQuestionIndex] = useState(0);
  useEffect(() => {
    if (!isGame10Place || placePhase !== "observe" || isCompleted) return;
    const interval = setInterval(() => {
      setPlaceSeconds((s) => {
        if (s <= 1) {
          setPlacePhase("questions");
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [isGame10Place, placePhase, isCompleted]);
  const handleAnswerPlaceQuestion = (choiceIdx) => {
    if (isCompleted) return;
    if (choiceIdx === placeQuestions[placeQuestionIndex].correct) {
      playSoundEffect(659.25, "triangle", 0.25);
      if (placeQuestionIndex < placeQuestions.length - 1) {
        setPlaceQuestionIndex((i) => i + 1);
      } else {
        finishGameWithScore(96, errorsCount);
      }
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(250, "sawtooth", 0.2);
    }
  };
  const storyNarrative = {
    title: "A Pleasant Morning at the Jorhat Flower Fair",
    content: `Yesterday morning at 8:00 AM, grandmother Radha walked with her neighbor Sunita to the lively Jorhat flower fair. Radha carried a sunny yellow cloth bag. Along the pathway, she greeted the friendly tea stall owner and stopped by the fragrant marigold flower shop. She carefully selected five fresh garlands of orange marigolds and two earthen clay lamps for the evening prayer at home. Before taking the blue bus back home at 10:30 AM, Radha and Sunita enjoyed a warm cup of cardamom milk tea together.`,
    audioSummary: "Yesterday morning at 8 AM, Radha went with Sunita to the Jorhat flower fair carrying a yellow cloth bag. She bought five orange marigold garlands and two clay lamps, enjoyed cardamom tea, and took the blue bus home at 10:30 AM."
  };
  const storyQuestions = [
    {
      q: "1. What color was the cloth bag that grandmother Radha carried?",
      options: ["Sunny Yellow", "Emerald Green", "Deep Red", "Sky Blue"],
      correct: 0,
      hint: "It was the bright color of the morning sun."
    },
    {
      q: "2. Who accompanied Radha to the flower fair?",
      options: ["Her neighbor Sunita", "The village postman", "Her young grandson", "The grocery shopkeeper"],
      correct: 0,
      hint: "Her friendly neighbor walked with her."
    },
    {
      q: "3. How many orange marigold garlands did Radha select?",
      options: ["Five (5) garlands", "Two (2) garlands", "Ten (10) garlands", "One (1) garland"],
      correct: 0,
      hint: "She chose five fragrant garlands."
    },
    {
      q: "4. What special items did she buy for the evening prayer?",
      options: ["Two earthen clay lamps", "A brass temple bell", "A silver incense holder", "A wooden flute"],
      correct: 0,
      hint: "She bought two clay lamps for the evening prayer."
    },
    {
      q: "5. What kind of warm beverage did they enjoy before heading home?",
      options: ["Cardamom milk tea", "Cold lemonade", "Black coffee", "Coconut water"],
      correct: 0,
      hint: "A comforting cup of cardamom tea."
    }
  ];
  const [storyPhase, setStoryPhase] = useState("read");
  const [currentStoryQIndex, setCurrentStoryQIndex] = useState(0);
  const [selectedStoryOption, setSelectedStoryOption] = useState(null);
  const [isStoryNarrationPlaying, setIsStoryNarrationPlaying] = useState(false);
  const [storyScorePoints, setStoryScorePoints] = useState(0);
  const speakStory = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const lang = profile?.language || "en";
      const isHindi = lang === "hi";
      const utt = new SpeechSynthesisUtterance(storyNarrative.content);
      utt.lang = isHindi ? "hi-IN" : "en-US";
      utt.rate = isHindi ? 0.78 : 0.82;
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
      utt.onstart = () => setIsStoryNarrationPlaying(true);
      utt.onend = () => setIsStoryNarrationPlaying(false);
      utt.onerror = () => setIsStoryNarrationPlaying(false);
      window.speechSynthesis.speak(utt);
    }
  };
  const stopStoryAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsStoryNarrationPlaying(false);
    }
  };
  const handleAnswerStoryQuestion = (optionIdx) => {
    if (isCompleted || selectedStoryOption !== null) return;
    setSelectedStoryOption(optionIdx);
    const isCorrect = optionIdx === storyQuestions[currentStoryQIndex].correct;
    if (isCorrect) {
      playSoundEffect(784, "triangle", 0.3);
      setStoryScorePoints((prev) => prev + 1);
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(260, "sawtooth", 0.25);
    }
    setTimeout(() => {
      setSelectedStoryOption(null);
      if (currentStoryQIndex < storyQuestions.length - 1) {
        setCurrentStoryQIndex((i) => i + 1);
      } else {
        const correctCount = storyScorePoints + (isCorrect ? 1 : 0);
        const calcScore = Math.max(75, Math.round(correctCount / storyQuestions.length * 100));
        finishGameWithScore(calcScore, errorsCount + (isCorrect ? 0 : 1));
      }
    }, 900);
  };
  const stretchSteps = [
    { title: "Gentle Neck Tilts", desc: "Slowly tilt your head to the left, then to the right with easy breaths.", duration: 15 },
    { title: "Shoulder Rolls", desc: "Roll shoulders gently backward in a circle 5 times, relaxing the upper body.", duration: 15 },
    { title: "Seated Reach", desc: "Raise both arms comfortably towards the ceiling, stretching the torso.", duration: 15 },
    { title: "Deep Calming Breath", desc: "Inhale deeply through your nose, hold gently, and exhale softly through your mouth.", duration: 15 }
  ];
  const [stretchStepIndex, setStretchStepIndex] = useState(0);
  const [meditationBreathPhase, setMeditationBreathPhase] = useState("Inhale");
  const [meditationCycles, setMeditationCycles] = useState(0);
  useEffect(() => {
    if (!isMeditation || isCompleted) return;
    const interval = setInterval(() => {
      setMeditationBreathPhase((prev) => {
        if (prev === "Inhale") {
          playSoundEffect(523.25, "sine", 0.5);
          return "Hold";
        }
        if (prev === "Hold") return "Exhale";
        playSoundEffect(392, "sine", 0.5);
        setMeditationCycles((c) => {
          if (c >= 3) {
            finishGameWithScore(98, 0);
          }
          return c + 1;
        });
        return "Inhale";
      });
    }, 4e3);
    return () => clearInterval(interval);
  }, [isMeditation, isCompleted]);
  const crosswordQuestions = [
    { clue: "Morning hot beverage brewed with leaves", answer: "TEA", options: ["TEA", "ICE", "SUN"] },
    { clue: "Illuminating source in the morning sky", answer: "SUN", options: ["SUN", "MOON", "LAMP"] },
    { clue: "Gentle morning activity in the garden", answer: "WALK", options: ["WALK", "SWIM", "RIDE"] }
  ];
  const [crosswordIndex, setCrosswordIndex] = useState(0);
  const handlePickCrossword = (choice) => {
    if (isCompleted) return;
    if (choice === crosswordQuestions[crosswordIndex].answer) {
      playSoundEffect(784, "triangle", 0.25);
      if (crosswordIndex < crosswordQuestions.length - 1) {
        setCrosswordIndex((i) => i + 1);
      } else {
        finishGameWithScore(96, errorsCount);
      }
    } else {
      setErrorsCount((e) => e + 1);
      playSoundEffect(260, "sawtooth", 0.2);
    }
  };
  const [sudokuSelected, setSudokuSelected] = useState(null);
  if (isCompleted) {
    return <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-[#0D7377]/20 text-center">
          
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center text-emerald-700 mb-5 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#132A2F] font-display mb-1">
            {t.greatJob}
          </h2>
          <p className="text-lg text-[#0D7377] font-semibold mb-6">
            {task.title} Completed
          </p>

          {
      /* Stats Badges */
    }
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15">
              <span className="text-xs font-bold text-slate-500 block uppercase">Accuracy</span>
              <span className="text-2xl font-black text-[#0D7377]">{score}%</span>
            </div>

            <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15">
              <span className="text-xs font-bold text-slate-500 block uppercase">Time</span>
              <span className="text-xl font-black text-[#132A2F]">
                {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
              </span>
            </div>

            <div className="bg-[#F3F8F7] p-3.5 rounded-2xl border border-[#0D7377]/15">
              <span className="text-xs font-bold text-slate-500 block uppercase">Status</span>
              <span className="text-xl font-black text-emerald-700">Done ✓</span>
            </div>
          </div>

          {
      /* Reassuring Robot AI Message */
    }
          <div className="bg-[#EAF6F4] rounded-2xl p-4 sm:p-5 border border-[#0D7377]/25 text-left mb-6 flex items-start gap-3.5">
            <RobotAvatar size="w-10 h-10" />
            <div>
              <p className="text-xs font-extrabold text-[#0D7377] uppercase tracking-wider mb-0.5">
                AI ANALYSIS: WONDERFUL WORK!
              </p>
              <p className="text-sm sm:text-base text-[#132A2F] font-medium leading-relaxed">
                "Cognition is steady, engaged, and alert ({score}%). Your daily routine is on track. Well done!"
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {isBeginnersMode ? (
              <button
                onClick={() => {
                  if (onComplete) {
                    onComplete(task.id, score, score, elapsedSeconds, errorsCount);
                  }
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer btn-glow-teal"
              >
                <span>{nextGameTitle ? `Next Exercise: ${nextGameTitle}` : "Continue to Daily Reminders"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={onBack}
                className="w-full py-4 px-6 rounded-2xl bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>
      </div>;
  }
  return <div
    onPointerDown={registerUserActivity}
    onTouchStart={registerUserActivity}
    onKeyDown={registerUserActivity}
    className="max-w-6xl xl:max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 animate-in fade-in duration-200"
  >
      
      {
    /* Top Header Bar */
  }
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#0D7377]/15 mb-4 sm:mb-6">
        <button
    onClick={onBack}
    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-sm sm:text-base py-2 px-4 rounded-xl hover:bg-slate-100 transition cursor-pointer"
  >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          Exit
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#132A2F]">
            {task.title}
          </h2>
          <span className="text-xs sm:text-sm font-bold text-[#0D7377]">
            Active Cognitive Exercise · Full Screen View
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs sm:text-sm cursor-pointer transition shadow-xs"
              title="Skip this exercise and go to next"
            >
              <span>Skip Exercise ⏭️</span>
            </button>
          )}
          {/* How to Play Button in Top Header */}
          <button
            onClick={handleOpenHowToPlay}
            title="Open step-by-step game instructions and video guide"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 text-[#0D7377] border-2 border-teal-300 font-black text-xs sm:text-sm cursor-pointer transition shadow-xs hover:shadow-md active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-[#0D7377]" />
            <span>How to Play {activeIsMemory ? "🎬" : "💡"}</span>
          </button>
          <button
            onClick={() => speakInstruction(task.title + ". " + (task.description || "Focus calmly on the activity."))}
            title="Read instructions aloud"
            className="p-2.5 sm:p-3 rounded-2xl bg-slate-100 hover:bg-teal-50 text-[#0D7377] transition cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm cursor-pointer transition shadow-xs ${isPaused ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>
        </div>
      </div>

      {/* Live Real-Time Game & AI Engine Telemetry Indicator */}
      <LiveGameIndicator
        gameTitle={task.title}
        currentStep={attemptsCount + 1}
        totalSteps={10}
        difficulty={task.difficulty || "Medium"}
        onTakeBreak={() => setIsPaused(true)}
      />

      {
    /* Picture & Exercise Visual Banner */
  }
      {(() => {
    const found = allUnifiedGames.find(
      (g) => g.id === task.id || g.title.toLowerCase().includes(task.title.toLowerCase()) || task.title.toLowerCase().includes(g.title.toLowerCase().replace(/^\d+\.\s*/, ""))
    );
    const imgUrl = task.imageUrl || found?.imageUrl || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80";
    return <div className="relative w-full h-40 sm:h-52 md:h-64 rounded-3xl overflow-hidden shadow-sm border border-slate-200 mb-6">
            <img
      src={imgUrl}
      alt={task.title}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs sm:text-sm font-black">
              <span className="bg-indigo-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                🧠 {task.domain || "Cognitive"} Exercise
              </span>
              <span className="bg-black/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-teal-200 font-mono text-sm sm:text-base border border-white/20">
                ⏱️ {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm sm:text-base md:text-lg font-bold text-slate-100 line-clamp-2 drop-shadow-md">
                {task.description || found?.tagline || "Focus calmly on the activity at your own comfortable pace."}
              </p>
            </div>
          </div>;
  })()}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 1: 🧠 MEMORY MATCH */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {activeIsMemory && <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-md border-2 border-emerald-300/80 space-y-6 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 uppercase bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                Memory Enhancement Cards
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#132A2F] mt-2">
                Match the Pairs
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                Tap cards to flip them and find all matching pairs · Total Attempts: <span className="font-black text-emerald-700">{memAttempts}</span>
              </p>
            </div>

            {/* Exactly marked in user's image at top-right of Match the Pairs */}
            <button
              onClick={handleOpenHowToPlay}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-[#0D7377] border-2 border-emerald-400 font-black text-xs sm:text-sm cursor-pointer transition shadow-xs hover:shadow-md active:scale-95 shrink-0"
              title="Watch How to Play Video Demo & Instructions"
            >
              <Video className="w-4 h-4 text-indigo-600" />
              <span>How to Play (Video 🎥)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {memTiles.map((tile, idx) => {
              const isRevealed = tile.isFlipped || tile.isMatched;
              return (
                <button
                  key={tile.id}
                  onClick={() => handleMemTileClick(idx)}
                  disabled={tile.isMatched}
                  className={`h-48 sm:h-56 md:h-64 rounded-3xl transition-all duration-300 flex flex-col items-center justify-between p-3 text-center shadow-sm border-2 cursor-pointer ${
                    tile.isMatched
                      ? "bg-emerald-50 border-emerald-500 shadow-xl ring-4 ring-emerald-300 scale-98"
                      : isRevealed
                      ? `${tile.bg} border-[#0D7377] text-[#132A2F] scale-102 shadow-xl ring-2 ring-teal-400`
                      : "bg-[#F8FCFB] hover:bg-teal-50/70 border-slate-200 text-slate-400 hover:border-[#0D7377] hover:shadow-md"
                  }`}
                >
                  {isRevealed ? (
                    <div className="w-full h-full flex flex-col items-center justify-between">
                      <div className="w-full h-36 sm:h-44 md:h-48 rounded-2xl overflow-hidden bg-white/90 shadow-xs border border-slate-200">
                        <img
                          src={tile.image}
                          alt={tile.name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="text-sm sm:text-base font-black text-[#132A2F] leading-tight truncate w-full px-1 pt-2">
                        {tile.name}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center py-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center mb-3 text-[#0D7377] shadow-xs">
                        <Brain className="w-8 h-8 sm:w-10 sm:h-10 opacity-85" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-teal-900 uppercase tracking-wider">
                        Tap to Flip
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => finishGameWithScore(94, errorsCount)}
              className="py-3 px-8 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-2xl cursor-pointer transition"
            >
              Complete Session Early
            </button>
          </div>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 2: 🔢 NUMBER RECALL */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame2Number && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-center space-y-6">
          <div>
            <div className="inline-block bg-blue-50 text-[#1D7BF6] px-3 py-1 rounded-full text-xs font-bold mb-2">
              {numberSeries[numberRound - 1].label}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
              {numberPhase === "show" ? "Remember This Number Series" : "Enter the Numbers in Order"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {numberPhase === "show" ? `Memorize in ${numberSeconds}s` : "Use the keypad below to enter what you saw"}
            </p>
          </div>

          {numberPhase === "show" ? <div className="py-10 bg-blue-50 border-2 border-blue-200 rounded-3xl animate-pulse">
              <span className="text-5xl font-black tracking-widest text-[#1D7BF6]">
                {numberSeries[numberRound - 1].target}
              </span>
            </div> : <div className="space-y-4">
              <div className="h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl font-black text-[#0D7377] tracking-widest border border-slate-300">
                {enteredNumber || "\u2014 \u2014 \u2014"}
              </div>
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => <button
    key={digit}
    onClick={() => handleNumberTap(digit)}
    className="h-14 bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-[#0D7377] rounded-2xl font-black text-2xl text-slate-800 transition active:scale-95 cursor-pointer"
  >
                    {digit}
                  </button>)}
              </div>
              <div className="flex justify-center gap-2 max-w-xs mx-auto">
                <button
    onClick={() => setEnteredNumber("")}
    className="py-2.5 px-4 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl cursor-pointer"
  >
                  Clear
                </button>
                <button
    onClick={() => handleNumberTap("0")}
    className="w-20 h-12 bg-slate-50 border-2 border-slate-200 font-black text-xl text-slate-800 rounded-xl cursor-pointer"
  >
                  0
                </button>
              </div>
            </div>}

          <button
    onClick={() => finishGameWithScore(95, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Skip to Result
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 3: 🖼️ PICTURE RECALL */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame3Picture && <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-300 text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-extrabold text-amber-800 uppercase bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Visual Picture Recall
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#132A2F] mt-2">
              {picturePhase === "memorize" ? "Observe These 4 Familiar Items" : "Which Items Did You See?"}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
              {picturePhase === "memorize" ? `Memorize them before time runs out (${pictureSecondsLeft}s)` : "Tap all 4 items that were shown"}
            </p>
          </div>

          {picturePhase === "memorize" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 sm:gap-6 w-full">
              {pictureObjects
                .filter((o) => o.isShown)
                .map((obj) => {
                  return (
                    <div
                      key={obj.id}
                      className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-4 flex flex-col items-center shadow-sm"
                    >
                      <div className="w-full h-36 sm:h-44 md:h-52 rounded-2xl overflow-hidden bg-white shadow-xs mb-3 border border-amber-200">
                        <img
                          src={obj.image}
                          alt={obj.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="text-sm sm:text-base font-black text-amber-950 text-center leading-tight">
                        {obj.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 sm:gap-6 w-full">
              {pictureObjects.map((obj) => {
                const isSel = selectedPictureIds.includes(obj.id);
                return (
                  <button
                    key={obj.id}
                    onClick={() => handleTogglePictureSelect(obj.id)}
                    className={`p-3.5 rounded-3xl border-2 flex flex-col items-center justify-between transition cursor-pointer ${
                      isSel
                        ? "bg-teal-50 border-[#0D7377] ring-4 ring-teal-400 scale-102 font-black shadow-lg"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50 shadow-xs"
                    }`}
                  >
                    <div className="w-full h-32 sm:h-40 md:h-48 rounded-2xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                      <img
                        src={obj.image}
                        alt={obj.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <span className="text-sm sm:text-base font-black text-center leading-tight truncate w-full px-1">
                      {obj.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => finishGameWithScore(96, errorsCount)}
              className="px-8 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-2xl cursor-pointer transition"
            >
              Complete Picture Game
            </button>
          </div>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 4: 🎨 PATTERN RECALL */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame4Pattern && <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border-2 border-indigo-200 text-center space-y-6">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs sm:text-sm font-extrabold text-[#0D7377] uppercase bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
              Round {patternRound} of 2 · Pattern Recognition
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#132A2F] mt-2">
              {isShowingPattern ? "Watch the Sequence" : "Tap the Lamps in Order"}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
              {isShowingPattern ? "Memorize which colored lamp lights up in sequence" : "Your turn! Tap the sequence you just observed."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-8 max-w-2xl sm:max-w-3xl mx-auto w-full py-4">
            {[
    { id: 0, color: "bg-rose-500 hover:bg-rose-600", name: "Ruby Lamp" },
    { id: 1, color: "bg-emerald-500 hover:bg-emerald-600", name: "Emerald Lamp" },
    { id: 2, color: "bg-amber-500 hover:bg-amber-600", name: "Golden Lamp" },
    { id: 3, color: "bg-blue-500 hover:bg-blue-600", name: "Sapphire Lamp" }
  ].map((lamp) => {
    const isLit = activeLamp === lamp.id;
    return <button
      key={lamp.id}
      onClick={() => handleLampClick(lamp.id)}
      disabled={isShowingPattern}
      className={`h-40 sm:h-52 md:h-60 rounded-3xl transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center p-4 text-white font-black text-base sm:text-xl shadow-lg cursor-pointer ${lamp.color} ${isLit ? "ring-8 ring-yellow-300 scale-105 brightness-125 shadow-2xl" : "opacity-85 hover:opacity-100 hover:scale-102"}`}
    >
                  <Sparkles className={`w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 ${isLit ? "animate-spin text-yellow-100" : "text-white"}`} />
                  <span className="tracking-wide">{lamp.name}</span>
                </button>;
  })}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => finishGameWithScore(92, errorsCount)}
              className="px-8 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-2xl cursor-pointer transition"
            >
              Complete Pattern Game
            </button>
          </div>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 5: 🔊 SOUND MATCH */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame5Sound && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-center space-y-6">
          <div>
            <span className="text-xs font-bold text-[#0D7377] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Round {currentSoundRoundIndex + 1} of {soundRounds.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F] mt-2">
              Listen and Match the Sound
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Tap the play button to hear the sound, then choose what made it
            </p>
          </div>

          <button
    onClick={playCurrentSound}
    className={`w-28 h-28 mx-auto rounded-full bg-[#0D7377] text-white flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer ${isPlayingSoundAnim ? "ring-8 ring-teal-200 animate-pulse" : ""}`}
  >
            <Volume2 className="w-12 h-12 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">Play Sound</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {soundRounds[currentSoundRoundIndex].choices.map((snd) => {
    const IconComp = snd.icon;
    return <button
      key={snd.id}
      onClick={() => handlePickSound(snd.id)}
      className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#0D7377] hover:bg-teal-50 text-slate-800 flex flex-col items-center transition cursor-pointer"
    >
                  <IconComp className="w-8 h-8 text-[#0D7377] mb-2" />
                  <span className="text-sm font-black">{snd.name}</span>
                  <span className="text-[10px] text-slate-500">{snd.desc}</span>
                </button>;
  })}
          </div>

          <button
    onClick={() => finishGameWithScore(95, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Complete Sound Game
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 6: 🧩 SIMPLE PUZZLE */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame6Puzzle && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-center space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
              4-Piece Scene Puzzle
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Select a piece from the tray below, then tap the matching corner slot to place it
            </p>
          </div>

          {
    /* Puzzle Board (2x2 Grid) */
  }
          <div className="w-64 h-64 mx-auto bg-slate-100 border-4 border-dashed border-slate-300 rounded-3xl grid grid-cols-2 p-2 gap-2">
            {[0, 1, 2, 3].map((slotIdx) => {
    const placedPieceId = placedSlots[slotIdx];
    const isFilled = placedPieceId !== null;
    const pieceInfo = isFilled ? puzzlePieces[placedPieceId] : null;
    return <button
      key={slotIdx}
      onClick={() => handlePlaceInSlot(slotIdx)}
      className={`rounded-2xl flex flex-col items-center justify-center text-white transition-all border-2 ${isFilled && pieceInfo ? `${pieceInfo.color} border-white shadow-md` : "bg-white/60 border-slate-300 text-slate-400 hover:bg-teal-50 cursor-pointer"}`}
    >
                  {isFilled && pieceInfo ? <>
                      <pieceInfo.icon className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-black">{pieceInfo.title}</span>
                    </> : <span className="text-xs font-bold">Slot #{slotIdx + 1}</span>}
                </button>;
  })}
          </div>

          {
    /* Tray */
  }
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-2">Pieces Tray:</span>
            <div className="flex justify-center gap-2 flex-wrap">
              {puzzlePieces.map((piece) => {
    const isAlreadyPlaced = placedSlots.includes(piece.id);
    const isSelected = selectedPuzzlePiece === piece.id;
    return <button
      key={piece.id}
      disabled={isAlreadyPlaced}
      onClick={() => handleSelectTrayPiece(piece.id)}
      className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${isAlreadyPlaced ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50" : isSelected ? "bg-[#0D7377] text-white ring-4 ring-teal-200" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
    >
                    <piece.icon className="w-4 h-4" />
                    <span>{piece.title}</span>
                  </button>;
  })}
            </div>
          </div>

          <button
    onClick={() => finishGameWithScore(96, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Complete Puzzle Game
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 7: 👀 FIND THE OBJECT */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame7FindObject && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-md border-2 border-teal-300 text-center space-y-8 w-full">
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-sm max-w-4xl mx-auto">
            <span className="text-xs sm:text-sm font-black text-[#0D7377] uppercase bg-white px-4 py-1.5 rounded-full border border-teal-200 shadow-2xs">
              Round {findRoundIndex + 1} of {findObjectTargets.length} · Object Detection & Identification
            </span>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 mt-5">
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-[#0D7377] shadow-xl shrink-0 bg-white ring-4 ring-teal-200">
                <img
                  src={currentFindTarget.image}
                  alt={currentFindTarget.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs sm:text-sm font-black text-[#0D7377] uppercase tracking-wider block">
                  🎯 Target Object To Find
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#132A2F] mt-1">
                  {currentFindTarget.name}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                  Spot this real object in the full-screen view below and tap its picture!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 w-full">
            {sceneItemsGrid.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleSpotItem(item.id)}
                  className="h-40 sm:h-48 md:h-52 bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-[#0D7377] hover:shadow-xl rounded-3xl flex flex-col items-center justify-between p-3 transition-all duration-300 transform active:scale-95 cursor-pointer group"
                >
                  <div className="w-full h-28 sm:h-36 md:h-38 rounded-2xl overflow-hidden bg-slate-100 mb-2 border border-slate-200 shadow-2xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#0D7377] truncate w-full text-center px-1">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => finishGameWithScore(98, errorsCount)}
              className="px-8 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-2xl cursor-pointer transition"
            >
              Complete Search Game
            </button>
          </div>
        </div>
      )}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 8: 🚦 COLOR & SHAPE MATCH */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame8ColorShape && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-center space-y-6">
          <div>
            <span className="text-xs font-bold text-[#0D7377] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Rule {colorShapeIndex + 1} of {colorShapeRounds.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F] mt-2">
              {colorShapeRounds[colorShapeIndex].ruleText}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tap the card below that matches the instruction above
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {colorShapeRounds[colorShapeIndex].cards.map((card) => {
    const ShapeIcon = card.shapeIcon;
    return <button
      key={card.id}
      onClick={() => handlePickColorShapeCard(card.matches)}
      className={`h-36 rounded-3xl ${card.color} text-white flex flex-col items-center justify-center p-4 shadow-md transition transform active:scale-95 cursor-pointer hover:brightness-110`}
    >
                  <ShapeIcon className="w-12 h-12 mb-2 fill-current opacity-90" />
                  <span className="text-base font-black">{card.label}</span>
                </button>;
  })}
          </div>

          <button
    onClick={() => finishGameWithScore(97, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Complete Color & Shape Match
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 9: 📅 DAILY ROUTINE RECALL */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame9Routine && <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border-2 border-teal-200 text-left space-y-6 max-w-4xl mx-auto">
          <div className="text-center">
            <span className="text-xs sm:text-sm font-extrabold text-[#0D7377] uppercase bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
              Daily Routine Sequencing
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#132A2F] mt-2">
              Daily Routine Sequencing
            </h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
              Arrange these 4 daily activities from first to last (Morning → Afternoon)
            </p>
          </div>

          <div className="space-y-4">
            {userRoutineOrder.map((item, idx) => {
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-teal-400 flex items-center justify-between shadow-xs hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0D7377] text-white font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </span>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-base sm:text-lg md:text-xl text-[#132A2F] leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-xs sm:text-sm text-[#0D7377] font-black bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
                          ⏱️ {item.time}
                        </span>
                        {item.desc && (
                          <span className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:inline-block">
                            {item.desc}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button
                      onClick={() => moveRoutineItem(idx, "up")}
                      disabled={idx === 0}
                      title="Move up"
                      className="p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-[#0D7377] border border-slate-200 disabled:opacity-20 cursor-pointer transition shadow-2xs"
                    >
                      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => moveRoutineItem(idx, "down")}
                      disabled={idx === userRoutineOrder.length - 1}
                      title="Move down"
                      className="p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-[#0D7377] border border-slate-200 disabled:opacity-20 cursor-pointer transition shadow-2xs"
                    >
                      <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
    onClick={handleVerifyRoutine}
    className="w-full py-4 sm:py-5 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-black text-lg sm:text-xl rounded-2xl shadow-lg transition cursor-pointer text-center"
  >
            Check Routine Sequence ✓
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 10: 🏠 FAMILIAR PLACE MEMORY */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isGame10Place && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-left space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
              {placePhase === "observe" ? "Explore the Familiar Veranda Scene" : `Question ${placeQuestionIndex + 1} of 3`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {placePhase === "observe" ? `Observe carefully for ${placeSeconds}s` : "Answer based on the room scene you observed"}
            </p>
          </div>

          {placePhase === "observe" ? <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-50 to-teal-50 p-5 rounded-2xl border border-teal-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0D7377]">
                  <Home className="w-5 h-5" />
                  <span>Scene: Morning Veranda in Jorhat</span>
                </div>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                  "The morning sun shines through the window with <strong>ocean blue curtains</strong>. On the central wooden table sits a warm <strong>brass tea kettle and cup</strong>. Outside on the veranda porch mat, a <strong>sleeping ginger cat</strong> rests peacefully under the shade."
                </p>
              </div>

              <button
    onClick={() => setPlacePhase("questions")}
    className="w-full py-3 bg-[#0D7377] text-white font-bold text-sm rounded-xl cursor-pointer"
  >
                I'm Ready for Questions
              </button>
            </div> : <div className="space-y-4">
              <h4 className="font-extrabold text-base text-[#132A2F]">
                {placeQuestions[placeQuestionIndex].q}
              </h4>
              <div className="space-y-2.5">
                {placeQuestions[placeQuestionIndex].options.map((opt, oIdx) => <button
    key={oIdx}
    onClick={() => handleAnswerPlaceQuestion(oIdx)}
    className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[#0D7377] hover:bg-teal-50 font-bold text-sm transition active:scale-98 cursor-pointer"
  >
                    {opt}
                  </button>)}
              </div>
            </div>}

          <button
    onClick={() => finishGameWithScore(96, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Complete Place Memory Game
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 11: 📖 STORY RECALL */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isStoryRecall && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-300 text-left space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0D7377] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {storyPhase === "read" ? "Phase 1: Read & Listen to Story" : `Question ${currentStoryQIndex + 1} of ${storyQuestions.length}`}
            </span>
            <button
    onClick={isStoryNarrationPlaying ? stopStoryAudio : speakStory}
    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${isStoryNarrationPlaying ? "bg-rose-100 text-rose-800 animate-pulse" : "bg-teal-50 text-[#0D7377] hover:bg-teal-100"}`}
  >
              <Volume2 className="w-4 h-4" />
              <span>{isStoryNarrationPlaying ? "Stop Voice" : "Read Aloud"}</span>
            </button>
          </div>

          {storyPhase === "read" ? <div className="space-y-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-amber-950">
                      {storyNarrative.title}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold">
                      Listen or read carefully at your own gentle pace
                    </p>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                  {storyNarrative.content}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
    onClick={() => {
      stopStoryAudio();
      setStoryPhase("questions");
    }}
    className="flex-1 py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-base rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
  >
                  <span>I'm Ready for the Questions</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div> : <div className="space-y-5">
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Question {currentStoryQIndex + 1}
                </span>
                <h4 className="font-extrabold text-base sm:text-lg text-[#132A2F] leading-snug">
                  {storyQuestions[currentStoryQIndex].q}
                </h4>
              </div>

              <div className="space-y-3">
                {storyQuestions[currentStoryQIndex].options.map((option, oIdx) => {
    const isChosen = selectedStoryOption === oIdx;
    const isCorrect = oIdx === storyQuestions[currentStoryQIndex].correct;
    return <button
      key={oIdx}
      disabled={selectedStoryOption !== null}
      onClick={() => handleAnswerStoryQuestion(oIdx)}
      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 font-bold text-sm sm:text-base transition active:scale-98 cursor-pointer flex items-center justify-between ${selectedStoryOption !== null ? isCorrect ? "bg-emerald-100 border-emerald-500 text-emerald-950 font-black" : isChosen ? "bg-rose-100 border-rose-400 text-rose-950" : "bg-white border-slate-200 text-slate-400 opacity-60" : "bg-white border-slate-200 hover:border-[#0D7377] hover:bg-teal-50 text-slate-800"}`}
    >
                      <span>{option}</span>
                      {selectedStoryOption !== null && isCorrect && <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />}
                    </button>;
  })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
    onClick={() => setStoryPhase("read")}
    className="text-xs font-bold text-slate-500 hover:text-[#0D7377] underline cursor-pointer"
  >
                  ← Read Story Again
                </button>

                <button
    onClick={() => finishGameWithScore(95, errorsCount)}
    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
                  Complete Story Recall
                </button>
              </div>
            </div>}
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 12: 🙆 MORNING STRETCH */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isStretch && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-blue-200 text-center space-y-6">
          <div className="flex items-center justify-center my-auto">
            <MorningStretchGraphic className="w-24 h-24" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Step {stretchStepIndex + 1} of {stretchSteps.length}
            </span>
            <h3 className="text-2xl font-black text-[#132A2F] mt-2">
              {stretchSteps[stretchStepIndex].title}
            </h3>
            <p className="text-sm text-slate-600 font-medium mt-1 max-w-md mx-auto">
              "{stretchSteps[stretchStepIndex].desc}"
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {stretchStepIndex < stretchSteps.length - 1 ? <button
    onClick={() => {
      playSoundEffect(587, "sine", 0.2);
      setStretchStepIndex((i) => i + 1);
    }}
    className="py-3 px-6 bg-[#1D7BF6] hover:bg-blue-600 text-white font-extrabold text-sm rounded-2xl shadow-md transition cursor-pointer"
  >
                Next Stretch Pose →
              </button> : <button
    onClick={() => finishGameWithScore(98, 0)}
    className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition cursor-pointer"
  >
                Complete Morning Stretch ✓
              </button>}
          </div>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 13: 🧘 MEDITATION & BREATHING */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isMeditation && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-200 text-center space-y-6">
          <div className="flex items-center justify-center my-auto">
            <MeditationGraphic className="w-24 h-24" />
          </div>
          <div>
            <span className="text-xs font-bold text-orange-700 uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Cycle {meditationCycles + 1} of 4
            </span>
            <h3 className="text-3xl font-black text-[#132A2F] mt-2 tracking-wide">
              {meditationBreathPhase}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Follow the breathing rhythm peacefully. Relax your shoulders.
            </p>
          </div>

          <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 flex items-center justify-center text-white font-black text-xl shadow-lg transition-all duration-1000 transform scale-105">
            {meditationBreathPhase}
          </div>

          <button
    onClick={() => finishGameWithScore(98, 0)}
    className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-2xl shadow-md transition cursor-pointer"
  >
            Finish Meditation Session ✓
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 14: 🔤 CROSSWORD & WORDS */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isCrossword && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-center space-y-6">
          <div>
            <span className="text-xs font-bold text-[#0D7377] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Word Clue {crosswordIndex + 1} of {crosswordQuestions.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F] mt-2">
              "{crosswordQuestions[crosswordIndex].clue}"
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Select the correct word that matches this clue:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {crosswordQuestions[crosswordIndex].options.map((opt) => <button
    key={opt}
    onClick={() => handlePickCrossword(opt)}
    className="h-16 rounded-2xl bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-[#0D7377] text-slate-900 font-black text-lg transition active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
  >
                {opt}
              </button>)}
          </div>

          <button
    onClick={() => finishGameWithScore(96, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Complete Word Game
          </button>
        </div>}

      {
    /* ------------------------------------------------------------ */
  }
      {
    /* GAME 15: 🔢 SUDOKU MINI */
  }
      {
    /* ------------------------------------------------------------ */
  }
      {isSudoku && <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-300 text-center space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#132A2F]">
              4x4 Mini Number Grid
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Every row and column should have numbers 1 to 4 without repetition.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto bg-slate-100 p-3 rounded-2xl border-2 border-slate-300">
            {["1", "2", "3", "4", "3", "4", "?", "2", "2", "1", "4", "3", "4", "3", "2", "1"].map((cell, idx) => <div
    key={idx}
    className={`h-12 rounded-xl flex items-center justify-center font-black text-lg ${cell === "?" ? "bg-amber-200 text-amber-900 border-2 border-amber-400 animate-pulse" : "bg-white text-slate-800 shadow-2xs"}`}
  >
                {cell === "?" && sudokuSelected ? sudokuSelected : cell}
              </div>)}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-600 mb-2">Select the missing number for (?):</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((num) => <button
    key={num}
    onClick={() => {
      setSudokuSelected(num);
      if (num === 1) {
        playSoundEffect(784, "triangle", 0.3);
        setTimeout(() => finishGameWithScore(98, errorsCount), 600);
      } else {
        setErrorsCount((e) => e + 1);
        playSoundEffect(260, "sawtooth", 0.2);
      }
    }}
    className="w-12 h-12 bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-[#0D7377] rounded-xl font-black text-lg text-slate-800 transition active:scale-95 cursor-pointer shadow-xs"
  >
                  {num}
                </button>)}
            </div>
          </div>

          <button
    onClick={() => finishGameWithScore(96, errorsCount)}
    className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl cursor-pointer"
  >
            Complete Su Doku
          </button>
        </div>}

      {/* ------------------------------------------------------------ */}
      {/* GAME 16: 📸 MEMORY ART GALLERY (PHOTO & MUSIC REMINISCENCE) */}
      {/* ------------------------------------------------------------ */}
      {isMemoryArtGallery && (
        <MemoryArtGallery
          profile={profile}
          onBack={onBack}
          onComplete={(scoreVal) => finishGameWithScore(scoreVal || 95, errorsCount)}
        />
      )}

      {/* How to Play Modal & Voice Guidance Assistant */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => {
          setIsHowToPlayOpen(false);
          setIsHowToPlayAutoTriggered(false);
          registerUserActivity();
        }}
        gameType={activeGameType}
        profile={profile}
        isAutoTriggered={isHowToPlayAutoTriggered}
      />

    </div>;
};
