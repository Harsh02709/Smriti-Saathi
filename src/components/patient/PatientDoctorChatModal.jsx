import React, { useState, useEffect, useRef } from "react";
import { useChatCall } from "../../context/ChatCallContext";
import { useAuth } from "../../context/AuthContext";
import {
  X,
  Send,
  Video,
  Mic,
  MicOff,
  Stethoscope,
  Sparkles,
  Phone,
  CheckCircle2,
  Clock,
  Play,
  ShieldCheck,
  Radio
} from "lucide-react";

export const PatientDoctorChatModal = ({
  isOpen,
  onClose,
  profile,
  onLaunchGame,
}) => {
  const {
    messages,
    sendMessage,
    sendTyping,
    typingStatus,
    activePatientCode,
    markAsRead,
    startVideoCall,
    presenceStatus,
  } = useChatCall();

  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);

  const doctorName = profile?.doctorName || "Dr. Debabrata Roy, MD";
  const doctorHospital = profile?.doctorHospital || "Apollo Neurological & Cognitive Care Centre";
  const patientName = profile?.name || "Lakshmi Devi";
  const isDoctorViewer = currentUser?.role === "doctor";

  // Mark messages as read when opening modal
  useEffect(() => {
    if (isOpen && activePatientCode) {
      markAsRead(activePatientCode);
    }
  }, [isOpen, activePatientCode, messages, markAsRead]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, typingStatus]);

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

  if (!isOpen) return null;

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
      patientCode: activePatientCode || profile?.patientCode || "PT-7241",
      text: inputText.trim(),
      type: "text",
    });

    setInputText("");
    sendTyping(activePatientCode, false);
  };

  const handleQuickChip = (text) => {
    if (isDoctorViewer && text.startsWith("Prescribe:")) {
      sendMessage({
        patientCode: activePatientCode || profile?.patientCode || "PT-7241",
        text: "Please practice the Memory Cards Recall session for 10 minutes today.",
        type: "prescription",
        prescriptionData: {
          taskTitle: "Memory Cards Recall",
          time: "Today · 10 min",
          prescribedBy: currentUser?.name || doctorName
        }
      });
      return;
    }

    sendMessage({
      patientCode: activePatientCode || profile?.patientCode || "PT-7241",
      text,
      type: "text",
    });
  };

  const handleStartVideoCall = () => {
    startVideoCall({
      patientCode: activePatientCode || profile?.patientCode || "PT-7241",
      targetRole: isDoctorViewer ? "patient" : "doctor",
      targetName: isDoctorViewer ? patientName : doctorName,
    });
  };

  const quickChips = isDoctorViewer
    ? [
        "Prescribe: Memory Cards Recall",
        "Great progress on your activities today! 🌟",
        "Let's schedule a video consultation",
        "Please rest well and stay hydrated",
      ]
    : [
        "I feel good today, Doctor",
        "I completed my daily exercises",
        "When is our next video consultation?",
        "Can we do a quick video checkup?",
      ];

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[780px] shadow-2xl border border-teal-100 flex flex-col overflow-hidden relative">
        {/* ========================================================= */}
        {/* 1. TOP IDENTITY BAR */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-[#132A2F] via-[#0D7377] to-teal-800 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border-2 border-[#9DF3C4] flex items-center justify-center text-[#9DF3C4] shadow-inner">
                {isDoctorViewer ? <Radio className="w-7 h-7 text-[#9DF3C4]" /> : <Stethoscope className="w-7 h-7" />}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#132A2F] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl font-display text-white">
                  {isDoctorViewer ? `Patient: ${patientName} (${activePatientCode || "PT-7241"})` : doctorName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-teal-100/80 font-medium truncate max-w-xs sm:max-w-md">
                {isDoctorViewer ? "Direct Patient & Caregiver Teleconsultation Channel" : doctorHospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Start Video Call Button */}
            <button
              onClick={handleStartVideoCall}
              className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. CHAT MESSAGE STREAM */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FDFAF5] to-[#F4F9F9]">
          <div className="text-center my-2">
            <span className="px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0D7377] text-xs font-bold shadow-2xs">
              {isDoctorViewer ? `Live Secure Patient Channel · ID ${activePatientCode || "PT-7241"}` : "Live Secure Channel with your Doctor"}
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = isDoctorViewer ? msg.senderRole === "doctor" : msg.senderRole === "patient";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-xs font-extrabold text-slate-500">
                    {msg.senderName} {isMe ? "(You)" : ""}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Prescription card with Start Game action */}
                {msg.type === "prescription" ? (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-[#0D7377]/40 rounded-3xl p-4 sm:p-5 max-w-md shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#0D7377] font-black text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Doctor Prescribed Activity
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-[#0D7377] rounded-md">
                        {msg.prescriptionData?.time || "Today"}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-[#132A2F] text-base">
                      {msg.prescriptionData?.taskTitle || "Cognitive Game"}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {msg.text}
                    </p>

                    <button
                      onClick={() => {
                        onClose();
                        if (onLaunchGame) {
                          onLaunchGame(msg.prescriptionData?.taskTitle || "Memory Cards Recall");
                        }
                      }}
                      className="w-full py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <Play className="w-4 h-4 text-[#9DF3C4]" />
                      <span>Start Prescribed Game Now</span>
                    </button>
                  </div>
                ) : msg.type === "consultation_summary" ? (
                  <div className="bg-slate-900 text-white rounded-3xl p-4 max-w-md border border-teal-500/30 shadow-md space-y-2">
                    <div className="flex items-center gap-2 text-[#9DF3C4] font-black text-xs uppercase">
                      <Video className="w-4 h-4" />
                      Teleconsultation Note
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200">
                      {msg.text}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`p-4 sm:p-5 rounded-3xl max-w-md text-sm sm:text-base leading-relaxed shadow-sm font-medium ${
                      isMe
                        ? "bg-[#0D7377] text-white rounded-tr-xs"
                        : "bg-white text-slate-900 rounded-tl-xs border border-teal-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing status */}
          {typingStatus && typingStatus.isTyping && (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-bold p-2.5 bg-teal-50 rounded-2xl w-fit border border-teal-200 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
              <span>{isDoctorViewer ? `${patientName} is typing...` : `${doctorName} is typing a response...`}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* ========================================================= */}
        {/* 3. SENIOR & DOCTOR QUICK ACTION CHIPS */}
        {/* ========================================================= */}
        <div className="p-2.5 px-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Actions:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickChip(chip)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 hover:text-[#0D7377] border border-slate-200 text-slate-700 font-bold text-xs whitespace-nowrap transition cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 4. LARGE ACCESSIBLE INPUT BAR */}
        {/* ========================================================= */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
        >
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
            onChange={(e) => {
              setInputText(e.target.value);
              sendTyping(activePatientCode, e.target.value.length > 0);
            }}
            placeholder={isListening ? "Listening to your voice..." : (isDoctorViewer ? "Type prescription note or clinical advice..." : "Type your message or click microphone...")}
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
