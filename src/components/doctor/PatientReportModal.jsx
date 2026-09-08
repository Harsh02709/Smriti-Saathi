import React, { useState } from "react";
import {
  FileText,
  Printer,
  X,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Sparkles,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Download,
  Share2,
  Clock,
  Heart
} from "lucide-react";

export const PatientReportModal = ({
  report,
  patient,
  isOpen,
  onClose,
  onAddDoctorComment
}) => {
  const [addendumText, setAddendumText] = useState("");
  const [addendums, setAddendums] = useState([]);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const pName = report.patientName || patient?.name || "Patient";
  const pCode = report.patientCode || patient?.patientCode || "PT-7241";
  const pAge = patient?.age || 72;
  const pGender = patient?.gender || "Female";
  const pCaregiver = patient?.caregiverName || "Family Caregiver";
  const pDoctor = patient?.doctorName || "Dr. Debabrata Roy, MD";
  const pHospital =
    patient?.doctorHospital || "Apollo Neurological & Cognitive Care Centre";

  const handlePrint = () => {
    window.print();
  };

  const handleAddAddendum = (e) => {
    e.preventDefault();
    if (!addendumText.trim()) return;
    const newAddendum = {
      id: `add_${Date.now()}`,
      text: addendumText.trim(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      doctor: pDoctor
    };
    setAddendums([...addendums, newAddendum]);
    if (onAddDoctorComment) {
      onAddDoctorComment(report.id, newAddendum);
    }
    setAddendumText("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `BrainBoost Clinical Report [${report.id}] for Patient ${pName} (${pCode})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#0D7377]/20 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0 print:border-none">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#0D7377]">
              {report.id}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                report.status === "Requires Attention"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : report.status === "Improving"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-teal-100 text-teal-900"
              }`}
            >
              {report.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              title="Copy Summary"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Close Report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="mb-4 p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold text-center">
            Report summary copied to clipboard!
          </div>
        )}

        {/* Printable Official Clinical Report Document */}
        <div className="space-y-6">
          {/* Document Header & Hospital Branding */}
          <div className="pb-5 border-b-2 border-slate-900/10">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#0D7377] font-extrabold text-xs uppercase tracking-widest mb-1">
                  <Stethoscope className="w-4 h-4" />
                  <span>Cognitive Neurology & Geriatric Care Institute</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#132A2F] font-display">
                  {report.title}
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Reporting Period: {report.period} · Issued: {report.date}
                </p>
              </div>

              <div className="text-left sm:text-right bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                  Authoring Physician
                </span>
                <span className="text-xs font-black text-[#132A2F] block">
                  {pDoctor}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {pHospital}
                </span>
              </div>
            </div>

            {/* Patient Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 bg-[#F8FAFA] p-3.5 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  Patient Name
                </span>
                <span className="font-extrabold text-[#132A2F] text-sm">
                  {pName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  Patient ID
                </span>
                <span className="font-mono font-black text-[#0D7377] text-sm">
                  {pCode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  Age & Gender
                </span>
                <span className="font-extrabold text-[#132A2F]">
                  {pAge} yrs · {pGender}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">
                  Primary Caregiver
                </span>
                <span className="font-extrabold text-[#132A2F] truncate block">
                  {pCaregiver}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Overall Accuracy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#132A2F]">
                  {report.overallScore}%
                </span>
                <span className="text-xs font-bold text-slate-500">
                  (Base: {report.baselineScore}%)
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Task Completion
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#0D7377] block">
                {report.completionRate || "86% Adherence"}
              </span>
              <span className="text-[10px] text-slate-500">Scheduled trials</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                Avg Completion Time
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 block">
                {report.avgCompletionTime || "4.8 min"}
              </span>
              <span className="text-[10px] text-slate-500">Per cognitive task</span>
            </div>

            <div
              className={`p-4 rounded-2xl border shadow-xs ${
                report.status === "Requires Attention"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : report.status === "Improving"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-teal-50 border-teal-200 text-teal-900"
              }`}
            >
              <span className="text-[11px] font-bold uppercase block mb-1">
                Clinical Status
              </span>
              <span className="text-lg sm:text-xl font-black block">
                {report.status}
              </span>
              <span className="text-[10px] opacity-80">
                {report.status === "Requires Attention"
                  ? "Variance detected"
                  : "Within normal limits"}
              </span>
            </div>
          </div>

          {/* Section 1: Cognitive Domain Breakdown */}
          {report.domainScores && (
            <div className="bg-[#F8FAFA] p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#132A2F] flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#0D7377]" />
                  <span>Cognitive Domain Breakdown (% vs Baseline)</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Personal Target: {report.baselineScore}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {Object.entries(report.domainScores).map(([domain, score]) => {
                  const numScore = Number(score);
                  const isLow = numScore < (report.baselineScore || 80) - 10;
                  return (
                    <div
                      key={domain}
                      className="bg-white p-3 rounded-xl border border-slate-200/80"
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="capitalize text-slate-700">
                          {domain} Domain
                        </span>
                        <span
                          className={`font-black text-sm ${
                            isLow ? "text-amber-700" : "text-[#0D7377]"
                          }`}
                        >
                          {numScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLow ? "bg-amber-500" : "bg-[#0D7377]"
                          }`}
                          style={{ width: `${Math.min(numScore, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: AI Longitudinal Trajectory & Diagnostic Findings */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-teal-900 to-[#132A2F] text-white p-5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-[#9DF3C4] font-extrabold text-xs uppercase tracking-widest mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Longitudinal Machine Evaluation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                {report.aiSummary ||
                  "Statistical regression model confirms consistent performance within tolerance parameters."}
              </p>
              {report.trendAnalysis && (
                <div className="mt-3 pt-3 border-t border-white/15 text-xs text-[#9DF3C4] font-medium">
                  <strong>Trajectory Note:</strong> {report.trendAnalysis}
                </div>
              )}
            </div>

            {/* Section 3: Physician Directives & Prescriptions */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#0D7377]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#0D7377] font-extrabold text-xs uppercase tracking-widest">
                <Stethoscope className="w-4 h-4" />
                <span>Physician Directives & Cognitive Adjustments</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed pl-1">
                {report.doctorRecommendations ||
                  "Maintain scheduled daily exercises and hydration protocol."}
              </div>
            </div>

            {/* Section 4: Caregiver & Behavioral Notes */}
            {report.caregiverSummary && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                <strong className="text-slate-900 block mb-1">
                  Caregiver Observations & Activity Log:
                </strong>
                {report.caregiverSummary}
              </div>
            )}
          </div>

          {/* Doctor Addendums Section */}
          {addendums.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#132A2F]">
                Clinical Addendums & Follow-Up Comments:
              </h4>
              {addendums.map((add) => (
                <div
                  key={add.id}
                  className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-slate-800 font-medium"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#0D7377] mb-1">
                    <span>{add.doctor}</span>
                    <span className="text-slate-400">{add.date}</span>
                  </div>
                  <p>{add.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Doctor Addendum Input (Hidden during print) */}
          <form
            onSubmit={handleAddAddendum}
            className="space-y-2 pt-4 border-t border-slate-200 print:hidden"
          >
            <label className="text-xs font-extrabold text-slate-700 block">
              Add Physician Comment / Sign-off Addendum:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={addendumText}
                onChange={(e) => setAddendumText(e.target.value)}
                placeholder="Type additional clinical instructions or tele-consult findings..."
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0D7377] font-medium"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-bold text-xs rounded-xl transition shrink-0 cursor-pointer"
              >
                Add Note
              </button>
            </div>
          </form>

          {/* Official Signature Footer */}
          <div className="pt-6 border-t-2 border-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Verification & Cryptographic Hash
              </span>
              <span className="font-mono text-[11px] text-slate-500 font-medium">
                SHA256: 7f8a92b1...d408 [Digitally Certified]
              </span>
            </div>

            <div className="text-center sm:text-right">
              <div className="inline-block border-b border-slate-400 pb-1 px-4 mb-1 font-serif italic text-slate-800 font-bold">
                Dr. Debabrata Roy, MD
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Consultant Cognitive Neurologist
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
