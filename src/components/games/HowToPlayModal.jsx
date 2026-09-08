import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Brain,
  Video,
  Info,
  Clock,
  RotateCcw
} from "lucide-react";

/**
 * Game guidance metadata for all cognitive & physical exercises.
 * Only 'memory_match' contains the videoUrl as requested.
 */
export const GAME_GUIDES = {
  memory_match: {
    title: "Match the Pairs",
    subtitle: "Memory Enhancement Cards",
    domain: "Working Memory & Focus",
    videoUrl: "/how-to-play-memory-match.mp4",
    videoFallback: "/20260906-1401-42.7501207.mp4",
    videoTitle: "Demonstration Video: How to Match the Pairs",
    steps: [
      {
        num: 1,
        title: "Tap Any Card",
        desc: "Tap on any card to flip it over and see the hidden picture.",
        icon: "👆"
      },
      {
        num: 2,
        title: "Find Its Match",
        desc: "Tap a second card. Try to find the card that has the exact same picture.",
        icon: "🔍"
      },
      {
        num: 3,
        title: "Keep Matched Pairs",
        desc: "If both cards match, they will stay face up in green! If they do not match, remember where they are.",
        icon: "✨"
      },
      {
        num: 4,
        title: "Clear the Board",
        desc: "Continue finding all pairs until all cards are matched. Take all the time you need!",
        icon: "🏆"
      }
    ],
    tips: [
      "There is no time limit — focus on one pair at a time.",
      "Say the name of the picture out loud (e.g., 'Apple', 'Taj Mahal') to help lock it into your memory."
    ],
    voiceEn: "Welcome to Match the Pairs! Tap any card to turn it over and reveal its picture. Then tap another card to find its matching pair. If both pictures match, they stay face up. If not, remember what was on them and try again. Take your time, there is no hurry!",
    voiceHi: "मैच द पेयर्स में आपका स्वागत है! किसी भी कार्ड पर टैप करके उसे पलटें और तस्वीर देखें। फिर उसका दूसरा साथी ढूंढने के लिए दूसरे कार्ड पर टैप करें। जब दोनों कार्ड मिल जाएंगे, वे खुले रहेंगे। धीरे-धीरे और आराम से खेलें!"
  },

  number: {
    title: "Number Recall",
    subtitle: "Working Memory & Digit Span",
    domain: "Short-Term Memory",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Observe the Numbers",
        desc: "Look carefully at the sequence of numbers shown on the screen.",
        icon: "👀"
      },
      {
        num: 2,
        title: "Remember the Order",
        desc: "Keep the digits in your mind as the countdown timer completes.",
        icon: "🧠"
      },
      {
        num: 3,
        title: "Tap the Keypad",
        desc: "Use the on-screen keypad to tap the digits in the exact same order.",
        icon: "🔢"
      },
      {
        num: 4,
        title: "Submit Answer",
        desc: "Tap Clear if you make a mistake, or Submit once all digits are entered.",
        icon: "✅"
      }
    ],
    tips: [
      "Repeat the numbers quietly to yourself as a rhythm (e.g., 'Four... Seven... Two')."
    ],
    voiceEn: "In Number Recall, watch the numbers displayed on screen carefully. Remember their exact order, and when they disappear, tap the numbers on the keypad in that same sequence.",
    voiceHi: "नंबर रिकॉल में, स्क्रीन पर दिखाए गए अंकों को ध्यान से देखें और याद रखें। फिर कीपैड पर उसी क्रम में नंबर दबाएं।"
  },

  picture: {
    title: "Picture & Scene Recall",
    subtitle: "Visual Memory & Scene Retention",
    domain: "Visual Cognition",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Study the Image",
        desc: "Spend a few moments exploring all details in the cultural photo.",
        icon: "🖼️"
      },
      {
        num: 2,
        title: "Notice Colors & Objects",
        desc: "Pay attention to who is in the picture and what items are present.",
        icon: "🔍"
      },
      {
        num: 3,
        title: "Answer the Question",
        desc: "When the question appears, tap the option that matches what you saw.",
        icon: "🎯"
      }
    ],
    tips: [
      "Look from left to right across the image to take in every small detail."
    ],
    voiceEn: "Look at the picture closely and take your time to remember the details. When the question appears, tap the correct answer that matches what you saw.",
    voiceHi: "तस्वीर को ध्यान से देखें और उसमें मौजूद चीजों को याद रखें। फिर पूछे गए सवाल का सही उत्तर चुनें।"
  },

  pattern: {
    title: "Pattern Recognition",
    subtitle: "Spatial Reasoning & Sequence Recall",
    domain: "Visual Spatial Memory",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Watch the Pattern",
        desc: "A group of tiles will illuminate in a specific arrangement.",
        icon: "💡"
      },
      {
        num: 2,
        title: "Memorize the Layout",
        desc: "Remember which tiles were highlighted before they fade.",
        icon: "🧩"
      },
      {
        num: 3,
        title: "Tap the Matching Tiles",
        desc: "Tap the tiles on the board to recreate the highlighted pattern.",
        icon: "👆"
      }
    ],
    tips: [
      "Try to see the pattern as a familiar shape like a letter or triangle."
    ],
    voiceEn: "Watch which blocks light up in the pattern. After they turn off, tap the exact same blocks to complete the pattern.",
    voiceHi: "पैटर्न में चमकने वाले खानों को ध्यान से देखें। फिर उन्हीं खानों पर टैप करके पैटर्न बनाएं।"
  },

  sound: {
    title: "Sound Association",
    subtitle: "Auditory Perception & Association",
    domain: "Auditory Memory",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Play the Sound",
        desc: "Tap the speaker icon to listen to the natural sound clip.",
        icon: "🔊"
      },
      {
        num: 2,
        title: "Identify the Source",
        desc: "Think about what object, animal, or weather makes that sound.",
        icon: "🌧️"
      },
      {
        num: 3,
        title: "Select Matching Picture",
        desc: "Tap the picture on screen that corresponds to what you heard.",
        icon: "👉"
      }
    ],
    tips: [
      "You can replay the sound as many times as you like by tapping the speaker button."
    ],
    voiceEn: "Listen to the sound by tapping the play button, then choose the picture that matches what you hear.",
    voiceHi: "आवाज सुनने के लिए स्पीकर बटन दबाएं, फिर सही तस्वीर पर टैप करें जो उस आवाज से मेल खाती है।"
  },

  puzzle: {
    title: "Shape & Jigsaw Puzzle",
    subtitle: "Spatial Alignment & Motor Coordination",
    domain: "Visuospatial Coordination",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Examine the Pieces",
        desc: "Look at the scrambled tiles and the target outline.",
        icon: "🧩"
      },
      {
        num: 2,
        title: "Tap to Place",
        desc: "Tap on a piece, then tap its proper spot on the puzzle frame.",
        icon: "🎯"
      },
      {
        num: 3,
        title: "Complete the Picture",
        desc: "Place all pieces correctly to reveal the full image.",
        icon: "🌟"
      }
    ],
    tips: [
      "Start by placing the corners and edges first."
    ],
    voiceEn: "Tap the puzzle pieces to move them into the correct spots and complete the picture.",
    voiceHi: "टुकड़ों पर टैप करके उन्हें सही स्थान पर लगाएं और पूरी तस्वीर बनाएं।"
  },

  find_object: {
    title: "Find the Object",
    subtitle: "Visual Search & Selective Attention",
    domain: "Selective Focus",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Read the Target Item",
        desc: "Check the object prompt at the top of the screen.",
        icon: "🔎"
      },
      {
        num: 2,
        title: "Scan the Grid",
        desc: "Look through the displayed items to locate the matching object.",
        icon: "👀"
      },
      {
        num: 3,
        title: "Tap to Confirm",
        desc: "Tap on the object once you spot it.",
        icon: "🎯"
      }
    ],
    tips: [
      "Scan smoothly row by row rather than looking randomly."
    ],
    voiceEn: "Find the requested item on the screen and tap on it.",
    voiceHi: "पूछी गई वस्तु को स्क्रीन पर ढूंढें और उस पर टैप करें।"
  },

  color_shape: {
    title: "Color & Shape Match",
    subtitle: "Categorization & Cognitive Flexibility",
    domain: "Executive Function",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Look at the Target",
        desc: "Check the shape and color shown in the center prompt.",
        icon: "🎨"
      },
      {
        num: 2,
        title: "Find the Match",
        desc: "Choose the card below that matches the requested rule (color or shape).",
        icon: "🔷"
      },
      {
        num: 3,
        title: "Tap Your Answer",
        desc: "Tap the card to submit your choice.",
        icon: "✨"
      }
    ],
    tips: [
      "Check whether the prompt asks for the Color or the Shape before tapping."
    ],
    voiceEn: "Look at the prompt and tap the matching color or shape.",
    voiceHi: "निर्देश देखें और सही रंग या आकार वाले विकल्प पर टैप करें।"
  },

  routine: {
    title: "Daily Routine Sequencing",
    subtitle: "Functional Memory & Daily Independence",
    domain: "Everyday Memory",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Review the Activity",
        desc: "Read the daily task (like making morning tea or preparing for a walk).",
        icon: "📋"
      },
      {
        num: 2,
        title: "Order the Steps",
        desc: "Tap the steps in the order that they should naturally happen from start to finish.",
        icon: "🔢"
      },
      {
        num: 3,
        title: "Complete the Sequence",
        desc: "Arrange all steps to reinforce functional daily memory.",
        icon: "🎉"
      }
    ],
    tips: [
      "Think about how you do this activity in your own home each day."
    ],
    voiceEn: "Arrange the daily activity steps in the correct order from start to finish.",
    voiceHi: "दैनिक क्रिया के चरणों को शुरुआत से अंत तक सही क्रम में व्यवस्थित करें।"
  },

  place: {
    title: "Familiar Places & Heritage Recall",
    subtitle: "Long-Term Reminiscence & Semantic Memory",
    domain: "Reminiscence Therapy",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "View the Landmark",
        desc: "Look at the famous monument or traditional heritage location.",
        icon: "🏛️"
      },
      {
        num: 2,
        title: "Recall Its Name",
        desc: "Connect the visual to your memories and knowledge of India's heritage.",
        icon: "💭"
      },
      {
        num: 3,
        title: "Tap the Correct Location",
        desc: "Tap the matching location name from the options.",
        icon: "📍"
      }
    ],
    tips: [
      "Think of famous cities and personal travels connected to the monument."
    ],
    voiceEn: "Identify the landmark shown in the picture and tap the correct location.",
    voiceHi: "तस्वीर में दिखाए गए प्रसिद्ध स्थान को पहचानें और सही विकल्प चुनें।"
  },

  story: {
    title: "Cultural Story Recall",
    subtitle: "Auditory & Narrative Memory",
    domain: "Verbal Retention",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Read or Listen to the Story",
        desc: "Enjoy the short cultural narrative or folklore tale.",
        icon: "📖"
      },
      {
        num: 2,
        title: "Recall Key Events",
        desc: "Remember the characters, actions, and moral of the story.",
        icon: "🧠"
      },
      {
        num: 3,
        title: "Answer the Question",
        desc: "Select the correct answer based on what happened in the story.",
        icon: "✨"
      }
    ],
    tips: [
      "Picture the characters and scenes like a movie in your mind."
    ],
    voiceEn: "Listen to or read the short story, then choose the correct answer to the question.",
    voiceHi: "कहानी को ध्यान से सुनें या पढ़ें, फिर सवाल का सही उत्तर चुनें।"
  },

  stretch: {
    title: "Gentle Morning Stretch",
    subtitle: "Chair Yoga & Mindful Mobility",
    domain: "Physical Vitality",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Sit Comfortably",
        desc: "Ensure your back is supported and feet are flat on the floor.",
        icon: "🪑"
      },
      {
        num: 2,
        title: "Follow the Gentle Motion",
        desc: "Gently stretch your arms, shoulders, and neck as guided on screen.",
        icon: "🧘"
      },
      {
        num: 3,
        title: "Breathe Deeply",
        desc: "Inhale slowly through your nose and exhale through your mouth.",
        icon: "🌬️"
      }
    ],
    tips: [
      "Never push into pain — stay within your gentle comfort zone."
    ],
    voiceEn: "Sit comfortably, follow the gentle movement on screen, and breathe calmly at your own pace.",
    voiceHi: "आराम से बैठें, स्क्रीन पर दिखाए गए सरल व्यायाम को दोहराएं और गहरी सांस लें।"
  },

  meditation: {
    title: "Mindful Breathing Meditation",
    subtitle: "Stress Reduction & Mental Clarity",
    domain: "Emotional Wellness",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Find a Quiet Posture",
        desc: "Sit tall with relaxed shoulders and rest your hands on your lap.",
        icon: "🌿"
      },
      {
        num: 2,
        title: "Watch the Breath Circle",
        desc: "Breathe in as the circle expands, hold gently, and breathe out as it contracts.",
        icon: "⭕"
      },
      {
        num: 3,
        title: "Feel Calm & Centered",
        desc: "Let thoughts pass like clouds and enjoy the peaceful rhythm.",
        icon: "🌸"
      }
    ],
    tips: [
      "Close your eyes lightly if you prefer to listen to the soft ambient chime."
    ],
    voiceEn: "Relax your body and follow the breathing circle. Inhale as it grows, and exhale as it shrinks.",
    voiceHi: "अपने शरीर को शिथिल करें। घेरा बड़ा होने पर सांस अंदर लें, और छोटा होने पर बाहर छोड़ें।"
  },

  crossword: {
    title: "Mini Crossword Puzzle",
    subtitle: "Word Finding & Semantic Recall",
    domain: "Language & Vocabulary",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Read the Clue",
        desc: "Check the clue at the bottom or top of the grid.",
        icon: "💡"
      },
      {
        num: 2,
        title: "Select Letters",
        desc: "Tap letter tiles to fill in the crossword boxes.",
        icon: "🔤"
      },
      {
        num: 3,
        title: "Complete the Word",
        desc: "Finish the row to test your vocabulary retention.",
        icon: "🏆"
      }
    ],
    tips: [
      "Look at how many letters are needed in the word to narrow down options."
    ],
    voiceEn: "Read the word clue, then tap the letters to fill in the missing word.",
    voiceHi: "संकेत पढ़ें और छूटे हुए अक्षरों को भरकर शब्द पूरा करें।"
  },

  sudoku: {
    title: "Gentle Mini Sudoku",
    subtitle: "Logical Reasoning & Working Memory",
    domain: "Executive Function",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Inspect the Grid",
        desc: "Look at the numbers already filled into the 4x4 grid.",
        icon: "🔢"
      },
      {
        num: 2,
        title: "Find Missing Digits",
        desc: "Each row, column, and 2x2 box must have digits 1 to 4 with no duplicates.",
        icon: "🔍"
      },
      {
        num: 3,
        title: "Tap to Place",
        desc: "Tap an empty square, then choose the missing number.",
        icon: "✅"
      }
    ],
    tips: [
      "Find rows or columns that already have 3 out of 4 numbers filled."
    ],
    voiceEn: "Fill each empty cell so that every row and box has numbers 1 through 4 without repeating.",
    voiceHi: "खाली खानों को भरें ताकि हर पंक्ति में 1 से 4 तक के अंक बिना दोहराए आएं।"
  },

  art_gallery: {
    title: "Memory Art Gallery",
    subtitle: "Art Appreciation & Memory Stimulation",
    domain: "Creative Reminiscence",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Explore the Artwork",
        desc: "Browse through timeless cultural masterpieces and portraits.",
        icon: "🎨"
      },
      {
        num: 2,
        title: "Reflect & Connect",
        desc: "Read the background stories and connect with nostalgic themes.",
        icon: "✨"
      }
    ],
    tips: [
      "Notice the colors, brushstrokes, and feeling conveyed by each painting."
    ],
    voiceEn: "Explore the paintings in the art gallery and enjoy the peaceful cultural memories.",
    voiceHi: "कला दीर्घा में चित्रों को देखें और सुखद यादों का आनंद लें।"
  },

  physical_memory: {
    title: "Physical Movement & Memory",
    subtitle: "Mind-Body Coordination & Motor Memory",
    domain: "Motor Coordination",
    videoUrl: null,
    steps: [
      {
        num: 1,
        title: "Watch the Instructor",
        desc: "Observe the physical movement sequence demonstrated on screen.",
        icon: "👀"
      },
      {
        num: 2,
        title: "Perform the Gesture",
        desc: "Repeat the movement gently with your hands or body.",
        icon: "✋"
      },
      {
        num: 3,
        title: "Camera Verification (Optional)",
        desc: "If camera is enabled, AI verifies your movement automatically.",
        icon: "📷"
      }
    ],
    tips: [
      "Always stay seated comfortably and move at your own natural pace."
    ],
    voiceEn: "Follow the instructor on screen, repeat the gentle movement, and move at your own comfortable pace.",
    voiceHi: "स्क्रीन पर दिखाए गए व्यायाम को देखें, आराम से बैठें और अपनी गति से अभ्यास करें।"
  }
};

/**
 * HowToPlayModal Component
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close callback
 * @param {string} gameType - Key into GAME_GUIDES (e.g. 'memory_match', 'number', etc.)
 * @param {object} profile - User profile with language preferences
 * @param {boolean} isAutoTriggered - Whether triggered by 30s inactivity
 * @param {function} onSpeak - Optional custom speech callback
 */
export const HowToPlayModal = ({
  isOpen,
  onClose,
  gameType = "memory_match",
  profile = {},
  isAutoTriggered = false,
  onSpeak
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const guide = GAME_GUIDES[gameType] || GAME_GUIDES.memory_match;
  const lang = profile?.language || "en";
  const isHindi = lang === "hi";

  // Speech helper
  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = isHindi
      ? guide.voiceHi || guide.voiceEn
      : guide.voiceEn;

    const utt = new SpeechSynthesisUtterance(textToSpeak);
    utt.lang = isHindi ? "hi-IN" : "en-US";
    utt.rate = isHindi ? 0.82 : 0.86;
    utt.pitch = 1.05;

    // Load available voices
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const targetLang = isHindi ? "hi-IN" : "en-US";
      const voice =
        voices.find((v) => v.lang === targetLang && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
        voices.find((v) => v.lang === targetLang) ||
        voices.find((v) => v.lang.startsWith(targetLang.substring(0, 2)));
      if (voice) utt.voice = voice;
    }

    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utt);
  };

  // Auto-speak voice instructions if opened via 30s inactivity
  useEffect(() => {
    if (isOpen && isAutoTriggered) {
      const timer = setTimeout(() => {
        handleSpeak();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAutoTriggered, gameType]);

  const prevIsOpenRef = useRef(false);

  // Clean up speech and video only when closing the modal
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  if (!isOpen) return null;

  const hasVideo = Boolean(guide.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[25000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
    >
      <div className="bg-gradient-to-b from-white via-[#F8FCFB] to-[#F1F9F8] border-2 border-[#0D7377]/30 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col my-auto transition-all">
        
        {/* Top Header Banner */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-b border-teal-100 flex items-center justify-between rounded-t-3xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D7377] shadow-xs">
              <Lightbulb className="w-6 h-6 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-teal-100/70 text-[#0D7377] px-2.5 py-0.5 rounded-full border border-teal-200">
                  {guide.domain}
                </span>
                {hasVideo && (
                  <span className="text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video Demo Included
                  </span>
                )}
              </div>
              <h2
                id="how-to-play-title"
                className="text-lg sm:text-2xl font-black text-[#132A2F] leading-tight mt-0.5"
              >
                How to Play: {guide.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition cursor-pointer border border-slate-200 hover:border-rose-200"
            aria-label="Close how to play guide"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 flex-1">
          
          {/* Inactivity Alert Notification if auto-triggered */}
          {isAutoTriggered && (
            <div className="bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-emerald-500/15 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-4.5 flex items-start gap-3.5 shadow-sm animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs font-black text-lg">
                💡
              </div>
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-black text-amber-950">
                  {isHindi
                    ? "नमस्ते! क्या आपको सहायता चाहिए? हमने देखा कि आप 30 सेकंड से शांत हैं।"
                    : "Need a quick hand? Smriti Saathi noticed you haven't made a move for 30s."}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-medium">
                  {isHindi
                    ? "चिंता न करें! नीचे दिए गए चरणों और वीडियो को देखकर आप आसानी से खेल सकते हैं।"
                    : "No worries! Review the simple steps below or listen to the voice guide to play smoothly."}
                </p>
              </div>
            </div>
          )}

          {/* Voice Assistant Audio Trigger Bar */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-teal-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSpeaking ? "bg-teal-600 text-white animate-bounce" : "bg-teal-50 text-[#0D7377] border border-teal-200"}`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-[#132A2F]">
                  {isSpeaking ? "Voice Agent is speaking..." : "Voice Guide & Audio Assistance"}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {isSpeaking
                    ? "Listening to voice narration. Tap to stop."
                    : isHindi
                    ? "आवाज में सुनने के लिए 'आवाज सुनें' बटन दबाएं।"
                    : "Tap to listen to the guided instructions spoken aloud."}
                </p>
              </div>
            </div>

            <button
              onClick={handleSpeak}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0 ${
                isSpeaking
                  ? "bg-rose-500 hover:bg-rose-600 text-white"
                  : "bg-[#0D7377] hover:bg-[#095255] text-white"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" /> Stop Voice
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> {isHindi ? "आवाज सुनें 🔊" : "Listen Guide 🔊"}
                </>
              )}
            </button>
          </div>

          {/* VIDEO DEMONSTRATION (Rendered exclusively for Match the Pairs / Memory Match) */}
          {hasVideo && (
            <div className="bg-slate-900 rounded-3xl p-3 sm:p-4 border-2 border-indigo-300 shadow-lg text-white space-y-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-teal-400" />
                    {guide.videoTitle}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  Tutorial Video (.mp4)
                </span>
              </div>

              {/* Video Player */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10 shadow-inner">
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                  onError={() => {
                    if (!videoError) {
                      setVideoError(true);
                      if (videoRef.current && guide.videoFallback) {
                        videoRef.current.src = guide.videoFallback;
                        videoRef.current.load();
                      }
                    }
                  }}
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                >
                  <source src={guide.videoUrl} type="video/mp4" />
                  {guide.videoFallback && (
                    <source src={guide.videoFallback} type="video/mp4" />
                  )}
                  Your browser does not support HTML5 video.
                </video>
              </div>

              <p className="text-xs text-slate-300 px-2 text-center">
                🎥 Watch this video to see how cards are flipped and matched step-by-step.
              </p>
            </div>
          )}

          {/* STEP BY STEP INSTRUCTIONS */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black text-[#132A2F] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              Easy Step-by-Step Instructions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.steps.map((step) => (
                <div
                  key={step.num}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#0D7377] font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-black text-sm text-[#132A2F]">
                      <span>{step.icon}</span>
                      <span>{step.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HELPFUL TIPS */}
          {guide.tips && guide.tips.length > 0 && (
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Helpful Tips for Maximum Benefit</span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-xs sm:text-sm text-amber-950 font-medium">
                {guide.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-7 py-4 border-t border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
          <button
            onClick={handleSpeak}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {isSpeaking ? "Stop Voice Guide" : "Replay Voice Guide"}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-[#0D7377] to-teal-700 hover:from-[#095255] hover:to-teal-800 text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            {isHindi ? "समझ आ गया, खेलें! 🚀" : "Got It, Let's Play! 🚀"}
          </button>
        </div>

      </div>
    </div>
  );
};
