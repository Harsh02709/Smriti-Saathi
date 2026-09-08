import React, { useState } from "react";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import {
  Activity,
  Brain,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Radio,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Camera,
  Mic,
  Zap,
  RotateCcw,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Play,
  Pause,
  Layers,
  Eye,
  Award
} from "lucide-react";

export const LiveTelemetryDashboard = ({ activePatient }) => {
  const {
    activeSession,
    isLiveActive,
    sessionHistory,
    recordEvent,
    startLiveGame,
    TRACKING_EVENT_TYPES
  } = useRealtimeTracking();

  const [filterEventType, setFilterEventType] = useState("all");
  const [activeTelemetryTab, setActiveTelemetryTab] = useState("live_overview");

  // Format patient name and code
  const patientName = activePatient?.name || activeSession?.patientName || "Lakshmi Devi";
  const patientCode = activePatient?.patientCode || activeSession?.patientId || "PT-7241";

  // Compute live data points
  const responseTimes = activeSession?.responseTimes || [3.2, 4.5, 6.8, 5.1];
  const accuracy = activeSession?.currentAccuracy ?? 84;
  const rollingAcc = activeSession?.rollingAccuracy ?? 80;
  const avgResponse = activeSession?.avgResponseTime ?? 4.8;
  const correctCount = activeSession?.correctCount ?? 7;
  const incorrectCount = activeSession?.incorrectCount ?? 2;
  const totalCount = correctCount + incorrectCount || 9;
  const step = activeSession?.currentStep || 7;
  const totalSteps = activeSession?.totalSteps || 10;
  const difficulty = activeSession?.difficulty || "Medium";
  const recommendedDiff = activeSession?.recommendedDifficulty || "Medium";
  const baselineAccuracy = activeSession?.baselineAccuracy || 88;
  const baselineResponseTime = activeSession?.baselineResponseTime || 4.5;
  const baselineDelta = activeSession?.accuracyDelta ?? -4;

  // Build live accuracy progress points for chart
  const accuracyPoints = responseTimes.map((time, idx) => {
    // Generate incremental accuracy curve from events
    return {
      step: idx + 1,
      time,
      accuracy: Math.max(40, Math.min(100, Math.round(100 - (idx > 2 ? (idx * 4) : 0) + (time < 5 ? 5 : -5))))
    };
  });

  // Simulator helper to test live updates directly from doctor screen
  const handleSimulateQuestion = (isCorrect, simulatedSeconds = 4.2) => {
    if (!isLiveActive) {
      startLiveGame(
        { id: "task-live-demo", title: "Memory Sequence", domain: "Memory", difficulty: "Medium" },
        activePatient || { patientCode: "PT-7241", name: "Lakshmi Devi" },
        { totalSteps: 10 }
      );
    }
    const nextStep = (activeSession?.currentStep || 0) + 1;
    recordEvent({
      eventType: isCorrect ? TRACKING_EVENT_TYPES.ANSWER_CORRECT : TRACKING_EVENT_TYPES.ANSWER_INCORRECT,
      stepNumber: nextStep,
      correct: isCorrect,
      responseTime: simulatedSeconds,
      instructionType: nextStep % 2 === 0 ? "DEMONSTRATION" : "VOICE",
      description: `Question ${nextStep} ${isCorrect ? 'completed correctly' : 'answered incorrectly'} in ${simulatedSeconds}s`
    });
  };

  const handleSimulateMotion = (isMatch = true) => {
    recordEvent({
      eventType: TRACKING_EVENT_TYPES.MOVEMENT_VERIFIED,
      expectedMovement: "Right Hand → Left Knee",
      actualMovement: isMatch ? "Right Hand → Left Knee" : "Right Hand → Right Knee",
      correct: isMatch,
      confidence: 0.96,
      description: `Camera Pose: Right Hand → Left Knee verified with 96% confidence`
    });
  };

  const eventsList = activeSession?.events || [];
  const filteredEvents = eventsList.filter((e) => {
    if (filterEventType === "all") return true;
    if (filterEventType === "answers") return e.eventType?.includes("ANSWER");
    if (filterEventType === "motion") return e.eventType?.includes("MOVEMENT") || e.eventType?.includes("POSE");
    if (filterEventType === "insights") return e.eventType?.includes("INSIGHT") || e.description?.includes("AI");
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP LIVE SESSION STATUS BANNER */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D7377] to-teal-600 text-white flex items-center justify-center shadow-md shadow-[#0D7377]/25">
                <Radio className="w-7 h-7 text-[#9DF3C4] animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                  {isLiveActive ? "🟢 Active Gameplay Session" : "🟢 Telemetry Engine Online"}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Patient: {patientName} ({patientCode})
                </span>
                <span className="text-xs font-bold bg-teal-50 text-[#0D7377] border border-teal-200 px-2.5 py-0.5 rounded-md">
                  Game: {activeSession?.gameTitle || "Memory Sequence"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5">
                Streaming continuous telemetry from game engine, camera pose analyzer, and voice agent.
              </p>
            </div>
          </div>

          {/* Quick Simulation Trigger Bar (Allows Doctors to Test Live Telemetry Anytime) */}
          <div className="flex items-center gap-2 flex-wrap bg-[#F0F7F6] p-2 rounded-2xl border border-[#0D7377]/15">
            <span className="text-[11px] font-extrabold text-[#0D7377] uppercase px-2">
              Live Stream Test:
            </span>
            <button
              onClick={() => handleSimulateQuestion(true, 3.4)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
              title="Simulate patient answering correctly"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>+ Correct Ans (3.4s)</span>
            </button>
            <button
              onClick={() => handleSimulateQuestion(false, 8.2)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
              title="Simulate slow incorrect answer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>+ Incorrect Ans (8.2s)</span>
            </button>
            <button
              onClick={() => handleSimulateMotion(true)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
              title="Simulate camera pose verification"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Pose Verified</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME TELEMETRY METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Live Accuracy & Rolling */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Live Accuracy</span>
            <Activity className="w-4 h-4 text-[#0D7377]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">
              {accuracy}%
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                baselineDelta >= 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {baselineDelta >= 0 ? `+${baselineDelta}%` : `${baselineDelta}%`} vs baseline
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Rolling 5-Task: <strong>{rollingAcc}%</strong></span>
            <span>Historical: <strong>{baselineAccuracy}%</strong></span>
          </div>
        </div>

        {/* Tile 2: Response Time & Trend */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Response Latency</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              {avgResponse}s
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                activeSession?.responseTimeTrend === "increasing"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {activeSession?.responseTimeTrend === "increasing" ? (
                <>
                  <TrendingUp className="w-3 h-3 text-amber-700" />
                  <span>Slowing</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-emerald-700" />
                  <span>Steady</span>
                </>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Last Step: <strong>{activeSession?.lastResponseTime || avgResponse}s</strong></span>
            <span>Baseline: <strong>{baselineResponseTime}s</strong></span>
          </div>
        </div>

        {/* Tile 3: Step Progress & Difficulty */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Session Progress</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">
              {step}/{totalSteps}
            </span>
            <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
              {difficulty} Tier
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0D7377] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((step / totalSteps) * 100))}%` }}
            />
          </div>
        </div>

        {/* Tile 4: AI Status & Fatigue Monitor */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">AI Cognitive Status</span>
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-lg sm:text-xl font-extrabold ${
                activeSession?.baselineStatus === "BELOW_BASELINE" || activeSession?.fatigueDetected
                  ? "text-amber-700"
                  : "text-emerald-700"
              }`}
            >
              {activeSession?.fatigueDetected
                ? "🟡 Fatigue Signal"
                : activeSession?.baselineStatus === "SLIGHTLY_BELOW"
                ? "🟡 Below Baseline"
                : "🟢 Stable Baseline"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate">
            {activeSession?.fatigueDetected
              ? "Consecutive slow latencies flagged."
              : `AI Target Difficulty: ${recommendedDiff}`}
          </p>
        </div>
      </div>

      {/* 3. REAL-TIME CHARTS GRID (Accuracy, Latency, vs Baseline, Correct/Incorrect) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Real-time Accuracy Curve */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#132A2F] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#0D7377]" />
                <span>Live Accuracy Stream (%)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Continuous rolling accuracy recalculated on each submitted event
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
              Current: {accuracy}%
            </span>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
            <div className="h-48 w-full relative flex items-center justify-center">
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="40" y1="20" x2="390" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="30" y="24" textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="bold">100%</text>

                <line x1="40" y1="55" x2="390" y2="55" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="30" y="59" textAnchor="end" fontSize="9" fill="#0D7377" fontWeight="black">88% Base</text>

                <line x1="40" y1="90" x2="390" y2="90" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="30" y="94" textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="bold">60%</text>

                <line x1="40" y1="130" x2="390" y2="130" stroke="#CBD5E1" strokeWidth="1" />
                <text x="30" y="134" textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="bold">30%</text>

                {/* Baseline Shaded Target Zone (85-92%) */}
                <rect x="40" y="45" width="350" height="25" fill="#0D7377" fillOpacity="0.08" rx="4" />

                {/* Live Accuracy Polyline */}
                {(() => {
                  const points = accuracyPoints.map((pt, i) => {
                    const x = 50 + (i * 330) / Math.max(1, accuracyPoints.length - 1);
                    const y = 20 + ((100 - pt.accuracy) / 70) * 110;
                    return `${x},${Math.max(20, Math.min(130, y))}`;
                  }).join(" ");

                  return (
                    <>
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#0D7377"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {accuracyPoints.map((pt, i) => {
                        const x = 50 + (i * 330) / Math.max(1, accuracyPoints.length - 1);
                        const y = 20 + ((100 - pt.accuracy) / 70) * 110;
                        return (
                          <g key={i}>
                            <circle
                              cx={x}
                              cy={Math.max(20, Math.min(130, y))}
                              r="4.5"
                              fill="#FFFFFF"
                              stroke="#0D7377"
                              strokeWidth="2.5"
                            />
                            <text
                              x={x}
                              y="150"
                              textAnchor="middle"
                              fontSize="9"
                              fill="#64748B"
                              fontWeight="bold"
                            >
                              Q{pt.step}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>

        {/* Chart 2: Real-time Response Latency Curve */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#132A2F] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Response Time per Task (Seconds)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tracking latency trends to identify cognitive hesitation or fatigue
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Avg: {avgResponse}s
            </span>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
            <div className="h-48 w-full relative flex items-center justify-center">
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="40" y1="25" x2="390" y2="25" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="30" y="29" textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="bold">12s</text>

                <line x1="40" y1="65" x2="390" y2="65" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                <text x="30" y="69" textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="bold">8s</text>

                <line x1="40" y1="100" x2="390" y2="100" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="30" y="104" textAnchor="end" fontSize="9" fill="#B45309" fontWeight="bold">4.5s Base</text>

                <line x1="40" y1="135" x2="390" y2="135" stroke="#CBD5E1" strokeWidth="1" />
                <text x="30" y="139" textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="bold">0s</text>

                {/* Response times bars / curve */}
                {(() => {
                  const points = responseTimes.map((t, i) => {
                    const x = 50 + (i * 330) / Math.max(1, responseTimes.length - 1);
                    const y = 135 - (t / 12) * 110;
                    return `${x},${Math.max(20, Math.min(135, y))}`;
                  }).join(" ");

                  return (
                    <>
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {responseTimes.map((t, i) => {
                        const x = 50 + (i * 330) / Math.max(1, responseTimes.length - 1);
                        const y = 135 - (t / 12) * 110;
                        return (
                          <g key={i}>
                            <circle
                              cx={x}
                              cy={Math.max(20, Math.min(135, y))}
                              r="4.5"
                              fill="#FFFFFF"
                              stroke="#F59E0B"
                              strokeWidth="2.5"
                            />
                            <text
                              x={x}
                              y={Math.max(15, y - 8)}
                              textAnchor="middle"
                              fontSize="8"
                              fill="#92400E"
                              fontWeight="black"
                            >
                              {t}s
                            </text>
                            <text
                              x={x}
                              y="150"
                              textAnchor="middle"
                              fontSize="9"
                              fill="#64748B"
                              fontWeight="bold"
                            >
                              Q{i + 1}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE VS BASELINE & LEARNING STYLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Correct vs Incorrect Live Counter */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#132A2F] uppercase">
              Correct vs Incorrect Ratio
            </h3>
            <span className="text-xs font-bold text-slate-400">Live Counters</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Correct</span>
              <span className="text-3xl font-black text-emerald-700">{correctCount}</span>
              <span className="text-[10px] font-bold text-emerald-600 block mt-1">
                {Math.round((correctCount / totalCount) * 100)}% of total
              </span>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 text-center">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">Incorrect</span>
              <span className="text-3xl font-black text-rose-700">{incorrectCount}</span>
              <span className="text-[10px] font-bold text-rose-600 block mt-1">
                {Math.round((incorrectCount / totalCount) * 100)}% of total
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Ratio Distribution</span>
              <span>{correctCount} : {incorrectCount}</span>
            </div>
            <div className="w-full bg-rose-100 h-3 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(correctCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Learning Style Profile (Section 15) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#132A2F] uppercase">
              Learning Style Detection
            </h3>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
              AI Inferred
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Response accuracy mapped by instruction presentation type:
          </p>

          <div className="space-y-2 text-xs font-bold">
            {[
              { type: "Visual Demonstration", score: 92, bg: "bg-teal-600" },
              { type: "Animation / Icon Guide", score: 88, bg: "bg-emerald-600" },
              { type: "Voice Instructions", score: 78, bg: "bg-blue-600" },
              { type: "Text Instructions", score: 62, bg: "bg-amber-500" }
            ].map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>{item.type}</span>
                  <span className="font-extrabold">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${item.bg} h-full rounded-full`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-900 font-medium mt-2">
            💡 <strong>Clinical Observation:</strong> Patient currently performs significantly better (+30%) with visual and demonstration-led instructions.
          </div>
        </div>

        {/* Card 3: Live AI Rationale & Insights Stream (Section 14 & 16) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-[#132A2F] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0D7377]" />
                <span>AI Clinical Insights</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Live</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(activeSession?.aiInsights || [
                "Response time is within normal baseline variance.",
                "Patient responds best to visual demonstrations.",
                "No clinical fatigue detected in active session."
              ]).map((insight, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold mt-2">
            🛡️ <strong>Non-Diagnostic Alerting:</strong> Persistent changes are only flagged after 4+ multi-session evaluations to prevent false alarms.
          </div>
        </div>
      </div>

      {/* 5. GAME EVENT STREAM (Section 11) */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[#132A2F] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0D7377]" />
              <span>Real-Time Game Event Stream</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Live audit stream of user inputs, pose detections, voice queries, and AI evaluations
            </p>
          </div>

          {/* Event Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F0F7F6] p-1 rounded-xl border border-[#0D7377]/15">
            {[
              { id: "all", label: "All Events" },
              { id: "answers", label: "Answers" },
              { id: "motion", label: "Motion / Pose" },
              { id: "insights", label: "AI Insights" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterEventType(f.id)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  filterEventType === f.id
                    ? "bg-[#0D7377] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Stream Terminal */}
        <div className="bg-[#132A2F] rounded-2xl p-4 font-mono text-xs text-emerald-300 max-h-64 overflow-y-auto space-y-2 border border-slate-700">
          {filteredEvents.length === 0 ? (
            <div className="text-slate-400 py-4 text-center font-sans text-xs">
              No live events recorded yet. Click "Simulate Telemetry Test" above or have patient start a game to stream events.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const isCorrect = evt.correct === true || evt.eventType === "ANSWER_CORRECT";
              const isIncorrect = evt.correct === false || evt.eventType === "ANSWER_INCORRECT";
              const isAi = evt.eventType?.includes("AI") || evt.description?.includes("AI");

              return (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 py-1 border-b border-slate-800/80 hover:bg-slate-800/40 px-2 rounded-md transition"
                >
                  <span className="text-slate-400 text-[11px] shrink-0 font-bold">
                    {evt.timeString || "14:32:10"}
                  </span>
                  <span className="shrink-0">
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold">✓</span>
                    ) : isIncorrect ? (
                      <span className="text-rose-400 font-bold">✗</span>
                    ) : isAi ? (
                      <span className="text-purple-300">🧠</span>
                    ) : (
                      <span className="text-teal-300">📡</span>
                    )}
                  </span>
                  <div className="flex-1">
                    <span className="text-slate-200">
                      {evt.description || `${evt.eventType}: Step ${evt.stepNumber || 1}`}
                    </span>
                    {evt.responseTime && (
                      <span className="text-amber-300 ml-2 text-[10px]">
                        [{evt.responseTime}s]
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">
                    {evt.eventType}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
