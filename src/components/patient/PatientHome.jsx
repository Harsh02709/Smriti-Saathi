import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChatCall } from "../../context/ChatCallContext";
import {
  allUnifiedGames
} from "../../data/unifiedGamesData";
import { TourDriver } from "./TourDriver";
import { TASK_GAME_MAP } from "../../data/tourData";
import { translations } from "../../data/translations";
import {
  ElderlyAvatar,
  MorningStretchGraphic,
  MemoryMatchGraphic,
  PatternRecallGraphic
} from "../common/GraphicAssets";
import {
  Brain,
  Sparkles,
  Volume2,
  Phone,
  Play,
  Calendar,
  CloudSun,
  Droplets,
  Pill,
  Home as HomeIcon,
  CheckSquare,
  BarChart2,
  Settings,
  Check,
  Gamepad2,
  BookOpen,
  Stethoscope,
  LogIn,
  Lock,
  ArrowRight,
  ShieldAlert,
  BellRing,
  MessageSquare,
  Video
} from "lucide-react";
import { IconHelper } from "../common/IconHelper";
export const PatientHome = ({
  profile,
  tasks,
  physicalActivities = [],
  freePlayGames,
  reminders,
  performance,
  onStartTask,
  onStartPhysicalActivity,
  onOpenOfflineCenter,
  onOpenVoice,
  onOpenCaregiverCall,
  onToggleReminder,
  onNavigateTab,
  onOpenDoctorPortal,
  onOpenAuthModal,
  onStartBeginnersRoutine,
  appMode = "beginners"
}) => {
  const { currentUser } = useAuth();
  const { setIsPatientChatModalOpen, startVideoCall, unreadCountForPatient } = useChatCall();
  const isDoctor = currentUser?.role === "doctor";
  const t = translations[profile.language];
  const [selectedGameFilter, setSelectedGameFilter] = useState("all");
  const filteredGames = allUnifiedGames.filter((game) => {
    if (selectedGameFilter === "all") return true;
    if (selectedGameFilter === "physical") return game.gameType === "physical_memory";
    if (selectedGameFilter === "cognitive") return game.gameType === "cognitive";
    return game.coreCategory === selectedGameFilter;
  });
  const handleLaunchGame = (game) => {
    const task = {
      id: game.id,
      title: game.title.toUpperCase(),
      domain: game.domain || "Memory",
      difficulty: game.difficulty || "Easy",
      durationMinutes: game.durationMinutes,
      doctorAssigned: false,
      status: "pending",
      iconName: game.iconName,
      description: game.tagline,
      required: false
    };
    onStartTask(task);
  };
  // ── Tour integration: launch the correct game domain when tour starts a step ──
  const handleTourLaunchGame = (taskIndex) => {
    const domain = TASK_GAME_MAP[taskIndex]; // e.g. "memory", "attention"
    const match = allUnifiedGames.find(
      (g) => g.coreCategory?.toLowerCase().includes(domain) && g.gameType === "cognitive"
    ) ?? allUnifiedGames.find(
      (g) => g.coreCategory?.toLowerCase().includes(domain)
    ) ?? allUnifiedGames[0];

    const task = {
      id: match.id,
      title: match.title.toUpperCase(),
      domain: match.domain || "Memory",
      difficulty: match.difficulty || "Easy",
      durationMinutes: match.durationMinutes,
      doctorAssigned: false,
      status: "pending",
      iconName: match.iconName,
      description: match.tagline,
      required: false,
    };
    onStartTask(task);
  };

  const handleLaunchGameByName = (gameName) => {
    const matchedUnified = allUnifiedGames.find(
      (g) => g.title.toLowerCase().includes(gameName.toLowerCase())
    );
    if (matchedUnified) {
      handleLaunchGame(matchedUnified);
      return;
    }
    const matched = tasks.find((t2) => t2.title.toLowerCase().includes(gameName.toLowerCase())) || {
      id: `task-${gameName.toLowerCase().replace(/[\s\.\&]+/g, "-")}`,
      title: gameName.toUpperCase(),
      domain: "Memory",
      difficulty: "Easy",
      durationMinutes: 5,
      doctorAssigned: false,
      status: "pending",
      iconName: "Brain",
      description: `Engage with ${gameName} at a calm, supportive pace.`,
      required: false
    };
    onStartTask(matched);
  };
  // ── Render a single game card ─────────────────────────────────────────────
  const renderGameCard = (game) => (
    <div
      key={game.id}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0D7377]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full shadow-2xs"
    >
      {/* Picture Banner with Badges & Gradient */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={game.imageUrl}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${game.gameType === "physical_memory" ? "bg-emerald-600/95 text-white" : "bg-indigo-600/95 text-white"}`}>
            {game.gameType === "physical_memory" ? "🤸 Physical + Memory" : "🧠 Cognitive"}
          </span>
          {game.popular && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-xs">
              ★ Popular
            </span>
          )}
        </div>
        {/* Bottom Overlay Info on Picture */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold pointer-events-none">
          <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">⏱️ ~{game.durationMinutes} min</span>
          <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-teal-200">{game.difficulty}</span>
        </div>
      </div>
      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${game.color} text-white flex items-center justify-center shadow-2xs shrink-0`}>
              <IconHelper name={game.iconName} className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm sm:text-base text-[#0A2540] group-hover:text-[#0D7377] transition-colors leading-tight truncate">
                {game.title}
              </h3>
              <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-teal-100 truncate max-w-full">
                {game.coreCategoryLabel}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">{game.tagline}</p>
          <div className="text-[11px] text-teal-900 font-semibold bg-teal-50/80 p-2.5 rounded-xl border border-teal-100/90 leading-snug line-clamp-2">
            <span className="font-extrabold text-[#0D7377]">Example:</span> {game.examplePrompt}
          </div>
        </div>
        {/* Bottom Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">
            Domain: <strong className="text-teal-800">{game.domain}</strong>
          </span>
          <button
            onClick={() => handleLaunchGame(game)}
            className="py-2 px-3.5 sm:px-4 bg-[#0D7377] hover:bg-[#0A5C5F] active:bg-[#074648] text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs hover:shadow transition active:scale-95 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>PLAY NOW</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pt-16 select-none animate-in fade-in duration-200">

      {/* ============================================================ */}
      {/* TOP NAVIGATION BAR (Home, Games, Tasks, Analysis, Caregiver) */}
      {/* ============================================================ */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-2 shadow-md">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between">

          {/* Home (Active) */}
          <button
            onClick={() => onNavigateTab("home")}
            className="flex flex-col items-center text-[#1D7BF6] font-bold text-[10px] gap-0.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <HomeIcon className="w-4.5 h-4.5 text-[#1D7BF6]" />
            </div>
            <span>Home</span>
          </button>

          {/* Games (Free Play) */}
          <button
            onClick={() => onNavigateTab("games")}
            className="flex flex-col items-center text-slate-500 hover:text-[#0D7377] font-bold text-[10px] gap-0.5 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full hover:bg-teal-50 flex items-center justify-center">
              <Gamepad2 className="w-4.5 h-4.5" />
            </div>
            <span>Games</span>
          </button>

          {/* Tasks */}
          <button
            onClick={() => onNavigateTab("tasks")}
            className="flex flex-col items-center text-slate-500 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
            <span>Tasks</span>
          </button>

          {/* Analysis */}
          <button
            onClick={() => onNavigateTab("analysis")}
            className="flex flex-col items-center text-slate-500 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <BarChart2 className="w-4.5 h-4.5" />
            </div>
            <span>Analysis</span>
          </button>

          {/* Settings / Caregiver */}
          <button
            onClick={onOpenCaregiverCall}
            className="flex flex-col items-center text-slate-500 hover:text-rose-600 font-bold text-[10px] gap-0.5 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full hover:bg-rose-50 flex items-center justify-center">
              <Settings className="w-4.5 h-4.5" />
            </div>
            <span>Caregiver</span>
          </button>

        </div>
      </div>

      {/* Guided Tour Driver — renders portals into document.body */}
      <TourDriver
        language={profile.language}
        onLaunchGame={handleTourLaunchGame}
      />

      {/* Offline Alert if active */}
      {profile.isOffline && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-3.5 sm:p-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-amber-900 text-sm mb-0.5">
              {t.offlineMode}
            </h4>
            <p className="text-xs text-amber-800 font-medium">
              {t.offlineSub}
            </p>
          </div>
        </div>
      )}

      {/* 1. TOP GREETING HEADER (GOOD MORNING / DATE / VOICE) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0A2540] tracking-tight uppercase">
            GOOD MORNING, {profile.preferredName.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mt-0.5">
            Tuesday, 25 August · Guwahati, Assam
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#0D7377] mt-0.5">
            How are you feeling today?
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <button
            onClick={onOpenVoice}
            title="Voice Assistant"
            className="h-11 sm:h-12 px-4 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 flex items-center gap-2 text-[#0D7377] font-bold text-xs shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">Voice Help</span>
          </button>
          <button
            onClick={onOpenVoice}
            title="Profile & Voice Companion"
            className="relative hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <ElderlyAvatar size="w-11 h-11 sm:w-12 sm:h-12" />
          </button>
        </div>
      </div>

      {/* 2. PRIMARY HERO CARD: TODAY'S ACTIVITIES & START TODAY'S TASKS */}
      <div className="bg-gradient-to-br from-[#0D7377] to-[#148A85] rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-[#0D7377]/25 space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-[#9DF3C4] inline-block">
                {tasks.filter((t2) => t2.status === "pending").length} TASKS REMAINING
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full inline-block">
                🌱 Mode 1: Beginner's Guided
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
              DOCTOR'S APPOINTED ROUTINE
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 font-medium">
              Top 6 sequential cognitive exercises with voice guide, health reminders & doctor summary
            </p>
          </div>
          <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/15 items-center justify-center text-[#9DF3C4] shrink-0">
            <Brain className="w-8 h-8" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#9DF3C4] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(tasks.filter((t2) => t2.status === "completed").length / tasks.length * 100)}%`
              }}
            />
          </div>
        </div>

        {/* PRIMARY START BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <button
            onClick={() => {
              if (onStartBeginnersRoutine) {
                onStartBeginnersRoutine();
              } else {
                const nextPending = tasks.find((t2) => t2.status !== "completed") || tasks[0];
                onStartTask(nextPending);
              }
            }}
            className="btn-glow-teal w-full py-4 sm:py-5 bg-white hover:bg-teal-50 text-[#0D7377] rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl transition active:scale-98 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
              <Play className="w-4 h-4 fill-[#0D7377] text-[#0D7377] ml-0.5" />
            </div>
            <span>START 6-GAME GUIDED ROUTINE</span>
          </button>

          <button
            onClick={() => {
              const nextPending = tasks.find((t2) => t2.status !== "completed") || tasks[0];
              onStartTask(nextPending);
            }}
            className="btn-glow-teal w-full py-4 sm:py-5 bg-teal-800/80 hover:bg-teal-800 border-2 border-white/40 text-white rounded-2xl sm:rounded-3xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-teal-200" />
            <span>START APPOINTED TASK</span>
          </button>
        </div>
      </div>

      {/* 3. TODAY'S REQUIRED TASKS (DOCTOR ASSIGNED - Responsive Grid) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base lg:text-lg font-black text-[#0A2540] uppercase tracking-tight">
              TODAY'S REQUIRED FOCUS
            </h2>
            <p className="text-xs text-slate-500 font-medium">Prescribed daily cognitive sessions</p>
          </div>
          <span className="text-[11px] font-black uppercase text-[#1D7BF6] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            DOCTOR ASSIGNED
          </span>
        </div>

        {/* Responsive Grid of Cards (1 col mobile, 2 col tablet, 4 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: MORNING STRETCH (Blue) */}
          <div className="bg-[#1D7BF6] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 sm:h-52 shadow-md shadow-blue-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <MorningStretchGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight truncate">
                MORNING STRETCH
              </h3>
              <button
                onClick={() => handleLaunchGameByName("Morning Stretch")}
                className="w-full py-2 bg-white text-[#1D7BF6] hover:bg-blue-50 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>PLAY</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Card 2: MEMORY MATCH GAME (Green) */}
          <div className="bg-[#28B463] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 sm:h-52 shadow-md shadow-green-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <MemoryMatchGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight truncate">
                MEMORY MATCH
              </h3>
              <button
                onClick={() => handleLaunchGameByName("Memory Match")}
                className="w-full py-2 bg-white text-[#28B463] hover:bg-emerald-50 rounded-full font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>COMPLETED</span>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Card 3: STORY RECALL (Orange) */}
          <div className="bg-[#FF7A00] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 sm:h-52 shadow-md shadow-orange-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <BookOpen className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight truncate">
                  STORY RECALL
                </h3>
                <span className="text-[9px] font-black uppercase bg-white/30 px-1.5 py-0.5 rounded">
                  TODAY
                </span>
              </div>
              <button
                onClick={() => handleLaunchGameByName("Story Recall")}
                className="w-full py-2 bg-white text-[#FF7A00] hover:bg-orange-50 rounded-full font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>PLAY</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Card 4: PATTERN RECALL (Slate / Completed) */}
          <div className="bg-[#28B463] rounded-3xl p-4 sm:p-5 text-white flex flex-col justify-between h-48 sm:h-52 shadow-md shadow-green-500/20 relative overflow-hidden group">
            <div className="flex items-center justify-center my-auto">
              <PatternRecallGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight truncate">
                PATTERN RECALL
              </h3>
              <button
                onClick={() => handleLaunchGameByName("Pattern Recall")}
                className="w-full py-2 bg-white text-[#28B463] hover:bg-emerald-50 rounded-full font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <span>COMPLETED</span>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. WEATHER & ROUTINE ASSISTANCE CARD */}
      <div className="bg-amber-50 rounded-3xl p-4 sm:p-5 border border-amber-200 flex items-start gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
          <CloudSun className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
              DAILY ASSISTANT
            </span>
            <span className="text-xs font-bold text-amber-900">28°C · Guwahati</span>
          </div>
          <p className="text-xs text-amber-900 font-semibold leading-relaxed pt-1">
            "Gentle weather this morning. Hydrate well and choose any cognitive or movement exercise below at your own calm pace."
          </p>
        </div>
      </div>

      {/* 5. UNIFIED ALL-IN-ONE GAMES & ACTIVITIES DIRECTORY (30 GAMES) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-black text-[#0A2540] uppercase tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#0D7377]" />
              <span>ALL GAMES & ACTIVITIES ({allUnifiedGames.length})</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Cognitive training & Physical + Memory exercises in one categorized hub
            </p>
          </div>
          <span className="text-xs font-black text-[#0D7377] bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 self-start sm:self-auto">
            {filteredGames.length} Available
          </span>
        </div>

        {/* Unified Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none flex-nowrap lg:flex-wrap">
          {[
            { id: "all", label: `All (${allUnifiedGames.length})` },
            { id: "memory_improvement", label: "🧠 Memory Improvement" },
            { id: "attention_concentration", label: "🎯 Attention & Concentration" },
            { id: "daily_routine_recall", label: "📅 Daily Routine Recall" },
            { id: "pattern_recognition", label: "🧩 Pattern Recognition" },
            { id: "object_recognition", label: "🔍 Object Recognition" },
            { id: "emotional_mental_engagement", label: "💖 Emotional / Mental" },
            { id: "physical", label: "🤸 Physical (15)" },
            { id: "cognitive", label: "💡 Cognitive (15)" }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setSelectedGameFilter(flt.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${
                selectedGameFilter === flt.id
                  ? "bg-[#0D7377] text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Categorized Game Boxes with Responsive Grids */}
        <div className="space-y-6">
          {/* cat-1: Memory Improvement */}
          {(selectedGameFilter === "all" || selectedGameFilter === "memory_improvement") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div id="cat-1" className="flex items-center justify-between px-3 py-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs sm:text-sm font-black uppercase text-emerald-800 tracking-tight">🧠 Memory Improvement</span>
                <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.coreCategory === "memory_improvement").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.coreCategory === "memory_improvement").map(game => renderGameCard(game))}
              </div>
            </div>
          )}

          {/* cat-2: Attention & Concentration */}
          {(selectedGameFilter === "all" || selectedGameFilter === "attention_concentration") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div id="cat-2" className="flex items-center justify-between px-3 py-2 bg-indigo-50 rounded-2xl border border-indigo-200">
                <span className="text-xs sm:text-sm font-black uppercase text-indigo-800 tracking-tight">🎯 Attention &amp; Concentration</span>
                <span className="text-[10px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.coreCategory === "attention_concentration").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.coreCategory === "attention_concentration").map(game => renderGameCard(game))}
              </div>
            </div>
          )}

          {/* cat-3: Daily Routine Recall */}
          {(selectedGameFilter === "all" || selectedGameFilter === "daily_routine_recall") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div id="cat-3" className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-xs sm:text-sm font-black uppercase text-amber-800 tracking-tight">📅 Daily Routine Recall</span>
                <span className="text-[10px] font-black text-amber-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.coreCategory === "daily_routine_recall").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.coreCategory === "daily_routine_recall").map(game => renderGameCard(game))}
              </div>
            </div>
          )}

          {/* cat-4: Pattern Recognition */}
          {(selectedGameFilter === "all" || selectedGameFilter === "pattern_recognition") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div id="cat-4" className="flex items-center justify-between px-3 py-2 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="text-xs sm:text-sm font-black uppercase text-purple-800 tracking-tight">🧩 Pattern Recognition</span>
                <span className="text-[10px] font-black text-purple-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.coreCategory === "pattern_recognition").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.coreCategory === "pattern_recognition").map(game => renderGameCard(game))}
              </div>
            </div>
          )}

          {/* cat-5: Object Recognition */}
          {(selectedGameFilter === "all" || selectedGameFilter === "object_recognition") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div id="cat-5" className="flex items-center justify-between px-3 py-2 bg-rose-50 rounded-2xl border border-rose-200">
                <span className="text-xs sm:text-sm font-black uppercase text-rose-800 tracking-tight">🔍 Object Recognition</span>
                <span className="text-[10px] font-black text-rose-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.coreCategory === "object_recognition").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.coreCategory === "object_recognition").map(game => renderGameCard(game))}
              </div>
            </div>
          )}

          {/* cat-6: Emotional / Mental Engagement */}
          {(selectedGameFilter === "all" || selectedGameFilter === "emotional_mental_engagement") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div id="cat-6" className="flex items-center justify-between px-3 py-2 bg-teal-50 rounded-2xl border border-teal-200">
                <span className="text-xs sm:text-sm font-black uppercase text-teal-800 tracking-tight">💖 Emotional / Mental Engagement</span>
                <span className="text-[10px] font-black text-teal-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.coreCategory === "emotional_mental_engagement").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.coreCategory === "emotional_mental_engagement").map(game => renderGameCard(game))}
              </div>
            </div>
          )}

          {/* Physical games */}
          {(selectedGameFilter === "all" || selectedGameFilter === "physical") && (
            <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-2xl border border-green-200">
                <span className="text-xs sm:text-sm font-black uppercase text-green-800 tracking-tight">🤸 Physical + Memory</span>
                <span className="text-[10px] font-black text-green-700 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {allUnifiedGames.filter(g => g.gameType === "physical_memory").length} Games
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGames.filter(g => g.gameType === "physical_memory").map(game => renderGameCard(game))}
              </div>
            </div>
          )}
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 6. DAILY REMINDERS & MEDICINE CHECK */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-[#001A4C] text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-[#001A4C] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase text-white tracking-tight flex items-center gap-2">
            <BellRing className="w-4 h-4 text-blue-300" />
            <span>YOUR REMINDERS</span>
          </h3>
          <span className="text-[11px] font-bold text-blue-200">TODAY</span>
        </div>

        <div className="space-y-2">
          {reminders.map((rem) => <div
            key={rem.id}
            className={`p-3 rounded-2xl border flex items-center justify-between transition ${
              rem.completed
                ? "bg-white/10 border-white/15 opacity-75"
                : "bg-white/15 border-white/20 hover:bg-white/20"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                rem.category === "medicine"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  : rem.category === "water"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
              }`}>
                {rem.category === "medicine" ? <Pill className="w-4 h-4" /> : rem.category === "water" ? <Droplets className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">{rem.title}</h4>
                <p className="text-[10px] font-bold text-blue-300">{rem.time}</p>
              </div>
            </div>

            <button
              onClick={() => onToggleReminder(rem.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition cursor-pointer ${
                rem.completed
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-[#3B82F6] text-white hover:bg-blue-600 shadow-sm"
              }`}
            >
              {rem.completed ? "✓ DONE" : rem.actionLabel}
            </button>
          </div>)}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6.1 DOCTOR LIVE WEBSOCKET CHAT & VIDEO TELECONSULTATION */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-br from-[#0D7377] via-teal-800 to-[#132A2F] rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-teal-900/20 space-y-4 border border-teal-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-[#9DF3C4]/40 flex items-center justify-center text-[#9DF3C4] shadow-inner shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-400/20 text-[#9DF3C4] border border-teal-300/30">
                  Live Clinician Channel
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Doctor Online
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold font-display text-white mt-1">
                {profile.doctorName || "Dr. Debabrata Roy, MD"}
              </h3>
              <p className="text-xs text-teal-200/80 font-medium">
                {profile.doctorHospital || "Apollo Neurological & Cognitive Care Centre"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              onClick={() => {
                startVideoCall({
                  targetRole: "doctor",
                  targetName: profile?.doctorName || "Dr. Debabrata Roy, MD",
                  patientCode: profile?.patientCode || "PT-7241",
                });
              }}
              className="py-3 px-4 sm:px-5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Video Call</span>
            </button>

            <button
              onClick={() => setIsPatientChatModalOpen(true)}
              className="py-3 px-4 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#9DF3C4]" />
                {unreadCountForPatient > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-teal-400 text-slate-950 text-[9px] font-black flex items-center justify-center">
                    {unreadCountForPatient}
                  </span>
                )}
              </div>
              <span>Doctor Chat</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-teal-100/90 leading-relaxed pt-2 border-t border-white/10">
          Connect in real-time with your attending neurologist via encrypted WebSocket messaging or direct HD video consultation. Prescriptions and advice sync directly into your daily routine.
        </p>
      </div>

      {/* ============================================================ */}
      {/* 7. DOCTOR & CLINICAL PORTAL (ROLE RESTRICTED) */}
      {/* ============================================================ */}
      <div className={`rounded-3xl p-5 text-white shadow-lg space-y-3 relative overflow-hidden ${
        isDoctor
          ? "bg-gradient-to-r from-teal-900 to-blue-950 shadow-teal-950/20"
          : "bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 shadow-slate-950/30"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDoctor ? "bg-teal-500/20 text-teal-300" : "bg-white/10 text-blue-200"
            }`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">
                {isDoctor ? "Doctor Review Mode Active" : "Doctor & Clinical Portal"}
              </h3>
              <p className="text-[11px] text-blue-200 font-medium">
                {isDoctor
                  ? `Viewing Patient: ${profile.name} (${profile.patientCode || "PT-7241"})`
                  : `${profile.doctorName || "Dr. Debabrata Roy"} · ${profile.doctorHospital || "Apollo Neurological Centre"}`}
              </p>
            </div>
          </div>
          {isDoctor ? (
            <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold border border-teal-400/30 flex items-center gap-1">
              <span>Doctor Mode</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold border border-amber-400/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Doctor Only</span>
            </span>
          )}
        </div>

        <p className="text-xs text-blue-100/90 leading-relaxed">
          {isDoctor
            ? "You are inspecting this patient's exercises, cognitive performance, and reminders. You have full access to test activities or manage their therapy."
            : "The Doctor Dashboard is strictly restricted to verified clinicians. Patients cannot view clinical diagnostic telemetry, MoCA records, or prescription management tools."}
        </p>

        <div className="pt-1">
          {isDoctor ? (
            <button
              onClick={() => onOpenDoctorPortal && onOpenDoctorPortal()}
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-slate-950" />
              <span>Return to Doctor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal({ mode: "login", initialRole: "doctor" })}
                className="w-full sm:w-auto flex-1 py-2.5 px-3 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Doctor Sign In</span>
              </button>
              <button
                onClick={() => onOpenDoctorPortal && onOpenDoctorPortal()}
                className="w-full sm:w-auto py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Doctor Access Info</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 8. CALL FAMILY / CAREGIVER (LARGE BOTTOM ACTION) */
  }
      {
    /* ============================================================ */
  }
      <button
    onClick={onOpenCaregiverCall}
    className="w-full py-4 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-md shadow-rose-500/20 flex items-center justify-center gap-2.5 transition active:scale-98 cursor-pointer"
  >
        <Phone className="w-5 h-5" />
        <span>CALL CAREGIVER / FAMILY</span>
      </button>



    </div>
  );
};
