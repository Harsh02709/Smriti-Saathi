import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  Mic,
  MicOff,
  X,
  Sparkles,
  Phone,
  Play,
  Brain,
  Activity,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Send,
  Languages,
  Home,
  Stethoscope
} from "lucide-react";
import { translations } from "../../data/translations";

export const VoiceModal = ({
  isOpen,
  onClose,
  profile,
  onCommandTrigger
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastRecognized, setLastRecognized] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [micError, setMicError] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [activeLang, setActiveLang] = useState(profile?.language || "en");
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const latestSpokenRef = useRef("");
  const hasExecutedRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animFrameRef = useRef(null);

  const lang = activeLang || "en";
  const t = translations[lang] || translations.hi || translations.en;

  const langCodeMap = {
    en: "en-IN",
    hi: "hi-IN",
    bn: "bn-IN",
    as: "as-IN",
    mni: "mni-IN",
    mzo: "en-IN"
  };

  useEffect(() => {
    if (profile?.language) {
      setActiveLang(profile.language);
    }
  }, [profile?.language]);

  // Text-to-speech feedback — Hindi-aware with matra support
  const speakFeedback = (text) => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const isHindi = lang === "hi";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = isHindi ? 0.82 : 0.92;
        utterance.pitch = 1.05;
        const targetLang = langCodeMap[lang] || (isHindi ? "hi-IN" : "en-US");
        utterance.lang = targetLang;

        // Select best matching voice for Hindi matra pronunciation
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferred =
            voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
            voices.find((v) => v.lang === targetLang) ||
            voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2))) ||
            null;
          if (preferred) utterance.voice = preferred;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }
  };

  // Setup live audio meter to show microphone input visualization
  const setupAudioMeter = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn("Audio meter setup notice:", err);
    }
  };

  const cleanupAudioMeter = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {
        // ignore
      }
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  };

  // Execute recognized command
  const executeCommand = (rawText) => {
    if (!rawText || hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    const commandText = rawText.trim();
    setLastRecognized(commandText);
    stopListening();

    const lower = commandText.toLowerCase();
    let spokenReply = `Starting ${commandText}`;

    if (
      lower.includes("game") ||
      lower.includes("start") ||
      lower.includes("play") ||
      lower.includes("khel")
    ) {
      spokenReply = lang === "hi" ? "खेल शुरू कर रहे हैं" : "Starting your game";
    } else if (
      lower.includes("test") ||
      lower.includes("memory") ||
      lower.includes("assessment")
    ) {
      spokenReply =
        lang === "hi" ? "मेमोरी टेस्ट शुरू कर रहे हैं" : "Opening memory test";
    } else if (
      lower.includes("exercise") ||
      lower.includes("walk") ||
      lower.includes("stretch") ||
      lower.includes("vyayam")
    ) {
      spokenReply =
        lang === "hi" ? "व्यायाम शुरू कर रहे हैं" : "Starting wellness exercise";
    } else if (
      lower.includes("caregiver") ||
      lower.includes("call") ||
      lower.includes("help") ||
      lower.includes("madad")
    ) {
      spokenReply =
        lang === "hi" ? "केयरगिवर को कॉल कर रहे हैं" : "Connecting to caregiver";
    } else if (lower.includes("analysis") || lower.includes("progress")) {
      spokenReply =
        lang === "hi" ? "प्रगति रिपोर्ट खोल रहे हैं" : "Opening your progress report";
    } else if (lower.includes("home") || lower.includes("ghar")) {
      spokenReply = lang === "hi" ? "होम पेज पर जा रहे हैं" : "Going to home";
    }

    speakFeedback(spokenReply);

    setTimeout(() => {
      onCommandTrigger(commandText);
    }, 700);
  };

  // Start real browser speech recognition
  const startRealListening = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
      setMicError(
        "Speech recognition is not supported in this browser. You can type or tap commands below."
      );
      return;
    }

    try {
      hasExecutedRef.current = false;
      latestSpokenRef.current = "";
      setTranscript("");
      setMicError("");

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      // Initialize audio meter for visual volume confirmation
      setupAudioMeter();

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = langCodeMap[lang] || "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setMicError("");
      };

      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript + " ";
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const combined = (finalTranscript + interimTranscript).trim();
        if (combined) {
          setTranscript(combined);
          latestSpokenRef.current = combined;

          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // If a final result was recognized, or after a brief silence pause (1.1s), execute!
          if (finalTranscript.trim()) {
            silenceTimerRef.current = setTimeout(() => {
              executeCommand(latestSpokenRef.current);
            }, 600);
          } else {
            silenceTimerRef.current = setTimeout(() => {
              if (latestSpokenRef.current) {
                executeCommand(latestSpokenRef.current);
              }
            }, 1200);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition event error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setIsListening(false);
          cleanupAudioMeter();
          setMicError(
            "Microphone permission was not granted. Please allow microphone in browser, or tap any command below."
          );
        } else if (event.error === "network") {
          setIsListening(false);
          cleanupAudioMeter();
          setMicError("Network error on speech service. Please tap a command below.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        cleanupAudioMeter();

        // If user finished speaking and transcript exists, execute now
        if (latestSpokenRef.current && !hasExecutedRef.current) {
          executeCommand(latestSpokenRef.current);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Failed to start SpeechRecognition:", err);
      setIsListening(false);
      cleanupAudioMeter();
      setMicError(
        "Could not activate microphone. You can tap any action card or type below."
      );
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    cleanupAudioMeter();
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      executeCommand(manualInput.trim());
      setManualInput("");
    }
  };

  // When modal opens, initialize microphone listening
  useEffect(() => {
    if (isOpen) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicSupported(false);
      }
      setTranscript("");
      setLastRecognized("");
      setMicError("");
      setManualInput("");
      hasExecutedRef.current = false;
      latestSpokenRef.current = "";

      // Auto start listening on open
      const timer = setTimeout(() => {
        startRealListening();
      }, 300);

      return () => {
        clearTimeout(timer);
        stopListening();
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [isOpen, activeLang]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-assistant-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-[#001F54]/15 relative text-center max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
          aria-label="Close voice assistant"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Language Selection Pill */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Languages className="w-3.5 h-3.5 text-[#003580]" />
          <button
            onClick={() => {
              setActiveLang("en");
              stopListening();
              setTimeout(() => startRealListening(), 200);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLang === "en"
                ? "bg-[#001F54] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              setActiveLang("hi");
              stopListening();
              setTimeout(() => startRealListening(), 200);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeLang === "hi"
                ? "bg-[#001F54] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Central Animated Microphone Button */}
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-[#001F54] via-[#003580] to-[#0072B5] flex items-center justify-center text-white shadow-xl shadow-[#001F54]/30 mb-4 relative group">
          <button
            type="button"
            onClick={isListening ? stopListening : startRealListening}
            className="w-full h-full rounded-full flex items-center justify-center cursor-pointer relative"
            title={isListening ? "Listening... Click to pause" : "Click to speak"}
          >
            {isListening ? (
              <Mic className="w-11 h-11 text-white animate-bounce" />
            ) : (
              <Mic className="w-11 h-11 text-white" />
            )}

            {/* Pulsing Concentric Ripple Rings when listening */}
            {isListening && (
              <>
                <span
                  className="absolute inset-0 rounded-full border-4 border-[#00B8EB] animate-ping opacity-60"
                  style={{ animationDuration: "1.6s" }}
                />
                <span
                  className="absolute -inset-2 rounded-full border-2 border-[#9DF3C4] animate-pulse opacity-80"
                  style={{
                    transform: `scale(${1 + audioLevel * 0.003})`,
                    transition: "transform 0.1s ease-out"
                  }}
                />
              </>
            )}
          </button>
        </div>

        {/* Equalizer Sound Waves (Dynamic with Voice Input) */}
        {isListening && (
          <div className="flex items-center justify-center gap-1.5 h-6 mb-3">
            {[40, 80, 100, 70, 50, 90, 60].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-gradient-to-t from-[#003580] to-[#00B8EB] rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(15, Math.min(100, h * (0.3 + (audioLevel / 100) * 0.7)))}%`
                }}
              />
            ))}
          </div>
        )}

        <h3
          id="voice-assistant-title"
          className="text-2xl sm:text-3xl font-extrabold text-[#001F54] font-serif mb-1"
        >
          {t.voiceAssistant || "Voice Assistant"}
        </h3>

        {/* Live Mic Status Pill & Button */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <button
            onClick={isListening ? stopListening : startRealListening}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
              isListening
                ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isListening ? "bg-rose-500 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span>
              {isListening
                ? "Listening... Speak now"
                : "Microphone Ready • Click to Speak"}
            </span>
          </button>
        </div>

        {/* Live Heard Spoken Words */}
        {transcript && isListening && (
          <div className="p-3 mb-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-950 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping shrink-0" />
            <span className="truncate">Hearing: "{transcript}"</span>
          </div>
        )}

        {/* Successfully Recognized Command */}
        {lastRecognized && (
          <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Recognized: "{lastRecognized}"</span>
          </div>
        )}

        {/* Error / Permission Guidance */}
        {micError && (
          <div className="p-3 mb-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-start gap-2 text-left shadow-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{micError}</span>
              <div className="mt-1">
                <button
                  onClick={startRealListening}
                  className="font-bold underline text-amber-800 hover:text-amber-950 cursor-pointer"
                >
                  Retry Microphone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spoken AI Guidance Banner */}
        <div className="bg-gradient-to-r from-[#EFF6FF] via-[#F0FDF4] to-[#EFF6FF] rounded-2xl p-3.5 sm:p-4 border border-blue-200/60 mb-4 text-left flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#001F54] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Volume2 className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-[#003580] tracking-wider uppercase mb-0.5">
              Smriti-Saathi AI says:
            </p>
            <p className="text-xs sm:text-sm text-[#0F172A] font-medium leading-relaxed">
              "{t.voicePrompt || `Speak commands like 'Start game', 'Memory test', or 'Call caregiver'.`}"
            </p>
          </div>
        </div>

        {/* Quick Voice Command Buttons for Elderly Accessibility */}
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-left">
          {lang === "hi" ? "त्वरित आदेश (बोलें या टैप करें)" : "Quick Commands (Speak or Tap)"}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-left">
          <button
            onClick={() => executeCommand("Start the game")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-[#003580]/40 border border-slate-200 font-bold text-[#0F172A] transition text-xs active:scale-98 cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Play className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">"Start the game"</span>
          </button>

          <button
            onClick={() => executeCommand("Take memory test")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-[#003580]/40 border border-slate-200 font-bold text-[#0F172A] transition text-xs active:scale-98 cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Brain className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">"Take memory test"</span>
          </button>

          <button
            onClick={() => executeCommand("Start exercise")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-[#003580]/40 border border-slate-200 font-bold text-[#0F172A] transition text-xs active:scale-98 cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Activity className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">"Start exercise"</span>
          </button>

          <button
            onClick={() => executeCommand("Show my progress")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-[#003580]/40 border border-slate-200 font-bold text-[#0F172A] transition text-xs active:scale-98 cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">"Show my progress"</span>
          </button>

          <button
            onClick={() => executeCommand("Call caregiver")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 hover:border-rose-300 border border-rose-200 font-bold text-rose-800 transition text-xs active:scale-98 cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">"Call caregiver"</span>
          </button>

          <button
            onClick={() => executeCommand("Go to Home")}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-[#003580]/40 border border-slate-200 font-bold text-[#0F172A] transition text-xs active:scale-98 cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Home className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">"Go to Home"</span>
          </button>
        </div>

        {/* Manual Command Typing Input Fallback */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder={
              lang === "hi"
                ? "या आदेश लिखें (उदा. start game)..."
                : "Or type a command (e.g. start game, exercise)..."
            }
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003580] text-xs sm:text-sm text-slate-800"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#001F54] hover:bg-[#003580] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <span>Run</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

        {/* Bottom Actions */}
        <div className="flex gap-3">
          <button
            onClick={() =>
              speakFeedback(
                lang === "hi"
                  ? "नमस्ते! आप कह सकते हैं: खेल शुरू करो, टेस्ट लो, व्यायाम, या केयरगिवर को कॉल करो।"
                  : "Hello! You can say: Start game, Take memory test, Start exercise, or Call caregiver."
              )
            }
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#001F54]" />
            <span>Voice Help</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#001F54] to-[#0072B5] hover:from-[#001438] hover:to-[#0084CE] text-white font-bold text-xs transition shadow-md shadow-[#001F54]/25 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
