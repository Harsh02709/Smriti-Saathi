import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Brain,
  Stethoscope,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus
} from "lucide-react";

export const AuthModal = ({ isOpen, onClose, defaultMode = "login", initialRole = "patient" }) => {
  const { login, register, allUsers, switchUser } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'patient' | 'doctor'
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("72");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("Cognitive Neurologist");
  const [hospital, setHospital] = useState("Apollo Brain & Memory Care");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [language, setLanguage] = useState("en");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [createdPatientCode, setCreatedPatientCode] = useState(null);

  // Sync mode and initial role when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode || "login");
      setSelectedRole(initialRole || "patient");
      setError("");
      setSuccessMsg("");
      setCreatedPatientCode(null);
    }
  }, [isOpen, defaultMode, initialRole]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      if (mode === "login") {
        if (!email || !password) {
          setError("Please enter both email and password.");
          return;
        }
        const user = login(email, password);
        setSuccessMsg(`Welcome back, ${user.name}!`);
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        // Register
        if (!name || !email || !password) {
          setError("Please fill in all required fields (Name, Email, Password).");
          return;
        }
        const newUser = register({
          name,
          email,
          password,
          role: selectedRole,
          age,
          gender,
          phone,
          specialty,
          hospital,
          caregiverName,
          caregiverPhone,
          language
        });

        if (newUser.role === "patient") {
          setCreatedPatientCode(newUser.patientCode);
          setSuccessMsg(`Account created! Your unique Patient ID is ${newUser.patientCode}. Doctors can use this ID to connect with you.`);
        } else {
          setSuccessMsg(`Account created successfully as Doctor!`);
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleQuickDemoLogin = (targetUser) => {
    setError("");
    switchUser(targetUser.id);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[20000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Top Header Gradient */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 p-5 sm:p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white border border-white/30 transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 z-20 group"
            title="Close Window (Exit)"
            aria-label="Close Window"
          >
            <span className="text-[11px] font-extrabold uppercase tracking-wide group-hover:underline">Close</span>
            <X className="w-4 h-4 text-white stroke-[2.5]" />
          </button>
          
          <div className="flex items-center gap-3 pr-16">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-inner shrink-0">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {mode === "login" ? "Sign In to BrainBoost" : "Create BrainBoost Account"}
              </h2>
              <p className="text-blue-100 text-xs mt-0.5">
                Role-Based Cognitive Health & Clinical Records Portal
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 mt-5 p-1 bg-black/20 rounded-2xl backdrop-blur-sm">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === "login"
                  ? "bg-white text-blue-900 shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === "register"
                  ? "bg-white text-blue-900 shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Register New Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2.5 font-medium animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex flex-col gap-2 font-medium animate-in slide-in-from-top-1">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">{successMsg}</span>
              </div>
              {createdPatientCode && (
                <div className="mt-1 p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase block">Your Patient Unique ID</span>
                    <span className="text-lg font-extrabold text-blue-700 tracking-wider">{createdPatientCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Enter Patient Portal
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Register Mode: Role Selection Cards */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Select Your Role *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Patient Role */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole("patient")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedRole === "patient"
                        ? "border-blue-600 bg-blue-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${selectedRole === "patient" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <User className="w-4 h-4" />
                      </div>
                      {selectedRole === "patient" && (
                        <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">Patient</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Gets unique Patient ID, cognitive training & games
                      </div>
                    </div>
                  </button>

                  {/* Doctor Role */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole("doctor")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedRole === "doctor"
                        ? "border-teal-600 bg-teal-50/70 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${selectedRole === "doctor" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      {selectedRole === "doctor" && (
                        <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">Doctor / Clinician</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Add patient IDs, longitudinal clinical reports & EHR
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Basic Details */}
            <div className="space-y-3">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={selectedRole === "doctor" ? "Dr. Priya Patel" : "Ramesh Sharma"}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Role Specific Registration Fields */}
            {mode === "register" && selectedRole === "patient" && (
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Patient Profile & Emergency Contacts</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Caregiver Name (Daughter / Son / Partner)</label>
                  <input
                    type="text"
                    value={caregiverName}
                    onChange={(e) => setCaregiverName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div className="text-[11px] text-blue-800 font-medium">
                  ✨ A unique Patient ID (e.g. PT-XXXX) will be generated automatically. You can give this code to your Doctor to link reports.
                </div>
              </div>
            )}

            {mode === "register" && selectedRole === "doctor" && (
              <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 space-y-3">
                <div className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical Credentials</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Specialty</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Cognitive Neurologist / Geriatrician"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Hospital / Memory Clinic</label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="Apollo Brain & Memory Care"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* Submit & Cancel Buttons */}
            {!createdPatientCode && (
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{mode === "login" ? "Sign In" : "Complete Registration"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
                  title="Exit / Cancel without saving"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Quick Demo Accounts</span>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">1-Click Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(allUsers[0])}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">Demo Patient</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ramesh (ID: PT-7241)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(allUsers[1])}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-bold text-slate-800">Demo Doctor</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Dr. Ananya Ray</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
