/**
 * hindiVoiceHelper.js — Centralized multilingual voice synthesis utility
 *
 * Provides a single `createLanguageAwareSpeaker` factory that returns a `speakText`
 * function configured for the current language. When Hindi (hi) is selected,
 * it explicitly selects a hi-IN voice, sets `utterance.lang = "hi-IN"`, and
 * uses a slower rate so that all matras (vowel signs like ा, ि, ी, ु, ू, े, ै, ो, ौ, ं, ः, ँ)
 * are read clearly and correctly.
 *
 * Usage in any component:
 *   import { createLanguageAwareSpeaker, getVoiceLang } from "../../utils/hindiVoiceHelper";
 *   const speakText = createLanguageAwareSpeaker(profile?.language);
 *   speakText("नमस्ते, आज हम स्मृति व्यायाम करेंगे।");
 */

/** BCP-47 language tag mapping for all supported languages */
const LANG_TO_BCP47 = {
  en: "en-US",
  hi: "hi-IN",
  as: "as-IN",
  bn: "bn-IN",
  mni: "mni-IN",   // Meitei Mayek — fallback to bn-IN if unavailable
  lus: "en-IN",    // Mizo — fallback to English India
};

/** Fallback chain: if primary BCP-47 voice not found, try these */
const LANG_FALLBACKS = {
  hi: ["hi-IN", "hi", "en-IN"],
  as: ["as-IN", "bn-IN", "hi-IN"],
  bn: ["bn-IN", "bn", "hi-IN"],
  mni: ["mni-IN", "bn-IN", "hi-IN"],
  lus: ["en-IN", "en-US"],
  en: ["en-US", "en-IN", "en-GB", "en"],
};

/** Module-scoped voice cache */
let _cachedVoices = null;
let _voicesListenerAttached = false;

/**
 * Load and cache available system voices.
 * Attaches a one-time "voiceschanged" listener for Chrome's async voice loading.
 */
function _ensureVoicesLoaded() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    _cachedVoices = voices;
  }

  if (!_voicesListenerAttached) {
    _voicesListenerAttached = true;
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      _cachedVoices = window.speechSynthesis.getVoices();
    });
  }

  return _cachedVoices || [];
}

/**
 * Find the best matching voice for a given language code.
 * Prefers voices with "Google" or "Microsoft" in the name for higher quality.
 *
 * @param {string} langCode - Language code: "hi", "en", "as", "bn", "mni", "lus"
 * @returns {SpeechSynthesisVoice|null}
 */
function _findBestVoice(langCode) {
  const voices = _ensureVoicesLoaded();
  if (!voices || voices.length === 0) return null;

  const fallbackChain = LANG_FALLBACKS[langCode] || LANG_FALLBACKS.en;

  for (const bcp47 of fallbackChain) {
    // 1. Try exact BCP-47 match with high-quality voice (Google/Microsoft)
    const premium = voices.find(
      (v) =>
        v.lang === bcp47 &&
        (v.name.includes("Google") || v.name.includes("Microsoft"))
    );
    if (premium) return premium;

    // 2. Exact BCP-47 match (any voice)
    const exact = voices.find((v) => v.lang === bcp47);
    if (exact) return exact;

    // 3. Prefix match (e.g., "hi" matches "hi-IN")
    const prefix = bcp47.split("-")[0];
    const prefixMatch = voices.find((v) => v.lang.startsWith(prefix));
    if (prefixMatch) return prefixMatch;
  }

  return null;
}

/**
 * Get the BCP-47 language tag for a given app language code.
 * @param {string} langCode
 * @returns {string}
 */
export function getVoiceLang(langCode) {
  return LANG_TO_BCP47[langCode] || "en-US";
}

/**
 * Strip emojis while preserving Indic scripts (Devanagari, Bengali, etc.)
 * @param {string} text
 * @returns {string}
 */
function _stripEmojis(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .replace(/[\uFE00-\uFEFF]/gu, "")
    .trim();
}

/**
 * Core speak function with full Hindi matra support.
 *
 * When Hindi is selected:
 * - Sets `utterance.lang = "hi-IN"` so the browser's TTS engine
 *   correctly processes Devanagari Unicode including all matras
 *   (ा ि ी ु ू ृ े ै ो ौ ं ः ँ ॅ ॉ)
 * - Selects a hi-IN voice (preferring Google Hindi / Microsoft Swara)
 * - Uses a slightly slower rate (0.85) for elderly comprehension
 *
 * @param {string} text - Text to speak (can be Hindi Devanagari or English)
 * @param {string} langCode - "hi", "en", "as", "bn", "mni", "lus"
 * @param {object} [options] - Optional overrides
 * @param {number} [options.rate] - Speech rate (default: 0.85 for Hindi, 0.9 for English)
 * @param {number} [options.pitch] - Speech pitch (default: 1.05)
 * @param {function} [options.onStart] - Callback when speech starts
 * @param {function} [options.onEnd] - Callback when speech ends
 * @param {function} [options.onError] - Callback on error
 */
export function speakWithLanguage(text, langCode = "en", options = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const cleaned = _stripEmojis(text);
  if (!cleaned) return;

  const bcp47 = getVoiceLang(langCode);
  const isHindi = langCode === "hi";

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = bcp47;
  utterance.rate = options.rate ?? (isHindi ? 0.82 : 0.9);
  utterance.pitch = options.pitch ?? 1.05;

  // Find and set the best available voice
  const bestVoice = _findBestVoice(langCode);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  // Attach callbacks
  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
}

/**
 * Factory: creates a language-aware `speakText` function bound to a specific language.
 * Drop-in replacement for existing `speakText` / `speakInstruction` functions.
 *
 * @param {string} langCode - "hi", "en", "as", "bn", "mni", "lus"
 * @param {object} [defaultOptions] - Default options for all calls
 * @returns {function} speakText(text, overrideOptions?)
 *
 * @example
 *   const speakText = createLanguageAwareSpeaker(profile?.language);
 *   speakText("आपकी स्मृति बहुत अच्छी है!");
 */
export function createLanguageAwareSpeaker(langCode = "en", defaultOptions = {}) {
  return (text, overrideOptions = {}) => {
    speakWithLanguage(text, langCode, { ...defaultOptions, ...overrideOptions });
  };
}

/**
 * Stop any ongoing speech synthesis.
 */
export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
