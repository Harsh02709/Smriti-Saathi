import { translations } from "../../data/translations";
import { RobotAvatar } from "../common/GraphicAssets";
import {
  ChevronLeft,
  Home as HomeIcon,
  CheckSquare,
  BarChart2,
  Settings
} from "lucide-react";
export const PatientAIAnalysis = ({
  profile,
  onBack,
  onNavigateTab
}) => {
  const t = translations[profile.language];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28 select-none animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER: < MY PROGRESS & ANALYSIS */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase text-[#0A2540] hover:text-[#1D7BF6] transition"
        >
          <ChevronLeft className="w-5 h-5 text-[#0A2540]" />
          <span>MY PROGRESS & ANALYSIS</span>
        </button>

        <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#1D7BF6] px-2.5 py-1 rounded-full border border-blue-200">
          Last 7 Days
        </span>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 2. CARD 1: MEMORY HEALTH TREND (Line Chart 0 to 100) */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-black uppercase text-[#0A2540] tracking-tight">
            MEMORY HEALTH TREND
          </h2>
          <span className="text-[11px] font-bold text-slate-400">
            last 7 days
          </span>
        </div>

        {
    /* Line Chart Canvas */
  }
        <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-100">
          
          <div className="flex">
            {
    /* Y Axis Numbers */
  }
            <div className="flex flex-col justify-between text-[9px] font-bold text-slate-400 pr-2 h-36">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {
    /* Chart SVG */
  }
            <div className="flex-1 h-36 relative">
              <svg viewBox="0 0 240 120" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="trendAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00D2C4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00D2C4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {
    /* Grid horizontal lines */
  }
                <line x1="0" y1="10" x2="240" y2="10" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="37" x2="240" y2="37" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="240" y2="65" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="92" x2="240" y2="92" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="240" y2="120" stroke="#CBD5E1" strokeWidth="1" />

                {
    /* Shaded Area under Curve */
  }
                <polygon
    points="15,92 55,65 95,73 135,42 175,42 215,10 215,120 15,120"
    fill="url(#trendAreaGrad)"
  />

                {
    /* Trend line */
  }
                <polyline
    points="15,92 55,65 95,73 135,42 175,42 215,10"
    fill="none"
    stroke="#0D7377"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

                {
    /* Data point dots */
  }
                {[
    { x: 15, y: 92, val: "25" },
    { x: 55, y: 65, val: "50" },
    { x: 95, y: 73, val: "42" },
    { x: 135, y: 42, val: "68" },
    { x: 175, y: 42, val: "68" },
    { x: 215, y: 10, val: "100" }
  ].map((pt, i) => <circle
    key={i}
    cx={pt.x}
    cy={pt.y}
    r="4"
    fill="#FFFFFF"
    stroke="#0D7377"
    strokeWidth="2.5"
  />)}
              </svg>
            </div>
          </div>

          {
    /* X Axis Labels */
  }
          <div className="flex justify-between text-[9px] font-bold text-slate-400 pl-6 pr-2 pt-2">
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
    /* ============================================================ */
  }
      {
    /* 3. CARD 2: AI ANALYSIS BUBBLE BOX (Robot Avatar + Reassuring message) */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-[#EAF6FF] rounded-3xl p-4 sm:p-5 border border-[#BFDBFE] flex items-start gap-3.5 shadow-2xs">
        <RobotAvatar size="w-11 h-11" />
        <div>
          <h3 className="text-xs sm:text-sm font-black uppercase text-[#0A2540] leading-tight">
            AI ANALYSIS: GREAT JOB! COGNITION IMPROVED (88%). KEEP UP THE ROUTINE.
          </h3>
          <p className="text-[11px] text-slate-600 font-semibold mt-1">
            Consistent morning activities keep neural pathways sharp and relaxed.
          </p>
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 4. CARD 3: 3 STAT CARDS IN A ROW */
  }
      {
    /* ============================================================ */
  }
      <div className="grid grid-cols-3 gap-2 text-center">
        
        {
    /* Stat 1: TASK COMPLETION */
  }
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
          <span className="text-[9px] font-extrabold uppercase text-slate-400 block leading-tight">
            TASK COMPLETION
          </span>
          <span className="text-base sm:text-lg font-black text-[#0A2540] mt-1 block">
            92%
          </span>
        </div>

        {
    /* Stat 2: GAME SCORES */
  }
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
          <span className="text-[9px] font-extrabold uppercase text-slate-400 block leading-tight">
            GAME SCORES
          </span>
          <span className="text-base sm:text-lg font-black text-[#1D7BF6] mt-1 block">
            810
          </span>
        </div>

        {
    /* Stat 3: REACTION TIME */
  }
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
          <span className="text-[9px] font-extrabold uppercase text-slate-400 block leading-tight">
            REACTION TIME
          </span>
          <span className="text-xs sm:text-sm font-black text-emerald-600 mt-1 block">
            STABLE
          </span>
        </div>

      </div>

      {
    /* ============================================================ */
  }
      {
    /* 5. COGNITIVE DOMAINS SUMMARY */
  }
      {
    /* ============================================================ */
  }
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-tight text-[#0A2540]">
          COGNITIVE DOMAINS BREAKDOWN
        </h3>

        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
              <span>Memory Recall</span>
              <span className="text-[#0D7377]">88%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0D7377] h-full rounded-full" style={{ width: "88%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
              <span>Attention & Focus</span>
              <span className="text-[#1D7BF6]">92%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#1D7BF6] h-full rounded-full" style={{ width: "92%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
              <span>Pattern Recognition</span>
              <span className="text-amber-600">85%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </div>

      {
    /* ============================================================ */
  }
      {
    /* 6. BOTTOM NAVIGATION BAR */
  }
      {
    /* ============================================================ */
  }
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2.5 shadow-lg">
        <div className="max-w-md mx-auto px-6 flex items-center justify-between">
          
          {
    /* Home */
  }
          <button
    onClick={() => onNavigateTab ? onNavigateTab("home") : onBack()}
    className="flex flex-col items-center text-slate-400 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition"
  >
            <div className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <HomeIcon className="w-5 h-5" />
            </div>
            <span>Home</span>
          </button>

          {
    /* Tasks */
  }
          <button
    onClick={() => onNavigateTab ? onNavigateTab("tasks") : onBack()}
    className="flex flex-col items-center text-slate-400 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition"
  >
            <div className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span>Tasks</span>
          </button>

          {
    /* Analysis (Active) */
  }
          <button
    className="flex flex-col items-center text-[#1D7BF6] font-bold text-[10px] gap-0.5"
  >
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-[#1D7BF6]" />
            </div>
            <span>Analysis</span>
          </button>

          {
    /* Settings */
  }
          <button
    onClick={() => onNavigateTab ? onNavigateTab("help") : onBack()}
    className="flex flex-col items-center text-slate-400 hover:text-[#1D7BF6] font-bold text-[10px] gap-0.5 transition"
  >
            <div className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <span>Settings</span>
          </button>

        </div>
      </div>

    </div>
  );
};
