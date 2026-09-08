import React, { useState } from "react";
import {
  FileText,
  Plus,
  X,
  Stethoscope,
  Brain,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const NewReportModal = ({
  patient,
  isOpen,
  onClose,
  onSaveReport
}) => {
  const [title, setTitle] = useState(
    `Weekly Cognitive Activity Summary (${new Date().toLocaleDateString("en-GB", { month: "short", day: "2-digit" })})`
  );
  const [reportType, setReportType] = useState("weekly_summary");
  const [overallScore, setOverallScore] = useState("78");
  const [baselineScore, setBaselineScore] = useState("85");
  const [memoryScore, setMemoryScore] = useState("75");
  const [attentionScore, setAttentionScore] = useState("86");
  const [recallScore, setRecallScore] = useState("70");
  const [patternScore, setPatternScore] = useState("88");
  const [status, setStatus] = useState("Stable");
  const [aiSummary, setAiSummary] = useState(
    "Patient demonstrates steady cognitive engagement. Memory retention stable with minor variations during timed trials."
  );
  const [doctorDirectives, setDoctorDirectives] = useState(
    "1. Maintain current cognitive exercise protocol.\n2. Continue 15-minute daily garden walk with caregiver.\n3. Routine hydration reminders recommended."
  );
  const [caregiverNotes, setCaregiverNotes] = useState(
    "Caregiver reported good mood and calm sleep over the previous 7 days."
  );

  if (!isOpen || !patient) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const newReport = {
      id: `REP-${patient.patientCode || "PAT"}-${Date.now().toString().slice(-4)}`,
      patientCode: patient.patientCode,
      patientName: patient.name,
      title: title.trim(),
      type: reportType,
      date: dateStr,
      period: `Reporting Week (${dateStr})`,
      author: `${patient.doctorName || "Dr. Debabrata Roy, MD"} & BrainBoost AI`,
      status: status,
      overallScore: parseInt(overallScore, 10) || 75,
      baselineScore: parseInt(baselineScore, 10) || 80,
      completionRate: "90% (19/21 Tasks)",
      avgCompletionTime: "4.5 min",
      domainScores: {
        memory: parseInt(memoryScore, 10) || 75,
        attention: parseInt(attentionScore, 10) || 85,
        recall: parseInt(recallScore, 10) || 70,
        pattern: parseInt(patternScore, 10) || 88
      },
      trendAnalysis: `Comprehensive clinical observation filed by Dr. Roy for patient ${patient.name} (${patient.patientCode}).`,
      aiSummary: aiSummary.trim(),
      doctorRecommendations: doctorDirectives.trim(),
      caregiverSummary: caregiverNotes.trim(),
      sessionSummaryCount: 19,
      vitalNotes: "BP & Vitals within baseline tolerance"
    };

    onSaveReport(newReport);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#0D7377]/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D7377] text-white flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#9DF3C4]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#132A2F]">
                Generate New Clinical Report
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Patient: <strong className="text-[#0D7377]">{patient.name}</strong> ({patient.patientCode})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Report Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200"
              >
                <option value="weekly_summary">Weekly Activity Summary</option>
                <option value="longitudinal_ai">Longitudinal AI Diagnostic</option>
                <option value="diagnostic_assessment">Clinical Assessment</option>
                <option value="caregiver_observation">Caregiver Observation Log</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Clinical Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200"
              >
                <option value="Stable">Stable</option>
                <option value="Improving">Improving</option>
                <option value="Requires Attention">Requires Attention</option>
              </select>
            </div>
          </div>

          {/* Domain Scores */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Cognitive Scores (%)
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Memory</label>
                <input
                  type="number"
                  value={memoryScore}
                  onChange={(e) => setMemoryScore(e.target.value)}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-200 text-center"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Attention</label>
                <input
                  type="number"
                  value={attentionScore}
                  onChange={(e) => setAttentionScore(e.target.value)}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-200 text-center"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Recall</label>
                <input
                  type="number"
                  value={recallScore}
                  onChange={(e) => setRecallScore(e.target.value)}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-200 text-center"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Pattern</label>
                <input
                  type="number"
                  value={patternScore}
                  onChange={(e) => setPatternScore(e.target.value)}
                  className="w-full text-xs font-bold p-2 rounded-lg border border-slate-200 text-center"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              AI Summary & Machine Evaluation
            </label>
            <textarea
              rows={2}
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Physician Directives & Prescription Notes
            </label>
            <textarea
              rows={2}
              value={doctorDirectives}
              onChange={(e) => setDoctorDirectives(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Clinical Report</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
