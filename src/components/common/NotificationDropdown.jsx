import React, { useState } from "react";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Play,
  Plus,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Pill,
  Droplets,
  Activity,
  Brain,
  Stethoscope,
  Footprints,
  ChevronRight,
  Check,
  RotateCcw
} from "lucide-react";

export const NotificationDropdown = ({
  isOpen,
  onClose,
  reminders = [],
  tasks = [],
  onToggleReminder,
  onStartTask,
  onAddReminder,
  onMarkAllDone,
  profile
}) => {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'reminders' | 'tasks'
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("08:00 PM");
  const [newCategory, setNewCategory] = useState("medicine");
  const [newNote, setNewNote] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const pendingReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const totalPending = pendingReminders.length + pendingTasks.length;

  const handleCreateReminder = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddReminder) {
      onAddReminder({
        title: newTitle.trim().toUpperCase(),
        time: newTime,
        category: newCategory,
        actionLabel: newCategory === "medicine" ? "TAKEN" : newCategory === "water" ? "DRINK WATER" : "DONE",
        note: newNote.trim() || undefined
      });
    }

    setNewTitle("");
    setNewNote("");
    setIsAddingReminder(false);
  };

  const handleSpeakReminders = () => {
    if (!("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = `Hello ${profile?.preferredName || profile?.name || ""}. `;
    if (totalPending === 0) {
      speechText += "You have completed all your reminders and daily tasks for today. Well done!";
    } else {
      speechText += `You have ${pendingReminders.length} pending reminders and ${pendingTasks.length} daily cognitive tasks to complete. `;
      if (pendingReminders.length > 0) {
        speechText += "Your reminders are: ";
        pendingReminders.forEach((r, idx) => {
          speechText += `${idx + 1}, ${r.title} scheduled for ${r.time}. ${r.note ? r.note : ""}. `;
        });
      }
      if (pendingTasks.length > 0) {
        speechText += "Your scheduled tasks are: ";
        pendingTasks.forEach((t, idx) => {
          speechText += `${idx + 1}, ${t.title}, ${t.durationMinutes} minutes. `;
        });
      }
    }

    const lang = profile?.language || "en";
    const isHindi = lang === "hi";
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = isHindi ? "hi-IN" : "en-US";
    utterance.rate = isHindi ? 0.82 : 0.9;
    utterance.pitch = 1.0;
    // Select best matching voice for Hindi matra pronunciation
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetLang = isHindi ? "hi-IN" : "en-US";
      const preferred =
        voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
        voices.find((v) => v.lang === targetLang) ||
        voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2))) ||
        null;
      if (preferred) utterance.voice = preferred;
    }
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "medicine":
        return <Pill className="w-4 h-4 text-rose-500" />;
      case "water":
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case "appointment":
        return <Stethoscope className="w-4 h-4 text-indigo-500" />;
      case "walk":
        return <Footprints className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "medicine":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "water":
        return "bg-sky-50 border-sky-200 text-sky-700";
      case "appointment":
        return "bg-indigo-50 border-indigo-200 text-indigo-700";
      case "walk":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-start justify-end sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Dropdown Container */}
      <div className="relative w-full sm:w-[440px] max-h-[92vh] sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 sm:mt-16 sm:mr-4 animate-in slide-in-from-top-4 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#001A4C] text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Your Reminders & Tasks
                </h3>
                {totalPending > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-xs shadow-xs">
                    {totalPending} due
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-xs">
                    All clear
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200 font-medium">
                Personal health alerts & cognitive routine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio narration button */}
            <button
              onClick={handleSpeakReminders}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSpeaking
                  ? "bg-amber-400 text-amber-950 border-amber-300 animate-bounce"
                  : "bg-white/15 hover:bg-white/25 text-white border-white/20"
              }`}
              title={isSpeaking ? "Stop Voice Narration" : "Read Reminders Aloud"}
              aria-label="Read Reminders Aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
              aria-label="Close Notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#001A4C] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              All ({reminders.length + tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("reminders")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "reminders"
                  ? "bg-[#001A4C] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              <span>Reminders</span>
              {pendingReminders.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "reminders" ? "bg-white text-[#001A4C] font-black" : "bg-rose-100 text-rose-700 font-bold"}`}>
                  {pendingReminders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "tasks"
                  ? "bg-[#001A4C] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              <span>Tasks</span>
              {pendingTasks.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "tasks" ? "bg-white text-[#001A4C] font-black" : "bg-amber-100 text-amber-800 font-bold"}`}>
                  {pendingTasks.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Action Button: Mark all done or Add */}
          <button
            onClick={() => setIsAddingReminder(!isAddingReminder)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#001A4C] text-xs font-bold transition cursor-pointer"
            title="Add a new reminder"
          >
            <Plus className="w-3.5 h-3.5 text-[#001A4C]" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Add Reminder Form Collapse */}
        {isAddingReminder && (
          <form
            onSubmit={handleCreateReminder}
            className="p-3.5 bg-gradient-to-br from-blue-50/70 to-slate-50 border-b border-blue-200 animate-in slide-in-from-top-2 duration-150 shrink-0"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#001A4C] uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#001A4C]" />
                New Reminder
              </span>
              <button
                type="button"
                onClick={() => setIsAddingReminder(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. EVENING BLOOD PRESSURE TABLET"
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001A4C] placeholder:text-slate-400"
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    Time / Schedule
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 08:30 PM"
                    className="w-full px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001A4C]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001A4C]"
                  >
                    <option value="medicine">💊 Medicine</option>
                    <option value="water">💧 Water & Hydration</option>
                    <option value="appointment">🩺 Doctor Appointment</option>
                    <option value="walk">🚶 Walk / Exercise</option>
                    <option value="routine">⏰ Routine Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Optional note (e.g. 1 glass warm water after meal)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001A4C] placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingReminder(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#001A4C] hover:bg-[#002466] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh] sm:max-h-[60vh] divide-y divide-slate-100">
          
          {/* ================= 1. REMINDERS LIST ================= */}
          {(activeTab === "all" || activeTab === "reminders") && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Personal Reminders ({reminders.length})</span>
                </span>
                {pendingReminders.length > 0 && onMarkAllDone && (
                  <button
                    onClick={onMarkAllDone}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all completed</span>
                  </button>
                )}
              </div>

              {reminders.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    No active reminders set for today.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reminders.map((rem) => {
                    const isDone = rem.completed;
                    return (
                      <div
                        key={rem.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isDone
                            ? "bg-slate-50/80 border-slate-200 opacity-75"
                            : "bg-white border-slate-200 hover:border-blue-300 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {/* Toggle Checkbox */}
                          <button
                            onClick={() => onToggleReminder && onToggleReminder(rem.id)}
                            className={`mt-0.5 p-1 rounded-xl transition cursor-pointer shrink-0 ${
                              isDone
                                ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                                : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                            title={isDone ? "Mark as Pending" : "Mark as Completed"}
                            aria-label={`Toggle reminder ${rem.title}`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 stroke-[2]" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-black tracking-tight ${
                                  isDone
                                    ? "line-through text-slate-500 font-semibold"
                                    : "text-slate-900"
                                }`}
                              >
                                {rem.title}
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${getCategoryBadgeClass(
                                  rem.category
                                )}`}
                              >
                                {getCategoryIcon(rem.category)}
                                <span className="capitalize">{rem.category || "reminder"}</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {rem.time}
                              </span>
                              {rem.note && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{rem.note}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status / Quick toggle button */}
                        <button
                          onClick={() => onToggleReminder && onToggleReminder(rem.id)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold shrink-0 border transition cursor-pointer ${
                            isDone
                              ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                              : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          {isDone ? "DONE ✓" : rem.actionLabel || "TAKE"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= 2. TASKS LIST ================= */}
          {(activeTab === "all" || activeTab === "tasks") && (
            <div className="space-y-2.5 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Assigned Daily Tasks ({tasks.length})</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {completedTasks.length} / {tasks.length} Completed
                </span>
              </div>

              {/* Tour pending steps callout */}
              {tasks.some(t => t.isTourStep) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                  <span className="text-lg">⏳</span>
                  <div>
                    <p className="text-xs font-extrabold text-amber-900">Guided Tour Steps Pending</p>
                    <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                      You skipped some onboarding steps. Tap <strong>Resume</strong> to continue the tour from where you left off.
                    </p>
                  </div>
                </div>
              )}

              {tasks.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    No doctor-assigned tasks scheduled today.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const isCompleted = task.status === "completed";
                    const isTourStep = task.isTourStep;
                    const isSkippedTask = task.isSkippedTask;

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isCompleted
                            ? "bg-emerald-50/50 border-emerald-200"
                            : isSkippedTask
                            ? "bg-amber-50/70 border-amber-300 hover:border-amber-400 shadow-xs"
                            : isTourStep
                            ? "bg-amber-50/60 border-amber-200 hover:border-amber-400 shadow-xs"
                            : "bg-white border-slate-200 hover:border-indigo-300 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                              isCompleted
                                ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                                : isSkippedTask
                                ? "bg-amber-100 border-amber-300 text-amber-800"
                                : isTourStep
                                ? "bg-amber-100 border-amber-300 text-amber-700"
                                : "bg-indigo-50 border-indigo-200 text-indigo-700"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : isSkippedTask ? (
                              <span className="text-lg">🎮</span>
                            ) : isTourStep ? (
                              <Clock className="w-5 h-5 text-amber-600" />
                            ) : (
                              <Brain className="w-5 h-5 text-indigo-600" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-black text-slate-900 tracking-tight truncate">
                                {task.title}
                              </h4>
                              {isSkippedTask && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-[9px] flex items-center gap-0.5">
                                  ⏭️ Skipped from Home
                                </span>
                              )}
                              {isTourStep && (
                                <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-800 font-bold text-[9px] flex items-center gap-0.5">
                                  ⏳ Tour Step
                                </span>
                              )}
                              {task.doctorAssigned && !isTourStep && !isSkippedTask && (
                                <span className="px-1.5 py-0.2 rounded-md bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[9px]">
                                  Rx Assigned
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                              <span className="font-bold text-slate-700">
                                {task.domain || "Cognitive"}
                              </span>
                              <span>•</span>
                              <span>{task.durationMinutes} min duration</span>
                              {task.difficulty && !isTourStep && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">{task.difficulty}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Start Task Button */}
                        <button
                          onClick={() => {
                            if (onStartTask) {
                              onStartTask(task);
                              onClose();
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs ${
                            isCompleted
                              ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300"
                              : isSkippedTask
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white ring-2 ring-amber-400"
                              : isTourStep
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          }`}
                          title={isCompleted ? "Play Again" : isSkippedTask ? "Start Therapy Game" : isTourStep ? "Go to Tour Step" : "Launch Cognitive Task"}
                        >
                          {isCompleted ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Replay</span>
                            </>
                          ) : isSkippedTask ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Start Therapy</span>
                            </>
                          ) : isTourStep ? (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Resume</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Start Task</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* All caught up encouragement */}
          {totalPending === 0 && (
            <div className="pt-4 text-center p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-xs font-extrabold text-emerald-900">
                You're all caught up for today!
              </h4>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Wonderful job completing your medication, hydration, and cognitive sessions.
              </p>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cloud & Local Sync Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
