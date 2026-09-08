import React, { useState, useEffect } from "react";
import { sessionHistoryRecords } from "../../data/initialData";
import {
  initialPatientRoster,
  initialPatientReports,
  createDefaultReportForPatient
} from "../../data/patientReportsData";
import { useAuth } from "../../context/AuthContext";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import { AddPatientModal } from "./AddPatientModal";
import { PatientReportModal } from "./PatientReportModal";
import { NewReportModal } from "./NewReportModal";
import { LiveTelemetryDashboard } from "./LiveTelemetryDashboard";
import { DoctorChatTab } from "./DoctorChatTab";
import { useChatCall } from "../../context/ChatCallContext";
import {
  Stethoscope,
  Brain,
  Sparkles,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  FileText,
  Activity,
  Check,
  Phone,
  Printer,
  ChevronRight,
  BarChart3,
  X,
  UserPlus,
  Search,
  User,
  FolderOpen,
  Filter,
  Eye,
  Download,
  Share2,
  Radio,
  MessageSquare,
  Video
} from "lucide-react";

export const DoctorDashboard = ({
  profile,
  tasks,
  reminders,
  performance,
  alert,
  notes,
  onUpdateTasks,
  onAcknowledgeAlert,
  onAddClinicalNote
}) => {
  const { currentUser, allUsers } = useAuth();
  const { isLiveActive } = useRealtimeTracking();
  const { startVideoCall, unreadCountForDoctor, setIsPatientChatModalOpen, setActivePatientCode } = useChatCall();

  // Multi-patient roster state
  const [patientRoster, setPatientRoster] = useState(() => {
    return initialPatientRoster;
  });

  const [selectedPatientCode, setSelectedPatientCode] = useState(
    profile?.patientCode || "PT-7241"
  );

  // All Reports state across patients
  const [reportsList, setReportsList] = useState(() => {
    const saved = localStorage.getItem("brainboost_doctor_reports");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing reports", e);
      }
    }
    return initialPatientReports;
  });

  // Save reports to localStorage
  useEffect(() => {
    localStorage.setItem(
      "brainboost_doctor_reports",
      JSON.stringify(reportsList)
    );
  }, [reportsList]);

  // Modals state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  // Reports tab filters
  const [reportFilterType, setReportFilterType] = useState("all");
  const [reportSearchTerm, setReportSearchTerm] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState(
    alert.isAcknowledged
  );
  const [timelineTasks, setTimelineTasks] = useState(tasks);
  const [aiPlanApproved, setAiPlanApproved] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("Object Recall");
  const [newTaskDomain, setNewTaskDomain] = useState("Recall");
  const [newTaskTime, setNewTaskTime] = useState("14:00");
  const [newTaskDifficulty, setNewTaskDifficulty] = useState("Easy");
  const [historyFilterDomain, setHistoryFilterDomain] = useState("all");
  const [newClinicalNote, setNewClinicalNote] = useState("");
  const [simulationScenario, setSimulationScenario] = useState("decline");

  // Synchronize registered patients from AuthContext into patientRoster
  useEffect(() => {
    const registeredPatients = allUsers.filter((u) => u.role === "patient");
    if (registeredPatients.length > 0) {
      setPatientRoster((prevRoster) => {
        const rosterMap = new Map(prevRoster.map((p) => [p.patientCode, p]));

        registeredPatients.forEach((u) => {
          const code = u.patientCode || u.id;
          if (!rosterMap.has(code)) {
            rosterMap.set(code, {
              patientCode: code,
              id: u.id,
              name: u.name,
              preferredName: u.name.split(" ")[0],
              age: u.age || 70,
              gender: u.gender || "Female",
              phone: u.phone || "+91 98765 00000",
              caregiverName: u.caregiverName || "Family Caregiver",
              caregiverPhone: u.caregiverPhone || "+91 98765 00001",
              condition:
                u.condition || "Mild Cognitive Observation · Baseline Monitoring",
              diagnosis:
                u.diagnosis || "Cognitive Health Monitoring Protocol",
              enrolledDate: "August 2026",
              doctorName:
                currentUser?.name || "Dr. Debabrata Roy, MD",
              doctorHospital:
                currentUser?.hospital ||
                "Apollo Neurological & Cognitive Care Centre",
              nextAppointment: "Scheduled Upon Request",
              streakDays: 4,
              activitiesCompletedThisWeek: 14,
              totalActivitiesWeek: 21,
              baselineMemory: 80,
              currentMemory: 78,
              status: "Stable",
              alertCount: 0,
              notesCount: 2,
              reportsCount: 2
            });
          }
        });

        return Array.from(rosterMap.values());
      });
    }
  }, [allUsers, currentUser]);

  // Current active patient object
  const activePatient =
    patientRoster.find((p) => p.patientCode === selectedPatientCode) ||
    patientRoster[0] || {
      patientCode: "PT-7241",
      name: profile?.name || "Lakshmi Devi",
      age: profile?.age || 72,
      gender: "Female",
      caregiverName: "Ananya Sharma (Daughter)",
      caregiverPhone: "+91 98765 43210",
      condition: "Mild Cognitive Observation · Baseline Monitoring",
      doctorName: "Dr. Debabrata Roy, MD",
      doctorHospital: "Apollo Neurological & Cognitive Care Centre",
      status: "Requires Attention"
    };

  // Get reports for the currently selected patient
  const patientReports = reportsList.filter(
    (r) => r.patientCode?.toUpperCase() === selectedPatientCode.toUpperCase()
  );

  // Filtered reports for search and category
  const filteredReports = patientReports.filter((rep) => {
    const matchesType =
      reportFilterType === "all" || rep.type === reportFilterType;
    const matchesSearch =
      reportSearchTerm === "" ||
      rep.title.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
      rep.id.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
      (rep.aiSummary &&
        rep.aiSummary.toLowerCase().includes(reportSearchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Handler when doctor adds/links a new patient by code
  const handlePatientAdded = (patientCode) => {
    const cleanCode = patientCode.trim().toUpperCase();
    setSelectedPatientCode(cleanCode);

    // Check if patient already has reports, if not generate default baseline reports
    const existing = reportsList.filter(
      (r) => r.patientCode?.toUpperCase() === cleanCode
    );
    if (existing.length === 0) {
      const patientObj = patientRoster.find(
        (p) => p.patientCode.toUpperCase() === cleanCode
      );
      const newReports = createDefaultReportForPatient(
        cleanCode,
        patientObj?.name || `Patient ${cleanCode}`,
        patientObj?.age || 70
      );
      setReportsList((prev) => [...newReports, ...prev]);
    }
  };

  // Handler for saving a new report generated by doctor
  const handleSaveNewReport = (newReport) => {
    setReportsList((prev) => [newReport, ...prev]);
    setSelectedReportForModal(newReport);
  };

  // Handler for adding doctor comment on a report
  const handleAddDoctorComment = (reportId, comment) => {
    setReportsList((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            doctorRecommendations: `${r.doctorRecommendations || ""}\n\n[Addendum ${comment.date}]: ${comment.text}`
          };
        }
        return r;
      })
    );
  };

  const currentPerformance =
    simulationScenario === "improvement"
      ? [
          {
            day: "Day 1",
            date: "19 Aug",
            memory: 72,
            attention: 75,
            recall: 70,
            pattern: 74,
            overall: 73,
            baseline: 80,
            timeMinutesEasy: 6.5,
            timeMinutesMed: 9,
            errorsCount: 6
          },
          {
            day: "Day 2",
            date: "20 Aug",
            memory: 75,
            attention: 78,
            recall: 73,
            pattern: 76,
            overall: 76,
            baseline: 80,
            timeMinutesEasy: 5.8,
            timeMinutesMed: 8.5,
            errorsCount: 5
          },
          {
            day: "Day 3",
            date: "21 Aug",
            memory: 79,
            attention: 82,
            recall: 77,
            pattern: 80,
            overall: 80,
            baseline: 80,
            timeMinutesEasy: 5,
            timeMinutesMed: 7.8,
            errorsCount: 4
          },
          {
            day: "Day 4",
            date: "22 Aug",
            memory: 82,
            attention: 85,
            recall: 81,
            pattern: 84,
            overall: 83,
            baseline: 80,
            timeMinutesEasy: 4.5,
            timeMinutesMed: 7.2,
            errorsCount: 3
          },
          {
            day: "Day 5",
            date: "23 Aug",
            memory: 85,
            attention: 88,
            recall: 84,
            pattern: 87,
            overall: 86,
            baseline: 80,
            timeMinutesEasy: 4,
            timeMinutesMed: 6.8,
            errorsCount: 2
          },
          {
            day: "Day 6",
            date: "24 Aug",
            memory: 87,
            attention: 89,
            recall: 86,
            pattern: 89,
            overall: 88,
            baseline: 80,
            timeMinutesEasy: 3.8,
            timeMinutesMed: 6.4,
            errorsCount: 1
          },
          {
            day: "Day 7 (Today)",
            date: "25 Aug",
            memory: 89,
            attention: 91,
            recall: 88,
            pattern: 92,
            overall: 90,
            baseline: 80,
            timeMinutesEasy: 3.5,
            timeMinutesMed: 6,
            errorsCount: 1
          }
        ]
      : simulationScenario === "dip"
      ? [
          {
            day: "Day 1",
            date: "19 Aug",
            memory: 88,
            attention: 89,
            recall: 86,
            pattern: 90,
            overall: 88,
            baseline: 88,
            timeMinutesEasy: 3.5,
            timeMinutesMed: 6.5,
            errorsCount: 2
          },
          {
            day: "Day 2",
            date: "20 Aug",
            memory: 89,
            attention: 88,
            recall: 87,
            pattern: 91,
            overall: 89,
            baseline: 88,
            timeMinutesEasy: 3.4,
            timeMinutesMed: 6.4,
            errorsCount: 2
          },
          {
            day: "Day 3",
            date: "21 Aug",
            memory: 87,
            attention: 90,
            recall: 85,
            pattern: 89,
            overall: 88,
            baseline: 88,
            timeMinutesEasy: 3.6,
            timeMinutesMed: 6.6,
            errorsCount: 2
          },
          {
            day: "Day 4",
            date: "22 Aug",
            memory: 88,
            attention: 87,
            recall: 86,
            pattern: 90,
            overall: 88,
            baseline: 88,
            timeMinutesEasy: 3.5,
            timeMinutesMed: 6.5,
            errorsCount: 2
          },
          {
            day: "Day 5",
            date: "23 Aug",
            memory: 86,
            attention: 88,
            recall: 84,
            pattern: 89,
            overall: 87,
            baseline: 88,
            timeMinutesEasy: 3.8,
            timeMinutesMed: 6.8,
            errorsCount: 3
          },
          {
            day: "Day 6 (Poor Sleep)",
            date: "24 Aug",
            memory: 62,
            attention: 74,
            recall: 58,
            pattern: 78,
            overall: 68,
            baseline: 88,
            timeMinutesEasy: 6.2,
            timeMinutesMed: 9,
            errorsCount: 7
          },
          {
            day: "Day 7 (Recovered)",
            date: "25 Aug",
            memory: 88,
            attention: 89,
            recall: 87,
            pattern: 91,
            overall: 89,
            baseline: 88,
            timeMinutesEasy: 3.5,
            timeMinutesMed: 6.5,
            errorsCount: 2
          }
        ]
      : performance;

  const handleAddNewTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.toUpperCase(),
      domain: newTaskDomain,
      difficulty: newTaskDifficulty,
      durationMinutes: 4,
      doctorAssigned: true,
      assignedTime: newTaskTime,
      status: "pending",
      iconName: "Eye",
      description: "Prescribed cognitive exercise.",
      required: true
    };
    const updated = [...timelineTasks, newTask].sort((a, b) =>
      (a.assignedTime || "").localeCompare(b.assignedTime || "")
    );
    setTimelineTasks(updated);
    onUpdateTasks(updated);
    setShowAddTaskModal(false);
  };

  const handleRemoveTask = (id) => {
    const updated = timelineTasks.filter((t) => t.id !== id);
    setTimelineTasks(updated);
    onUpdateTasks(updated);
  };

  const handleChangeDifficulty = (id, diff) => {
    const updated = timelineTasks.map((t) =>
      t.id === id ? { ...t, difficulty: diff } : t
    );
    setTimelineTasks(updated);
    onUpdateTasks(updated);
  };

  const handleApproveAiPlan = () => {
    setAiPlanApproved(true);
    const updated = timelineTasks.map((t) => ({ ...t, difficulty: "Easy" }));
    setTimelineTasks(updated);
    onUpdateTasks(updated);
  };

  const handleSaveDoctorNote = (e) => {
    e.preventDefault();
    if (!newClinicalNote.trim()) return;
    const noteItem = {
      id: `doc-note-${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      author: activePatient.doctorName || profile?.doctorName || "Dr. Debabrata Roy",
      authorRole: "doctor",
      category: "Clinical",
      content: newClinicalNote,
      followUpRequired: true
    };
    onAddClinicalNote(noteItem);
    setNewClinicalNote("");
  };

  const filteredHistory =
    historyFilterDomain === "all"
      ? sessionHistoryRecords
      : sessionHistoryRecords.filter(
          (s) => s.domain.toLowerCase() === historyFilterDomain.toLowerCase()
        );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* ========================================================= */}
      {/* 1. TOP DOCTOR BAR WITH PATIENT SELECTOR & ADD PATIENT ID */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#0D7377]/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Active Patient Identity */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D7377] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0D7377]/20">
              <Stethoscope className="w-8 h-8 text-[#9DF3C4]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Patient:
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display">
                  {activePatient.name}
                </h1>
                <span className="font-mono text-xs font-black bg-teal-50 text-[#0D7377] border border-teal-200 px-2.5 py-0.5 rounded-lg">
                  {activePatient.patientCode}
                </span>
                <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-0.5 rounded-full">
                  Age {activePatient.age}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-0.5 rounded-full border flex items-center gap-1 ${
                    activePatient.status === "Requires Attention"
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : activePatient.status === "Improving"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                      : "bg-teal-100 text-teal-900 border-teal-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  {activePatient.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Caregiver: <strong>{activePatient.caregiverName}</strong> · Condition: {activePatient.condition} · {patientReports.length} Reports Archived
              </p>
            </div>
          </div>

          {/* Quick Doctor Actions & Navigation Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                startVideoCall({
                  patientCode: activePatient.patientCode,
                  targetRole: "patient",
                  targetName: activePatient.name,
                });
              }}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Video className="w-4 h-4" />
              <span>Video Consultation</span>
            </button>

            <button
              onClick={() => {
                if (activePatient?.patientCode) {
                  setActivePatientCode(activePatient.patientCode);
                }
                setIsPatientChatModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0D7377] font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-xs"
              title="Open Live Chat Popup Modal"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Patient Chat (Popup)</span>
            </button>

            <button
              onClick={() => setShowAddPatientModal(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-[#0D7377] hover:from-teal-700 hover:to-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#0D7377]/20 flex items-center gap-2 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#9DF3C4]" />
              <span>+ Add Patient with ID</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PATIENT ROSTER SELECTOR BAR (SWITCH AMONG DOCTOR PATIENTS) */}
        {/* ========================================================= */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              Doctor Roster ({patientRoster.length}):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {patientRoster.map((patient) => {
                const isSelected =
                  patient.patientCode === selectedPatientCode;
                const reportsCount = reportsList.filter(
                  (r) => r.patientCode === patient.patientCode
                ).length;
                return (
                  <button
                    key={patient.patientCode}
                    onClick={() => {
                      setSelectedPatientCode(patient.patientCode);
                      // If patient has no reports, generate default
                      if (reportsCount === 0) {
                        const newReps = createDefaultReportForPatient(
                          patient.patientCode,
                          patient.name,
                          patient.age
                        );
                        setReportsList((prev) => [...newReps, ...prev]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-[#0D7377] text-white shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <span>{patient.name}</span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-white/20 text-white font-black"
                          : "bg-teal-50 text-[#0D7377] border border-teal-200"
                      }`}
                    >
                      {patient.patientCode}
                    </span>
                    {reportsCount > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-[#9DF3C4] text-slate-950 font-black"
                            : "bg-slate-200 text-slate-700"
                        }`}
                        title={`${reportsCount} Reports`}
                      >
                        {reportsCount} reps
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setShowAddPatientModal(true)}
            className="text-xs font-extrabold text-[#0D7377] hover:underline flex items-center gap-1 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>Link Another Patient ID</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 mt-4 bg-[#F0F7F6] rounded-2xl border border-[#0D7377]/15">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            {
              id: "chat",
              label: "Live Chat & Teleconsult",
              icon: MessageSquare,
              badge: unreadCountForDoctor > 0 ? String(unreadCountForDoctor) : "LIVE"
            },
            {
              id: "telemetry",
              label: "Live Telemetry & Tracking",
              icon: Radio,
              badge: isLiveActive ? "LIVE" : "SYNC"
            },
            {
              id: "reports",
              label: `Patient Reports (${patientReports.length})`,
              icon: FileText,
              badge: patientReports.length ? String(patientReports.length) : null
            },
            { id: "scheduler", label: "Task Scheduler", icon: Calendar },
            { id: "analytics", label: "AI Analytics", icon: Activity },
            {
              id: "alerts",
              label: "Alert Center",
              icon: AlertTriangle,
              badge: activePatient.status === "Requires Attention" ? "1" : null
            },
            { id: "history", label: "Session History", icon: Clock },
            { id: "notes", label: "Clinical Notes", icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isCurrent
                    ? "bg-[#0D7377] text-white shadow-xs"
                    : "text-slate-700 hover:bg-white/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                      tab.id === "alerts"
                        ? "bg-rose-500 text-white"
                        : "bg-teal-200 text-[#0D7377]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* AI CLINICAL DEMONSTRATOR BAR */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-[#132A2F] to-[#0D7377] rounded-3xl p-4 sm:p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#9DF3C4]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9DF3C4] block">
              AI ENGINE LONGITUDINAL SIMULATOR · ACTIVE PATIENT: {activePatient.name} ({activePatient.patientCode})
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-white">
              {simulationScenario === "decline"
                ? "Scenario 1: Persistent Decline Detected (4 Consecutive Sessions Below Baseline)"
                : simulationScenario === "improvement"
                ? "Scenario 2: Adaptive Cognitive Improvement (AI Proposes Difficulty Upgrade)"
                : "Scenario 3: Temporary Sleep Dip / Filtered False Alert (Responsible Alerting)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSimulationScenario("decline")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              simulationScenario === "decline"
                ? "bg-amber-400 text-slate-950 shadow-xs"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Persistent Decline
          </button>
          <button
            onClick={() => setSimulationScenario("improvement")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              simulationScenario === "improvement"
                ? "bg-emerald-400 text-slate-950 shadow-xs"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Improvement
          </button>
          <button
            onClick={() => setSimulationScenario("dip")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              simulationScenario === "dip"
                ? "bg-blue-400 text-slate-950 shadow-xs"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Isolated Dip
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB: LIVE DOCTOR-PATIENT WEBSOCKET CHAT & TELECONSULTATION */}
      {/* ========================================================= */}
      {activeTab === "chat" && (
        <DoctorChatTab
          patientRoster={patientRoster}
          selectedPatientCode={selectedPatientCode}
          onSelectPatient={(code) => setSelectedPatientCode(code)}
        />
      )}

      {/* ========================================================= */}
      {/* TAB: REAL-TIME TELEMETRY & GAME TRACKING ENGINE */}
      {/* ========================================================= */}
      {activeTab === "telemetry" && (
        <LiveTelemetryDashboard activePatient={activePatient} />
      )}

      {/* ========================================================= */}
      {/* TAB 1: MAIN DOCTOR CLINICAL DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Real-time Telemetry Quick Access Banner */}
          <div className="bg-gradient-to-r from-[#0D7377] via-teal-800 to-[#132A2F] rounded-3xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#9DF3C4] shrink-0">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#9DF3C4]">
                    AI Real-Time Game Telemetry Engine
                  </span>
                  <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    ONLINE
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                  Streaming live cognitive events, latency curves, pose tracking, and difficulty adaptations for {activePatient.name}.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("telemetry")}
              className="px-4 py-2.5 bg-[#9DF3C4] hover:bg-[#8AE8B3] text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl transition shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Open Live Telemetry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Task Completion
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#132A2F]">
                  86%
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  18/21 week
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#0D7377] h-full rounded-full"
                  style={{ width: "86%" }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Average Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#132A2F]">
                  76%
                </span>
                <span className="text-xs font-bold text-amber-700">
                  vs 88% Base
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Consistent engagement
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15">
              <span className="text-xs font-bold text-amber-800 uppercase block mb-1">
                Memory Accuracy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-700">
                  68%
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  ↓ -20%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                4 sessions below baseline
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#0D7377]/15 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Clinical Reports
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#0D7377]">
                    {patientReports.length}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    Archived
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("reports")}
                className="text-xs font-bold text-[#0D7377] underline mt-2 inline-flex items-center gap-1 cursor-pointer"
              >
                View Patient Reports <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Main Trend Line + AI Longitudinal Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cognitive Performance Trend */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#0D7377]/15">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-[#132A2F]">
                    Cognitive Performance Trend (7 Days)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Patient: {activePatient.name} ({activePatient.patientCode}) · Baseline (88%)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-600 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />{" "}
                    Memory
                  </span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />{" "}
                    Attention
                  </span>
                  <span className="text-[#0D7377] flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D7377]" />{" "}
                    Pattern
                  </span>
                </div>
              </div>

              {/* Clean SVG Line Graph */}
              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 600 230" className="w-full h-60">
                  {[100, 80, 60, 40].map((v) => {
                    const y = 30 + ((100 - v) / 60) * 150;
                    return (
                      <g key={v}>
                        <line
                          x1="40"
                          y1={y}
                          x2="570"
                          y2={y}
                          stroke="#F1F5F9"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <text
                          x="30"
                          y={y + 4}
                          textAnchor="end"
                          fontSize="10"
                          fill="#94A3B8"
                          fontWeight="bold"
                        >
                          {v}%
                        </text>
                      </g>
                    );
                  })}

                  {(() => {
                    const baseY = 30 + ((100 - 88) / 60) * 150;
                    return (
                      <g>
                        <line
                          x1="40"
                          y1={baseY}
                          x2="570"
                          y2={baseY}
                          stroke="#148A85"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <text
                          x="560"
                          y={baseY - 5}
                          textAnchor="end"
                          fontSize="10"
                          fill="#0D7377"
                          fontWeight="bold"
                        >
                          Baseline: 88%
                        </text>
                      </g>
                    );
                  })()}

                  {/* Memory Series */}
                  {(() => {
                    const pts = currentPerformance
                      .map((p, i) => {
                        const x =
                          50 + (i * 510) / (currentPerformance.length - 1);
                        const y = 30 + ((100 - p.memory) / 60) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ");
                    return (
                      <polyline
                        points={pts}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })()}

                  {/* Attention Series */}
                  {(() => {
                    const pts = currentPerformance
                      .map((p, i) => {
                        const x =
                          50 + (i * 510) / (currentPerformance.length - 1);
                        const y = 30 + ((100 - p.attention) / 60) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ");
                    return (
                      <polyline
                        points={pts}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    );
                  })()}

                  {/* Pattern Series */}
                  {(() => {
                    const pts = currentPerformance
                      .map((p, i) => {
                        const x =
                          50 + (i * 510) / (currentPerformance.length - 1);
                        const y = 30 + ((100 - p.pattern) / 60) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ");
                    return (
                      <polyline
                        points={pts}
                        fill="none"
                        stroke="#0D7377"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        strokeLinecap="round"
                      />
                    );
                  })()}

                  {currentPerformance.map((p, i) => {
                    const x = 50 + (i * 510) / (currentPerformance.length - 1);
                    const yMem = 30 + ((100 - p.memory) / 60) * 150;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={yMem}
                          r="5"
                          fill="#FFFFFF"
                          stroke="#F59E0B"
                          strokeWidth="3"
                        />
                        <text
                          x={x}
                          y="210"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="#64748B"
                        >
                          {p.date}
                        </text>
                        {i === currentPerformance.length - 1 && (
                          <text
                            x={x}
                            y={yMem - 10}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="extrabold"
                            fill="#B45309"
                          >
                            {p.memory}% (Today)
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#0D7377]/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0D7377] text-white flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#9DF3C4]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#132A2F]">
                      AI Longitudinal Rationale
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Patient: {activePatient.name} ({activePatient.patientCode})
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-4 border mb-4 ${
                    simulationScenario === "decline"
                      ? "bg-amber-50/80 border-amber-200"
                      : simulationScenario === "improvement"
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-blue-50/80 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-xs mb-1">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        simulationScenario === "decline"
                          ? "text-amber-700"
                          : simulationScenario === "improvement"
                          ? "text-emerald-700"
                          : "text-blue-700"
                      }`}
                    />
                    <span
                      className={
                        simulationScenario === "decline"
                          ? "text-amber-900"
                          : simulationScenario === "improvement"
                          ? "text-emerald-900"
                          : "text-blue-900"
                      }
                    >
                      {simulationScenario === "decline"
                        ? "PERSISTENT PERFORMANCE CHANGE"
                        : simulationScenario === "improvement"
                        ? "STEADY COGNITIVE IMPROVEMENT"
                        : "TRANSIENT DEVIATION FILTERED"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {simulationScenario === "decline"
                      ? "Memory accuracy dropped from 88% baseline to 68% over 4 comparable sessions. Average completion time shifted from 4.2 min to 7.8 min. Attention remains intact at 86%."
                      : simulationScenario === "improvement"
                      ? "Memory accuracy rose from 72% to 89% over 7 sessions with average completion time improving from 6.5 min to 3.5 min. AI recommends advancing to Medium tier."
                      : "Day 6 dip (62%) was an isolated episode coinciding with caregiver-reported poor sleep. Day 7 performance returned to 88%. No clinical alert triggered (responsible alerting)."}
                  </p>
                </div>

                {/* Domain Breakdown Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-4">
                  <div className="bg-[#F4F9F8] p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">
                      Memory
                    </span>
                    <span className="text-amber-700 text-sm font-black">
                      {
                        currentPerformance[currentPerformance.length - 1]
                          .memory
                      }
                      %
                    </span>
                  </div>
                  <div className="bg-[#F4F9F8] p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">
                      Attention
                    </span>
                    <span className="text-emerald-700 text-sm font-black">
                      {
                        currentPerformance[currentPerformance.length - 1]
                          .attention
                      }
                      %
                    </span>
                  </div>
                  <div className="bg-[#F4F9F8] p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">
                      Recall
                    </span>
                    <span className="text-teal-700 text-sm font-black">
                      {
                        currentPerformance[currentPerformance.length - 1]
                          .recall
                      }
                      %
                    </span>
                  </div>
                  <div className="bg-[#F4F9F8] p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">
                      Pattern
                    </span>
                    <span className="text-teal-700 text-sm font-black">
                      {
                        currentPerformance[currentPerformance.length - 1]
                          .pattern
                      }
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab("reports")}
                  className="w-full py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  View All Patient Reports ({patientReports.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PATIENT REPORTS & CLINICAL FILES (FULL REPORTS HUB) */}
      {/* ========================================================= */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#0D7377]/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0D7377] uppercase tracking-wider mb-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>Clinical Records & Reports Archive</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display">
                  Reports for {activePatient.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Patient ID: <strong className="font-mono text-[#0D7377]">{activePatient.patientCode}</strong> · Age {activePatient.age} · Caregiver: {activePatient.caregiverName}
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setShowNewReportModal(true)}
                  className="px-4 py-2.5 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Generate New Report</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print All</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-5">
              {/* Type Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: "all", label: `All Reports (${patientReports.length})` },
                  { id: "weekly_summary", label: "Weekly Summaries" },
                  { id: "longitudinal_ai", label: "Longitudinal AI" },
                  { id: "diagnostic_assessment", label: "Assessments" },
                  { id: "caregiver_observation", label: "Caregiver Logs" }
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setReportFilterType(flt.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      reportFilterType === flt.id
                        ? "bg-[#0D7377] text-white shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={reportSearchTerm}
                  onChange={(e) => setReportSearchTerm(e.target.value)}
                  placeholder="Search reports, keywords..."
                  className="w-full text-xs font-medium p-2.5 pl-8 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0D7377] bg-[#FAFAFA]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                {reportSearchTerm && (
                  <button
                    onClick={() => setReportSearchTerm("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Reports Grid List */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-3xl p-6 shadow-xs border border-[#0D7377]/15 hover:border-[#0D7377]/40 transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-[#0D7377] border border-teal-200">
                            {report.id}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {report.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#132A2F] leading-snug">
                          {report.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Period: {report.period} · Author: {report.author}
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap border shrink-0 ${
                          report.status === "Requires Attention"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : report.status === "Improving"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : "bg-teal-100 text-teal-900 border-teal-200"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Scores & Completion Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-[#F8FAFA] p-3 rounded-2xl border border-slate-100 text-xs font-bold mb-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">
                          Overall Score
                        </span>
                        <span className="text-base font-black text-[#132A2F]">
                          {report.overallScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">
                          Baseline
                        </span>
                        <span className="text-base font-bold text-slate-600">
                          {report.baselineScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">
                          Completion
                        </span>
                        <span className="text-xs font-black text-[#0D7377] truncate block mt-0.5">
                          {report.completionRate || "86% Tasks"}
                        </span>
                      </div>
                    </div>

                    {/* Domain Scores Bar Preview */}
                    {report.domainScores && (
                      <div className="space-y-1.5 mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          Domain Performance (%):
                        </span>
                        <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold text-center">
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block">Memory</span>
                            <span className="text-amber-700 font-extrabold">{report.domainScores.memory}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block">Attention</span>
                            <span className="text-emerald-700 font-extrabold">{report.domainScores.attention}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block">Recall</span>
                            <span className="text-teal-700 font-extrabold">{report.domainScores.recall}%</span>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block">Pattern</span>
                            <span className="text-teal-700 font-extrabold">{report.domainScores.pattern}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Excerpt */}
                    <div className="text-xs text-slate-600 font-medium line-clamp-2 bg-teal-50/40 p-2.5 rounded-xl border border-teal-100">
                      <strong>AI Summary:</strong> "{report.aiSummary || report.trendAnalysis}"
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <button
                      onClick={() => setSelectedReportForModal(report)}
                      className="flex-1 py-2.5 px-4 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Full Clinical Report</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReportForModal(report);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                      title="Print / Save PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#0D7377]/15 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0D7377] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#132A2F]">
                  No Reports Found for this Filter
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {reportSearchTerm
                    ? `No reports matched "${reportSearchTerm}". Try clearing your search term.`
                    : `No reports currently listed under this category for ${activePatient.name}.`}
                </p>
              </div>
              <div className="flex justify-center gap-3">
                {reportSearchTerm && (
                  <button
                    onClick={() => setReportSearchTerm("")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => setShowNewReportModal(true)}
                  className="px-4 py-2 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Report for {activePatient.name}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TASK SCHEDULER */}
      {/* ========================================================= */}
      {activeTab === "scheduler" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#0D7377]/15 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#0D7377] uppercase tracking-wider">
                Daily Task Prescription · Patient: {activePatient.name}
              </span>
              <h3 className="text-2xl font-extrabold text-[#132A2F]">
                Scheduled Tasks for {activePatient.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Add, remove, or modify cognitive exercises for this patient
              </p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2.5 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Task</span>
            </button>
          </div>

          <div className="space-y-3">
            {timelineTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0D7377] flex items-center justify-center font-extrabold text-xs">
                    {t.assignedTime || "09:00"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#132A2F] text-sm">
                      {t.title}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      Domain: <strong>{t.domain}</strong> · Duration: {t.durationMinutes} min
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={t.difficulty}
                    onChange={(e) => handleChangeDifficulty(t.id, e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                  </select>
                  <button
                    onClick={() => handleRemoveTask(t.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                    title="Remove Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ALERT CENTER */}
      {/* ========================================================= */}
      {activeTab === "alerts" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-amber-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-0.5 rounded-full uppercase">
                      Alert Center
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {alert.timestamp}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#132A2F] mt-1">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium mt-0.5">
                    Patient: {activePatient.name} (Age {activePatient.age}) · ID: {activePatient.patientCode}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsAlertAcknowledged(true);
                    onAcknowledgeAlert(alert.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition flex items-center gap-1.5 ${
                    isAlertAcknowledged
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-[#0D7377] hover:bg-[#0A5C5F] text-white shadow-xs"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {isAlertAcknowledged ? "Acknowledged" : "Acknowledge"}
                </button>
                <button
                  onClick={() =>
                    alert(
                      `Calling caregiver ${activePatient.caregiverName} at ${activePatient.caregiverPhone}`
                    )
                  }
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  Contact Family
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F8FAFA] p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Accuracy Trend
                </span>
                <span className="text-xl font-extrabold text-amber-700">
                  88% → 68%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Personal baseline drop
                </span>
              </div>

              <div className="bg-[#F8FAFA] p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Completion Time
                </span>
                <span className="text-xl font-extrabold text-amber-700">
                  4.2 min → 7.8 min
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Observed elongation
                </span>
              </div>

              <div className="bg-[#F8FAFA] p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
                  Observed Over
                </span>
                <span className="text-xl font-extrabold text-[#132A2F]">
                  4 Sessions
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Comparable exercises
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
              <strong>Clinical Rationale:</strong> "{alert.aiExplanation}"
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: CLINICAL SESSION HISTORY TABLE */}
      {/* ========================================================= */}
      {activeTab === "history" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#0D7377]/15 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-[#132A2F]">
                Clinical Session History
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Trial logs for {activePatient.name} ({activePatient.patientCode})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Domain:</span>
              <select
                value={historyFilterDomain}
                onChange={(e) => setHistoryFilterDomain(e.target.value)}
                className="text-xs font-bold bg-[#F0F7F6] border border-[#0D7377]/20 rounded-xl px-3 py-1.5 text-slate-700"
              >
                <option value="all">All Domains</option>
                <option value="Memory">Memory</option>
                <option value="Attention">Attention</option>
                <option value="Recall">Recall</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Game</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Accuracy</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Errors</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 font-bold text-[#132A2F]">{row.date}</td>
                    <td className="py-3.5 font-semibold">{row.game}</td>
                    <td className="py-3.5">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-bold">
                        {row.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold">{row.score}</td>
                    <td className="py-3.5 font-black text-[#0D7377]">
                      {row.accuracy}
                    </td>
                    <td className="py-3.5">{row.time}</td>
                    <td className="py-3.5 text-amber-700 font-bold">
                      {row.errors}
                    </td>
                    <td className="py-3.5">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />{" "}
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: CLINICAL / CARE NOTES */}
      {/* ========================================================= */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#0D7377]/15 space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-2xl font-extrabold text-[#132A2F]">
              Clinical & Care Notes
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Patient: {activePatient.name} ({activePatient.patientCode})
            </p>
          </div>

          <form onSubmit={handleSaveDoctorNote} className="space-y-3">
            <textarea
              value={newClinicalNote}
              onChange={(e) => setNewClinicalNote(e.target.value)}
              placeholder="Enter physician follow-up instructions, prescription changes, or tele-consult findings..."
              rows={3}
              className="w-full text-sm p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#0D7377] focus:outline-none bg-[#FAFAFA]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-sm rounded-xl transition shadow-xs cursor-pointer"
            >
              Add Physician Note
            </button>
          </form>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-[#F8FAFA] border border-slate-200"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-extrabold text-[#0D7377]">
                    {note.author} ({note.category})
                  </span>
                  <span className="text-slate-400 font-medium">{note.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ADD PATIENT BY PATIENT ID MODAL */}
      {/* ========================================================= */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onPatientAdded={handlePatientAdded}
        existingAssignedCodes={patientRoster.map((p) => p.patientCode)}
      />

      {/* ========================================================= */}
      {/* MODAL 2: FULL CLINICAL REPORT VIEWER & EXPORT MODAL */}
      {/* ========================================================= */}
      {selectedReportForModal && (
        <PatientReportModal
          isOpen={Boolean(selectedReportForModal)}
          report={selectedReportForModal}
          patient={activePatient}
          onClose={() => setSelectedReportForModal(null)}
          onAddDoctorComment={handleAddDoctorComment}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL 3: GENERATE NEW REPORT MODAL */}
      {/* ========================================================= */}
      {showNewReportModal && (
        <NewReportModal
          isOpen={showNewReportModal}
          patient={activePatient}
          onClose={() => setShowNewReportModal(false)}
          onSaveReport={handleSaveNewReport}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ADD TASK MODAL */}
      {/* ========================================================= */}
      {showAddTaskModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddTaskModal(false);
          }}
          className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#0D7377]/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-[#132A2F]">
                Schedule Cognitive Task
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Standard Clinical Game Presets (1-10)
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                {[
                  { name: "1. Memory Match", domain: "Memory" },
                  { name: "2. Number Recall", domain: "Recall" },
                  { name: "3. Picture Recall", domain: "Recall" },
                  { name: "4. Pattern Recall", domain: "Attention" },
                  { name: "5. Sound Match", domain: "Attention" },
                  { name: "6. Simple Puzzle", domain: "Pattern" },
                  { name: "7. Find the Object", domain: "Attention" },
                  { name: "8. Color & Shape Match", domain: "Attention" },
                  { name: "9. Daily Routine Recall", domain: "Recall" },
                  { name: "10. Familiar Place Memory", domain: "Memory" }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setNewTaskTitle(preset.name.toUpperCase());
                      setNewTaskDomain(preset.domain);
                    }}
                    className="p-1.5 text-left bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg text-slate-700 truncate cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNewTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Domain
                  </label>
                  <select
                    value={newTaskDomain}
                    onChange={(e) => setNewTaskDomain(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-slate-200"
                  >
                    <option value="Memory">Memory</option>
                    <option value="Attention">Attention</option>
                    <option value="Recall">Recall</option>
                    <option value="Pattern">Pattern</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newTaskDifficulty}
                    onChange={(e) => setNewTaskDifficulty(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl border border-slate-200"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Time (24h)
                </label>
                <input
                  type="text"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 font-bold"
                  placeholder="e.g. 14:00"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-sm rounded-xl cursor-pointer"
                >
                  Add to Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
