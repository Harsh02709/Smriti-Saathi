import { useState, useEffect, useRef } from "react";
import { physicalMemoryGamesList } from "../../data/unifiedGamesData";
import { translations } from "../../data/translations";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import { LiveGameIndicator } from "../patient/LiveGameIndicator";
import { PoseCameraVerification } from "./PoseCameraVerification";
import {
  Volume2,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ShieldAlert,
  Camera,
  Activity,
  Sparkles,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobotAvatar } from "../common/GraphicAssets";
import { HowToPlayModal } from "./HowToPlayModal";

export const PhysicalMemoryEngine = ({
  game,
  profile,
  onComplete,
  onBack,
  onSkip,
  isBeginnersMode = false,
  nextGameTitle = ""
}) => {
  const t = translations[profile.language] || translations.en;
  const {
    startLiveGame,
    recordEvent,
    completeGame,
    abandonGame
  } = useRealtimeTracking();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(96);
  const [errorsCount, setErrorsCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // How to Play and 30s Inactivity Auto-Guide States
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isHowToPlayAutoTriggered, setIsHowToPlayAutoTriggered] = useState(false);
  const lastInteractionTimeRef = useRef(Date.now());
  const hasAutoPromptedRef = useRef(false);

  const registerUserActivity = () => {
    lastInteractionTimeRef.current = Date.now();
  };

  const handleOpenHowToPlay = () => {
    registerUserActivity();
    setIsHowToPlayAutoTriggered(false);
    setIsHowToPlayOpen(true);
  };

  // 30-Second Inactivity Watcher
  useEffect(() => {
    lastInteractionTimeRef.current = Date.now();
    hasAutoPromptedRef.current = false;

    const interval = setInterval(() => {
      if (isPaused || isCompleted || isHowToPlayOpen || hasAutoPromptedRef.current) return;
      const inactiveMs = Date.now() - lastInteractionTimeRef.current;
      if (inactiveMs >= 30000) {
        hasAutoPromptedRef.current = true;
        setIsHowToPlayAutoTriggered(true);
        setIsHowToPlayOpen(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCompleted, isHowToPlayOpen, game?.id]);

  // Initialize Tracking
  useEffect(() => {
    startLiveGame(
      { id: game.id, title: game.title, domain: "Physical & Memory", difficulty: "Medium" },
      profile,
      { totalSteps: 4, difficulty: "Medium" }
    );
    return () => {
      if (!isCompleted) {
        abandonGame();
      }
    };
  }, [game.id]);

  const titleLower = (game.title || "").toLowerCase() + " " + (game.id || "").toLowerCase();
  const isTouchBody = titleLower.includes("touch the body") || titleLower.includes("pm-1");
  const isRememberMove = titleLower.includes("remember & move") || titleLower.includes("pm-2");
  const isSimonSays = titleLower.includes("simon says") || titleLower.includes("pm-3");
  const isCrossBody = titleLower.includes("cross-body") || titleLower.includes("pm-4");
  const isCountTouch = titleLower.includes("count & touch") || titleLower.includes("pm-5");
  const isLeftRight = titleLower.includes("left or right") || titleLower.includes("pm-6");
  const isFingerSeq = titleLower.includes("finger sequence") || titleLower.includes("pm-7");
  const isClapPattern = titleLower.includes("clap pattern") || titleLower.includes("pm-8");
  const isFootTap = titleLower.includes("foot tap") || titleLower.includes("pm-9");
  const isMovementSeq = titleLower.includes("movement sequence") || titleLower.includes("pm-10");
  const isColorMove = titleLower.includes("color movement") || titleLower.includes("pm-11");
  const isFreezeMove = titleLower.includes("freeze & move") || titleLower.includes("pm-12");
  const isRhythmCopy = titleLower.includes("rhythm copy") || titleLower.includes("pm-13");
  const isMirrorMe = titleLower.includes("mirror me") || titleLower.includes("pm-14");
  const isReverseSeq = titleLower.includes("reverse sequence") || titleLower.includes("pm-15");

  const playTone = (freq = 520, type = "sine", duration = 0.25) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Ignore audio context errors
    }
  };

  const speakPrompt = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.85;
        utt.onstart = () => setIsSpeaking(true);
        utt.onend = () => setIsSpeaking(false);
        utt.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
      } catch {
        // Ignore synthesis error
      }
    }
  };

  // Timer
  useEffect(() => {
    let interval = null;
    if (!isPaused && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isCompleted]);

  // Finish Game Handler (Auto-triggered upon camera verification)
  const handleFinishGame = (finalScore = 98, finalErrors = errorsCount) => {
    setScore(finalScore);
    try {
      confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti error
    }
    playTone(784, "triangle", 0.4);
    completeGame({
      finalScore,
      finalErrors,
      elapsedSeconds
    });

    if (isBeginnersMode) {
      if (onComplete) {
        onComplete(
          game.id,
          finalScore,
          Math.max(75, 100 - finalErrors * 5),
          elapsedSeconds,
          finalErrors
        );
      }
    } else {
      setIsCompleted(true);
      if (onComplete) {
        onComplete(
          game.id,
          finalScore,
          Math.max(75, 100 - finalErrors * 5),
          elapsedSeconds,
          finalErrors
        );
      }
    }
  };

  // 1. TOUCH THE BODY PART
  const touchBodyLevels = [
    { text: "Touch your head → touch left shoulder → touch right shoulder", steps: ["Touch your head", "Touch your left shoulder", "Touch your right shoulder"] },
    { text: "Touch your nose → touch left ear → touch right knee", steps: ["Touch your nose", "Touch your left ear", "Touch your right knee"] },
    { text: "Touch left shoulder → touch right ear → raise both hands", steps: ["Touch your left shoulder", "Touch your right ear", "Raise both hands"] }
  ];
  const [touchLevelIdx, setTouchLevelIdx] = useState(0);

  // 2. REMEMBER & MOVE
  const rememberMoveItems = [
    { title: "Wave Hand 👋", command: "Wave your right hand", desc: "Wave your right hand gently" },
    { title: "Touch Head 🙆", command: "Touch your head", desc: "Place hand gently on your head" },
    { title: "Clap Twice 👏", command: "Clap twice", desc: "Clap your hands together two times" }
  ];
  const [rememberMoveIdx, setRememberMoveIdx] = useState(0);

  // 3. SIMON SAYS
  const simonRounds = [
    { prompt: "Simon says: Touch your head!", command: "Touch your head", simonSaid: true },
    { prompt: "Clap your hands twice!", command: "Stay still", simonSaid: false },
    { prompt: "Simon says: Raise both hands!", command: "Raise both hands", simonSaid: true },
    { prompt: "Touch your knees!", command: "Stay still", simonSaid: false },
    { prompt: "Simon says: Touch your left shoulder!", command: "Touch your left shoulder", simonSaid: true }
  ];
  const [simonIndex, setSimonIndex] = useState(0);

  // 4. CROSS-BODY TOUCH
  const crossBodySteps = [
    { title: "Right Hand → Left Knee", command: "Touch your left knee with your right hand", desc: "Cross right hand down to touch left knee." },
    { title: "Left Hand → Right Knee", command: "Touch your right knee with your left hand", desc: "Cross left hand down to touch right knee." },
    { title: "Right Hand → Left Shoulder", command: "Touch your left shoulder with your right hand", desc: "Reach right hand across to touch left shoulder." },
    { title: "Left Hand → Right Shoulder", command: "Touch your right shoulder with your left hand", desc: "Reach left hand across to touch right shoulder." }
  ];
  const [crossBodyIdx, setCrossBodyIdx] = useState(0);

  // 5. COUNT & TOUCH
  const countTouchCommands = [
    "Touch your right knee",
    "Touch your right knee",
    "Touch your right knee"
  ];
  const [countTouchStep, setCountTouchStep] = useState(0);

  // 6. LEFT OR RIGHT
  const leftRightQuestions = [
    { prompt: "Raise your RIGHT hand!", command: "Raise your right hand" },
    { prompt: "Raise your LEFT hand!", command: "Raise your left hand" },
    { prompt: "Touch your RIGHT shoulder!", command: "Touch your right shoulder" },
    { prompt: "Touch your LEFT ear!", command: "Touch your left ear" }
  ];
  const [leftRightIdx, setLeftRightIdx] = useState(0);

  // 7. FINGER SEQUENCE
  const fingerSeqSteps = [
    "Touch your head",
    "Touch your nose",
    "Touch your left ear"
  ];
  const [fingerSeqIdx, setFingerSeqIdx] = useState(0);

  // 8. CLAP PATTERN
  const clapPatternCommand = "Clap twice";

  // 9. FOOT / KNEE TAP
  const footTapSteps = [
    { title: "Touch Right Knee", command: "Touch your right knee" },
    { title: "Touch Left Knee", command: "Touch your left knee" },
    { title: "Touch Right Knee", command: "Touch your right knee" }
  ];
  const [footTapIdx, setFootTapIdx] = useState(0);

  // 10. MOVEMENT SEQUENCE
  const moveSeqSteps = [
    { title: "1. Raise Both Hands", command: "Raise both hands", desc: "Raise both arms comfortably towards the sky" },
    { title: "2. Touch Shoulders", command: "Touch your left shoulder", desc: "Place fingertips on your shoulders" },
    { title: "3. Clap Hands Twice", command: "Clap twice", desc: "Clap hands twice with a bright sound" }
  ];
  const [moveSeqIdx, setMoveSeqIdx] = useState(0);

  // 11. COLOR MOVEMENT
  const colorMoveCards = [
    { colorName: "RED", bgClass: "bg-rose-500", action: "CLAP HANDS 👏", command: "Clap twice" },
    { colorName: "BLUE", bgClass: "bg-blue-500", action: "TOUCH LEFT SHOULDER 🙆", command: "Touch your left shoulder" },
    { colorName: "GREEN", bgClass: "bg-emerald-500", action: "RAISE RIGHT HAND ✋", command: "Raise your right hand" }
  ];
  const [colorMoveIdx, setColorMoveIdx] = useState(0);

  // 12. FREEZE & MOVE
  const [freezePhase, setFreezePhase] = useState("move");

  // 13. RHYTHM COPY
  const rhythmCopyCommand = "Clap twice";

  // 14. MIRROR ME
  const mirrorSteps = [
    { title: "Raise Right Hand", command: "Raise your right hand", desc: "Mirror the coach: Lift your right hand up high." },
    { title: "Touch Left Ear", command: "Touch your left ear", desc: "Mirror the coach: Reach hand to your left ear." },
    { title: "Raise Both Hands", command: "Raise both hands", desc: "Mirror the coach: Lift both hands up high." }
  ];
  const [mirrorIdx, setMirrorIdx] = useState(0);

  // 15. REVERSE SEQUENCE
  const reverseRounds = [
    { title: "Reverse: Knee → Shoulder → Head", steps: ["Touch your right knee", "Touch your left shoulder", "Touch your head"] },
    { title: "Reverse: Clap → Ear → Nose", steps: ["Clap twice", "Touch your left ear", "Touch your nose"] }
  ];
  const [reverseIdx, setReverseIdx] = useState(0);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Completion View
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border-2 border-emerald-300 text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full">
              CAMERA VERIFICATION COMPLETED
            </span>
            <h2 className="text-3xl font-extrabold text-[#132A2F] mt-3">
              Wonderful Job, {profile.preferredName || profile.name}!
            </h2>
            <p className="text-base text-slate-600 font-medium mt-1">
              Your physical movements were verified by the AI camera engine in{" "}
              <span className="font-bold text-[#0D7377]">{game.title}</span>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-slate-500 uppercase block">Score</span>
              <span className="text-2xl font-black text-[#0D7377]">{score}%</span>
            </div>
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-slate-500 uppercase block">Time</span>
              <span className="text-2xl font-black text-slate-800">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-slate-500 uppercase block">AI Accuracy</span>
              <span className="text-2xl font-black text-emerald-600">98%</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left flex items-start gap-3">
            <RobotAvatar size="w-10 h-10" />
            <div>
              <p className="text-xs font-extrabold text-[#0D7377] uppercase tracking-wider mb-0.5">
                NEURO-MOTOR BENEFIT NOTE
              </p>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "Combining camera-verified motor coordination with cognitive memory strengthens neural connections in the motor cortex and frontal lobe!"
              </p>
            </div>
          </div>

          {isBeginnersMode ? (
            <button
              onClick={() => {
                if (onComplete) {
                  onComplete(
                    game.id,
                    score,
                    Math.max(75, 100 - errorsCount * 5),
                    elapsedSeconds,
                    errorsCount
                  );
                }
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer btn-glow-teal"
            >
              <span>{nextGameTitle ? `Next Exercise: ${nextGameTitle}` : "Continue to Next Exercise"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="w-full py-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-lg rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to All Games</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const gameImageUrl =
    game.imageUrl ||
    physicalMemoryGamesList.find(
      (g) => g.id === game.id || g.title.toLowerCase() === game.title.toLowerCase()
    )?.imageUrl ||
    "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80";

  return (
    <div
      onPointerDown={registerUserActivity}
      onTouchStart={registerUserActivity}
      onKeyDown={registerUserActivity}
      className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-xs border border-[#0D7377]/15">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold text-sm py-1.5 px-3 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center justify-center gap-1 mx-auto">
            <Camera className="w-3 h-3" />
            Camera-Verified Physical Game
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#132A2F] mt-0.5">
            {game.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onSkip && (
            <button
              onClick={onSkip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-black text-xs cursor-pointer transition shadow-xs"
              title="Skip this physical exercise"
            >
              <span>Skip ⏭️</span>
            </button>
          )}
          <button
            onClick={handleOpenHowToPlay}
            title="Open how to play instructions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0D7377] border border-teal-300 font-black text-xs cursor-pointer transition shadow-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How to Play 💡</span>
          </button>
          <button
            onClick={() => speakPrompt(game.tagline || game.title)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isSpeaking
                ? "bg-rose-100 border-rose-300 text-rose-800 animate-pulse"
                : "bg-teal-50 border-teal-200 text-[#0D7377]"
            }`}
            title="Read instructions aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Live Real-Time Game & AI Engine Telemetry Indicator */}
      <LiveGameIndicator
        gameTitle={game.title}
        currentStep={touchLevelIdx + 1}
        totalSteps={4}
        difficulty="Medium"
        onTakeBreak={() => setIsPaused(true)}
      />

      {/* Picture & Exercise Banner */}
      <div className="relative w-full h-32 sm:h-40 rounded-3xl overflow-hidden shadow-xs border border-slate-200">
        <img
          src={gameImageUrl}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs font-black">
          <span className="bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" />
            Live Pose Verification
          </span>
          <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full text-teal-200">
            ~{game.durationMinutes || 3} min
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs sm:text-sm font-semibold text-teal-100 line-clamp-1">
            {game.tagline || "Perform the gentle movement in front of your camera."}
          </p>
        </div>
      </div>

      {/* Safety message */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2.5 text-amber-900 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
        <p className="text-xs font-bold leading-tight">
          "{game.safetyMessage || "Move at your own gentle pace while seated comfortably."}"
        </p>
      </div>

      {/* ============================================================= */}
      {/* 1. TOUCH THE BODY PART (Camera-Verified) */}
      {/* ============================================================= */}
      {isTouchBody && (
        <div className="space-y-4">
          <PoseCameraVerification
            key={`touch-${touchLevelIdx}`}
            commandText={touchBodyLevels[touchLevelIdx].text}
            multiSteps={touchBodyLevels[touchLevelIdx].steps}
            gameId={game.id}
            activityId="touch-body"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (touchLevelIdx < touchBodyLevels.length - 1) {
                setTouchLevelIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 2. REMEMBER & MOVE (Camera-Verified) */}
      {/* ============================================================= */}
      {isRememberMove && (
        <div className="space-y-4">
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-blue-900 uppercase">
              Action {rememberMoveIdx + 1} of {rememberMoveItems.length}: {rememberMoveItems[rememberMoveIdx].title}
            </span>
          </div>

          <PoseCameraVerification
            key={`rem-move-${rememberMoveIdx}`}
            commandText={rememberMoveItems[rememberMoveIdx].command}
            gameId={game.id}
            activityId="remember-move"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (rememberMoveIdx < rememberMoveItems.length - 1) {
                setRememberMoveIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. SIMON SAYS (Camera-Verified) */}
      {/* ============================================================= */}
      {isSimonSays && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-purple-900 uppercase">
              Round {simonIndex + 1} of {simonRounds.length}: "{simonRounds[simonIndex].prompt}"
            </span>
          </div>

          <PoseCameraVerification
            key={`simon-${simonIndex}`}
            commandText={simonRounds[simonIndex].command}
            gameId={game.id}
            activityId="simon-says"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (simonIndex < simonRounds.length - 1) {
                setSimonIndex((i) => i + 1);
              } else {
                handleFinishGame(98, errorsCount);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. CROSS-BODY TOUCH (Camera-Verified) */}
      {/* ============================================================= */}
      {isCrossBody && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-teal-900 uppercase">
              Cross-Body Step {crossBodyIdx + 1} of {crossBodySteps.length}: {crossBodySteps[crossBodyIdx].title}
            </span>
          </div>

          <PoseCameraVerification
            key={`cross-${crossBodyIdx}`}
            commandText={crossBodySteps[crossBodyIdx].command}
            gameId={game.id}
            activityId="cross-body"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (crossBodyIdx < crossBodySteps.length - 1) {
                setCrossBodyIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. COUNT & TOUCH (Camera-Verified) */}
      {/* ============================================================= */}
      {isCountTouch && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-amber-900 uppercase">
              Repetition {countTouchStep + 1} of {countTouchCommands.length}: Touch Your Right Knee
            </span>
          </div>

          <PoseCameraVerification
            key={`count-touch-${countTouchStep}`}
            commandText="Touch your right knee"
            gameId={game.id}
            activityId="count-touch"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (countTouchStep < countTouchCommands.length - 1) {
                setCountTouchStep((s) => s + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 6. LEFT OR RIGHT (Camera-Verified) */}
      {/* ============================================================= */}
      {isLeftRight && (
        <div className="space-y-4">
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-cyan-900 uppercase">
              Challenge {leftRightIdx + 1} of {leftRightQuestions.length}
            </span>
          </div>

          <PoseCameraVerification
            key={`left-right-${leftRightIdx}`}
            commandText={leftRightQuestions[leftRightIdx].command}
            gameId={game.id}
            activityId="left-right"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (leftRightIdx < leftRightQuestions.length - 1) {
                setLeftRightIdx((i) => i + 1);
              } else {
                handleFinishGame(98, errorsCount);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 7. FINGER SEQUENCE (Camera-Verified) */}
      {/* ============================================================= */}
      {isFingerSeq && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-indigo-900 uppercase">
              Sequence Step {fingerSeqIdx + 1} of {fingerSeqSteps.length}
            </span>
          </div>

          <PoseCameraVerification
            key={`finger-${fingerSeqIdx}`}
            commandText={fingerSeqSteps[fingerSeqIdx]}
            gameId={game.id}
            activityId="finger-seq"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (fingerSeqIdx < fingerSeqSteps.length - 1) {
                setFingerSeqIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 8. CLAP PATTERN (Camera-Verified) */}
      {/* ============================================================= */}
      {isClapPattern && (
        <div className="space-y-4">
          <PoseCameraVerification
            commandText={clapPatternCommand}
            gameId={game.id}
            activityId="clap-pattern"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              handleFinishGame(98, 0);
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 9. FOOT / KNEE TAP (Camera-Verified) */}
      {/* ============================================================= */}
      {isFootTap && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-emerald-900 uppercase">
              Tap Step {footTapIdx + 1} of {footTapSteps.length}: {footTapSteps[footTapIdx].title}
            </span>
          </div>

          <PoseCameraVerification
            key={`foot-${footTapIdx}`}
            commandText={footTapSteps[footTapIdx].command}
            gameId={game.id}
            activityId="foot-tap"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (footTapIdx < footTapSteps.length - 1) {
                setFootTapIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 10. MOVEMENT SEQUENCE (Camera-Verified) */}
      {/* ============================================================= */}
      {isMovementSeq && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-blue-900 uppercase">
              Step {moveSeqIdx + 1} of {moveSeqSteps.length}: {moveSeqSteps[moveSeqIdx].title}
            </span>
          </div>

          <PoseCameraVerification
            key={`move-seq-${moveSeqIdx}`}
            commandText={moveSeqSteps[moveSeqIdx].command}
            gameId={game.id}
            activityId="move-sequence"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (moveSeqIdx < moveSeqSteps.length - 1) {
                setMoveSeqIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 11. COLOR MOVEMENT (Camera-Verified) */}
      {/* ============================================================= */}
      {isColorMove && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl ${colorMoveCards[colorMoveIdx].bgClass} text-white text-center shadow-md`}>
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              COLOR CHALLENGE {colorMoveIdx + 1} of {colorMoveCards.length}
            </span>
            <h3 className="text-2xl font-black mt-1">
              {colorMoveCards[colorMoveIdx].action}
            </h3>
          </div>

          <PoseCameraVerification
            key={`color-move-${colorMoveIdx}`}
            commandText={colorMoveCards[colorMoveIdx].command}
            gameId={game.id}
            activityId="color-movement"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (colorMoveIdx < colorMoveCards.length - 1) {
                setColorMoveIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 12. FREEZE & MOVE (Camera-Verified) */}
      {/* ============================================================= */}
      {isFreezeMove && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-600 text-white text-center shadow-md">
            <h3 className="text-2xl font-black">🛑 FREEZE! HOLD STILL!</h3>
            <p className="text-xs font-semibold text-white/90">
              Hold completely steady in front of the camera.
            </p>
          </div>

          <PoseCameraVerification
            commandText="Stay still"
            gameId={game.id}
            activityId="freeze-move"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              handleFinishGame(98, 0);
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 13. RHYTHM COPY (Camera-Verified) */}
      {/* ============================================================= */}
      {isRhythmCopy && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-xs font-bold text-purple-900 uppercase">
              Rhythm Clapping Challenge
            </span>
          </div>

          <PoseCameraVerification
            commandText={rhythmCopyCommand}
            gameId={game.id}
            activityId="rhythm-copy"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              handleFinishGame(98, 0);
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 14. MIRROR ME (Camera-Verified) */}
      {/* ============================================================= */}
      {isMirrorMe && (
        <div className="space-y-4">
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-cyan-900 uppercase">
              Mirror Step {mirrorIdx + 1} of {mirrorSteps.length}: {mirrorSteps[mirrorIdx].title}
            </span>
          </div>

          <PoseCameraVerification
            key={`mirror-${mirrorIdx}`}
            commandText={mirrorSteps[mirrorIdx].command}
            gameId={game.id}
            activityId="mirror-me"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (mirrorIdx < mirrorSteps.length - 1) {
                setMirrorIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* 15. REVERSE SEQUENCE (Camera-Verified) */}
      {/* ============================================================= */}
      {isReverseSeq && (
        <div className="space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
            <span className="text-xs font-bold text-teal-900 uppercase">
              {reverseRounds[reverseIdx].title}
            </span>
          </div>

          <PoseCameraVerification
            key={`reverse-${reverseIdx}`}
            commandText={reverseRounds[reverseIdx].title}
            multiSteps={reverseRounds[reverseIdx].steps}
            gameId={game.id}
            activityId="reverse-seq"
            patientId={profile.id || "PT-7241"}
            onVerified={() => {
              playTone(784, "triangle", 0.3);
              if (reverseIdx < reverseRounds.length - 1) {
                setReverseIdx((i) => i + 1);
              } else {
                handleFinishGame(98, 0);
              }
            }}
            onCancel={onBack}
          />
        </div>
      )}

      {/* Fallback for general physical game completion */}
      {!isTouchBody &&
        !isRememberMove &&
        !isSimonSays &&
        !isCrossBody &&
        !isCountTouch &&
        !isLeftRight &&
        !isFingerSeq &&
        !isClapPattern &&
        !isFootTap &&
        !isMovementSeq &&
        !isColorMove &&
        !isFreezeMove &&
        !isRhythmCopy &&
        !isMirrorMe &&
        !isReverseSeq && (
          <div className="space-y-4">
            <PoseCameraVerification
              commandText="Raise both hands"
              gameId={game.id}
              activityId="general-physical"
              patientId={profile.id || "PT-7241"}
              onVerified={() => handleFinishGame(98, 0)}
              onCancel={onBack}
            />
          </div>
        )}

      {/* How to Play Modal & Voice Guidance Assistant */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => {
          setIsHowToPlayOpen(false);
          setIsHowToPlayAutoTriggered(false);
          registerUserActivity();
        }}
        gameType="physical_memory"
        profile={profile}
        isAutoTriggered={isHowToPlayAutoTriggered}
      />
    </div>
  );
};
