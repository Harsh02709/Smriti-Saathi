import { translations } from "../../data/translations";
import {
  Brain,
  Sparkles,
  Flame,
  Award,
  ArrowLeft,
  Heart
} from "lucide-react";
export const PatientProgress = ({
  profile,
  performance,
  onBack
}) => {
  const t = translations[profile.language];
  const width = 500;
  const height = 180;
  const padding = 35;
  const points = performance.map((p, i) => {
    const x = padding + i * (width - 2 * padding) / (performance.length - 1);
    const normalizedY = (p.overall - 50) / 50;
    const y = height - padding - normalizedY * (height - 2 * padding);
    return { x, y, val: p.overall, day: p.date };
  });
  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");
  return <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24 animate-in fade-in duration-200">
      
      {
    /* Back Header */
  }
      <div className="flex items-center justify-between">
        <button
    onClick={onBack}
    className="flex items-center gap-1.5 text-slate-700 hover:text-[#0D7377] font-bold text-sm sm:text-base py-1.5 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs transition"
  >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <span className="text-xs sm:text-sm font-bold text-[#0D7377] bg-[#EAF6F4] px-3 py-1 rounded-full border border-[#0D7377]/20">
          Weekly Wellness
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#0D7377]/15">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display mb-1">
          {t.myWeek}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium mb-6">
          Your daily consistency strengthens memory and attention.
        </p>

        {
    /* 4 Large Clean Metric Cards (Frame 06) */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          
          <div className="bg-[#F3F8F7] p-4 rounded-2xl border border-[#0D7377]/20 text-center">
            <Award className="w-6 h-6 text-[#0D7377] mx-auto mb-1" />
            <span className="text-xs font-bold text-slate-500 uppercase block">Activities</span>
            <span className="text-xl sm:text-2xl font-black text-[#0D7377]">18</span>
            <span className="text-[11px] font-semibold text-slate-500 block">completed</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <Brain className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
            <span className="text-xs font-bold text-emerald-800 uppercase block">Memory</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700">Good</span>
            <span className="text-[11px] font-semibold text-emerald-800 block">Active daily</span>
          </div>

          <div className="bg-teal-50 p-4 rounded-2xl border border-teal-200 text-center">
            <Sparkles className="w-6 h-6 text-[#0D7377] mx-auto mb-1" />
            <span className="text-xs font-bold text-teal-800 uppercase block">Attention</span>
            <span className="text-xl sm:text-2xl font-black text-[#0D7377]">Stable</span>
            <span className="text-[11px] font-semibold text-teal-800 block">Strong focus</span>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
            <Flame className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-amber-800 uppercase block">Streak</span>
            <span className="text-xl sm:text-2xl font-black text-amber-700">5 Days</span>
            <span className="text-[11px] font-semibold text-amber-800 block">In a row!</span>
          </div>

        </div>

        {
    /* Simple 7-Day Performance Line Chart (High Readability) */
  }
        <div className="bg-[#F8FCFB] rounded-2xl p-4 sm:p-5 border border-[#0D7377]/15 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-[#132A2F]">
              7-Day Activity Rhythm
            </span>
            <span className="text-xs font-bold text-[#0D7377] bg-white px-2.5 py-0.5 rounded-full border border-[#0D7377]/20">
              Personal Baseline 88%
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
              {
    /* Baseline reference line */
  }
              <line
    x1={padding}
    y1={height - padding - (88 - 50) / 50 * (height - 2 * padding)}
    x2={width - padding}
    y2={height - padding - (88 - 50) / 50 * (height - 2 * padding)}
    stroke="#148A85"
    strokeWidth="1.5"
    strokeDasharray="4 4"
    opacity="0.6"
  />

              {
    /* Trend Path */
  }
              <path
    d={pathD}
    fill="none"
    stroke="#0D7377"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

              {
    /* Data points */
  }
              {points.map((pt, idx) => <g key={idx}>
                  <circle
    cx={pt.x}
    cy={pt.y}
    r="5.5"
    fill="#FFFFFF"
    stroke="#0D7377"
    strokeWidth="3"
  />
                  <text
    x={pt.x}
    y={height - 10}
    textAnchor="middle"
    fontSize="11"
    fontWeight="bold"
    fill="#64748B"
  >
                    {pt.day}
                  </text>
                  <text
    x={pt.x}
    y={pt.y - 10}
    textAnchor="middle"
    fontSize="11"
    fontWeight="bold"
    fill="#0D7377"
  >
                    {pt.val}%
                  </text>
                </g>)}
            </svg>
          </div>
        </div>

        {
    /* Heartfelt Reassuring Message */
  }
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex items-center gap-4 text-emerald-900">
          <div className="w-12 h-12 rounded-2xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base sm:text-lg">
              {t.greatWork}
            </h4>
            <p className="text-xs sm:text-sm font-medium text-emerald-800 mt-0.5">
              Your care team is happy with your daily engagement. Keep resting well and drinking water.
            </p>
          </div>
        </div>

      </div>

    </div>;
};
