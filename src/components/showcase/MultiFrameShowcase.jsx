import { useState } from "react";
import { allFramesList } from "../../data/initialData";
import {
  BrainBoostLogo,
  ElderlyAvatar,
  RobotAvatar,
  MorningStretchGraphic,
  MemoryMatchGraphic,
  MeditationGraphic,
  PatternRecallGraphic,
  CrosswordGraphic,
  SudokuGraphic,
  JigsawGraphic,
  BubbleGraphic
} from "../common/GraphicAssets";
import {
  Sparkles,
  ChevronRight,
  Home as HomeIcon,
  CheckSquare,
  BarChart2,
  Settings
} from "lucide-react";
export const MultiFrameShowcase = ({
  onSelectRole,
  onLaunchGame
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredFrames = selectedCategory === "all" ? allFramesList : allFramesList.filter((f) => f.category.toLowerCase() === selectedCategory.toLowerCase());
  const handleGameClick = (title) => {
    if (onLaunchGame) {
      onLaunchGame(title);
    } else {
      onSelectRole("patient");
    }
  };
  return <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-10 pb-28 select-none">
      
      {
    /* ========================================================= */
  }
      {
    /* 1. HERO TRIPLE-DEVICE CANVAS (EXACT MATCH TO UPLOADED IMAGE) */
  }
      {
    /* ========================================================= */
  }
      <div className="bg-gradient-to-br from-[#FDFAF5] via-white to-[#EFF6FF] rounded-3xl p-4 sm:p-8 lg:p-10 border border-[#E8E2D9] shadow-sm relative overflow-hidden">
        
        {
    /* Subtle decorative sparkles in background */
  }
        <div className="absolute top-8 right-12 text-blue-300 opacity-60 pointer-events-none">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute bottom-16 left-10 text-teal-300 opacity-50 pointer-events-none">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        {
    /* Top Header inside Presentation Board */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <BrainBoostLogo iconSize="w-9 h-9" textSize="text-2xl" />

          {
    /* Quick interactive switcher pills */
  }
          <div className="flex items-center gap-2">
            <button
    onClick={() => onSelectRole("patient")}
    className="px-4 py-2 bg-[#1D7BF6] hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center gap-1.5"
  >
              <span>Play as Patient</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
    onClick={() => onSelectRole("doctor")}
    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-black shadow-xs transition active:scale-95"
  >
              Doctor View
            </button>
          </div>
        </div>

        {
    /* Triple-Device Row: Phone 1 | Phone 2 | Laptop 3 */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 lg:gap-8 items-end">
          
          {
    /* ========================================================= */
  }
          {
    /* DEVICE 1: MOBILE DASHBOARD (Phone Frame) - xl:col-span-3 */
  }
          {
    /* ========================================================= */
  }
          <div className="xl:col-span-3 flex flex-col items-center space-y-2">
            {
    /* Top Label */
  }
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              MOBILE DASHBOARD
            </h3>

            {
    /* iPhone Chassis */
  }
            <div className="w-full max-w-[280px] bg-[#0F172A] rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-700 ring-1 ring-black/30">
              
              {
    /* Dynamic Island & Status Bar */
  }
              <div className="flex items-center justify-between px-4 pt-1 pb-1.5 text-[10px] font-bold text-white">
                <span>9:41</span>
                <div className="w-16 h-3 bg-black rounded-full" />
                <div className="flex items-center gap-1 text-[9px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {
    /* Phone Screen Canvas */
  }
              <div className="bg-[#EDF5FB] rounded-[34px] p-3 text-[#132A2F] space-y-2.5 overflow-hidden">
                
                {
    /* Greeting */
  }
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#0A2540] tracking-tight">
                      WELCOME, ELIZA!
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      THURSDAY, OCT 26
                    </p>
                  </div>
                  <ElderlyAvatar size="w-8 h-8" />
                </div>

                {
    /* Daily Tasks */
  }
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-black text-[#0A2540] tracking-tight">
                    <span>MY DAILY TASKS</span>
                    <span className="text-[#1D7BF6]">(3 OF 4 COMPLETE)</span>
                  </div>

                  {
    /* 2x2 Grid of 4 Cards */
  }
                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    
                    {
    /* 1. Morning Stretch */
  }
                    <div
    onClick={() => handleGameClick("Morning Stretch")}
    className="bg-[#1D7BF6] rounded-2xl p-2 text-white flex flex-col items-center justify-between h-28 shadow-xs cursor-pointer hover:scale-102 transition-transform"
  >
                      <MorningStretchGraphic className="w-10 h-10 my-auto" />
                      <span className="text-[8px] font-black uppercase tracking-tight leading-tight">MORNING STRETCH</span>
                      <span className="mt-1 text-[7px] font-black bg-white text-[#1D7BF6] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        PLAY ▶
                      </span>
                    </div>

                    {
    /* 2. Memory Match Game */
  }
                    <div
    onClick={() => handleGameClick("Memory Match")}
    className="bg-[#28B463] rounded-2xl p-2 text-white flex flex-col items-center justify-between h-28 shadow-xs cursor-pointer hover:scale-102 transition-transform"
  >
                      <MemoryMatchGraphic className="w-10 h-10 my-auto" />
                      <span className="text-[8px] font-black uppercase tracking-tight leading-tight">MEMORY MATCH GAME</span>
                      <span className="mt-1 text-[7px] font-black bg-white text-[#28B463] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        COMPLETED ✓
                      </span>
                    </div>

                    {
    /* 3. Meditation */
  }
                    <div
    onClick={() => handleGameClick("Meditation")}
    className="bg-[#FF7A00] rounded-2xl p-2 text-white flex flex-col items-center justify-between h-28 shadow-xs cursor-pointer hover:scale-102 transition-transform"
  >
                      <MeditationGraphic className="w-10 h-10 my-auto" />
                      <span className="text-[8px] font-black uppercase tracking-tight leading-tight">MEDITATION</span>
                      <span className="mt-1 text-[7px] font-black bg-white text-[#FF7A00] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        PLAY ▶
                      </span>
                    </div>

                    {
    /* 4. Pattern Recall */
  }
                    <div
    onClick={() => handleGameClick("Pattern Recall")}
    className="bg-[#E2E8F0] rounded-2xl p-2 text-slate-700 flex flex-col items-center justify-between h-28 shadow-xs border border-slate-300 cursor-pointer hover:scale-102 transition-transform"
  >
                      <PatternRecallGraphic className="w-10 h-10 my-auto" />
                      <span className="text-[8px] font-black uppercase tracking-tight leading-tight text-slate-800">PATTERN RECALL</span>
                      <span className="mt-1 text-[7px] font-black bg-white text-slate-700 px-2 py-0.5 rounded-full">
                        NOT DONE
                      </span>
                    </div>

                  </div>
                </div>

                {
    /* Play Games Anytime */
  }
                <div className="space-y-1 pt-0.5">
                  <span className="text-[9px] font-black uppercase text-[#0A2540]">PLAY GAMES ANYTIME</span>
                  <div className="grid grid-cols-3 gap-1 text-[7px] font-black text-center text-slate-800">
                    <div
    onClick={() => handleGameClick("Crossword")}
    className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center cursor-pointer"
  >
                      <CrosswordGraphic className="w-8 h-8 mb-0.5" />
                      <span>CROSSWORD</span>
                    </div>
                    <div
    onClick={() => handleGameClick("Sudoku")}
    className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center cursor-pointer"
  >
                      <SudokuGraphic className="w-8 h-8 mb-0.5" />
                      <span>SU DOKU</span>
                    </div>
                    <div
    onClick={() => handleGameClick("Jigsaw Puzzle")}
    className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center cursor-pointer"
  >
                      <JigsawGraphic className="w-8 h-8 mb-0.5" />
                      <span>JIGSAW PUZZLE</span>
                    </div>
                  </div>
                </div>

                {
    /* Bottom Navigation */
  }
                <div className="bg-white rounded-2xl py-1 px-3 flex items-center justify-between border border-slate-200 shadow-2xs">
                  <HomeIcon className="w-4 h-4 text-[#1D7BF6]" />
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <BarChart2 className="w-4 h-4 text-slate-400" />
                  <Settings className="w-4 h-4 text-slate-400" />
                </div>

              </div>
            </div>

            {
    /* Bottom Label */
  }
            <span className="text-[11px] font-black uppercase text-slate-700 pt-1">
              MOBILE DASHBOARD
            </span>
          </div>

          {
    /* ========================================================= */
  }
          {
    /* DEVICE 2: ANALYSIS VIEW (Phone Frame) - xl:col-span-3 */
  }
          {
    /* ========================================================= */
  }
          <div className="xl:col-span-3 flex flex-col items-center space-y-2">
            {
    /* Top Label */
  }
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              ANALYSIS VIEW
            </h3>

            {
    /* iPhone Chassis */
  }
            <div className="w-full max-w-[280px] bg-[#0F172A] rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-700 ring-1 ring-black/30">
              
              {
    /* Dynamic Island & Status Bar */
  }
              <div className="flex items-center justify-between px-4 pt-1 pb-1.5 text-[10px] font-bold text-white">
                <span>9:41</span>
                <div className="w-16 h-3 bg-black rounded-full" />
                <div className="flex items-center gap-1 text-[9px]">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {
    /* Phone Screen Canvas */
  }
              <div className="bg-white rounded-[34px] p-3 text-[#132A2F] space-y-2.5 overflow-hidden">
                
                {
    /* Header */
  }
                <div className="border-b border-slate-100 pb-1">
                  <h4 className="text-[10px] font-black uppercase text-[#0A2540] tracking-tight">
                    &lt; MY PROGRESS & ANALYSIS
                  </h4>
                </div>

                {
    /* Memory Health Trend */
  }
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline text-[9px] font-black text-[#0A2540]">
                    <span>MEMORY HEALTH TREND</span>
                    <span className="text-[8px] text-slate-400 font-bold">last 7 days</span>
                  </div>

                  {
    /* Line chart canvas */
  }
                  <div className="bg-[#F8FAFC] rounded-xl p-1.5 border border-slate-100">
                    <div className="flex">
                      <div className="flex flex-col justify-between text-[7px] font-bold text-slate-400 pr-1 h-20">
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                      </div>

                      <div className="flex-1 h-20 relative">
                        <svg viewBox="0 0 160 80" className="w-full h-full">
                          <defs>
                            <linearGradient id="miniArea" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#00D2C4" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#00D2C4" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {
    /* Area */
  }
                          <polygon points="10,60 38,40 66,48 94,26 122,26 150,6 150,80 10,80" fill="url(#miniArea)" />

                          {
    /* Line */
  }
                          <polyline
    points="10,60 38,40 66,48 94,26 122,26 150,6"
    fill="none"
    stroke="#0D7377"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

                          {
    /* Dots */
  }
                          {[
    { x: 10, y: 60 },
    { x: 38, y: 40 },
    { x: 66, y: 48 },
    { x: 94, y: 26 },
    { x: 122, y: 26 },
    { x: 150, y: 6 }
  ].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#FFFFFF" stroke="#0D7377" strokeWidth="1.5" />)}
                        </svg>
                      </div>
                    </div>

                    <div className="flex justify-between text-[7px] font-bold text-slate-400 pl-4 pr-1">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>
                  </div>
                </div>

                {
    /* AI Analysis Bubble */
  }
                <div className="bg-[#EAF6FF] rounded-2xl p-2 border border-[#BFDBFE] flex items-start gap-2">
                  <RobotAvatar size="w-8 h-8" />
                  <div>
                    <h5 className="text-[8px] font-black uppercase text-[#0A2540] leading-tight">
                      AI ANALYSIS: GREAT JOB! COGNITION IMPROVED (88%). KEEP UP THE ROUTINE.
                    </h5>
                  </div>
                </div>

                {
    /* 3 Metric Pills */
  }
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[6.5px] font-black text-slate-400 uppercase block">TASK COMPLETION</span>
                    <span className="text-[10px] font-black text-[#0A2540]">92%</span>
                  </div>

                  <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[6.5px] font-black text-slate-400 uppercase block">GAME SCORES</span>
                    <span className="text-[10px] font-black text-[#1D7BF6]">810</span>
                  </div>

                  <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <span className="text-[6.5px] font-black text-slate-400 uppercase block">REACTION TIME</span>
                    <span className="text-[9px] font-black text-emerald-600">STABLE</span>
                  </div>
                </div>

                {
    /* Bottom Navigation */
  }
                <div className="bg-white rounded-2xl py-1 px-3 flex items-center justify-between border border-slate-200 shadow-2xs">
                  <HomeIcon className="w-4 h-4 text-slate-400" />
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <BarChart2 className="w-4 h-4 text-[#1D7BF6]" />
                  <Settings className="w-4 h-4 text-slate-400" />
                </div>

              </div>
            </div>

            {
    /* Bottom Label */
  }
            <span className="text-[11px] font-black uppercase text-slate-700 pt-1">
              ANALYSIS VIEW
            </span>
          </div>

          {
    /* ========================================================= */
  }
          {
    /* DEVICE 3: DESKTOP LAYOUT (MacBook Frame) - xl:col-span-6 */
  }
          {
    /* ========================================================= */
  }
          <div className="xl:col-span-6 flex flex-col items-center space-y-2">
            
            {
    /* MacBook Chassis */
  }
            <div className="w-full bg-[#1E293B] rounded-3xl p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-black/40">
              
              {
    /* Webcam notch */
  }
              <div className="w-3 h-3 rounded-full bg-slate-900 mx-auto mb-1.5 border border-slate-800" />

              {
    /* Screen Inside Laptop */
  }
              <div className="bg-[#EDF5FB] rounded-2xl p-3 text-[#132A2F] space-y-2.5 overflow-hidden">
                
                {
    /* Desktop Top Navbar */
  }
                <div className="bg-white rounded-xl px-3 py-1.5 flex items-center justify-between border border-slate-200 shadow-2xs">
                  <BrainBoostLogo iconSize="w-5 h-5" textSize="text-xs" />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]">🔔</span>
                    <ElderlyAvatar size="w-6 h-6" />
                  </div>
                </div>

                {
    /* Desktop 4-Part Structure: Sidebar + 3 Columns */
  }
                <div className="grid grid-cols-12 gap-2">
                  
                  {
    /* Left Sidebar (2 cols) */
  }
                  <div className="col-span-3 bg-white rounded-xl p-1.5 border border-slate-200 space-y-1 text-[8px] font-black">
                    <div className="bg-[#E0F2FE] text-[#0284C7] p-1.5 rounded-lg flex items-center gap-1">
                      <HomeIcon className="w-3 h-3 text-[#0284C7]" />
                      <span>HOME</span>
                    </div>
                    <div className="text-slate-600 p-1.5 rounded-lg flex items-center gap-1">
                      <CheckSquare className="w-3 h-3" />
                      <span>DAILY TASKS</span>
                    </div>
                    <div className="text-slate-600 p-1.5 rounded-lg flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" />
                      <span>ANALYSIS</span>
                    </div>
                    <div className="text-slate-600 p-1.5 rounded-lg flex items-center gap-1">
                      <span>👤</span>
                      <span>MY PROFILE</span>
                    </div>
                    <div className="text-slate-600 p-1.5 rounded-lg flex items-center gap-1">
                      <span>👥</span>
                      <span>FAMILY UPDATES</span>
                    </div>
                  </div>

                  {
    /* 3 Main Columns (9 cols) */
  }
                  <div className="col-span-9 grid grid-cols-3 gap-2">
                    
                    {
    /* Col 1: TODAY'S ROUTINE */
  }
                    <div className="bg-white rounded-xl p-2 border border-slate-200 space-y-1.5">
                      <h6 className="text-[8px] font-black uppercase text-slate-800">TODAY'S ROUTINE</h6>
                      
                      {
    /* Routine card 1 */
  }
                      <div className="bg-[#1D7BF6] text-white p-1.5 rounded-lg text-[7px] font-black flex items-center justify-between">
                        <div>
                          <span>MORNING STRETCH</span>
                          <div className="w-12 bg-white/40 h-1 rounded-full mt-0.5">
                            <div className="bg-white h-full w-full rounded-full" />
                          </div>
                        </div>
                        <span className="w-4 h-4 rounded-full bg-white text-[#1D7BF6] flex items-center justify-center text-[7px]">▶</span>
                      </div>

                      {
    /* Routine card 2 */
  }
                      <div className="bg-[#28B463] text-white p-1.5 rounded-lg text-[7px] font-black flex items-center justify-between">
                        <div>
                          <span>MEMORY MATCH</span>
                          <span className="text-[6px] bg-white/30 px-1 rounded block mt-0.5">COMPLETED</span>
                        </div>
                        <span className="w-4 h-4 rounded-full bg-white text-[#28B463] flex items-center justify-center text-[8px]">✓</span>
                      </div>

                      {
    /* Routine card 3 */
  }
                      <div className="bg-[#FF7A00] text-white p-1.5 rounded-lg text-[7px] font-black flex items-center justify-between">
                        <div>
                          <span>MEDITATION</span>
                          <span className="text-[6px] bg-white/30 px-1 rounded block mt-0.5">PLAY</span>
                        </div>
                        <span className="w-4 h-4 rounded-full bg-white text-[#FF7A00] flex items-center justify-center text-[7px]">▶</span>
                      </div>

                      {
    /* Routine card 4 */
  }
                      <div className="bg-[#E2E8F0] text-slate-700 p-1.5 rounded-lg text-[7px] font-black flex items-center justify-between border border-slate-300">
                        <div>
                          <span>PATTERN RECALL</span>
                          <span className="text-[6px] bg-slate-300 text-slate-700 px-1 rounded block mt-0.5">NOT DONE</span>
                        </div>
                        <span className="w-4 h-4 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[7px]">🕒</span>
                      </div>
                    </div>

                    {
    /* Col 2: WEEKLY INSIGHTS */
  }
                    <div className="bg-white rounded-xl p-2 border border-slate-200 space-y-1">
                      <h6 className="text-[8px] font-black uppercase text-slate-800">WEEKLY INSIGHTS</h6>
                      <p className="text-[6px] text-slate-500 font-semibold leading-tight">
                        Detailed AI performance analysis charts hew in front of performance and potential of task routine.
                      </p>

                      {
    /* Bar & Line chart */
  }
                      <div className="h-12 bg-[#F8FAFC] rounded-lg p-1 border border-slate-100 flex items-end justify-between">
                        <svg viewBox="0 0 100 40" className="w-full h-full">
                          {[
    { x: 5, h: 20 },
    { x: 18, h: 28 },
    { x: 31, h: 32 },
    { x: 44, h: 22 },
    { x: 57, h: 35 },
    { x: 70, h: 38 },
    { x: 83, h: 26 }
  ].map((b, i) => <rect key={i} x={b.x} y={40 - b.h} width="8" height={b.h} fill="#0284C7" rx="1" />)}
                          <polyline
    points="9,20 22,14 35,10 48,18 61,8 74,6 87,14"
    fill="none"
    stroke="#F97316"
    strokeWidth="1.5"
    strokeLinecap="round"
  />
                        </svg>
                      </div>

                      <div className="text-[6px] space-y-0.5 text-slate-600 font-bold">
                        <p>• Progress all performances</p>
                        <p>• Cognition metrics (86%)</p>
                        <p>• Pattern game and scores</p>
                      </div>
                    </div>

                    {
    /* Col 3: MY FAVORITE GAMES */
  }
                    <div className="bg-white rounded-xl p-2 border border-slate-200 space-y-1">
                      <h6 className="text-[8px] font-black uppercase text-slate-800">MY FAVORITE GAMES</h6>
                      
                      <div className="grid grid-cols-2 gap-1 text-[6px] font-black text-center text-slate-700">
                        <div className="bg-slate-50 p-1 rounded-md border border-slate-200">
                          <CrosswordGraphic className="w-5 h-5 mx-auto" />
                          <span className="mt-0.5 block">CROSSWORD</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded-md border border-slate-200">
                          <BubbleGraphic className="w-5 h-5 mx-auto" />
                          <span className="mt-0.5 block">WORD BOARD</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded-md border border-slate-200">
                          <CrosswordGraphic className="w-5 h-5 mx-auto" />
                          <span className="mt-0.5 block">CROSSWORD</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded-md border border-slate-200">
                          <SudokuGraphic className="w-5 h-5 mx-auto" />
                          <span className="mt-0.5 block">SU DOKU</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded-md border border-slate-200">
                          <JigsawGraphic className="w-5 h-5 mx-auto" />
                          <span className="mt-0.5 block">JIGSAW</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded-md border border-slate-200">
                          <JigsawGraphic className="w-5 h-5 mx-auto" />
                          <span className="mt-0.5 block">JIOSAM</span>
                        </div>
                      </div>

                      {
    /* Pagination dots */
  }
                      <div className="flex justify-center gap-1 pt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {
    /* Laptop bottom metallic bar */
  }
              <div className="w-32 h-1.5 bg-slate-600 rounded-full mx-auto mt-2" />
            </div>

            {
    /* Bottom Label */
  }
            <span className="text-[11px] font-black uppercase text-slate-700 pt-1">
              DESKTOP LAYOUT
            </span>
          </div>

        </div>

        {
    /* Bottom Tagline (Exact wording from image) */
  }
        <div className="text-right mt-6 pt-3 border-t border-blue-200/60">
          <p className="text-xs sm:text-sm font-black text-[#0A2540] tracking-tight uppercase">
            SIMPLE, ACCESSIBLE DESIGN FOR COGNITIVE WELLNESS.
          </p>
        </div>

      </div>

      {
    /* ========================================================= */
  }
      {
    /* 2. 30-FRAME SPECIFICATION CATALOG */
  }
      {
    /* ========================================================= */
  }
      <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xs border border-slate-200 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">
              30-Frame Specification Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Complete multi-frame cognitive health system architecture for Patient, Family, and Doctor
            </p>
          </div>

          {
    /* Filter Pills */
  }
          <div className="flex items-center gap-1.5 bg-[#F0F7FB] p-1 rounded-2xl border border-blue-100 overflow-x-auto">
            {["all", "Patient", "Family", "Doctor", "System"].map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`px-3 py-1.5 rounded-xl text-xs font-black transition capitalize ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "bg-[#1D7BF6] text-white shadow-xs" : "text-slate-600 hover:bg-white"}`}
  >
                {cat}
              </button>)}
          </div>
        </div>

        {
    /* Frames Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFrames.map((frame) => <div
    key={frame.id}
    className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:bg-white hover:border-blue-300 transition shadow-2xs hover:shadow-xs flex flex-col justify-between"
  >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-[#1D7BF6] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    {frame.frameNumber}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {frame.device} · {frame.category}
                  </span>
                </div>
                <h4 className="text-base font-black text-[#0A2540] mb-1">
                  {frame.title}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {frame.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1D7BF6]">
                  Production Ready
                </span>
                <button
    onClick={() => {
      if (frame.category === "Patient") onSelectRole("patient");
      else if (frame.category === "Family") onSelectRole("family");
      else onSelectRole("doctor");
    }}
    className="text-xs font-bold text-[#1D7BF6] hover:underline flex items-center gap-0.5"
  >
                  Open in App <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>)}
        </div>

      </div>

    </div>;
};
