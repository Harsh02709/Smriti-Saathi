import { useState } from "react";
import { BrainBoostLogo, ElderlyAvatar, CrosswordGraphic, SudokuGraphic, JigsawGraphic, BubbleGraphic } from "../common/GraphicAssets";
import {
  Home,
  CheckSquare,
  BarChart2,
  User,
  Users,
  Bell,
  Play,
  Check,
  Clock,
  X
} from "lucide-react";
export const DesktopLayout = ({
  profile,
  tasks,
  performance,
  onStartTask,
  onNavigateTab,
  onClose
}) => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("home");
  const [carouselPage, setCarouselPage] = useState(0);
  const handleLaunchGameByName = (gameName) => {
    const matched = tasks.find((t) => t.title.toLowerCase().includes(gameName.toLowerCase())) || {
      id: `game-${gameName.toLowerCase().replace(/\s+/g, "-")}`,
      title: gameName.toUpperCase(),
      domain: "Memory",
      difficulty: "Easy",
      durationMinutes: 5,
      doctorAssigned: false,
      status: "pending",
      iconName: "Brain",
      description: `Enjoy an interactive session of ${gameName}.`,
      required: false
    };
    onStartTask(matched);
  };
  return <div className="w-full bg-gradient-to-br from-[#FDFAF5] via-white to-[#EFF6FF] border border-[#E8E2D9] min-h-[580px] rounded-3xl p-4 sm:p-6 text-[#132A2F] select-none space-y-4 shadow-sm">
      
      {
    /* Top Navbar inside Desktop */
  }
      <div className="bg-white rounded-2xl px-5 py-3 shadow-2xs border border-slate-200/80 flex items-center justify-between">
        <BrainBoostLogo iconSize="w-8 h-8" textSize="text-xl" />

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <ElderlyAvatar size="w-9 h-9" />
            <div className="text-left hidden sm:block">
              <span className="text-xs font-black text-[#132A2F] block leading-tight">Eliza M.</span>
              <span className="text-[10px] font-bold text-[#1D7BF6]">Active Patient</span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-600 transition flex items-center gap-1 cursor-pointer"
              title="Close window / Back to Home"
              aria-label="Close window"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {
    /* Main Container: Left Sidebar + 3 Content Columns */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {
    /* ================= LEFT SIDEBAR (lg:col-span-2) ================= */
  }
        <div className="lg:col-span-2 bg-white rounded-2xl p-3 shadow-2xs border border-slate-200/80 space-y-1.5">
          <button
    onClick={() => setActiveSidebarItem("home")}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition ${activeSidebarItem === "home" ? "bg-[#E0F2FE] text-[#0284C7] shadow-2xs" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
  >
            <Home className="w-4 h-4 text-[#0284C7]" />
            <span>HOME</span>
          </button>

          <button
    onClick={() => setActiveSidebarItem("tasks")}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition ${activeSidebarItem === "tasks" ? "bg-[#E0F2FE] text-[#0284C7] shadow-2xs" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
  >
            <CheckSquare className="w-4 h-4" />
            <span>DAILY TASKS</span>
          </button>

          <button
    onClick={() => setActiveSidebarItem("analysis")}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition ${activeSidebarItem === "analysis" ? "bg-[#E0F2FE] text-[#0284C7] shadow-2xs" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
  >
            <BarChart2 className="w-4 h-4" />
            <span>ANALYSIS</span>
          </button>

          <button
    onClick={() => setActiveSidebarItem("profile")}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition ${activeSidebarItem === "profile" ? "bg-[#E0F2FE] text-[#0284C7] shadow-2xs" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
  >
            <User className="w-4 h-4" />
            <span>MY PROFILE</span>
          </button>

          <button
    onClick={() => setActiveSidebarItem("family")}
    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition ${activeSidebarItem === "family" ? "bg-[#E0F2FE] text-[#0284C7] shadow-2xs" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
  >
            <Users className="w-4 h-4" />
            <span>FAMILY UPDATES</span>
          </button>
        </div>

        {
    /* ================= 3 COLUMNS MAIN AREA (lg:col-span-10) ================= */
  }
        <div className="lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {
    /* ---------------- COLUMN 1: TODAY'S ROUTINE ---------------- */
  }
          <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
              TODAY'S ROUTINE
            </h4>

            {
    /* Task 1: Morning Stretch (Blue Card) */
  }
            <div className="bg-[#1D7BF6] text-white rounded-2xl p-3.5 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-tight">MORNING STRETCH</h5>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-24 bg-white/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white h-full w-full rounded-full" />
                    </div>
                    <span className="text-[9px] font-extrabold text-white/90">100%</span>
                  </div>
                </div>

                <button
    onClick={() => handleLaunchGameByName("Morning Stretch")}
    className="w-8 h-8 rounded-full bg-white text-[#1D7BF6] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition"
    title="Play Morning Stretch"
  >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>

            {
    /* Task 2: Memory Match Game (Green Card) */
  }
            <div className="bg-[#28B463] text-white rounded-2xl p-3.5 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-tight">MEMORY MATCH GAME</h5>
                  <span className="inline-block mt-1 text-[9px] font-extrabold bg-white/25 px-2 py-0.5 rounded-full">
                    COMPLETED
                  </span>
                </div>

                <button
    onClick={() => handleLaunchGameByName("Memory Match")}
    className="w-8 h-8 rounded-full bg-white text-[#28B463] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition"
    title="Replay Memory Match"
  >
                  <Check className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>

            {
    /* Task 3: Meditation (Orange Card) */
  }
            <div className="bg-[#FF7A00] text-white rounded-2xl p-3.5 shadow-xs relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-tight">MEDITATION</h5>
                  <span className="inline-block mt-1 text-[9px] font-extrabold bg-white/25 px-2 py-0.5 rounded-full">
                    PLAY
                  </span>
                </div>

                <button
    onClick={() => handleLaunchGameByName("Meditation")}
    className="w-8 h-8 rounded-full bg-white text-[#FF7A00] flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition"
    title="Start Meditation"
  >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>

            {
    /* Task 4: Pattern Recall (Grey Card) */
  }
            <div className="bg-[#E2E8F0] text-slate-800 rounded-2xl p-3.5 shadow-2xs relative overflow-hidden group border border-slate-300/60">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-tight text-slate-700">PATTERN RECALL</h5>
                  <span className="inline-block mt-1 text-[9px] font-extrabold bg-slate-300 text-slate-700 px-2 py-0.5 rounded-full">
                    NOT DONE
                  </span>
                </div>

                <button
    onClick={() => handleLaunchGameByName("Pattern Recall")}
    className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center shadow-2xs hover:scale-105 active:scale-95 transition"
    title="Start Pattern Recall"
  >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {
    /* ---------------- COLUMN 2: WEEKLY INSIGHTS ---------------- */
  }
          <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 space-y-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                WEEKLY INSIGHTS
              </h4>
              <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                Detailed AI performance analysis charts hew in front of performance and potential of task routine.
              </p>
            </div>

            {
    /* Bar & Line Chart Mockup */
  }
            <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200">
              <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 mb-1">
                <span>1000</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#0284C7] rounded-xs inline-block" /> Last 7 days</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[#F97316] inline-block" /> Performance</span>
                </div>
              </div>

              {
    /* Chart SVG Canvas */
  }
              <div className="h-28 w-full relative flex items-end justify-between pt-2">
                <svg viewBox="0 0 200 90" className="w-full h-full">
                  {
    /* Y Grid lines */
  }
                  <line x1="0" y1="10" x2="200" y2="10" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="0" y1="35" x2="200" y2="35" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="0" y1="85" x2="200" y2="85" stroke="#CBD5E1" strokeWidth="1" />

                  {
    /* Teal Bar columns for Mon - Sun */
  }
                  {[
    { x: 12, h: 40 },
    { x: 38, h: 55 },
    { x: 64, h: 68 },
    { x: 90, h: 48 },
    { x: 116, h: 78 },
    { x: 142, h: 82 },
    { x: 168, h: 62 }
  ].map((bar, i) => <rect
    key={i}
    x={bar.x}
    y={85 - bar.h}
    width="14"
    height={bar.h}
    rx="2"
    fill="#0284C7"
  />)}

                  {
    /* Orange Trendline */
  }
                  <polyline
    points="19,42 45,30 71,24 97,38 123,20 149,15 175,28"
    fill="none"
    stroke="#F97316"
    strokeWidth="2.5"
    strokeLinecap="round"
  />
                  {[
    { x: 19, y: 42 },
    { x: 45, y: 30 },
    { x: 71, y: 24 },
    { x: 97, y: 38 },
    { x: 123, y: 20 },
    { x: 149, y: 15 },
    { x: 175, y: 28 }
  ].map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#FFFFFF" stroke="#F97316" strokeWidth="1.5" />)}
                </svg>
              </div>

              {
    /* X Axis Labels */
  }
              <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1 pt-1">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {
    /* Bullet Points */
  }
            <div className="space-y-1 text-[10px] text-slate-700 font-semibold leading-relaxed">
              <p className="flex items-start gap-1">
                <span className="text-[#0284C7]">•</span> Progress all performances all evaluation
              </p>
              <p className="flex items-start gap-1">
                <span className="text-[#0284C7]">•</span> Cognition metrics (86%)
              </p>
              <p className="flex items-start gap-1">
                <span className="text-[#0284C7]">•</span> Pattern performance analysis
              </p>
              <p className="flex items-start gap-1">
                <span className="text-[#0284C7]">•</span> Representative presents and pattern game and scores.
              </p>
            </div>

            <p className="text-[9px] text-slate-500 font-medium border-t border-slate-100 pt-2 leading-tight">
              In detailed AI performance analysis charts and performing your contents are timed time to your contintion.
            </p>
          </div>

          {
    /* ---------------- COLUMN 3: MY FAVORITE GAMES ---------------- */
  }
          <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                MY FAVORITE GAMES
              </h4>
              <span className="text-[9px] font-bold text-[#1D7BF6] bg-blue-50 px-2 py-0.5 rounded-full">
                8 Games
              </span>
            </div>

            {
    /* 2x4 Grid of Game Icons */
  }
            <div className="grid grid-cols-2 gap-2 text-center">
              
              {
    /* Game 1: Crossword */
  }
              <button
    onClick={() => handleLaunchGameByName("Crossword")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <CrosswordGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">CROSSWORD</span>
              </button>

              {
    /* Game 2: Word Board */
  }
              <button
    onClick={() => handleLaunchGameByName("Word Match")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <BubbleGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">WORD BOARD</span>
              </button>

              {
    /* Game 3: Crossword Classic */
  }
              <button
    onClick={() => handleLaunchGameByName("Crossword")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <CrosswordGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">CROSSWORD</span>
              </button>

              {
    /* Game 4: Sudoku */
  }
              <button
    onClick={() => handleLaunchGameByName("Sudoku")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <SudokuGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">SU DOKU</span>
              </button>

              {
    /* Game 5: Jigsaw Red/Green */
  }
              <button
    onClick={() => handleLaunchGameByName("Jigsaw Puzzle")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <JigsawGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">JIGSAW PUZZLE</span>
              </button>

              {
    /* Game 6: Jigsaw Snap */
  }
              <button
    onClick={() => handleLaunchGameByName("Jigsaw Puzzle")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <JigsawGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">JIOSAM PUZZLE</span>
              </button>

              {
    /* Game 7: Bubble Pop */
  }
              <button
    onClick={() => handleLaunchGameByName("Bubble Pop")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <BubbleGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">BALLOON POP</span>
              </button>

              {
    /* Game 8: Bubble Shooter */
  }
              <button
    onClick={() => handleLaunchGameByName("Bubble Shooter")}
    className="p-2 rounded-xl bg-slate-50 hover:bg-[#E0F2FE] border border-slate-200 hover:border-blue-300 transition flex flex-col items-center group"
  >
                <div className="w-10 h-10 mb-1 group-hover:scale-105 transition-transform">
                  <BubbleGraphic className="w-full h-full" />
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 group-hover:text-[#0284C7]">BUBBLES</span>
              </button>

            </div>

            {
    /* Carousel Pagination Dots */
  }
            <div className="flex justify-center items-center gap-1.5 pt-1">
              <span
    onClick={() => setCarouselPage(0)}
    className={`w-2 h-2 rounded-full cursor-pointer transition ${carouselPage === 0 ? "bg-[#0284C7]" : "bg-slate-300"}`}
  />
              <span
    onClick={() => setCarouselPage(1)}
    className={`w-2 h-2 rounded-full cursor-pointer transition ${carouselPage === 1 ? "bg-[#0284C7]" : "bg-slate-300"}`}
  />
              <span
    onClick={() => setCarouselPage(2)}
    className={`w-2 h-2 rounded-full cursor-pointer transition ${carouselPage === 2 ? "bg-[#0284C7]" : "bg-slate-300"}`}
  />
            </div>
          </div>

        </div>

      </div>

    </div>;
};
