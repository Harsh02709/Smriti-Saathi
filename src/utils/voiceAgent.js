/**
 * voiceAgent.js — W3C Web Speech API utility for the Guided Tour
 *
 * Exported functions:
 *   speakInstruction(text, lang)  — speak tour step text in the given language
 *   stopVoice()                   — cancel any in-progress speech
 *   stripEmojis(text)             — remove emoji, preserve Indic scripts
 */

/** BCP-47 language tag mapping */
const LANG_BCP47 = {
  hi: "hi-IN",
  en: "en-US",
  as: "as-IN",
  mni: "bn-IN",  // Meitei/Manipuri — closest available BCP-47 fallback
  nag: "en-IN",
};

/**
 * Module-scoped voice cache.
 * Populated on first call; refreshed via voiceschanged event in Chrome.
 */
let _voiceCache = null;
let _voicesChangedAttached = false;

function _loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    _voiceCache = voices;
  }
  if (!_voicesChangedAttached) {
    _voicesChangedAttached = true;
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      _voiceCache = window.speechSynthesis.getVoices();
    });
  }
}

/**
 * Remove emoji code points while preserving Indic Unicode ranges.
 *
 * Removed ranges:
 *   U+1F300–U+1FAFF  — Misc Symbols, Emoticons, Transport, Supplemental
 *   U+2600–U+27BF    — Misc Symbols, Dingbats
 *   U+2300–U+23FF    — Misc Technical
 *   U+FE00–U+FEFF    — Variation Selectors, Zero-Width No-Break Space
 *
 * Preserved: Devanagari (U+0900–U+097F), Bengali/Assamese (U+0980–U+09FF),
 *            Gurmukhi (U+0A00–U+0A7F), Gujarati (U+0A80–U+0AFF),
 *            Odia (U+0B00–U+0B7F), Telugu (U+0C00–U+0C7F),
 *            Kannada (U+0C80–U+0CFF), Malayalam (U+0D00–U+0D7F)
 *
 * @param {string} text
 * @returns {string}
 */
export function stripEmojis(text) {
  if (typeof text !== "string") return "";
  return text
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .replace(/[\uFE00-\uFEFF]/gu, "")
    .trim();
}

/**
 * Speak text using the W3C Web Speech API.
 * Always cancels any in-progress speech before starting a new utterance.
 * Falls back gracefully when speechSynthesis is unavailable.
 *
 * @param {string} text  — plain text to speak (may contain Indic scripts)
 * @param {string} lang  — language code: "hi" | "en" | "as" | "mni" | "nag"
 */
export function speakInstruction(text, lang) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // Always cancel previous utterance first
  window.speechSynthesis.cancel();

  const cleaned = stripEmojis(text);
  if (!cleaned) return;

  const bcp47 = LANG_BCP47[lang] || "en-US";
  const isHindi = lang === "hi" || bcp47 === "hi-IN";

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = bcp47;
  utterance.rate = isHindi ? 0.82 : 0.88;  // optimized slower cadence for Hindi matra clarity and elderly comprehension
  utterance.pitch = 1.05;

  // Lazy-load voice cache
  _loadVoices();

  if (_voiceCache && _voiceCache.length > 0) {
    // Prefer exact BCP-47 match with natural engine (Google / Microsoft), then exact match, then prefix match
    const preferred =
      _voiceCache.find((v) => v.lang === bcp47 && (v.name.includes("Google") || v.name.includes("Microsoft"))) ||
      _voiceCache.find((v) => v.lang === bcp47) ||
      _voiceCache.find((v) => v.lang.startsWith(bcp47.substring(0, 2))) ||
      null;
    if (preferred) {
      utterance.voice = preferred;
    }
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Cancel any in-progress speech synthesis utterance.
 * Safe to call when speechSynthesis is unavailable.
 */
export function stopVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
