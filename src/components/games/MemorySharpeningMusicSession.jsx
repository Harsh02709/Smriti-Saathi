import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  ArrowRight,
  ChevronLeft,
  Headphones,
  Zap,
  Clock,
  Radio,
  CheckCircle2,
  Sliders,
  Waves
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobotAvatar } from "../common/GraphicAssets";
import { routineTranslations } from "../../data/routineTranslations";

// Scientifically curated memory-sharpening music tracks
const DEFAULT_TRACKS = [
  {
    id: "gamma_40hz",
    title: "40 Hz Gamma Wave Synapse Sharpener",
    frequencyText: "40 Hz Acoustic Gamma (MIT Protocol)",
    category: "Hippocampal Synapse Activation",
    baseFreq: 240,
    binauralBeat: 40,
    chordOffsets: [0, 5, 7, 12],
    color: "from-teal-600 via-[#0D7377] to-emerald-700",
    badge: "Clinical Neuro-Sharpener",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    description: "40Hz Gamma acoustic stimulation activates hippocampal microglia, improving synaptic transmission and memory recall speed.",
    bgImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "432hz_alpha",
    title: "432 Hz Alpha Brainwave Memory Retain",
    frequencyText: "432 Hz Natural Pitch + 10 Hz Alpha Waves",
    category: "Memory Retention & Clarity",
    baseFreq: 432,
    binauralBeat: 10,
    chordOffsets: [0, 4, 7, 11],
    color: "from-emerald-600 to-teal-800",
    badge: "Cognitive Fog Cleanser",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Harmonizes brain hemispheres, clears mental fatigue, and strengthens short-term memory consolidation.",
    bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "raga_yaman",
    title: "Raga Yaman Flute & Tanpura Harmony",
    frequencyText: "Shadja (Sa) 261.6 Hz + Tivra Ma Harmonics",
    category: "Indian Classical Memory Calming",
    baseFreq: 261.63,
    binauralBeat: 8,
    chordOffsets: [0, 4, 6, 7, 11],
    color: "from-amber-600 via-orange-600 to-teal-800",
    badge: "Mind-Calm & Grounding",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Ancient meditative melody proven to induce calming alpha synchrony and awaken long-term episodic memories.",
    bgImage: "https://images.unsplash.com/photo-1516715094483-75da7dee9758?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "528hz_solfeggio",
    title: "528 Hz Solfeggio Nostalgia Awakening",
    frequencyText: "528 Hz 'Miracle Tone' + 6 Hz Theta Waves",
    category: "Deep Reminiscence & Emotional Peace",
    baseFreq: 528,
    binauralBeat: 6,
    chordOffsets: [0, 3, 7, 10],
    color: "from-indigo-600 via-blue-700 to-teal-900",
    badge: "Emotional Memory Stimulation",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description: "Stimulates deep limbic memory centers, easing anxiety and promoting emotional well-being.",
    bgImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1000&q=80"
  }
];

export const MemorySharpeningMusicSession = ({
  profile,
  onComplete,
  onBack,
  onSkip,
  nextGameTitle = "11. NOSTALGIA & PAST MEMORY RECALL"
}) => {
  const currentLang = profile?.language || "en";
  const rt = routineTranslations[currentLang] || routineTranslations.en;
  const mData = rt.music || routineTranslations.en.music;

  const tracks = (mData.tracks || []).map((t, idx) => ({
    ...DEFAULT_TRACKS[idx],
    ...t
  }));

  const [selectedTrack, setSelectedTrack] = useState(tracks[0] || DEFAULT_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);
  const lfoRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Web Audio synthesizer
  const startAudioEngine = (track = selectedTrack) => {
    try {
      stopAudioEngine();
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.22, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Polyphonic Harmonic Oscillators
      const oscs = [];
      track.chordOffsets.forEach((semitone, i) => {
        const freq = track.baseFreq * Math.pow(2, semitone / 12);
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Alternating warm waveforms
        osc.type = i === 0 ? "sine" : i === 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle envelope
        const gainVal = i === 0 ? 0.45 : i === 1 ? 0.25 : 0.15;
        oscGain.gain.setValueAtTime(gainVal, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      // Binaural Beat / Pulse Modulator (e.g. 40Hz / 10Hz)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(track.binauralBeat || 10, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
      lfo.connect(lfoGain.gain);
      lfo.start();
      lfoRef.current = lfo;

      oscillatorsRef.current = oscs;
      setIsPlaying(true);
    } catch (err) {
      console.warn("Web Audio start failed:", err);
    }
  };

  const stopAudioEngine = () => {
    try {
      if (oscillatorsRef.current.length > 0) {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
      }
      if (lfoRef.current) {
        try {
          lfoRef.current.stop();
          lfoRef.current.disconnect();
        } catch {}
        lfoRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {}
    setIsPlaying(false);
  };

  // Auto start on mount
  useEffect(() => {
    startAudioEngine(selectedTrack);

    return () => {
      stopAudioEngine();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer counter
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Volume update
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : volume * 0.22;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume, isMuted]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioEngine();
    } else {
      startAudioEngine(selectedTrack);
    }
  };

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    startAudioEngine(track);
  };

  const handleCompleteSession = () => {
    stopAudioEngine();
    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch {}
    if (onComplete) {
      onComplete("game-5-sound", 98, 98, elapsedSeconds + 15, 0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#0D7377]/15">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-black uppercase text-teal-800 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200 flex items-center justify-center gap-1.5 mx-auto">
            <Headphones className="w-3.5 h-3.5 text-[#0D7377]" />
            <span>Step 8: Therapeutic Acoustic Stimulation</span>
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-[#132A2F] mt-1">
            Memory Sharpening Neuro-Acoustic Music 🎵
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onSkip && (
            <button
              onClick={() => {
                stopAudioEngine();
                onSkip();
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs cursor-pointer transition shadow-xs"
              title="Skip this music session"
            >
              <span>Skip ⏭️</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Music Player Hero Card */}
      <div className={`relative rounded-3xl overflow-hidden shadow-xl border-2 border-teal-300 bg-gradient-to-br ${selectedTrack.color} text-white p-6 sm:p-10 transition-all duration-500`}>
        {/* Background Ambient Layer */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Column: Track Info & Visualizer */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-black">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{selectedTrack.category}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {selectedTrack.title}
            </h3>

            <p className="text-sm sm:text-base text-teal-100 font-medium max-w-xl leading-relaxed">
              {selectedTrack.description}
            </p>

            {/* Frequency Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-mono text-emerald-200">
              <Radio className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{selectedTrack.frequencyText}</span>
            </div>

            {/* Audio Waveform Equalizer Animation */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 pt-2">
              {[40, 75, 55, 90, 60, 100, 80, 45, 95, 70, 85, 50, 65, 90].map((h, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full bg-white transition-all duration-300 ${
                    isPlaying ? "animate-pulse" : "opacity-40"
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(12, (h * (i % 3 + 1)) % 48)}px` : "12px",
                    animationDuration: `${0.4 + (i % 5) * 0.15}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Audio Interactive Player Controls */}
          <div className="flex flex-col items-center bg-black/30 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shrink-0 w-full sm:w-80 shadow-2xl">
            {/* Big Play / Pause Button */}
            <button
              onClick={handleTogglePlay}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                isPlaying
                  ? "bg-white text-[#0D7377] ring-8 ring-white/30 scale-105"
                  : "bg-emerald-400 hover:bg-emerald-300 text-teal-950 ring-4 ring-white/20 hover:scale-105"
              }`}
              title={isPlaying ? "Pause Music" : "Play Music"}
            >
              {isPlaying ? (
                <Pause className="w-12 h-12" />
              ) : (
                <Play className="w-12 h-12 ml-1" />
              )}
            </button>

            <span className="text-xs font-black uppercase tracking-wider mt-4 text-teal-100">
              {isPlaying ? "Stimulating Memory Synapses 🎵" : "Tap to Start Music"}
            </span>

            {/* Session Listen Timer */}
            <div className="mt-2 text-2xl font-black font-mono text-white">
              ⏱️ {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
            </div>

            {/* Volume Control */}
            <div className="w-full mt-5 pt-4 border-t border-white/15 flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-teal-200 transition cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/30 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track Selector & Presets */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#0D7377]" />
            <h4 className="text-base sm:text-lg font-black text-[#132A2F]">
              Select Memory-Boosting Frequency Preset:
            </h4>
          </div>
          <span className="text-xs font-bold text-slate-500">4 Therapeutic Soundscapes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tracks.map((track) => {
            const isSelected = selectedTrack.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? "bg-teal-50/90 border-[#0D7377] ring-2 ring-[#0D7377]/30 shadow-md scale-[1.01]"
                    : "bg-white hover:bg-slate-50 border-slate-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black shadow-xs ${
                    isSelected ? "bg-[#0D7377] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isSelected && isPlaying ? (
                    <Waves className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Music className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${track.badgeColor}`}
                    >
                      {track.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-black text-[#0D7377] bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        {currentLang === "hi" ? "सक्रिय" : "Active"}
                      </span>
                    )}
                  </div>
                  <h5 className="font-black text-sm sm:text-base text-[#132A2F] mt-1">
                    {track.title}
                  </h5>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-2">
                    {track.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Rationale Note */}
      <div className="bg-[#EAF6F4] rounded-3xl p-5 sm:p-6 border border-[#0D7377]/25 flex items-start gap-4 shadow-xs">
        <RobotAvatar size="w-12 h-12" />
        <div>
          <span className="text-xs font-black text-[#0D7377] uppercase tracking-wider">
            {currentLang === "hi" ? "चिकित्सीय संगीत थेरेपी का आधार" : "CLINICAL MUSIC THERAPY RATIONALE"}
          </span>
          <p className="text-sm sm:text-base text-[#132A2F] font-medium leading-relaxed mt-0.5">
            {currentLang === "hi"
              ? "ध्वनिक 40Hz गामा ध्वनि तरंगें और 432Hz अल्फा आवृत्तियाँ हिप्पोकैम्पस में न्यूरॉन्स को धीरे से सक्रिय करती हैं। केवल 1–2 मिनट सुनने से मानसिक थकान दूर होती है और पुरानी यादें ताज़ा होती हैं।"
              : `"Acoustic 40Hz Gamma sound waves and 432Hz alpha frequencies gently synchronise neural firing in the hippocampus and temporal cortex. Listening for just 1–2 minutes clears brain fog and prepares the mind for deep past memory recall."`}
          </p>
        </div>
      </div>

      {/* Bottom Action: Proceed to Next Step */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={handleCompleteSession}
          className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer btn-glow-teal scale-105 active:scale-98"
        >
          <span>{currentLang === "hi" ? "मन शांत और तरोताजा है · चरण 9 पर आगे बढ़ें" : "I Feel Refreshed · Continue to Step 9 (Past Memory Recall)"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
