import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Music,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  RotateCcw,
  Calendar,
  MapPin,
  Users,
  Plus,
  X,
  Upload,
  Brain,
  Sliders,
  Radio,
  FileAudio,
  CheckCircle2,
  Smile,
  ShieldCheck,
  Headphones,
  Zap,
  Clock,
  Waves
} from "lucide-react";
import confetti from "canvas-confetti";

const NOSTALGIA_STORAGE_KEY = "smriti_nostalgia_memories_v1";

// Curated Google Photos-style past memories
const DEFAULT_NOSTALGIA_MEMORIES = [
  {
    id: "nostalgia-1",
    title: "Diwali Sweet Making with Granddaughter",
    timeAgo: "8 Years Ago • October 2018",
    dateFormatted: "October 24, 2018",
    location: "Kolkata Family Kitchen",
    who: "Granddaughter Ananya & Lakshmi Devi",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    recollectionStory: "Do you remember this joyful Diwali morning in the Kolkata kitchen? You and little Ananya were rolling sweet golden Besan Ladoos with pure ghee. The whole house smelled of roasted cardamom, and Ananya kept tasting the warm dough with a big smile on her face.",
    caregiverNote: "Lakshmi loved making festive sweets every year with her granddaughter.",
    recommendedMusicPreset: "432hz"
  },
  {
    id: "nostalgia-2",
    title: "Summer Trip to Dal Lake Shikara",
    timeAgo: "12 Years Ago • June 2014",
    dateFormatted: "June 15, 2014",
    location: "Dal Lake, Srinagar, Kashmir",
    who: "With Husband Ramesh and Children",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    recollectionStory: "Look at this serene summer afternoon in Kashmir on the wooden Shikara boat. The cold mountain breeze was blowing softly across Dal Lake, and you were admiring the floating pink lotus flowers while drinking warm Kahwa saffron tea together.",
    caregiverNote: "A favorite family holiday remembered fondly for the crisp mountain air.",
    recommendedMusicPreset: "raga_yaman"
  },
  {
    id: "nostalgia-3",
    title: "Morning Garden Ginger Chai & Roses",
    timeAgo: "5 Years Ago • Spring 2021",
    dateFormatted: "March 10, 2021",
    location: "Home Garden Lawn, New Delhi",
    who: "Lakshmi Devi relaxing in wicker chair",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
    recollectionStory: "Remember your peaceful mornings in the lawn? You were sitting in your favorite white wicker chair with a fresh cup of hot ginger tea, listening to the morning sparrows chirping in the red rose bushes you planted yourself.",
    caregiverNote: "Her daily morning meditation routine in the rose garden.",
    recommendedMusicPreset: "528hz"
  },
  {
    id: "nostalgia-4",
    title: "Grandson Rohan's First School Play",
    timeAgo: "10 Years Ago • December 2016",
    dateFormatted: "December 12, 2016",
    location: "St. Xavier's Auditorium",
    who: "Grandson Rohan and Family",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    recollectionStory: "Do you recall how proud you felt watching Rohan on stage dressed in his little royal costume? When he delivered his lines, you clapped the loudest in the front row and gave him a big warm hug with his favorite chocolate bar afterwards.",
    caregiverNote: "A milestone family memory celebrated with sweets and hugs.",
    recommendedMusicPreset: "gamma_40hz"
  }
];

// Scientifically Backed Memory Sharpening Music Presets
const BRAIN_MUSIC_PRESETS = [
  {
    id: "432hz",
    name: "432 Hz Alpha Wave Memory Retain",
    category: "Memory Retention & Clarity",
    frequencyText: "432 Hz Carrier + 10 Hz Alpha Rhythm",
    description: "Promotes neuroplasticity, clears cognitive brain fog, and helps consolidate past memory recall.",
    baseFreq: 432,
    binauralBeat: 10,
    chordOffsets: [0, 4, 7, 11], // Major 7th serene harmony
    color: "from-teal-600 to-emerald-700",
    badge: "Most Recommended for Dementia Care",
    badgeColor: "bg-emerald-100 text-emerald-800"
  },
  {
    id: "528hz",
    name: "528 Hz Solfeggio Nostalgia Awakening",
    category: "Deep Reminiscence & Calm",
    frequencyText: "528 Hz 'Transformation' + 6 Hz Theta Waves",
    description: "Stimulates deep emotional autobiographical memory centers and evokes warm, soothing childhood nostalgia.",
    baseFreq: 528,
    binauralBeat: 6,
    chordOffsets: [0, 3, 7, 10], // Minor 7th deeply reflective
    color: "from-indigo-600 to-[#001A4C]",
    badge: "Emotional Memory Recall",
    badgeColor: "bg-indigo-100 text-indigo-800"
  },
  {
    id: "gamma_40hz",
    name: "40 Hz Gamma Wave Neural Sharpener",
    category: "Active Brain Stimulation",
    frequencyText: "40 Hz Gamma Synchrony (MIT Protocol)",
    description: "Clinically studied acoustic gamma stimulation designed to heighten attention and activate hippocampal synapses.",
    baseFreq: 240,
    binauralBeat: 40,
    chordOffsets: [0, 5, 7, 12], // Open 5th resonant octave
    color: "from-blue-600 to-[#0D7377]",
    badge: "Clinical Cognitive Agility",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "raga_yaman",
    name: "Raga Yaman Harmonic Serenade",
    category: "Indian Classical Cognitive Calm",
    frequencyText: "Shadja (Sa) 261.6 Hz + Tivra Ma & Ga Harmonics",
    description: "Ancient evening raga renowned in music therapy for creating deep meditative relaxation and grounding elder recall.",
    baseFreq: 261.63,
    binauralBeat: 8,
    chordOffsets: [0, 4, 6, 7, 11], // Yaman scale intervals
    color: "from-amber-600 to-teal-800",
    badge: "Classical Music Therapy",
    badgeColor: "bg-amber-100 text-amber-800"
  },
  {
    id: "retro_nostalgia",
    name: "Golden Era Nostalgia Melody",
    category: "Vintage Comfort & Familiarity",
    frequencyText: "Warm Analog 396 Hz + 7.83 Hz Schumann Resonance",
    description: "Warm vintage radio tones that bring an immediate sense of comfort and nostalgic familiarity to senior minds.",
    baseFreq: 396,
    binauralBeat: 7.83,
    chordOffsets: [0, 4, 7, 9], // Major 6th classic vintage
    color: "from-purple-700 to-[#001A4C]",
    badge: "Vintage Comfort",
    badgeColor: "bg-purple-100 text-purple-800"
  }
];

export function NostalgiaRecallMusic({ onBack }) {
  // Memories List
  const [memories, setMemories] = useState(() => {
    try {
      const saved = localStorage.getItem(NOSTALGIA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_NOSTALGIA_MEMORIES;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAutoRecount, setIsAutoRecount] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [patientResponse, setPatientResponse] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Memory Form State
  const [formTitle, setFormTitle] = useState("");
  const [formTimeAgo, setFormTimeAgo] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formWho, setFormWho] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formStory, setFormStory] = useState("");
  const [formError, setFormError] = useState("");

  // Music Studio State
  const [selectedMusicPreset, setSelectedMusicPreset] = useState(BRAIN_MUSIC_PRESETS[0]);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.6);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timerRemaining, setTimerRemaining] = useState(15 * 60);

  // Audio Context and Synth Refs
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const recognitionRef = useRef(null);

  const currentMemory = memories[currentIndex] || memories[0];

  // Persist memories
  useEffect(() => {
    try {
      localStorage.setItem(NOSTALGIA_STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error(e);
    }
  }, [memories]);

  // AI Voice Synthesis for Recounting Memory Story
  const speakRecount = useCallback((storyText, onComplete) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(storyText);
    utterance.rate = 0.88; // Gentle, warm and unhurried for seniors
    utterance.pitch = 1.0;
    utterance.lang = "en-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onComplete) onComplete();
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Trigger voice recount on memory change if auto-recount enabled
  useEffect(() => {
    if (currentMemory) {
      setPatientResponse("");
      stopSpeaking();

      if (isAutoRecount) {
        const timer = setTimeout(() => {
          const intro = `${currentMemory.title}. ${currentMemory.timeAgo}. ${currentMemory.recollectionStory}`;
          speakRecount(intro);
        }, 600);
        return () => {
          clearTimeout(timer);
          stopSpeaking();
        };
      }
    }
  }, [currentIndex, isAutoRecount]);

  // Speech Recognition
  const startListening = () => {
    stopSpeaking();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. You can type in the box.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setPatientResponse("");
      };
      recognition.onresult = (e) => {
        let transcript = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setPatientResponse(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => {
        setIsListening(false);
        if (patientResponse) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Next / Previous Navigation
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(memories.length - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Web Audio Synth for Memory Sharpening Brain Frequencies
  const startMusicSynth = (preset = selectedMusicPreset) => {
    try {
      stopMusicSynth();

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(musicVolume * 0.25, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const baseFreq = preset.baseFreq;
      const newOscillators = [];

      // Create harmonious chords + binaural differential
      preset.chordOffsets.forEach((semitone, i) => {
        const osc = ctx.createOscillator();
        const chordGain = ctx.createGain();

        // Calculate frequency from semitone offset: f = base * 2^(semitone/12)
        const freq = baseFreq * Math.pow(2, semitone / 12);
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.type = i === 0 ? "sine" : i === 1 ? "triangle" : "sine";

        // Subtle slow LFO vibrato for natural soothing warmth
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.15 + i * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        chordGain.gain.setValueAtTime(0.3 / (i + 1), ctx.currentTime);
        osc.connect(chordGain);
        chordGain.connect(masterGain);

        osc.start();
        newOscillators.push(osc);
        newOscillators.push(lfo);
      });

      // Binaural Beat Carrier Oscillator (Left/Right brain hemisphere sync)
      const binauralOsc = ctx.createOscillator();
      const binauralGain = ctx.createGain();
      binauralOsc.frequency.setValueAtTime(baseFreq + preset.binauralBeat, ctx.currentTime);
      binauralOsc.type = "sine";
      binauralGain.gain.setValueAtTime(0.15, ctx.currentTime);
      binauralOsc.connect(binauralGain);
      binauralGain.connect(masterGain);
      binauralOsc.start();
      newOscillators.push(binauralOsc);

      oscillatorsRef.current = newOscillators;
      setIsPlayingMusic(true);

      // Start countdown timer
      setTimerRemaining(timerMinutes * 60);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            stopMusicSynth();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      console.error("Audio synth start error", e);
    }
  };

  const stopMusicSynth = () => {
    if (audioContextRef.current && gainNodeRef.current) {
      try {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.5);
        setTimeout(() => {
          oscillatorsRef.current.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (e) {}
          });
          oscillatorsRef.current = [];
          if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close();
          }
          audioContextRef.current = null;
        }, 600);
      } catch (e) {}
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsPlayingMusic(false);
  };

  // Adjust volume live
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(musicVolume * 0.25, audioContextRef.current.currentTime + 0.1);
    }
  }, [musicVolume]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopMusicSynth();
    };
  }, []);

  // Save new custom memory
  const handleSaveNewMemory = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formStory.trim()) {
      setFormError("Please provide a title and memory story.");
      return;
    }

    const newMem = {
      id: "nostalgia-" + Date.now(),
      title: formTitle.trim(),
      timeAgo: formTimeAgo.trim() || "Cherished Past Memory",
      dateFormatted: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      location: formLocation.trim() || "Family Home",
      who: formWho.trim() || "Loved Family Members",
      imageUrl: formImage.trim() || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      recollectionStory: formStory.trim(),
      caregiverNote: "Added with love by family caregiver.",
      recommendedMusicPreset: "432hz"
    };

    setMemories((prev) => [newMem, ...prev]);
    setCurrentIndex(0);
    setShowAddModal(false);
    setFormTitle("");
    setFormStory("");
    setFormLocation("");
    setFormWho("");
    setFormTimeAgo("");
    setFormImage("");
    setFormError("");
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-10 animate-fadeIn font-sans text-[#001A4C]">
      {/* ============================================================ */}
      {/* 1. GOOGLE PHOTOS STYLE MEMORY LANE HERO SECTION             */}
      {/* ============================================================ */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 relative overflow-hidden">
        {/* Top Header & Google Photos Memories Capsule Carousel */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#001A4C] text-[#9DF3C4] rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Google Photos Nostalgia Memory Lane
              </span>
              <span className="text-xs font-bold text-slate-500">
                AI Voice Storytelling & Autobiographical Reminiscence
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#001A4C]">
              Past Precious Memories & Voice Recount
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoRecount(!isAutoRecount)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isAutoRecount
                  ? "bg-[#0D7377]/10 text-[#0D7377] border-[#0D7377]/30"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Auto Recount: {isAutoRecount ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#001A4C] to-[#0D7377] hover:from-[#002866] hover:to-[#0F8A8F] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#9DF3C4]" />
              <span>+ Add Past Photo</span>
            </button>
          </div>
        </div>

        {/* Circular Google Photos Story Bubbles / Capsules */}
        <div className="py-4 overflow-x-auto flex items-center gap-4 scrollbar-none">
          {memories.map((mem, idx) => (
            <button
              key={mem.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 group transition cursor-pointer p-1 rounded-2xl ${
                idx === currentIndex ? "scale-105" : "opacity-75 hover:opacity-100"
              }`}
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition duration-300 ${
                  idx === currentIndex
                    ? "ring-4 ring-[#0D7377] bg-gradient-to-tr from-[#001A4C] to-[#9DF3C4] shadow-lg"
                    : "ring-2 ring-slate-200 hover:ring-[#0D7377]/50"
                }`}
              >
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span
                className={`text-[11px] font-extrabold max-w-[80px] sm:max-w-[90px] truncate text-center ${
                  idx === currentIndex ? "text-[#0D7377]" : "text-slate-600"
                }`}
              >
                {mem.title}
              </span>
            </button>
          ))}

          {/* Quick Add Story Capsule */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group transition cursor-pointer p-1"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[#0D7377]/60 hover:border-[#0D7377] bg-[#9DF3C4]/10 hover:bg-[#9DF3C4]/20 flex items-center justify-center text-[#0D7377] transition shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-500">Add Memory</span>
          </button>
        </div>

        {/* HERO SHOWCASE CARD: Large Photo + AI Voice Agent Storytelling */}
        {currentMemory && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Big Nostalgic Photo */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 relative group">
              <div className="aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center">
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-black/70 backdrop-blur text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-[#9DF3C4]" />
                    {currentMemory.timeAgo}
                  </span>
                  {currentMemory.location && (
                    <span className="px-3 py-1.5 bg-black/70 backdrop-blur text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-[#9DF3C4]" />
                      {currentMemory.location}
                    </span>
                  )}
                </div>

                {currentMemory.who && (
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/75 backdrop-blur text-white rounded-2xl text-xs font-medium flex items-center gap-2 shadow-lg">
                    <Users className="w-4 h-4 text-[#9DF3C4] flex-shrink-0" />
                    <span>{currentMemory.who}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: AI Voice Agent Recount Box & Patient Voice Response */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {/* AI Voice Agent Recount Box */}
              <div className="bg-gradient-to-br from-[#001A4C] to-[#0D7377] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-md">
                      <Brain className="w-5 h-5 text-[#9DF3C4]" />
                    </div>
                    <div>
                      <span className="text-xs font-black tracking-wider uppercase text-[#9DF3C4]">
                        Voice Agent Recount
                      </span>
                      <div className="text-[11px] text-slate-300">Speaking past precious memory</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        speakRecount(currentMemory.recollectionStory);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition flex items-center gap-1.5 text-xs font-bold border border-white/20 cursor-pointer shadow-xs"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>Pause Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#9DF3C4]" />
                        <span>Listen to Story</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recount Story Text */}
                <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/15">
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    "{currentMemory.recollectionStory}"
                  </p>
                </div>

                {currentMemory.caregiverNote && (
                  <p className="text-[11px] text-[#9DF3C4] font-medium mt-3 italic flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                    <span>Family Note: {currentMemory.caregiverNote}</span>
                  </p>
                )}
              </div>

              {/* Patient Response Section (Speak back to Voice Agent) */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#001A4C] uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-[#0D7377]" /> Speak Your Memory to Voice Agent
                  </span>
                  {patientResponse && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Memory Shared!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs transition cursor-pointer shadow-md ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-[#001A4C] hover:bg-[#0D7377] text-white"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#9DF3C4]" />}
                    <span>{isListening ? "Listening... Speak" : "Tap to Talk Back"}</span>
                  </button>

                  <input
                    type="text"
                    value={patientResponse}
                    onChange={(e) => setPatientResponse(e.target.value)}
                    placeholder="Tell the Voice Agent what you remember..."
                    className="flex-1 p-3 bg-white border border-slate-300 rounded-xl text-xs text-[#001A4C] font-semibold focus:ring-2 focus:ring-[#0D7377] outline-none"
                  />
                </div>

                {patientResponse && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fadeIn">
                    <Smile className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>You recalled: "{patientResponse}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PREVIOUS & NEXT MEMORY BUTTONS RIGHT AFTER/BELOW THE IMAGE (As explicitly requested by user) */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#001A4C] rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow transition transform hover:-translate-x-0.5 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-[#0D7377]" />
            <span>← Previous Memory</span>
          </button>

          <div className="text-center font-black text-sm text-slate-600 px-4">
            Memory <span className="text-[#0D7377]">{currentIndex + 1}</span> of {memories.length}
          </div>

          <button
            onClick={handleNext}
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-[#0D7377] hover:bg-[#0A5A5D] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition transform hover:translate-x-0.5 cursor-pointer"
          >
            <span>Next Memory →</span>
            <ChevronRight className="w-5 h-5 text-[#9DF3C4]" />
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MEMORY SHARPENING & BRAIN FOCUS MUSIC STUDIO (NEW FEATURE)*/}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-[#001A4C] via-[#0D7377] to-[#001A4C] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#9DF3C4]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold text-[#9DF3C4] border border-white/20">
              <Headphones className="w-3.5 h-3.5" /> Cognitive Neuro-Music Therapy Studio
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Memory Sharpening Brain Wave Music
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Scientifically curated binaural acoustic frequencies, Solfeggio tones & Indian classical ragas for memory consolidation.
            </p>
          </div>

          {/* Master Play / Stop CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isPlayingMusic) {
                  stopMusicSynth();
                } else {
                  startMusicSynth(selectedMusicPreset);
                }
              }}
              className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2.5 shadow-xl transition transform hover:scale-105 active:scale-95 cursor-pointer ${
                isPlayingMusic
                  ? "bg-rose-500 hover:bg-rose-600 text-white animate-pulse"
                  : "bg-[#9DF3C4] hover:bg-[#85E7B0] text-[#001A4C]"
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause Music</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play Memory Music ({selectedMusicPreset.name.split(" ")[0]})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sound Wave Animation & Current Playing Track Indicator */}
        <div className="my-6 p-6 bg-white/10 backdrop-blur rounded-3xl border border-white/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Animated Frequency Visualizer Bars */}
          <div className="md:col-span-4 flex items-center gap-2 justify-center py-4">
            {[40, 75, 55, 90, 65, 80, 45, 95, 70, 85, 60, 100, 50, 70].map((height, i) => (
              <div
                key={i}
                style={{
                  height: isPlayingMusic ? `${height}%` : "16%",
                  transition: "height 0.3s ease-in-out"
                }}
                className={`w-2.5 rounded-full ${
                  isPlayingMusic
                    ? "bg-gradient-to-t from-[#9DF3C4] to-white animate-pulse"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Active Preset Info */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${selectedMusicPreset.badgeColor}`}>
                {selectedMusicPreset.badge}
              </span>
              <span className="text-xs text-[#9DF3C4] font-bold">
                {selectedMusicPreset.frequencyText}
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{selectedMusicPreset.name}</h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedMusicPreset.description}
            </p>
          </div>

          {/* Controls: Volume & Timer */}
          <div className="md:col-span-3 bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/15 space-y-3">
            {/* Volume */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-[#9DF3C4]" /> Volume
                </span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full accent-[#9DF3C4] cursor-pointer"
              />
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#9DF3C4]" /> Session Timer
              </span>
              <span className="text-[#9DF3C4] font-black">
                {isPlayingMusic ? formatTimer(timerRemaining) : `${timerMinutes} min`}
              </span>
            </div>
          </div>
        </div>

        {/* Preset Cards Selector Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#9DF3C4] flex items-center gap-1.5">
            <Waves className="w-4 h-4" /> Select Memory Sharpening Frequency Preset:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAIN_MUSIC_PRESETS.map((preset) => {
              const isSelected = selectedMusicPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedMusicPreset(preset);
                    if (isPlayingMusic) {
                      startMusicSynth(preset);
                    }
                  }}
                  className={`p-5 rounded-3xl text-left transition duration-300 border cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-white text-[#001A4C] border-white shadow-2xl scale-[1.02]"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-[#0D7377] text-white" : preset.badgeColor
                        }`}
                      >
                        {preset.badge}
                      </span>
                      {isSelected && isPlayingMusic && (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>

                    <h5 className="font-extrabold text-sm sm:text-base leading-snug">
                      {preset.name}
                    </h5>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/40 flex items-center justify-between text-[11px] font-bold">
                    <span className={isSelected ? "text-[#0D7377]" : "text-[#9DF3C4]"}>
                      {preset.frequencyText.split("+")[0]}
                    </span>
                    <span className="flex items-center gap-1 underline">
                      {isSelected ? "Active Selected" : "Tap to Switch"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. ADD NEW PAST MEMORY MODAL                                */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scaleUp text-[#001A4C]">
            <div className="bg-gradient-to-r from-[#001A4C] to-[#0D7377] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                  <Camera className="w-5 h-5 text-[#9DF3C4]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Add Past Memory</h3>
                  <p className="text-xs text-slate-200">
                    Upload elder photo and write recollection story for Voice Agent
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

            <form onSubmit={handleSaveNewMemory} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-800">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">
                  1. Title / Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Anniversary Picnic in Shimla"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#0D7377] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">When (e.g. 10 Years Ago)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Years Ago • May 2014"
                    value={formTimeAgo}
                    onChange={(e) => setFormTimeAgo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Shimla Hills, Himachal"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Who is in the photo?</label>
                <input
                  type="text"
                  placeholder="e.g. Husband Ramesh & Grandchildren"
                  value={formWho}
                  onChange={(e) => setFormWho(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider block mb-1">
                  2. Voice Agent Recollection Story *
                </label>
                <p className="text-[11px] text-slate-500 mb-1">
                  Write the story in warm, second-person tone ("Do you remember when you..."). The Voice Agent will read this aloud to the patient!
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Do you remember this sunny afternoon in Shimla with Ramesh? You were drinking warm ginger tea and enjoying the snowy mountain view..."
                  value={formStory}
                  onChange={(e) => setFormStory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0D7377] outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#001A4C] to-[#0D7377] hover:from-[#002866] hover:to-[#0F8A8F] text-white rounded-xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#9DF3C4]" />
                  <span>Save to Memory Lane</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NostalgiaRecallMusic;
