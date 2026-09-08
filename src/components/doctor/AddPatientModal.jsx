import React, { useState } from "react";
import {
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  X,
  User,
  Phone,
  Heart,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { initialPatientRoster } from "../../data/patientReportsData";

export const AddPatientModal = ({
  isOpen,
  onClose,
  onPatientAdded,
  existingAssignedCodes = []
}) => {
  const { allUsers, doctorAddPatientByCode } = useAuth();
  const [patientIdInput, setPatientIdInput] = useState("");
  const [activeTab, setActiveTab] = useState("byId"); // 'byId' | 'registerNew'
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New patient registration form state
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("70");
  const [newGender, setNewGender] = useState("Female");
  const [newPhone, setNewPhone] = useState("+91 98765 00000");
  const [newCaregiver, setNewCaregiver] = useState("Family Member");
  const [newCaregiverPhone, setNewCaregiverPhone] = useState("+91 98765 00001");
  const [newDiagnosis, setNewDiagnosis] = useState(
    "Mild Cognitive Observation · Baseline Monitoring"
  );

  if (!isOpen) return null;

  const normalizedInput = patientIdInput.trim().toUpperCase();

  // Find candidate patient in allUsers or initialPatientRoster
  const candidateFromUsers = allUsers.find(
    (u) =>
      u.role === "patient" &&
      (u.patientCode?.toUpperCase() === normalizedInput ||
        u.id?.toUpperCase() === normalizedInput)
  );

  const candidateFromRoster = initialPatientRoster.find(
    (p) => p.patientCode.toUpperCase() === normalizedInput
  );

  const foundPatient = candidateFromUsers || candidateFromRoster;
  const isAlreadyLinked = existingAssignedCodes.includes(normalizedInput);

  const handleLinkById = (codeToLink) => {
    const targetCode = (codeToLink || normalizedInput).trim().toUpperCase();
    if (!targetCode) {
      setError("Please enter a Patient ID (e.g., PT-7241).");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      // Find extra info if from preset roster
      const presetInfo = initialPatientRoster.find(
        (p) => p.patientCode.toUpperCase() === targetCode
      );

      const extra = presetInfo
        ? {
            name: presetInfo.name,
            age: presetInfo.age,
            gender: presetInfo.gender,
            phone: presetInfo.phone,
            caregiverName: presetInfo.caregiverName,
            caregiverPhone: presetInfo.caregiverPhone,
            diagnosis: presetInfo.diagnosis
          }
        : {};

      const result = doctorAddPatientByCode(targetCode, extra);
      setSuccessMsg(
        `Successfully linked ${result.patientName} (${result.patientCode}) to your doctor roster!`
      );

      setTimeout(() => {
        if (onPatientAdded) {
          onPatientAdded(targetCode);
        }
        onClose();
      }, 1100);
    } catch (err) {
      setError(err.message || "Failed to link patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAndLink = (e) => {
    e.preventDefault();
    if (!patientIdInput.trim()) {
      setError("Please specify a unique Patient ID (e.g., PT-9102).");
      return;
    }
    if (!newName.trim()) {
      setError("Please provide the patient's full name.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const code = normalizedInput.startsWith("PT-")
        ? normalizedInput
        : `PT-${normalizedInput}`;

      const extra = {
        name: newName.trim(),
        age: parseInt(newAge, 10) || 70,
        gender: newGender,
        phone: newPhone.trim(),
        caregiverName: newCaregiver.trim(),
        caregiverPhone: newCaregiverPhone.trim(),
        diagnosis: newDiagnosis.trim(),
        condition: newDiagnosis.trim()
      };

      const result = doctorAddPatientByCode(code, extra);
      setSuccessMsg(
        `Enrolled and linked ${result.patientName} (${code}) to your clinical roster!`
      );

      setTimeout(() => {
        if (onPatientAdded) {
          onPatientAdded(code);
        }
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to register and link patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#0D7377]/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0D7377] text-white flex items-center justify-center shadow-md shadow-[#0D7377]/20">
              <UserPlus className="w-6 h-6 text-[#9DF3C4]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#132A2F] font-display">
                Add Patient to Clinical Roster
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Link existing Patient ID or enroll a new patient profile
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1.5 bg-[#F0F7F6] rounded-2xl border border-[#0D7377]/15">
          <button
            type="button"
            onClick={() => {
              setActiveTab("byId");
              setError("");
              setSuccessMsg("");
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "byId"
                ? "bg-[#0D7377] text-white shadow-xs"
                : "text-slate-700 hover:bg-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Link by Patient ID</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("registerNew");
              setError("");
              setSuccessMsg("");
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "registerNew"
                ? "bg-[#0D7377] text-white shadow-xs"
                : "text-slate-700 hover:bg-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll New Patient</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: Link by Patient ID */}
        {activeTab === "byId" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-[#132A2F] block mb-1.5">
                Enter Unique Patient ID (e.g. PT-7241)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={patientIdInput}
                  onChange={(e) => {
                    setPatientIdInput(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. PT-7241 or PT-5082"
                  className="w-full text-sm font-extrabold uppercase p-3.5 pl-10 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#0D7377] focus:outline-none bg-[#FAFAFA]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Quick Demo ID suggestions */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Available Patient Directory:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {initialPatientRoster.map((patient) => {
                  const isAssigned = existingAssignedCodes.includes(
                    patient.patientCode
                  );
                  return (
                    <button
                      key={patient.patientCode}
                      type="button"
                      onClick={() => {
                        setPatientIdInput(patient.patientCode);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition text-xs font-medium cursor-pointer ${
                        patientIdInput.toUpperCase() === patient.patientCode
                          ? "bg-teal-50 border-teal-500 ring-2 ring-teal-200"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#132A2F]">
                          {patient.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[#0D7377]">
                          {patient.patientCode}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">
                        Age {patient.age} · {patient.caregiverName}
                      </p>
                      {isAssigned && (
                        <span className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Already on Roster
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Found Patient Live Card */}
            {foundPatient && (
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0D7377] text-white flex items-center justify-center font-bold text-xs">
                      {foundPatient.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#132A2F] text-sm">
                        {foundPatient.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Patient ID:{" "}
                        <strong className="text-[#0D7377]">
                          {foundPatient.patientCode || foundPatient.id}
                        </strong>{" "}
                        · Age {foundPatient.age || 72}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    Verified Patient
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium pt-2 border-t border-teal-100">
                  <p>
                    <strong>Caregiver:</strong>{" "}
                    {foundPatient.caregiverName || "Ananya Sharma"}
                  </p>
                  <p className="truncate">
                    <strong>Diagnosis:</strong>{" "}
                    {foundPatient.diagnosis ||
                      "Mild Cognitive Observation · Baseline Monitoring"}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleLinkById()}
                className="flex-1 py-3.5 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-sm rounded-2xl transition shadow-md shadow-[#0D7377]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 text-[#9DF3C4]" />
                <span>
                  {isAlreadyLinked ? "Select / View Patient" : "Link to Roster"}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Enroll New Patient */}
        {activeTab === "registerNew" && (
          <form onSubmit={handleRegisterAndLink} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Assign Patient ID *
                </label>
                <input
                  type="text"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  placeholder="e.g. PT-9421"
                  className="w-full text-xs font-extrabold uppercase p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0D7377]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Smt. Shanti Bose"
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0D7377]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200"
                  min="40"
                  max="110"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Gender
                </label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Primary Caregiver Name
                </label>
                <input
                  type="text"
                  value={newCaregiver}
                  onChange={(e) => setNewCaregiver(e.target.value)}
                  placeholder="e.g. Amit Bose (Son)"
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Caregiver Phone
                </label>
                <input
                  type="text"
                  value={newCaregiverPhone}
                  onChange={(e) => setNewCaregiverPhone(e.target.value)}
                  placeholder="+91 98765 00001"
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Clinical Diagnosis / Monitoring Condition
              </label>
              <input
                type="text"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                placeholder="e.g. Early Amnestic MCI · Post-Stroke Monitoring"
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-[#0D7377] hover:bg-[#0A5C5F] text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4 text-[#9DF3C4]" />
                <span>Enroll & Link Patient</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
