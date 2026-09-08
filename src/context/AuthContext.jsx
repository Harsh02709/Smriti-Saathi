import React, { createContext, useContext, useState, useEffect } from "react";
import { initialPatientProfile, initialTasks } from "../data/initialData";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "brainboost_auth_user";
const USERS_DB_KEY = "brainboost_registered_users";

// Helper to generate a patient unique ID like PT-8492
const generatePatientCode = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PT-${num}`;
};

export const AuthProvider = ({ children }) => {
  // Current logged in user object: null or { id, name, email, role, patientCode, ... }
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    return null;
  });

  // Registered users database
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_DB_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading users", e);
      }
    }
    const defaultList = [
      {
        id: "demo-patient-1",
        email: "patient@brainboost.org",
        password: "password123",
        name: "Lakshmi Devi",
        role: "patient",
        age: 72,
        gender: "Female",
        phone: "+91 98765 43210",
        patientCode: "PT-7241",
        caregiverName: "Ananya Sharma (Daughter)",
        caregiverPhone: "+91 98765 43211",
        language: "en",
        createdAt: new Date().toISOString(),
        profile: { ...initialPatientProfile, patientCode: "PT-7241" }
      },
      {
        id: "demo-doctor-1",
        email: "doctor@brainboost.org",
        password: "password123",
        name: "Dr. Debabrata Roy",
        role: "doctor",
        specialty: "Cognitive Neurologist & Geriatrician",
        hospital: "Apollo Neurological & Cognitive Care Centre",
        phone: "+91 91234 56780",
        assignedPatientCodes: ["PT-7241", "PT-5082"],
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultList));
    return defaultList;
  });

  // Save currentUser whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Save allUsers whenever it changes
  useEffect(() => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  // Register a new user (Doctor or Patient)
  const register = ({
    name,
    email,
    password,
    role,
    age,
    gender,
    phone,
    specialty,
    hospital,
    caregiverName,
    caregiverPhone,
    language
  }) => {
    const existing = allUsers.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const newId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const patientCode = role === "patient" ? generatePatientCode() : undefined;

    const newUser = {
      id: newId,
      email: email.trim().toLowerCase(),
      password,
      name: name.trim(),
      role, // 'patient' | 'doctor'
      createdAt: new Date().toISOString(),
      ...(role === "patient" && {
        patientCode,
        age: age ? parseInt(age, 10) : 70,
        gender: gender || "Not Specified",
        phone: phone || "",
        caregiverName: caregiverName || "Family Caregiver",
        caregiverPhone: caregiverPhone || "",
        language: language || "en",
        profile: {
          ...initialPatientProfile,
          name: name.trim(),
          age: age ? parseInt(age, 10) : 70,
          gender: gender || "Female",
          patientCode,
          phone: phone || initialPatientProfile.phone,
          language: language || "en"
        }
      }),
      ...(role === "doctor" && {
        specialty: specialty || "Cognitive Neurologist & Geriatrician",
        hospital: hospital || "BrainCare Memory Health Institute",
        phone: phone || "",
        assignedPatientCodes: []
      })
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    setCurrentUser(newUser);
    return newUser;
  };

  // Login
  const login = (email, password) => {
    const user = allUsers.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password. Please check your credentials.");
    }
    setCurrentUser(user);
    return user;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
  };

  // Quick switch user
  const switchUser = (userId) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Doctor: Add a patient by unique Patient ID (with optional new patient details if not yet registered)
  const doctorAddPatientByCode = (patientCode, extraDetails = {}) => {
    const cleanCode = (patientCode || "").trim().toUpperCase();
    if (!cleanCode) {
      throw new Error("Please enter a valid Patient ID (e.g. PT-7241).");
    }

    // Check if patient exists in registered database
    let patientUser = allUsers.find(
      (u) =>
        u.role === "patient" &&
        (u.patientCode?.toUpperCase() === cleanCode || u.id === cleanCode)
    );

    // If patient is not yet registered, auto-register them with this patient code
    if (!patientUser && extraDetails.name) {
      const newPatientId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      patientUser = {
        id: newPatientId,
        email: extraDetails.email ? extraDetails.email.toLowerCase().trim() : `patient_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@brainboost.org`,
        password: "password123",
        name: extraDetails.name.trim(),
        role: "patient",
        patientCode: cleanCode,
        age: extraDetails.age ? parseInt(extraDetails.age, 10) : 70,
        gender: extraDetails.gender || "Not Specified",
        phone: extraDetails.phone || "+91 98765 00000",
        caregiverName: extraDetails.caregiverName || "Family Caregiver",
        caregiverPhone: extraDetails.caregiverPhone || "+91 98765 00001",
        condition: extraDetails.condition || "Cognitive Baseline Monitoring",
        diagnosis: extraDetails.diagnosis || "Cognitive Baseline Observation",
        language: extraDetails.language || "en",
        createdAt: new Date().toISOString(),
        profile: {
          ...initialPatientProfile,
          name: extraDetails.name.trim(),
          age: extraDetails.age ? parseInt(extraDetails.age, 10) : 70,
          gender: extraDetails.gender || "Female",
          patientCode: cleanCode,
          phone: extraDetails.phone || initialPatientProfile.phone
        }
      };
      setAllUsers((prev) => [...prev, patientUser]);
    }

    // Update doctor's assigned codes
    if (currentUser && currentUser.role === "doctor") {
      const existingAssigned = currentUser.assignedPatientCodes || [];
      if (!existingAssigned.includes(cleanCode)) {
        const updatedDoctor = {
          ...currentUser,
          assignedPatientCodes: [...existingAssigned, cleanCode]
        };
        const updatedUsers = allUsers.map((u) =>
          u.id === currentUser.id ? updatedDoctor : u
        );
        setAllUsers(updatedUsers);
        setCurrentUser(updatedDoctor);
      }
    }

    return {
      success: true,
      patientName: patientUser ? patientUser.name : `Patient ${cleanCode}`,
      patientCode: cleanCode,
      patient: patientUser
    };
  };

  // Doctor: Remove patient
  const doctorRemovePatient = (patientCode) => {
    if (!currentUser || currentUser.role !== "doctor") return;
    const cleanCode = patientCode.trim().toUpperCase();
    const updatedDoctor = {
      ...currentUser,
      assignedPatientCodes: (currentUser.assignedPatientCodes || []).filter(
        (c) => c !== cleanCode
      )
    };
    const updatedUsers = allUsers.map((u) =>
      u.id === currentUser.id ? updatedDoctor : u
    );
    setAllUsers(updatedUsers);
    setCurrentUser(updatedDoctor);
  };

  // Get patients for the doctor
  const getDoctorAssignedPatients = () => {
    const assignedCodes = currentUser?.assignedPatientCodes || ["PT-7241", "PT-5082"];

    const registeredPatients = allUsers
      .filter((u) => u.role === "patient")
      .map((u) => ({
        id: u.patientCode || u.id,
        name: u.name,
        age: u.age || 72,
        gender: u.gender || "Female",
        phone: u.phone,
        caregiver: u.caregiverName || "Family",
        diagnosis: "Mild Cognitive Observation · Baseline Monitoring",
        patientCode: u.patientCode,
        isCustomRegistered: true
      }));

    return registeredPatients;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        register,
        login,
        logout,
        switchUser,
        doctorAddPatientByCode,
        doctorRemovePatient,
        getDoctorAssignedPatients
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
