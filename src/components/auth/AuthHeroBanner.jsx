import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Brain,
  Stethoscope,
  User,
  ShieldCheck,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogOut,
  IdCard
} from "lucide-react";

export const AuthHeroBanner = ({ onOpenAuthModal }) => {
  const { currentUser, logout, switchUser, allUsers } = useAuth();

  return (
    <div className="w-full bg-gradient-to-r from-[#001A4C] via-[#002266] to-[#002D80] border-b border-blue-900/40 text-white py-3.5 px-4 sm:px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Status Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
            currentUser
              ? currentUser.role === "doctor"
                ? "bg-teal-500 text-white"
                : "bg-blue-500 text-white"
              : "bg-amber-400 text-slate-950"
          }`}>
            {currentUser ? (
              currentUser.role === "doctor" ? (
                <Stethoscope className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0">
            {currentUser ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-300 font-medium">Signed in as:</span>
                <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                  {currentUser.name}
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  currentUser.role === "doctor"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-400/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                }`}>
                  {currentUser.role} Account
                </span>
                {currentUser.patientCode && (
                  <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <IdCard className="w-3 h-3" />
                    ID: {currentUser.patientCode}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Role-Based Authentication Active</span>
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/20">
                    Patient / Doctor
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Register as a <span className="text-teal-300 font-bold">Doctor</span> (with Patient ID Linking) or <span className="text-blue-300 font-bold">Patient</span> (with unique ID & games).
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal({ mode: "register" })}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Switch / Register</span>
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal({ mode: "login" })}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuthModal({ mode: "register" })}
                className="px-4 py-1.5 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer transform active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register (Doctor / Patient)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
