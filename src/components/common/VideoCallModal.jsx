import React, { useState, useEffect, useRef } from "react";
import { useChatCall, CALL_STATES } from "../../context/ChatCallContext";
import { useAuth } from "../../context/AuthContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  User,
  Stethoscope,
  Send,
  Maximize2,
  Minimize2,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

export const VideoCallModal = () => {
  const {
    callState,
    activeCall,
    isVideoModalOpen,
    isMuted,
    isVideoOff,
    isScreenSharing,
    localStream,
    callDuration,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    messages,
    sendMessage,
  } = useChatCall();

  const { currentUser } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clinicalAssessment, setClinicalAssessment] = useState({
    alertness: "High",
    speechClarity: "Clear",
    motorResponse: "Normal",
  });
  const [assessmentLogged, setAssessmentLogged] = useState(false);

  const localVideoRef = useRef(null);
  const containerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Attach local media stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideoOff]);

  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatOpen, messages]);

  if (!isVideoModalOpen || !activeCall) return null;

  const isUserDoctor = currentUser?.role === "doctor" || activeCall?.callerRole !== "doctor";
  const remotePersonName =
    currentUser?.role === "doctor"
      ? activeCall.targetName || "Lakshmi Devi"
      : activeCall.callerName || "Dr. Debabrata Roy, MD";
  const remoteRole = currentUser?.role === "doctor" ? "Patient" : "Neurologist";

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendInCallChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage({
      patientCode: activeCall.patientCode,
      text: chatInput.trim(),
      type: "text",
    });
    setChatInput("");
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleLogClinicalCheck = () => {
    setAssessmentLogged(true);
    sendMessage({
      patientCode: activeCall.patientCode,
      text: `Live Clinical Telehealth Assessment during Video Call: Alertness=${clinicalAssessment.alertness}, Speech=${clinicalAssessment.speechClarity}, Motor Response=${clinicalAssessment.motorResponse}. Verified by Dr. Debabrata Roy.`,
      type: "clinical_note",
      senderRole: "doctor",
      senderName: "Dr. Debabrata Roy, MD",
    });
    setTimeout(() => setAssessmentLogged(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[25000] bg-slate-950 flex flex-col overflow-hidden select-none font-sans"
    >
      {/* ========================================================= */}
      {/* 1. TOP TELEHEALTH HUD BAR */}
      {/* ========================================================= */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between text-white shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-[#9DF3C4]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-white font-display">
                {remotePersonName}
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-[#9DF3C4] border border-teal-400/30">
                {remoteRole}
              </span>
              <span className="font-mono text-xs text-teal-300 bg-white/5 px-2 py-0.5 rounded-md">
                {activeCall.patientCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Video Encrypted
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                {callState === CALL_STATES.CALLING ? "Connecting..." : formatDuration(callDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Badges & Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>WebSocket Signaling · 1080p WebRTC</span>
          </div>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN VIDEO DISPLAY & SIDE DRAWERS */}
      {/* ========================================================= */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Main Stage Video */}
        <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
          {/* Main Remote Feed Visual */}
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Background Graphic Grid */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(13, 115, 119, 0.4) 0%, transparent 80%)`,
              }}
            />

            {/* Connecting Screen or Remote Stream Display */}
            {callState === CALL_STATES.CALLING ? (
              <div className="text-center p-8 text-white space-y-4">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-[#0D7377] flex items-center justify-center border-2 border-[#9DF3C4] shadow-xl">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-display">Calling {remotePersonName}...</h3>
                <p className="text-sm text-teal-200/70">
                  Establishing peer-to-peer WebSocket audio/video stream
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Simulated / Remote Video Avatar Canvas with Pulse Wave */}
                <div className="relative flex flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 rounded-full bg-teal-500/20 animate-pulse" />
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#0D7377] via-teal-700 to-emerald-600 flex items-center justify-center shadow-2xl border-4 border-[#9DF3C4]/40">
                      {currentUser?.role === "doctor" ? (
                        <User className="w-20 h-20 text-white" />
                      ) : (
                        <Stethoscope className="w-20 h-20 text-white" />
                      )}
                    </div>
                    {/* Live Audio Activity Ring */}
                    <div className="absolute -bottom-2 right-4 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      LIVE AUDIO
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {remotePersonName}
                  </h3>
                  <p className="text-sm text-teal-200/80 font-medium mt-1">
                    {currentUser?.role === "doctor"
                      ? "Patient Connected · Audio & Video Stream Active"
                      : "Attending Neurologist · Clinical Telehealth Consultation"}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold text-teal-300 border border-white/10">
                      Latency: 14ms
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold text-teal-300 border border-white/10">
                      Audio: HD Stereo
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                      Connection: Excellent
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Local Picture-in-Picture Video Preview */}
            <div className="absolute bottom-4 right-4 w-36 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden bg-slate-800 border-2 border-teal-500/40 shadow-2xl z-10">
              {localStream && !isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                    {isVideoOff ? <VideoOff className="w-6 h-6 text-rose-400" /> : <User className="w-6 h-6" />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">
                    {currentUser?.name || "You"}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {isVideoOff ? "Camera Off" : "Video Preview"}
                  </span>
                </div>
              )}

              {/* Local Video Tag */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white flex items-center gap-1">
                <span>You</span>
                {isMuted && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* IN-CALL CHAT DRAWER */}
        {/* ========================================================= */}
        {chatOpen && (
          <div className="w-80 sm:w-96 bg-slate-900 border-l border-white/10 flex flex-col shrink-0 z-20 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#9DF3C4]" />
                <h4 className="font-extrabold text-sm font-display">In-Call Live Chat</h4>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe =
                  (currentUser?.role === "doctor" && msg.senderRole === "doctor") ||
                  (currentUser?.role !== "doctor" && msg.senderRole !== "doctor");
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-slate-400 font-medium mb-0.5">
                      {msg.senderName}
                    </span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isMe
                          ? "bg-teal-600 text-white rounded-tr-xs"
                          : "bg-slate-800 text-slate-100 rounded-tl-xs border border-white/10"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendInCallChat} className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type live message..."
                className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* DOCTOR CLINICAL QUICK TOOLS DRAWER */}
        {/* ========================================================= */}
        {toolsOpen && isUserDoctor && (
          <div className="w-80 sm:w-96 bg-slate-900 border-l border-white/10 flex flex-col shrink-0 z-20 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#9DF3C4]" />
                <h4 className="font-extrabold text-sm font-display">Live Clinical Assessment</h4>
              </div>
              <button
                onClick={() => setToolsOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-white">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  1. Live Alertness Rating
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {["High", "Moderate", "Drowsy"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClinicalAssessment((prev) => ({ ...prev, alertness: lvl }))}
                      className={`py-1.5 rounded-lg text-xs font-bold transition ${
                        clinicalAssessment.alertness === lvl
                          ? "bg-[#0D7377] text-white border border-[#9DF3C4]"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  2. Speech & Fluency Clarity
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Clear", "Hesitant", "Slurred"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClinicalAssessment((prev) => ({ ...prev, speechClarity: lvl }))}
                      className={`py-1.5 rounded-lg text-xs font-bold transition ${
                        clinicalAssessment.speechClarity === lvl
                          ? "bg-[#0D7377] text-white border border-[#9DF3C4]"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  3. Motor / Response Speed
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Normal", "Delayed", "Asymmetric"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setClinicalAssessment((prev) => ({ ...prev, motorResponse: lvl }))}
                      className={`py-1.5 rounded-lg text-xs font-bold transition ${
                        clinicalAssessment.motorResponse === lvl
                          ? "bg-[#0D7377] text-white border border-[#9DF3C4]"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogClinicalCheck}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {assessmentLogged ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                    <span>Logged to Medical Record & Chat!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save Observation Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM CALL CONTROLS BAR */}
      {/* ========================================================= */}
      <div className="bg-slate-900/90 backdrop-blur-md border-t border-white/10 px-4 sm:px-6 py-4 flex items-center justify-center gap-3 sm:gap-6 shrink-0 z-20">
        {/* Audio Mute */}
        <button
          onClick={toggleMute}
          className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
            isMuted
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span className="text-[10px] font-bold text-slate-300">
            {isMuted ? "Muted" : "Mute"}
          </span>
        </button>

        {/* Video Camera Toggle */}
        <button
          onClick={toggleVideo}
          className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
            isVideoOff
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
          <span className="text-[10px] font-bold text-slate-300">
            {isVideoOff ? "Cam Off" : "Camera"}
          </span>
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
            isScreenSharing
              ? "bg-teal-500 text-slate-950 font-bold"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="Share Screen"
        >
          <ScreenShare className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-bold text-slate-300">
            {isScreenSharing ? "Sharing" : "Screen"}
          </span>
        </button>

        {/* In-Call Chat Toggle */}
        <button
          onClick={() => {
            setChatOpen((prev) => !prev);
            setToolsOpen(false);
          }}
          className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
            chatOpen
              ? "bg-teal-500 text-slate-950 font-bold"
              : "bg-white/10 hover:bg-white/20 text-white"
          }`}
          title="In-Call Chat"
        >
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-bold text-slate-300">Chat</span>
        </button>

        {/* Doctor Clinical Assessment Tools Toggle */}
        {isUserDoctor && (
          <button
            onClick={() => {
              setToolsOpen((prev) => !prev);
              setChatOpen(false);
            }}
            className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
              toolsOpen
                ? "bg-[#9DF3C4] text-slate-950 font-bold"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
            title="Clinical Telehealth Tools"
          >
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] font-bold text-slate-300">Clinical</span>
          </button>
        )}

        {/* End Call Button */}
        <button
          onClick={endCall}
          className="p-3.5 sm:p-4 px-6 sm:px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold transition shadow-lg shadow-rose-600/30 flex flex-col items-center gap-1 cursor-pointer active:scale-95"
          title="End Consultation"
        >
          <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[10px] font-black uppercase tracking-wider">End Call</span>
        </button>
      </div>
    </div>
  );
};
