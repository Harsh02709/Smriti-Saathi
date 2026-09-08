import { useState } from "react";
import { Phone, X, MessageSquare } from "lucide-react";
export const CallCaregiverModal = ({
  isOpen,
  onClose,
  profile
}) => {
  const [callInitiated, setCallInitiated] = useState(false);
  if (!isOpen) return null;
  const handleCall = () => {
    setCallInitiated(true);
  };
  return <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative text-center">
        
        {
    /* Close Button */
  }
        <button
    onClick={() => {
      setCallInitiated(false);
      onClose();
    }}
    className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
    aria-label="Close"
  >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-5 shadow-inner">
          <Phone className="w-10 h-10" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#132A2F] font-display mb-1">
          {callInitiated ? "Connecting Call..." : "Connect Caregiver"}
        </h3>
        
        <p className="text-base sm:text-lg text-slate-600 font-medium mb-6">
          {callInitiated ? `Ringing ${profile.caregiverName} now.` : `Reach out to your dedicated family caregiver anytime.`}
        </p>

        {
    /* Caregiver Card */
  }
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-lg">
              AS
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#132A2F]">{profile.caregiverName}</h4>
              <p className="text-xs text-slate-500 font-medium">Primary Caregiver & Daughter</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-200">
            <span>Direct Line:</span>
            <span className="font-bold text-[#132A2F]">{profile.caregiverPhone}</span>
          </div>
        </div>

        {callInitiated ? <div className="space-y-3">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              Audio channel established. Speak into microphone.
            </div>
            <button
    onClick={() => {
      setCallInitiated(false);
      onClose();
    }}
    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-base rounded-2xl shadow-lg transition"
  >
              End Call
            </button>
          </div> : <div className="space-y-3">
            <button
    onClick={handleCall}
    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition active:scale-98"
  >
              <Phone className="w-5 h-5" />
              Call {profile.caregiverName.split(" ")[0]}
            </button>

            <button
    onClick={() => {
      alert(`Pre-written SMS sent to ${profile.caregiverPhone}: "Hi Ananya, Mom is checking in from BrainBoost app."`);
      onClose();
    }}
    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2"
  >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              Send "I am doing well" Message
            </button>
          </div>}

      </div>
    </div>;
};
