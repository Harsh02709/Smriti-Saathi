import { useState } from "react";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import { useChatCall } from "../../context/ChatCallContext";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Plus,
  MessageSquare,
  ChevronRight,
  Radio,
  Clock,
  Activity,
  Video
} from "lucide-react";
export const FamilyDashboard = ({
  profile,
  tasks,
  reminders,
  performance,
  alert,
  notes,
  onAddObservation,
  onContactDoctor
}) => {
  const { setIsPatientChatModalOpen, startVideoCall } = useChatCall();
  const [newNoteText, setNewNoteText] = useState("");
  const [noteCategory, setNoteCategory] = useState("General observation");
  const [showNoteSuccess, setShowNoteSuccess] = useState(false);
  const [showAlertDetailModal, setShowAlertDetailModal] = useState(false);
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const familyNotes = notes.filter((n) => n.authorRole === "family" || n.authorRole === "caregiver");
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const noteItem = {
      id: `fam-note-${Date.now()}`,
      date: "25 Aug 2026, Just now",
      author: profile.caregiverName,
      authorRole: "family",
      category: noteCategory,
      content: newNoteText,
      followUpRequired: false
    };
    onAddObservation(noteItem);
    setNewNoteText("");
    setShowNoteSuccess(true);
    setTimeout(() => setShowNoteSuccess(false), 3e3);
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      
      {
    /* Top Banner: Patient Overview Card (Frame 11) */
  }
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#0D7377]/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#0D7377] to-[#148A85] flex items-center justify-center text-white text-2xl font-black shadow-md shadow-[#0D7377]/25 shrink-0">
            LD
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display">
                {profile.name}
              </h1>
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                Age {profile.age}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Status: Monitoring
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Primary Physician: {profile.doctorName} · {profile.doctorHospital}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Read-Only Family & Caregiver Companion View
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              startVideoCall({
                targetRole: "doctor",
                targetName: profile?.doctorName || "Dr. Debabrata Roy, MD",
                patientCode: profile?.patientCode || "PT-7241",
              });
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Video className="w-4 h-4" />
            <span>Doctor Video Call</span>
          </button>

          <button
            onClick={() => setIsPatientChatModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0D7377] font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Doctor</span>
          </button>
        </div>
      </div>

      {/* Live Patient Engagement Indicator for Family */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-5 border-2 border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Radio className="w-6 h-6 animate-pulse text-[#9DF3C4]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Live Companion Telemetry
              </span>
              <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
              {profile.name} is currently engaged in cognitive & physical exercises today.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Real-time events and baseline calibration are securely synchronizing with {profile.doctorName}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-bold text-emerald-800 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl">
            ✨ Healthy Engagement
          </span>
        </div>
      </div>

      {
    /* Main 4 Metric Cards (Frame 11) */
  }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {
    /* Card 1: Task Completion */
  }
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Task Completion</span>
            <CheckCircle2 className="w-5 h-5 text-[#0D7377]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#132A2F]">86%</span>
            <span className="text-xs font-bold text-emerald-700">2/3 today</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#0D7377] h-full rounded-full" style={{ width: "86%" }} />
          </div>
        </div>

        {
    /* Card 2: Memory Domain */
  }
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Memory</span>
            <Brain className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-700">72%</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              Needs attention
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Baseline 88% · Slower completion
          </p>
        </div>

        {
    /* Card 3: Attention Domain */
  }
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Attention</span>
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700">86%</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Stable & Good
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-2">
            Excellent focus during pattern exercises
          </p>
        </div>

        {
    /* Card 4: Alerts */
  }
        <div className="bg-amber-50 rounded-3xl p-5 sm:p-6 shadow-xs border-2 border-amber-300">
          <div className="flex items-center justify-between text-amber-900 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Alerts</span>
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-900">1</span>
            <span className="text-xs font-bold text-amber-800">Under Review</span>
          </div>
          <button
    onClick={() => setShowAlertDetailModal(true)}
    className="text-xs font-bold text-amber-900 underline mt-2 inline-flex items-center gap-1"
  >
            View Alert Breakdown <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {
    /* Grid: 7-Day Performance Trend (Left) & AI Daily Summary (Right) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {
    /* 7-Day Performance Trend Chart */
  }
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#0D7377]/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#132A2F]">
                7-Day Cognitive Performance Trend
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tracking daily games compared to personal baseline (88%)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#0D7377]">
                <span className="w-3 h-3 rounded-full bg-[#0D7377]" /> Overall
              </span>
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Memory
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Attention
              </span>
            </div>
          </div>

          {
    /* SVG Multi-Line Chart */
  }
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 220" className="w-full h-56">
              {
    /* Grid lines */
  }
              {[100, 80, 60, 40].map((level) => {
    const y = 30 + (100 - level) / 60 * 150;
    return <g key={level}>
                    <line x1="40" y1={y} x2="570" y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="30" y={y + 4} textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="bold">
                      {level}%
                    </text>
                  </g>;
  })}

              {
    /* Baseline reference Line 88% */
  }
              {(() => {
    const baseY = 30 + (100 - 88) / 60 * 150;
    return <g>
                    <line x1="40" y1={baseY} x2="570" y2={baseY} stroke="#148A85" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                    <text x="560" y={baseY - 5} textAnchor="end" fontSize="10" fill="#0D7377" fontWeight="bold">
                      Baseline: 88%
                    </text>
                  </g>;
  })()}

              {
    /* Overall Line */
  }
              {(() => {
    const pts = performance.map((p, i) => {
      const x = 50 + i * 510 / (performance.length - 1);
      const y = 30 + (100 - p.overall) / 60 * 150;
      return `${x},${y}`;
    }).join(" ");
    return <polyline points={pts} fill="none" stroke="#0D7377" strokeWidth="3" strokeLinecap="round" />;
  })()}

              {
    /* Memory Line */
  }
              {(() => {
    const pts = performance.map((p, i) => {
      const x = 50 + i * 510 / (performance.length - 1);
      const y = 30 + (100 - p.memory) / 60 * 150;
      return `${x},${y}`;
    }).join(" ");
    return <polyline points={pts} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="2 2" strokeLinecap="round" />;
  })()}

              {
    /* Data circles & Day labels */
  }
              {performance.map((p, i) => {
    const x = 50 + i * 510 / (performance.length - 1);
    const y = 30 + (100 - p.overall) / 60 * 150;
    return <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#FFFFFF" stroke="#0D7377" strokeWidth="2.5" />
                    <text x={x} y="205" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748B">
                      {p.date}
                    </text>
                  </g>;
  })}
            </svg>
          </div>
        </div>

        {
    /* AI Daily Summary Card (Right) */
  }
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#0D7377]/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#0D7377] text-white flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#9DF3C4]" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#132A2F]">
                  AI Daily Summary
                </h3>
                <p className="text-xs text-slate-500 font-medium">Auto-generated clinical insight</p>
              </div>
            </div>

            <div className="bg-[#F4F9F8] rounded-2xl p-4 border border-[#0D7377]/15 mb-4 text-sm text-[#132A2F] font-medium leading-relaxed">
              "Lakshmi completed 2 of 3 prescribed tasks today. Attention and pattern recognition remain resilient (86-91%). Memory recall speed was 7.8 min (baseline 4.2 min). Dr. Roy has adjusted the afternoon difficulty to preserve comfort."
            </div>

            <div className="space-y-2 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Reaction Time:</span>
                <span className="font-bold text-[#132A2F]">Calm / Stable</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span>Engagement Streak:</span>
                <span className="font-bold text-[#0D7377]">5 Days Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>Next Tele-Consult:</span>
                <span className="font-bold text-[#132A2F]">{profile.nextAppointment}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block mb-2">
              Family View is non-diagnostic. Always discuss changes with Dr. Roy.
            </span>
          </div>
        </div>

      </div>

      {
    /* Frame 26: Family Observation Logger + Reminders Summary */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {
    /* Family Observation Logger Form (Frame 26) */
  }
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#0D7377]/15">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#132A2F]">
                  Family Observations (Frame 26)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Log home mood, sleep, or fatigue for the doctor to review
                </p>
              </div>
            </div>
          </div>

          {showNoteSuccess && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Observation saved and shared with Dr. Roy!
            </div>}

          <form onSubmit={handleAddNote} className="space-y-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Category:</span>
              <select
    value={noteCategory}
    onChange={(e) => setNoteCategory(e.target.value)}
    className="text-xs font-bold bg-[#F4F9F8] border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
  >
                <option value="General observation">General Observation</option>
                <option value="Mood">Mood & Disposition</option>
                <option value="Sleep">Sleep Quality</option>
              </select>
            </div>

            <textarea
    value={newNoteText}
    onChange={(e) => setNewNoteText(e.target.value)}
    placeholder="e.g. She seemed tired today after waking early. Enjoyed the marigold memory game."
    rows={3}
    className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D7377] text-slate-800 bg-[#FAFAFA]"
  />

            <button
    type="submit"
    className="w-full py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2"
  >
              <Plus className="w-4 h-4" />
              Add Observation Note
            </button>
          </form>

          {
    /* Previous logged notes list */
  }
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {familyNotes.map((n) => <div key={n.id} className="p-3 bg-[#F8FAFA] rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-bold text-[#0D7377]">{n.author} ({n.category})</span>
                  <span>{n.date}</span>
                </div>
                <p className="text-slate-700 font-medium">{n.content}</p>
              </div>)}
          </div>
        </div>

        {
    /* Reminders & Routine Tracker (Frame 22) */
  }
        <div className="bg-[#001A4C] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#001A4C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-white">
              Daily Routine & Reminders (Frame 22)
            </h3>
            <span className="text-xs font-bold text-blue-200">
              Live Home Sync
            </span>
          </div>

          <div className="space-y-3">
            {reminders.map((rem) => <div
    key={rem.id}
    className="p-3.5 rounded-2xl border border-white/15 flex items-center justify-between gap-3 bg-white/10"
  >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">
                      {rem.title}
                    </h4>
                    <span className="text-xs font-bold text-blue-300">
                      {rem.time}
                    </span>
                  </div>
                  {rem.note && <p className="text-xs text-blue-200/80 font-medium mt-0.5">
                      {rem.note}
                    </p>}
                </div>

                <span
    className={`px-3 py-1 rounded-full text-xs font-extrabold ${rem.completed ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"}`}
  >
                  {rem.completed ? "✓ Completed" : "Pending"}
                </span>
              </div>)}
          </div>
        </div>

      </div>

      {
    /* Alert Breakdown Modal for Family */
  }
      {showAlertDetailModal && <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-300 relative">
            <div className="flex items-center gap-3 text-amber-800 mb-4">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
              <h3 className="text-xl font-extrabold text-[#132A2F]">
                [!] {alert.title}
              </h3>
            </div>

            <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">
              {alert.message}
            </p>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs font-semibold text-amber-900 space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-bold">{alert.metricComparison.accuracyBaseline}% baseline → {alert.metricComparison.accuracyCurrent}% recent</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Time:</span>
                <span className="font-bold">{alert.metricComparison.timeBaseline} min → {alert.metricComparison.timeCurrent} min</span>
              </div>
              <div className="flex justify-between">
                <span>Observed over:</span>
                <span className="font-bold">{alert.metricComparison.sessionsObserved} consecutive sessions</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
    onClick={() => {
      setShowAlertDetailModal(false);
      onContactDoctor();
    }}
    className="flex-1 py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-sm rounded-xl"
  >
                Message Dr. Roy
              </button>
              <button
    onClick={() => setShowAlertDetailModal(false)}
    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl"
  >
                Close
              </button>
            </div>
          </div>
        </div>}

    </div>;
};
