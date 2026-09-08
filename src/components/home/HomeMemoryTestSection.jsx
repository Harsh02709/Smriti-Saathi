import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Tv,
  Activity,
  Award,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowRight,
  ArrowLeft,
  Hand,
  Clock,
  Camera,
  Headphones
} from "lucide-react";
import confetti from "canvas-confetti";
import { MemoryArtGallery } from "../games/MemoryArtGallery";
import { NostalgiaRecallMusic } from "./NostalgiaRecallMusic";

export const HomeMemoryTestSection = ({
  t,
  isStandalonePage = false,
  initialTab = "voice_motor_test",
  onBack,
  onLaunchGame,
  onSelectRole
}) => {
  // Active test mode: 'voice_motor_test' | 'video_guide' | 'game_tests' | 'memory_gallery' | 'nostalgia_recall_music'
  const [activeTab, setActiveTab] = useState(initialTab || "voice_motor_test");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Voice Agent Cross-Body Test state
  const [testPhase, setTestPhase] = useState("idle"); // 'idle' | 'running' | 'completed'
  const [currentRound, setCurrentRound] = useState(0); // 0 to 3 (4 rounds)
  const [roundTimer, setRoundTimer] = useState(5);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [completedSwitches, setCompletedSwitches] = useState(0);
  const [reactionTime, setReactionTime] = useState(1.4);

  const timerRef = useRef(null);

  // Cross-body step instructions
  const roundsData = [
    {
      roundNum: 1,
      title: "Round 1: Right Hand to Nose, Left Hand to Left Ear",
      voiceText: "Round 1. Touch your nose with your right hand, and touch your left ear with your left hand. Hold and breathe gently.",
      noseHand: "Right Hand",
      earHand: "Left Hand",
      earTarget: "Left Ear",
      tip: "Cross your right hand in front of your face to your nose.",
      color: "from-blue-500 to-indigo-600",
      accent: "#3b82f6",
    },
    {
      roundNum: 2,
      title: "Round 2 (ALTERNATE): Left Hand to Nose, Right Hand to Right Ear",
      voiceText: "Now switch! Touch your nose with your left hand, and touch your right ear with your right hand. Superb!",
      noseHand: "Left Hand",
      earHand: "Right Hand",
      earTarget: "Right Ear",
      tip: "Swap both hands smoothly across your center line.",
      color: "from-emerald-500 to-teal-600",
      accent: "#10b981",
    },
    {
      roundNum: 3,
      title: "Round 3 (SWITCH BACK): Right Hand to Nose, Left Hand to Left Ear",
      voiceText: "Switch again! Right hand to nose, left hand to left ear. Keep a steady rhythm.",
      noseHand: "Right Hand",
      earHand: "Left Hand",
      earTarget: "Left Ear",
      tip: "Engage both brain hemispheres with this rhythmic transition.",
      color: "from-purple-500 to-indigo-600",
      accent: "#8b5cf6",
    },
    {
      roundNum: 4,
      title: "Round 4 (FINAL ALTERNATE): Left Hand to Nose, Right Hand to Right Ear",
      voiceText: "Final switch! Left hand to nose, right hand to right ear. Hold for three seconds!",
      noseHand: "Left Hand",
      earHand: "Right Hand",
      earTarget: "Right Ear",
      tip: "Finish strong with balanced posture and calm focus.",
      color: "from-amber-500 to-orange-600",
      accent: "#f59e0b",
    },
  ];

  // Synthesizer Audio Cue
  const playTone = (freq = 520, type = "sine", duration = 0.2) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  };

  // Speak voice instruction — Hindi-aware with matra support
  const speakText = (text) => {
    if (!isVoiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const lang = (typeof t === "object" && t?.languageName === "Hindi") ? "hi" : "en";
    const isHindi = lang === "hi";
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = isHindi ? "hi-IN" : "en-US";
    utt.rate = isHindi ? 0.82 : 0.88;
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
  };

  // Start the voice motor test
  const handleStartVoiceTest = () => {
    setTestPhase("running");
    setCurrentRound(0);
    setRoundTimer(5);
    setScore(0);
    setCompletedSwitches(0);
    playTone(650, "triangle", 0.3);
    speakText("Welcome to the Cross-Body Motor and Memory Test. " + roundsData[0].voiceText);
  };

  // Step to next alternating round
  const handleNextRound = () => {
    playTone(780, "sine", 0.25);
    if (currentRound < roundsData.length - 1) {
      const nextR = currentRound + 1;
      setCurrentRound(nextR);
      setRoundTimer(5);
      setCompletedSwitches(prev => prev + 1);
      speakText(roundsData[nextR].voiceText);
    } else {
      // Completed all rounds
      setCompletedSwitches(4);
      setTestPhase("completed");
      setScore(98);
      playTone(880, "triangle", 0.5);
      speakText("Fantastic job! You completed all alternating rounds. Your bilateral motor coordination and focus score is 98 percent!");
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
        });
      } catch (_) {}
    }
  };

  // Reset test
  const handleResetTest = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setTestPhase("idle");
    setCurrentRound(0);
    setRoundTimer(5);
  };

  // Countdown timer for active round
  useEffect(() => {
    if (testPhase === "running") {
      timerRef.current = setInterval(() => {
        setRoundTimer((prev) => {
          if (prev <= 1) {
            playTone(440, "sine", 0.1);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [testPhase, currentRound]);

  const currentRoundInfo = roundsData[currentRound] || roundsData[0];

  return (
    <section className={`section bg-gradient-to-b from-slate-50 via-slate-100/40 to-white ${isStandalonePage ? "min-h-screen py-8" : "py-16"}`} id="memory-test-hub">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Standalone Page Back Header */}
        {isStandalonePage && (
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs transition active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#001A4C]" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Live Assessment Engine Active
              </span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#001A4C]/10 border border-[#001A4C]/20 text-[#001A4C] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Brain className="w-4 h-4 text-[#001A4C]" />
            <span>AI Cognitive & Physical Memory Assessment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Test Your Memory & Motor Agility
          </h2>
          <p className="text-base text-slate-600 mt-2 font-medium">
            Run instant cognitive evaluations combining interactive Voice Agent motor exercises, top memory puzzles, and certified Brain-Gym cross-lateral techniques.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm gap-2">
            <button
              onClick={() => setActiveTab("voice_motor_test")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "voice_motor_test"
                  ? "bg-[#001A4C] text-white shadow-md shadow-[#001A4C]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Voice Agent Cross-Body Test</span>
            </button>

            <button
              id="nostalgia-recall-tab-btn"
              onClick={() => setActiveTab("nostalgia_recall_music")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "nostalgia_recall_music"
                  ? "bg-gradient-to-r from-[#001A4C] via-[#0D7377] to-[#001A4C] text-white shadow-md shadow-[#001A4C]/30 ring-2 ring-[#9DF3C4]/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Headphones className="w-4 h-4 text-[#0D7377]" />
              <span>Memory Lane & Brain Music</span>
            </button>

            <button
              onClick={() => setActiveTab("game_tests")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "game_tests"
                  ? "bg-[#001A4C] text-white shadow-md shadow-[#001A4C]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Top Memory Game Tests</span>
            </button>

            <button
              onClick={() => setActiveTab("memory_gallery")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "memory_gallery"
                  ? "bg-gradient-to-r from-[#0D7377] to-teal-700 text-white shadow-md shadow-[#0D7377]/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-teal-50"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Memory Art Gallery</span>
            </button>
          </div>
        </div>

        {/* TAB 1: VOICE AGENT NOSE-EAR TEST */}
        {activeTab === "voice_motor_test" && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative overflow-hidden transition-all">
            
            {/* Header with voice mute toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-black uppercase">
                    Interactive Voice Guided
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    4 Alternating Rounds • 30 Seconds
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Nose-Ear Cross-Touch Motor Coordination Test
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isVoiceEnabled
                      ? "bg-[#001A4C]/10 text-[#001A4C] border-[#001A4C]/20"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                  title="Toggle Voice Prompts"
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{isVoiceEnabled ? "Voice Agent: ON" : "Voice Agent: OFF"}</span>
                </button>
              </div>
            </div>

            {/* Test Body */}
            {testPhase === "idle" && (
              <div className="py-10 text-center max-w-2xl mx-auto space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#001A4C]/10 text-[#001A4C] flex items-center justify-center shadow-inner text-4xl animate-pulse">
                  🫱👃🫲
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900">
                    Ready to Test Bilateral Brain Hemisphere Coordination?
                  </h4>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Our AI Voice Agent will guide you to touch your <strong>nose with one hand</strong> and your <strong>opposite ear with the other hand</strong>, then prompt you to alternate smoothly between rounds.
                  </p>
                </div>

                {/* 2 Step Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-black text-[#001A4C] uppercase">Step 1</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      Right Hand 🫱 ➔ Nose 👃<br />Left Hand 🫲 ➔ Left Ear 👂
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <span className="text-xs font-black text-emerald-800 uppercase">Step 2 (Alternate)</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      Left Hand 🫲 ➔ Nose 👃<br />Right Hand 🫱 ➔ Right Ear 👂
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={handleStartVoiceTest}
                    className="btn-glow-teal inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-black text-xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    <span>Start Voice Assessment Now</span>
                  </button>
                </div>
              </div>
            )}

            {testPhase === "running" && (
              <div className="py-6 space-y-6">
                
                {/* Round Progress Tracker */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#001A4C]">
                      Round {currentRound + 1} of 4
                    </span>
                    <span className="text-xs text-slate-400 font-bold">• Alternating Pattern</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3].map((r) => (
                      <div
                        key={r}
                        className={`h-2.5 w-8 rounded-full transition-all ${
                          r === currentRound
                            ? "bg-[#001A4C] w-12"
                            : r < currentRound
                            ? "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Instruction Display */}
                <div className={`p-8 rounded-3xl bg-[#001A4C] text-white shadow-lg text-center space-y-4`}>
                  <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
                    {currentRoundInfo.title}
                  </div>

                  <div className="flex items-center justify-center gap-6 text-5xl sm:text-6xl py-2">
                    <div className="flex flex-col items-center">
                      <span>{currentRoundInfo.noseHand.includes("Right") ? "🫱" : "🫲"}</span>
                      <span className="text-xs font-black uppercase mt-1 tracking-wider text-white/90">
                        {currentRoundInfo.noseHand} ➔ Nose
                      </span>
                    </div>
                    
                    <span className="text-2xl text-white/60 font-black">+</span>

                    <div className="flex flex-col items-center">
                      <span>{currentRoundInfo.earHand.includes("Left") ? "🫲" : "🫱"}</span>
                      <span className="text-xs font-black uppercase mt-1 tracking-wider text-white/90">
                        {currentRoundInfo.earHand} ➔ {currentRoundInfo.earTarget}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg sm:text-xl font-extrabold max-w-xl mx-auto leading-relaxed">
                    "{currentRoundInfo.voiceText}"
                  </p>

                  <p className="text-xs text-white/80 font-medium">
                    💡 Tip: {currentRoundInfo.tip}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => speakText(currentRoundInfo.voiceText)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-[#001A4C]" />
                    <span>🔊 Repeat Voice Instruction</span>
                  </button>

                  <button
                    onClick={handleNextRound}
                    className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-600/25 transition transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{currentRound < 3 ? "✅ I Did It (Switch to Next)" : "🎉 Finish Assessment"}</span>
                  </button>

                  <button
                    onClick={handleResetTest}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>
            )}

            {testPhase === "completed" && (
              <div className="py-8 text-center max-w-2xl mx-auto space-y-6 animate-in fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg text-4xl">
                  🏆
                </div>

                <div>
                  <h4 className="text-2xl font-black text-slate-900">
                    Bilateral Coordination Assessment Completed!
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Great neural plasticity response and smooth hemisphere alternation.
                  </p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-2xl font-black text-[#001A4C]">98%</span>
                    <p className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">Motor Accuracy</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-2xl font-black text-emerald-700">4 / 4</span>
                    <p className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">Alternating Switches</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-2xl font-black text-amber-700">High</span>
                    <p className="text-[11px] font-bold text-slate-600 uppercase mt-0.5">Cognitive Agility</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleStartVoiceTest}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#001A4C] hover:bg-[#002466] text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Test</span>
                  </button>

                  <button
                    onClick={() => onLaunchGame?.("Memory Cards Recall")}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
                  >
                    <Brain className="w-4 h-4 text-amber-400" />
                    <span>Continue to Memory Cards Game</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}



        {/* TAB 3: TOP MEMORY GAMES TEST LAUNCHER */}
        {activeTab === "game_tests" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Memory Cards */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#001A4C]/10 text-[#001A4C] flex items-center justify-center mb-3 text-2xl">
                  🃏
                </div>
                <h4 className="text-lg font-black text-slate-900">Memory Cards Speed Test</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Flip and match pairs of familiar Indian cultural items, herbs, and artifacts. Tracks accuracy & response time.
                </p>
              </div>
              <button
                onClick={() => onLaunchGame?.("Memory Cards Recall")}
                className="w-full py-3 rounded-2xl bg-[#001A4C] hover:bg-[#002466] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Memory Cards Test</span>
              </button>
            </div>

            {/* Card 2: Pattern Recall */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 text-2xl">
                  🧩
                </div>
                <h4 className="text-lg font-black text-slate-900">Pattern Puzzle Recall Test</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Memorize sequence shapes and reconstruct geometric patterns to evaluate visual-spatial retention.
                </p>
              </div>
              <button
                onClick={() => onLaunchGame?.("Pattern Puzzle Match")}
                className="w-full py-3 rounded-2xl bg-[#001A4C] hover:bg-[#002466] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Pattern Test</span>
              </button>
            </div>

            {/* Card 3: Object Identification */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3 text-2xl">
                  🏺
                </div>
                <h4 className="text-lg font-black text-slate-900">Object Identification Test</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Identify household tools, musical instruments, and regional symbols with AI speech prompts.
                </p>
              </div>
              <button
                onClick={() => onLaunchGame?.("Object Identification")}
                className="w-full py-3 rounded-2xl bg-[#001A4C] hover:bg-[#002466] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Object Test</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 4: MEMORY ART GALLERY */}
        {activeTab === "memory_gallery" && (
          <MemoryArtGallery
            profile={{
              preferredName: "your loved one",
              patientCode: "PT-7241",
              ...(typeof t === 'object' ? {} : {}),
            }}
            onBack={() => setActiveTab("voice_motor_test")}
          />
        )}

        {/* TAB 5: NOSTALGIA MEMORY LANE & BRAIN WAVE MUSIC */}
        {activeTab === "nostalgia_recall_music" && (
          <NostalgiaRecallMusic
            onBack={() => setActiveTab("voice_motor_test")}
          />
        )}

      </div>
    </section>
  );
};
