import React, { useState, useEffect, useRef } from "react";
import { useChatCall } from "../../context/ChatCallContext";
import { useAuth } from "../../context/AuthContext";
import {
  Send,
  Video,
  Phone,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  Check,
  CheckCheck,
  User,
  Stethoscope,
  Activity,
  Calendar,
  Clock,
  Plus,
  Search,
  FileText,
  Radio,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Play
} from "lucide-react";

export const DoctorChatTab = ({ patientRoster = [], selectedPatientCode, onSelectPatient }) => {
  const {
    messages,
    sendMessage,
    sendTyping,
    typingStatus,
    activePatientCode,
    setActivePatientCode,
    markAsRead,
    startVideoCall,
    presenceStatus,
    connectionStatus,
  } = useChatCall();

  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPrescriptionMenu, setShowPrescriptionMenu] = useState(false);
  const [selectedTaskToPrescribe, setSelectedTaskToPrescribe] = useState("Object Identification");
  const [prescribeDifficulty, setPrescribeDifficulty] = useState("Easy");
  const [prescribeTime, setPrescribeTime] = useState("14:00");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const chatBottomRef = useRef(null);

  // Setup Web Speech API for voice typing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = "en-IN";

        recog.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recog.onerror = () => setIsListening(false);
        recog.onend = () => setIsListening(false);
        recognitionRef.current = recog;
      }
    }
  }, []);

  // Sync active patient code if passed from parent
  useEffect(() => {
    if (selectedPatientCode && selectedPatientCode !== activePatientCode) {
      setActivePatientCode(selectedPatientCode);
    }
  }, [selectedPatientCode, activePatientCode, setActivePatientCode]);

  // Mark as read when viewing active patient chat
  useEffect(() => {
    if (activePatientCode) {
      markAsRead(activePatientCode);
    }
  }, [activePatientCode, messages, markAsRead]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingStatus]);

  const activePatient =
    patientRoster.find((p) => p.patientCode === activePatientCode) ||
    patientRoster[0] || {
      name: "Lakshmi Devi",
      patientCode: "PT-7241",
      age: 72,
      caregiverName: "Ananya Sharma",
      condition: "Mild Cognitive Observation",
    };

  const filteredPatients = patientRoster.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Speech Recognition error", e);
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      patientCode: activePatientCode,
      text: inputText.trim(),
      type: "text",
    });

    setInputText("");
    sendTyping(activePatientCode, false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    sendTyping(activePatientCode, e.target.value.length > 0);
  };

  const handleSendQuickTemplate = (text) => {
    sendMessage({
      patientCode: activePatientCode,
      text,
      type: "text",
    });
  };

  const handleSendPrescription = () => {
    sendMessage({
      patientCode: activePatientCode,
      text: `Prescribed Cognitive Exercise: ${selectedTaskToPrescribe} (${prescribeDifficulty} level) scheduled for ${prescribeTime}.`,
      type: "prescription",
      prescriptionData: {
        taskTitle: selectedTaskToPrescribe.toUpperCase(),
        domain: selectedTaskToPrescribe.includes("Recall") ? "Recall" : "Coordination",
        time: prescribeTime,
        difficulty: prescribeDifficulty,
        instructions: "Complete this task as part of daily cognitive protocol.",
      },
    });
    setShowPrescriptionMenu(false);
  };

  const handleStartCall = () => {
    startVideoCall({
      patientCode: activePatientCode,
      targetRole: "patient",
      targetName: activePatient.name,
    });
  };

  const isPatientOnline =
    presenceStatus[activePatientCode]?.status === "online" || connectionStatus === "connected";

  return (
    <div className="bg-white rounded-3xl border border-[#0D7377]/15 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[750px]">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR: PATIENT ROSTER CHAT LIST */}
      {/* ========================================================= */}
      <div className="w-full md:w-80 border-r border-slate-100 bg-gradient-to-b from-[#FAFDFD] to-[#F4F9F9] flex flex-col shrink-0">
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-gradient-to-r from-[#132A2F] via-[#0D7377] to-teal-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border-2 border-[#9DF3C4] flex items-center justify-center text-[#9DF3C4] shadow-inner">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base font-display">
                  Doctor Inbox
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  WebSocket Live
                </span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/50 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name or ID..."
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/50 focus:outline-hidden focus:border-[#9DF3C4] focus:bg-white/15 transition"
            />
          </div>
        </div>

        {/* Patient Conversations List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPatients.map((patient) => {
            const isSelected = patient.patientCode === activePatientCode;
            const patientOnline =
              presenceStatus[patient.patientCode]?.status === "online" ||
              patient.patientCode === "PT-7241";

            return (
              <button
                key={patient.patientCode}
                onClick={() => {
                  setActivePatientCode(patient.patientCode);
                  if (onSelectPatient) onSelectPatient(patient.patientCode);
                }}
                className={`w-full text-left p-3.5 rounded-2xl transition flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#0D7377] to-teal-700 text-white shadow-md shadow-[#0D7377]/20"
                    : "hover:bg-teal-50 text-slate-700"
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-2xl font-black flex items-center justify-center text-xs ${
                      isSelected
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-teal-100 text-[#0D7377] border border-teal-200"
                    }`}
                  >
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  {patientOnline && (
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 ${isSelected ? 'border-[#0D7377]' : 'border-white'} animate-pulse`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`font-extrabold text-xs truncate ${
                        isSelected ? "text-white" : "text-[#132A2F]"
                      }`}
                    >
                      {patient.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {patient.patientCode}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate ${
                      isSelected ? "text-teal-100" : "text-slate-500"
                    }`}
                  >
                    {patient.condition || "Cognitive Monitoring Protocol"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN CHAT PANE */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col bg-white">
        {/* ========================================================= */}
        {/* 1. TOP PATIENT IDENTITY BAR — Premium Gradient */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-[#132A2F] via-[#0D7377] to-teal-800 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border-2 border-[#9DF3C4] flex items-center justify-center text-[#9DF3C4] shadow-inner">
                <User className="w-7 h-7" />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${isPatientOnline ? 'bg-emerald-400' : 'bg-slate-400'} border-2 border-[#132A2F] ${isPatientOnline ? 'animate-pulse' : ''}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl font-display text-white">
                  {activePatient.name}
                </h3>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-white/10 text-teal-200 border border-white/20">
                  {activePatient.patientCode}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isPatientOnline ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-slate-500/20 text-slate-300 border-slate-400/30'}`}>
                  {isPatientOnline ? "Online" : "Offline"}
                </span>
              </div>
              <p className="text-xs text-teal-100/80 font-medium truncate max-w-xs sm:max-w-md">
                Caregiver: {activePatient.caregiverName} · {activePatient.condition}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Start Video Call Button */}
            <button
              onClick={handleStartCall}
              className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. CHAT MESSAGE STREAM — Warm Background */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FDFAF5] to-[#F4F9F9]">
          <div className="text-center my-2">
            <span className="px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0D7377] text-xs font-bold shadow-2xs">
              Live Secure Telehealth Channel with Patient
            </span>
          </div>

          {messages.map((msg) => {
            const isDoctor = msg.senderRole === "doctor";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-xs font-extrabold text-slate-500">
                    {msg.senderName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Prescription card — rich design */}
                {msg.type === "prescription" ? (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-[#0D7377]/40 rounded-3xl p-4 sm:p-5 max-w-md shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#0D7377] font-black text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Prescribed Clinical Task
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-[#0D7377] rounded-md">
                        {msg.prescriptionData?.time || "Today"}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#132A2F] text-base">
                      {msg.prescriptionData?.taskTitle || "Cognitive Exercise"}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {msg.text}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-bold text-teal-900 bg-white/80 p-2.5 rounded-xl border border-teal-100">
                      <span>Difficulty: {msg.prescriptionData?.difficulty || "Easy"}</span>
                      <span>·</span>
                      <span>Scheduled: {msg.prescriptionData?.time || "Today"}</span>
                    </div>

                    <div className="w-full py-2.5 bg-[#0D7377]/10 text-[#0D7377] font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 border border-[#0D7377]/20">
                      <Play className="w-3.5 h-3.5" />
                      <span>Dispatched to Patient</span>
                    </div>
                  </div>
                ) : msg.type === "consultation_summary" ? (
                  <div className="bg-slate-900 text-white rounded-3xl p-4 max-w-md border border-teal-500/30 shadow-md space-y-2">
                    <div className="flex items-center gap-2 text-[#9DF3C4] font-black text-xs uppercase">
                      <Video className="w-4 h-4" />
                      Teleconsultation Session Summary
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {msg.text}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Archived to Patient Medical Record
                    </span>
                  </div>
                ) : (
                  <div
                    className={`p-4 sm:p-5 rounded-3xl max-w-lg text-sm sm:text-base leading-relaxed shadow-sm font-medium ${
                      isDoctor
                        ? "bg-teal-700 text-white rounded-tr-xs"
                        : "bg-white text-slate-900 rounded-tl-xs border border-teal-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {/* Read Receipt */}
                <div className="flex items-center gap-1 mt-1 px-1">
                  {isDoctor && (
                    <CheckCheck className="w-3.5 h-3.5 text-teal-500" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing status */}
          {typingStatus && typingStatus.isTyping && (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-bold p-2.5 bg-teal-50 rounded-2xl w-fit border border-teal-200 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span>{typingStatus.senderName || "Patient"} is typing a response...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* ========================================================= */}
        {/* 3. QUICK CLINICAL TEMPLATE CHIPS */}
        {/* ========================================================= */}
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Templates:
          </span>
          {[
            "How are you feeling after morning tasks?",
            "Please complete your 2:00 PM cognitive exercise.",
            "I reviewed your telemetry and your pattern accuracy is 88%!",
            "Let's schedule a quick video check-in today.",
          ].map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuickTemplate(tmpl)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 hover:text-[#0D7377] border border-slate-200 text-slate-700 font-bold text-xs whitespace-nowrap transition cursor-pointer"
            >
              {tmpl}
            </button>
          ))}
        </div>

        {/* Prescription Modal Popup if opened */}
        {showPrescriptionMenu && (
          <div className="p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-t border-teal-200 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0D7377] font-black text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Prescribe Task directly in chat</span>
              </div>
              <button
                onClick={() => setShowPrescriptionMenu(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={selectedTaskToPrescribe}
                onChange={(e) => setSelectedTaskToPrescribe(e.target.value)}
                className="bg-white border border-teal-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-[#0D7377]"
              >
                <option value="Object Identification">Object Identification</option>
                <option value="Pattern Recognition">Pattern Recognition</option>
                <option value="Memory Sequence">Memory Sequence</option>
                <option value="Left or Right Movement">Left or Right Movement</option>
                <option value="Finger Tap Rhythm">Finger Tap Rhythm</option>
              </select>

              <select
                value={prescribeDifficulty}
                onChange={(e) => setPrescribeDifficulty(e.target.value)}
                className="bg-white border border-teal-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:border-[#0D7377]"
              >
                <option value="Easy">Easy (3-4 mins)</option>
                <option value="Medium">Medium (6-8 mins)</option>
                <option value="Advanced">Advanced (10 mins)</option>
              </select>

              <button
                type="button"
                onClick={handleSendPrescription}
                className="py-2.5 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#0D7377]/20 transition cursor-pointer active:scale-95"
              >
                Dispatch Task to Patient
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. INPUT BAR WITH VOICE + PRESCRIBE */}
        {/* ========================================================= */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
        >
          {/* Prescribe Task Button */}
          <button
            type="button"
            onClick={() => setShowPrescriptionMenu((prev) => !prev)}
            className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-[#0D7377] border border-teal-200 transition cursor-pointer flex items-center justify-center"
            title="Prescribe Task"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-center ${
              isListening
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-teal-50 hover:bg-teal-100 text-[#0D7377] border border-teal-200"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak to write message"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={isListening ? "Listening to your voice..." : "Type clinical advice or message to patient & family..."}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#0D7377] focus:bg-white transition"
          />

          <button
            type="submit"
            className="py-3.5 px-6 rounded-2xl bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#0D7377]/20 flex items-center gap-2 transition cursor-pointer active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
