import React from "react";
import { useChatCall } from "../../context/ChatCallContext";
import { Video, Phone, PhoneOff, User, Stethoscope, ShieldCheck } from "lucide-react";

export const IncomingCallModal = () => {
  const { isIncomingModalOpen, activeCall, acceptCall, declineCall } = useChatCall();

  if (!isIncomingModalOpen || !activeCall) return null;

  const isCallerDoctor = activeCall.callerRole === "doctor";

  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-[#132A2F] to-[#0A1A1D] border border-teal-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative text-center overflow-hidden">
        {/* Ambient Ringing Pulses */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-teal-500/20 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl animate-pulse pointer-events-none" />

        {/* Pulsing Avatar */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-teal-500/30 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#0D7377] to-teal-400 flex items-center justify-center shadow-lg border-2 border-[#9DF3C4]">
            {isCallerDoctor ? (
              <Stethoscope className="w-12 h-12 text-white" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
            <Video className="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        {/* Caller Details */}
        <div className="space-y-1.5 mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/20 text-[#9DF3C4] text-xs font-bold uppercase tracking-wider border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Incoming Clinical Teleconsultation
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            {activeCall.callerName}
          </h3>
          <p className="text-sm text-teal-200/80 font-medium">
            {isCallerDoctor
              ? "Your Attending Neurologist is calling for a live video checkup"
              : `Patient ${activeCall.patientCode} is requesting an urgent video consultation`}
          </p>
        </div>

        {/* Security Badge */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-8 text-xs text-slate-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>WebSocket Real-Time Video Signaling · HIPAA Compliant 256-bit</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={declineCall}
            className="py-3.5 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <PhoneOff className="w-5 h-5 text-rose-400" />
            <span>Decline</span>
          </button>

          <button
            onClick={acceptCall}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition active:scale-95 cursor-pointer animate-bounce"
          >
            <Phone className="w-5 h-5" />
            <span>Accept Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
