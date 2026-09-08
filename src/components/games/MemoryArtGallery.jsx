import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Music,
  Trash2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  Heart,
  Award,
  ArrowLeft,
  X,
  Plus,
  CheckCircle2,
  Brain,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Check,
  Eye,
  Sliders,
  Send,
  UserCheck,
  Radio,
  FileAudio,
  Image,
  Info,
  Calendar,
  MapPin,
  Users
} from "lucide-react";
import confetti from "canvas-confetti";

const GALLERY_STORAGE_KEY = "smriti_memory_gallery_v2_";

// Default curated memories with rich caretaker ground truth data
const DEFAULT_PRESET_MEMORIES = [
  {
    id: "preset-1",
    type: "photo",
    title: "Diwali Sweet Making with Granddaughter",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1000&q=80",
    caretakerGroundTruth: "Making traditional Besan Ladoos and Diwali sweets in the Kolkata home kitchen with granddaughter Ananya.",
    whoIsInPhoto: "Granddaughter Ananya and Lakshmi",
    whereWasTaken: "Kolkata family kitchen during Diwali festival",
    voiceQuestion: "What were you and Ananya making together in this kitchen picture?",
    expectedKeywords: ["sweets", "ladoo", "laddu", "diwali", "cooking", "kitchen", "ananya", "granddaughter", "making sweets", "mithai"],
    caretakerHint: "Think of the sweet smell of roasted besan and making round ladoos for Diwali festival with Ananya.",
    uploadedBy: "Caregiver Rahul",
    dateAdded: "Yesterday"
  },
  {
    id: "preset-2",
    type: "photo",
    title: "Morning Garden Chai & Roses",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
    caretakerGroundTruth: "Enjoying morning ginger tea in the front lawn garden surrounded by flowering marigolds and rose pots.",
    whoIsInPhoto: "Lakshmi Devi relaxing in her favorite wicker chair",
    whereWasTaken: "Home Garden Lawn, New Delhi",
    voiceQuestion: "What were you enjoying drinking in the garden while sitting in your chair?",
    expectedKeywords: ["tea", "chai", "garden", "morning", "ginger tea", "cup", "roses", "flowers", "sitting"],
    caretakerHint: "You always loved having your morning ginger chai sitting outside with your flowers.",
    uploadedBy: "Caregiver Priya",
    dateAdded: "2 days ago"
  },
  {
    id: "preset-3",
    type: "photo",
    title: "Family Trip to Dal Lake Shikara",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    caretakerGroundTruth: "Riding a decorated Shikara boat on Dal Lake in Kashmir during the summer family holiday.",
    whoIsInPhoto: "Whole family on the wooden boat",
    whereWasTaken: "Dal Lake, Srinagar, Kashmir",
    voiceQuestion: "Where were you riding this beautiful wooden boat with the family?",
    expectedKeywords: ["kashmir", "dal lake", "shikara", "boat", "lake", "srinagar", "holiday", "water", "mountains"],
    caretakerHint: "Remember the cold breeze, floating lotus flowers, and our holiday in Kashmir on the lake boat.",
    uploadedBy: "Caregiver Rahul",
    dateAdded: "3 days ago"
  },
  {
    id: "preset-4",
    type: "music",
    title: "Classic Bhajan: Vaishnav Jan To",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    audioUrl: null,
    caretakerGroundTruth: "The favorite devotional prayer song 'Vaishnav Jan To Tene Kahiye' sung every morning during pooja.",
    whoIsInPhoto: "Morning Devotional Bhajan",
    whereWasTaken: "Home Mandir / Prayer room",
    voiceQuestion: "What is the famous prayer song we sing in the morning that starts with 'Vaishnav Jan To'?",
    expectedKeywords: ["vaishnav jan to", "vaishnav", "tene kahiye", "bhajan", "pooja", "prayer", "morning song", "gandhi", "mandir"],
    caretakerHint: "This is the serene morning prayer song you sing every day during the morning diya lighting.",
    uploadedBy: "Caregiver Priya",
    dateAdded: "4 days ago"
  }
];

// Open-source Client-side NLP Semantic Answer Verifier
function evaluatePatientAnswer(patientTranscript, memoryItem) {
  if (!patientTranscript || !patientTranscript.trim()) {
    return {
      status: "empty",
      score: 0,
      confidence: 0,
      feedback: "No voice response detected yet. Please tap the microphone and speak.",
      matchedKeywords: []
    };
  }

  const cleanText = patientTranscript.toLowerCase().replace(/[^\w\s]/gi, " ");
  const textWords = cleanText.split(/\s+/).filter(Boolean);

  const keywords = (memoryItem.expectedKeywords || []).map((k) => k.toLowerCase().trim());
  const groundTruthWords = (memoryItem.caretakerGroundTruth || "")
    .toLowerCase()
    .replace(/[^\w\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  // 1. Keyword check
  const matchedKeywords = [];
  keywords.forEach((kw) => {
    if (cleanText.includes(kw)) {
      matchedKeywords.push(kw);
    } else {
      const kwWords = kw.split(/\s+/);
      const allFound = kwWords.every((w) => textWords.includes(w));
      if (allFound && !matchedKeywords.includes(kw)) {
        matchedKeywords.push(kw);
      }
    }
  });

  // 2. Ground truth overlap
  let groundTruthMatches = 0;
  groundTruthWords.forEach((gw) => {
    if (textWords.includes(gw)) groundTruthMatches++;
  });

  const keywordCoverage = keywords.length > 0 ? matchedKeywords.length / Math.min(3, keywords.length) : 0;
  const wordOverlapRatio = groundTruthWords.length > 0 ? groundTruthMatches / Math.min(4, groundTruthWords.length) : 0;

  const confidence = Math.min(1, keywordCoverage * 0.7 + wordOverlapRatio * 0.3 + (textWords.length > 3 ? 0.2 : 0));

  if (confidence >= 0.45 || matchedKeywords.length >= 2) {
    return {
      status: "correct",
      score: 100,
      confidence: Math.round(Math.max(85, confidence * 100)),
      feedback: `🎯 Wonderful Memory! You correctly recalled: "${matchedKeywords.join(", ") || "the event"}"!`,
      matchedKeywords,
      spokenEncouragement: `Brilliant! You remembered that so clearly. Wonderful job!`
    };
  } else if (confidence >= 0.2 || matchedKeywords.length === 1 || groundTruthMatches >= 1) {
    return {
      status: "partial",
      score: 75,
      confidence: Math.round(Math.max(60, confidence * 100)),
      feedback: `🌟 Good Memory! You mentioned "${matchedKeywords[0] || textWords[0]}". You're on the right track!`,
      matchedKeywords,
      spokenEncouragement: `Good memory! You got parts of that right. Let's keep exploring your memories together.`
    };
  } else {
    return {
      status: "needs_hint",
      score: 40,
      confidence: Math.round(confidence * 100),
      feedback: `💡 Gentle Clue: Check the caregiver's memory hint below to help you remember.`,
      matchedKeywords: [],
      spokenEncouragement: `That's okay! Let me share a little clue from your family to help you remember.`
    };
  }
}

export function MemoryArtGallery({ onBack }) {
  // Memories State
  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load memories from localStorage", e);
    }
    return DEFAULT_PRESET_MEMORIES;
  });

  // UI Modes
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  // Form State for Caregiver Add/Upload Modal
  const [formType, setFormType] = useState("photo");
  const [formTitle, setFormTitle] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formAudioName, setFormAudioName] = useState("");
  const [formGroundTruth, setFormGroundTruth] = useState("");
  const [formWho, setFormWho] = useState("");
  const [formWhere, setFormWhere] = useState("");
  const [formQuestion, setFormQuestion] = useState("");
  const [formKeywords, setFormKeywords] = useState("");
  const [formHint, setFormHint] = useState("");
  const [formError, setFormError] = useState("");

  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error("Storage save failed", e);
    }
  }, [memories]);

  // Current active memory in session
  const currentMemory = memories[currentIndex] || memories[0];

  // AI Voice Synthesis for Question
  const speakText = useCallback((text, onComplete) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Senior friendly, clear and calm
    utterance.pitch = 1.0;
    utterance.lang = "en-IN"; // Indian English / Global English

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  // Stop Speech
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Speak Current Question when navigating to a new memory in session
  useEffect(() => {
    if (isSessionActive && currentMemory && !sessionCompleted) {
      setSpeechTranscript("");
      setTypedAnswer("");
      setEvaluationResult(null);
      setShowHint(false);

      // Speak question after a slight natural pause
      const timer = setTimeout(() => {
        const greeting = `Memory ${currentIndex + 1} of ${memories.length}. ${currentMemory.title}. ${currentMemory.voiceQuestion || "What do you remember about this?"}`;
        speakText(greeting);
      }, 500);

      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [currentIndex, isSessionActive, sessionCompleted]);

  // Speech Recognition (Web Speech API)
  const startListening = () => {
    stopSpeaking();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. You can type your answer in the box!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechTranscript("");
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpeechTranscript(transcript);
        setTypedAnswer(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech recognition startup error", e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Handle Answer Submission & Open-Source AI Semantic Verification
  const handleSubmitAnswer = (answerText) => {
    const textToEvaluate = answerText || typedAnswer || speechTranscript;
    if (!textToEvaluate.trim()) return;

    stopListening();
    stopSpeaking();

    const result = evaluatePatientAnswer(textToEvaluate, currentMemory);
    setEvaluationResult(result);
    setTotalScore((prev) => prev + (result.score || 0));

    if (result.status === "correct") {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      speakText(result.spokenEncouragement);
    } else if (result.status === "partial") {
      speakText(result.spokenEncouragement);
    } else {
      speakText(result.spokenEncouragement + " " + (currentMemory.caretakerHint || ""));
      setShowHint(true);
    }
  };

  // Move to next memory
  const handleNextMemory = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      speakText("Congratulations! You have completed your memory art session today with flying colors!");
    }
  };

  // Handle Photo File Upload
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Audio File Upload
  const handleAudioFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormAudioName(file.name);
    }
  };

  // Preset Sample Filler for Caretaker Convenience
  const fillSamplePreset = (presetNum) => {
    if (presetNum === 1) {
      setFormType("photo");
      setFormTitle("Golden Temple Visit with Grandson");
      setFormImage("https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&w=1000&q=80");
      setFormGroundTruth("Visiting the sacred Golden Temple in Amritsar during Baisakhi festival and having delicious Karah Parshad with grandson Rohan.");
      setFormWho("Grandson Rohan and Lakshmi");
      setFormWhere("Amritsar Golden Temple, Punjab");
      setFormQuestion("Which holy temple were you visiting here, and what sweet parshad did we eat?");
      setFormKeywords("golden temple, amritsar, temple, parshad, rohan, grandson, baisakhi, punjab, pond, holy");
      setFormHint("Remember the golden reflection on the water and the warm sweet halwa parshad Rohan brought you.");
    } else if (presetNum === 2) {
      setFormType("photo");
      setFormTitle("First Rain Monsoon Pakoras");
      setFormImage("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80");
      setFormGroundTruth("Sitting on the balcony eating hot onion pakoras and drinking masala tea during the first monsoon rain of July.");
      setFormWho("Lakshmi with Family");
      setFormWhere("Home Balcony, Mumbai");
      setFormQuestion("What snack were we all enjoying on the balcony while watching the rain?");
      setFormKeywords("pakora, pakore, rain, monsoon, tea, chai, balcony, onion, snacks");
      setFormHint("Think of the sound of heavy rain on the roof and eating crispy hot onion pakoras with green chutney.");
    }
  };

  // Save New Memory from Caregiver Form
  const handleSaveMemory = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError("Please provide a title or occasion name for this memory.");
      return;
    }
    if (formType === "photo" && !formImage.trim()) {
      setFormError("Please upload a photo or provide an image link.");
      return;
    }
    if (!formGroundTruth.trim()) {
      setFormError("Please fill in the Caretaker Ground Truth (what is happening in this memory).");
      return;
    }

    const newMemory = {
      id: "mem-" + Date.now(),
      type: formType,
      title: formTitle.trim(),
      imageUrl: formType === "photo" ? formImage : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
      audioName: formType === "music" ? formAudioName : null,
      caretakerGroundTruth: formGroundTruth.trim(),
      whoIsInPhoto: formWho.trim() || "Family Members",
      whereWasTaken: formWhere.trim() || "Family Home",
      voiceQuestion: formQuestion.trim() || `What do you remember most about ${formTitle}?`,
      expectedKeywords: formKeywords
        ? formKeywords.split(",").map((k) => k.trim()).filter(Boolean)
        : formGroundTruth.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
      caretakerHint: formHint.trim() || `Think about the special time with family during ${formTitle}.`,
      uploadedBy: "Caregiver",
      dateAdded: "Just now"
    };

    setMemories((prev) => [newMemory, ...prev]);
    setShowAddModal(false);
    setFormError("");
    // Reset Form
    setFormTitle("");
    setFormImage("");
    setFormAudioName("");
    setFormGroundTruth("");
    setFormWho("");
    setFormWhere("");
    setFormQuestion("");
    setFormKeywords("");
    setFormHint("");
  };

  // Delete Memory
  const handleDeleteMemory = (id) => {
    if (memories.length <= 1) {
      alert("Please keep at least one memory in the gallery.");
      return;
    }
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm("Reset gallery to default sample memories?")) {
      setMemories(DEFAULT_PRESET_MEMORIES);
      localStorage.removeItem(GALLERY_STORAGE_KEY);
    }
  };

  return (
    <div className="min-w-full min-h-screen bg-[#F8FAFC] text-[#001A4C] font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              title="Return to Games Hub"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001A4C] to-[#0D7377] flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5 text-[#9DF3C4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#001A4C] tracking-tight">
                  Memory Art Gallery
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#9DF3C4]/40 text-[#0D7377] border border-[#0D7377]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Voice AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Caregiver Curated Photos, Music & AI Voice Assisted Reminiscence Therapy
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="open-add-memory-btn"
            onClick={() => {
              setFormError("");
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-[#001A4C] to-[#0D7377] hover:from-[#002866] hover:to-[#0F8A8F] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#9DF3C4]" />
            <span>+ Add Elder Memory</span>
          </button>

          {!isSessionActive && (
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSessionCompleted(false);
                setTotalScore(0);
                setIsSessionActive(true);
              }}
              className="px-5 py-2.5 bg-[#0D7377] hover:bg-[#0A5A5D] text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm border-2 border-[#9DF3C4]/60 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#9DF3C4]" />
              <span>Start Patient Session ({memories.length})</span>
            </button>
          )}

          {isSessionActive && (
            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                setIsSessionActive(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Gallery Studio View</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6">
        {/* ============================================================ */}
        {/* VIEW 1: ACTIVE PATIENT INTERACTIVE VOICE SESSION            */}
        {/* ============================================================ */}
        {isSessionActive && !sessionCompleted && currentMemory && (
          <div className="animate-fadeIn space-y-6">
            {/* Top Session Status Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 bg-[#001A4C] text-[#9DF3C4] rounded-xl font-black text-sm tracking-wide">
                  Memory {currentIndex + 1} of {memories.length}
                </span>
                <h2 className="text-lg font-bold text-[#001A4C]">
                  {currentMemory.title}
                </h2>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {memories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? "w-8 bg-[#0D7377]"
                        : idx < currentIndex
                        ? "w-2.5 bg-[#9DF3C4] border border-[#0D7377]"
                        : "w-2.5 bg-slate-200"
                    }`}
                    title={`Go to memory ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMemory}
                  className="px-4 py-2 bg-[#0D7377] hover:bg-[#0A5A5D] text-white rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <span>{currentIndex === memories.length - 1 ? "Finish Session" : "Next Memory"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Split Screen Layout: Left Photo/Media, Right AI Voice Assistant & Answer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Elder Photo / Audio Visualizer */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-5 shadow-lg border border-slate-200/80 overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center group shadow-inner">
                  {currentMemory.type === "photo" ? (
                    <img
                      src={currentMemory.imageUrl}
                      alt={currentMemory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                    />
                  ) : (
                    <div className="text-center p-8 text-white space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#001A4C] to-[#0D7377] flex items-center justify-center border-4 border-[#9DF3C4]/60 shadow-2xl animate-pulse">
                        <FileAudio className="w-12 h-12 text-[#9DF3C4]" />
                      </div>
                      <h3 className="text-2xl font-black text-white">{currentMemory.title}</h3>
                      <p className="text-sm text-[#9DF3C4] font-semibold">Devotional Melody & Lyrics Recall</p>
                    </div>
                  )}

                  {/* Top Badges over image */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-xs font-bold rounded-lg flex items-center gap-1">
                      {currentMemory.type === "photo" ? <Camera className="w-3.5 h-3.5 text-[#9DF3C4]" /> : <Music className="w-3.5 h-3.5 text-[#9DF3C4]" />}
                      {currentMemory.type === "photo" ? "Family Photo" : "Melody Memory"}
                    </span>
                    {currentMemory.whereWasTaken && (
                      <span className="px-3 py-1 bg-black/60 backdrop-blur text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#9DF3C4]" /> {currentMemory.whereWasTaken}
                      </span>
                    )}
                  </div>

                  {currentMemory.whoIsInPhoto && (
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/70 backdrop-blur text-white rounded-xl text-xs font-medium flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#9DF3C4] flex-shrink-0" />
                      <span>{currentMemory.whoIsInPhoto}</span>
                    </div>
                  )}
                </div>

                {/* Ground Truth Preview for Facilitator / Elder Context */}
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0D7377] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#001A4C]">Caretaker Context: </span>
                    {currentMemory.caretakerGroundTruth}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Voice Agent Interaction */}
              <div className="lg:col-span-5 space-y-5">
                {/* Voice Agent Question Box */}
                <div className="bg-gradient-to-br from-[#001A4C] to-[#0D7377] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#9DF3C4]/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                        <Brain className="w-5 h-5 text-[#9DF3C4]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-wider uppercase text-[#9DF3C4]">AI Voice Companion</span>
                        <div className="text-xs text-slate-300">Speaking aloud with gentle pacing</div>
                      </div>
                    </div>

                    <button
                      onClick={() => speakText(currentMemory.voiceQuestion || currentMemory.title)}
                      className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition flex items-center gap-1.5 text-xs font-bold border border-white/20 cursor-pointer"
                      title="Replay Voice Question"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4 text-amber-300 animate-pulse" />
                          <span>Speaking...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-[#9DF3C4]" />
                          <span>Replay Question</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/15">
                    <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      "{currentMemory.voiceQuestion || `What do you remember most about ${currentMemory.title}?`}"
                    </p>
                  </div>
                </div>

                {/* Patient Voice Input Section */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#001A4C] uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-[#0D7377]" /> Speak Your Memory
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Open-source Speech NLP</span>
                  </div>

                  {/* Big Voice Microphone Button */}
                  <div className="flex flex-col items-center justify-center py-2 space-y-3">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition transform hover:scale-105 active:scale-95 cursor-pointer ${
                        isListening
                          ? "bg-rose-500 text-white animate-pulse ring-8 ring-rose-200"
                          : "bg-gradient-to-tr from-[#001A4C] to-[#0D7377] text-white hover:shadow-2xl ring-4 ring-[#9DF3C4]/50"
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-8 h-8 mb-1" />
                          <span className="text-[11px] font-black tracking-wider uppercase">Listening</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-8 h-8 mb-1 text-[#9DF3C4]" />
                          <span className="text-[11px] font-black tracking-wider uppercase">Tap to Speak</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-500 text-center font-medium">
                      {isListening ? "Listening... Speak naturally about your memory" : "Tap the microphone and tell the AI what you remember"}
                    </p>
                  </div>

                  {/* Live Transcript / Typed Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Your Response / Transcript:</span>
                      {speechTranscript && (
                        <button
                          onClick={() => {
                            setSpeechTranscript("");
                            setTypedAnswer("");
                          }}
                          className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </label>
                    <textarea
                      rows={2}
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Your spoken words will appear here automatically, or you can type here..."
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#001A4C] focus:ring-2 focus:ring-[#0D7377] focus:border-transparent outline-none transition"
                    />

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleSubmitAnswer(typedAnswer || speechTranscript)}
                        disabled={!typedAnswer.trim() && !speechTranscript.trim()}
                        className="flex-1 py-3 bg-[#0D7377] hover:bg-[#0A5A5D] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#9DF3C4]" />
                        <span>Verify Memory Answer</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowHint(true);
                          speakText("Here is a helpful family clue: " + currentMemory.caretakerHint);
                        }}
                        className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl font-bold text-sm transition flex items-center gap-1.5 cursor-pointer"
                        title="Show Clue / Hint"
                      >
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Need Hint?</span>
                      </button>
                    </div>
                  </div>

                  {/* NLP Evaluation Result Feedback */}
                  {evaluationResult && (
                    <div
                      className={`p-4 rounded-2xl border transition-all animate-fadeIn ${
                        evaluationResult.status === "correct"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                          : evaluationResult.status === "partial"
                          ? "bg-teal-50 border-teal-300 text-teal-950"
                          : "bg-amber-50 border-amber-300 text-amber-950"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {evaluationResult.status === "correct" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : evaluationResult.status === "partial" ? (
                          <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <div className="font-extrabold text-sm flex items-center gap-2">
                            <span>{evaluationResult.feedback}</span>
                            <span className="text-xs px-2 py-0.5 bg-white rounded-md font-bold shadow-xs border">
                              {evaluationResult.confidence}% Accuracy Match
                            </span>
                          </div>

                          {evaluationResult.matchedKeywords && evaluationResult.matchedKeywords.length > 0 && (
                            <div className="text-xs font-semibold text-slate-600 flex items-center gap-1 flex-wrap pt-1">
                              <span>Matched memory concepts:</span>
                              {evaluationResult.matchedKeywords.map((k, i) => (
                                <span key={i} className="px-2 py-0.5 bg-white rounded text-[#0D7377] font-bold border border-slate-200">
                                  ✓ {k}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Caregiver Gentle Clue Box */}
                  {showHint && currentMemory.caretakerHint && (
                    <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl animate-fadeIn space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase">
                        <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span>Family Memory Hint:</span>
                      </div>
                      <p className="text-sm font-medium text-amber-950 italic">
                        "{currentMemory.caretakerHint}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: SESSION SUMMARY UPON FINISH                         */}
        {/* ============================================================ */}
        {isSessionActive && sessionCompleted && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#001A4C] to-[#0D7377] flex items-center justify-center text-white shadow-xl">
              <Award className="w-10 h-10 text-[#9DF3C4]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#001A4C]">
                Memory Session Completed!
              </h2>
              <p className="text-slate-600 font-medium">
                You recalled wonderful precious memories with your family and loved ones today.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase">Total Memories Explored</div>
                <div className="text-2xl font-black text-[#001A4C]">{memories.length}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase">Recall Score</div>
                <div className="text-2xl font-black text-[#0D7377]">100% Active</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSessionCompleted(false);
                  setIsSessionActive(true);
                }}
                className="px-6 py-3 bg-[#0D7377] hover:bg-[#0A5A5D] text-white rounded-xl font-extrabold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#9DF3C4]" />
                <span>Play Again</span>
              </button>
              <button
                onClick={() => setIsSessionActive(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#001A4C] rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Return to Gallery Studio</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: CAREGIVER GALLERY STUDIO & MEMORIES MANAGEMENT      */}
        {/* ============================================================ */}
        {!isSessionActive && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner with Launch CTA */}
            <div className="bg-gradient-to-r from-[#001A4C] via-[#0D7377] to-[#001A4C] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-[#9DF3C4]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold text-[#9DF3C4] border border-white/20">
                  <Sparkles className="w-3.5 h-3.5" /> Caregiver Memory Therapy Studio
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  Elder Memory Art Gallery
                </h2>
                <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed">
                  Upload elder family photos, memorable occasions, and favorite classic devotional songs.
                  The AI Voice Agent will interact with the patient, asking personalized questions and verifying their answers with gentle family hints.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCurrentIndex(0);
                      setSessionCompleted(false);
                      setTotalScore(0);
                      setIsSessionActive(true);
                    }}
                    className="px-6 py-3.5 bg-white text-[#001A4C] hover:bg-slate-100 rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current text-[#0D7377]" />
                    <span>Start Memory Session with Patient →</span>
                  </button>

                  <button
                    id="add-memory-btn"
                    onClick={() => {
                      setFormError("");
                      setShowAddModal(true);
                    }}
                    className="px-5 py-3.5 bg-[#9DF3C4] hover:bg-[#85E7B0] text-[#001A4C] rounded-2xl font-extrabold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#001A4C]" />
                    <span>+ Add New Memory Photo / Song</span>
                  </button>

                  <button
                    onClick={handleResetDefaults}
                    className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs transition border border-white/20 cursor-pointer"
                  >
                    Reset Sample Memories
                  </button>
                </div>
              </div>
            </div>

            {/* Caretaker Ground Truth Guide Card */}
            <div className="bg-[#9DF3C4]/15 border border-[#0D7377]/30 rounded-2xl p-5 flex items-start gap-4 text-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#0D7377] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Info className="w-5 h-5 text-[#9DF3C4]" />
              </div>
              <div className="text-xs sm:text-sm space-y-1">
                <h3 className="font-extrabold text-[#001A4C]">
                  How Caregiver Ground Truth Powers AI Reminiscence
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  When you upload a photo or song, you provide the true story (e.g. <em>"Making Diwali ladoos with granddaughter Ananya in Kolkata"</em>).
                  When the patient speaks their memory, our open-source semantic model checks their response against your ground truth to encourage and validate their recall!
                </p>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#001A4C] flex items-center gap-2">
                  <span>Current Elder Memories ({memories.length})</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">Click any card to play or delete</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memories.map((mem, idx) => (
                  <div
                    key={mem.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* Image / Header */}
                    <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                      {mem.type === "photo" ? (
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#001A4C] to-[#0D7377] flex flex-col items-center justify-center text-white p-4">
                          <Music className="w-12 h-12 text-[#9DF3C4] mb-2" />
                          <span className="text-sm font-bold text-center">{mem.title}</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur text-white text-[11px] font-bold rounded-lg flex items-center gap-1">
                          {mem.type === "photo" ? <Camera className="w-3 h-3 text-[#9DF3C4]" /> : <Music className="w-3 h-3 text-[#9DF3C4]" />}
                          {mem.type === "photo" ? "Photo" : "Bhajan / Song"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold drop-shadow-md truncate">
                        {mem.title}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Who & Where */}
                        {(mem.whoIsInPhoto || mem.whereWasTaken) && (
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            {mem.whoIsInPhoto && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md flex items-center gap-1">
                                <Users className="w-3 h-3 text-[#0D7377]" /> {mem.whoIsInPhoto}
                              </span>
                            )}
                            {mem.whereWasTaken && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#0D7377]" /> {mem.whereWasTaken}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Ground Truth */}
                        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="font-bold text-[#001A4C] block mb-0.5">Caretaker Story:</span>
                          <p className="line-clamp-2">{mem.caretakerGroundTruth}</p>
                        </div>

                        {/* Question */}
                        <div className="text-xs text-[#0D7377] font-semibold bg-[#9DF3C4]/20 p-2.5 rounded-xl border border-[#0D7377]/20">
                          <span className="font-bold text-[#001A4C] block mb-0.5">Voice Question:</span>
                          <p className="line-clamp-2 italic">"{mem.voiceQuestion}"</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setCurrentIndex(idx);
                          setSessionCompleted(false);
                          setIsSessionActive(true);
                        }}
                        className="w-full py-2.5 bg-[#001A4C] hover:bg-[#0D7377] text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-[#9DF3C4]" />
                        <span>Practice This Memory</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* POPUP MODAL FORM: ADD / UPLOAD ELDER MEMORY & GROUND TRUTH  */}
      {/* ============================================================ */}
      {showAddModal && (
        <div
          id="add-memory-modal-backdrop"
          className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#001A4C] to-[#0D7377] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                  <Camera className="w-5 h-5 text-[#9DF3C4]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Add Elder Memory</h3>
                  <p className="text-xs text-slate-200">
                    Upload photo/music & set Caretaker Ground Truth for Voice AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets for 1-click test */}
            <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500">Quick Test Presets:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillSamplePreset(1)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#001A4C] border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  Golden Temple Trip
                </button>
                <button
                  type="button"
                  onClick={() => fillSamplePreset(2)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#001A4C] border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  Monsoon Pakoras
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMemory} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Memory Type Switch */}
              <div>
                <label className="text-xs font-black text-[#001A4C] uppercase tracking-wider block mb-1.5">
                  1. Memory Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormType("photo")}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                      formType === "photo"
                        ? "bg-[#001A4C] text-white border-[#001A4C] shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Camera className="w-4 h-4 text-[#9DF3C4]" />
                    <span>Family Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("music")}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                      formType === "music"
                        ? "bg-[#001A4C] text-white border-[#001A4C] shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Music className="w-4 h-4 text-[#9DF3C4]" />
                    <span>Music & Bhajan</span>
                  </button>
                </div>
              </div>

              {/* Title / Occasion */}
              <div>
                <label className="text-xs font-black text-[#001A4C] uppercase tracking-wider block mb-1.5">
                  2. Title / Occasion Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Sweets Making with Granddaughter"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#001A4C] font-semibold focus:ring-2 focus:ring-[#0D7377] outline-none"
                />
              </div>

              {/* Upload Media (Photo or Audio) */}
              {formType === "photo" ? (
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#001A4C] uppercase tracking-wider block">
                    3. Upload Elder's Photo *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-[#0D7377]/40 hover:border-[#0D7377] bg-slate-50 hover:bg-[#9DF3C4]/10 rounded-2xl p-4 text-center cursor-pointer transition">
                      <Upload className="w-6 h-6 mx-auto text-[#0D7377] mb-1" />
                      <span className="text-xs font-bold text-[#001A4C] block">Click to upload image file</span>
                      <span className="text-[11px] text-slate-500">JPG, PNG, WebP supported</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {formImage && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#0D7377] shadow-md flex-shrink-0">
                        <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>Or image URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="flex-1 p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-black text-[#001A4C] uppercase tracking-wider block">
                    3. Upload Audio / Bhajan File (Optional)
                  </label>
                  <label className="block border-2 border-dashed border-[#0D7377]/40 hover:border-[#0D7377] bg-slate-50 hover:bg-[#9DF3C4]/10 rounded-2xl p-4 text-center cursor-pointer transition">
                    <FileAudio className="w-6 h-6 mx-auto text-[#0D7377] mb-1" />
                    <span className="text-xs font-bold text-[#001A4C] block">
                      {formAudioName ? `Selected: ${formAudioName}` : "Click to select MP3 / WAV audio"}
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Caregiver Ground Truth Input */}
              <div>
                <label className="text-xs font-black text-[#001A4C] uppercase tracking-wider block mb-1">
                  4. Caregiver Ground Truth (What happened in this memory?) *
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Describe what the elder was doing, who they were with, and what made it special. The Voice AI evaluates patient answers against this story.
                </p>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Making traditional Besan Ladoos and Diwali sweets in the Kolkata home kitchen with granddaughter Ananya."
                  value={formGroundTruth}
                  onChange={(e) => setFormGroundTruth(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#001A4C] focus:ring-2 focus:ring-[#0D7377] outline-none"
                />
              </div>

              {/* Who & Where Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#001A4C] block mb-1">
                    Who is in this photo?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Granddaughter Ananya & Lakshmi"
                    value={formWho}
                    onChange={(e) => setFormWho(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#001A4C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#001A4C] block mb-1">
                    Where was it taken?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kolkata family kitchen"
                    value={formWhere}
                    onChange={(e) => setFormWhere(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#001A4C]"
                  />
                </div>
              </div>

              {/* Voice Question to Ask Patient */}
              <div>
                <label className="text-xs font-black text-[#001A4C] uppercase tracking-wider block mb-1">
                  5. AI Voice Question to Ask Patient
                </label>
                <input
                  type="text"
                  placeholder="e.g. What were you and Ananya making together in this kitchen picture?"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-[#001A4C] focus:ring-2 focus:ring-[#0D7377] outline-none"
                />
              </div>

              {/* Expected Keywords for Semantic Matching */}
              <div>
                <label className="text-xs font-bold text-[#001A4C] block mb-1">
                  Expected Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. sweets, ladoo, kitchen, ananya, diwali, cooking"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#001A4C]"
                />
              </div>

              {/* Gentle Family Hint / Clue */}
              <div>
                <label className="text-xs font-bold text-[#001A4C] block mb-1">
                  Gentle Family Hint (Read if patient struggles)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Think of the sweet smell of roasted besan and round ladoos for Diwali."
                  value={formHint}
                  onChange={(e) => setFormHint(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-[#001A4C]"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#001A4C] to-[#0D7377] hover:from-[#002866] hover:to-[#0F8A8F] text-white rounded-xl font-black text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#9DF3C4]" />
                  <span>Save to Elder's Art Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoryArtGallery;
