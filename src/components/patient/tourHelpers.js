/**
 * tourHelpers.js — Pure utility functions for TourDriver state management.
 * All functions are side-effect free except writeTourStorage and cleanURLParams.
 */

const PROGRESS_KEY = "sih_tour_progress";
const SKIPPED_KEY = "sih_tour_skipped";

// ─── Progress logic ────────────────────────────────────────────────────────────

/**
 * Returns the minimum step index (1–6) not in the progress array,
 * or null if all 6 steps are complete.
 *
 * @param {number[]} progress — completed step indices
 * @returns {number|null}
 */
export function findNextIncompleteStep(progress) {
  for (let i = 1; i <= 6; i++) {
    if (!progress.includes(i)) return i;
  }
  return null;
}

// ─── localStorage ──────────────────────────────────────────────────────────────

/**
 * Read both tour storage keys from localStorage.
 * Falls back to empty arrays on any error (malformed JSON, SecurityError, etc.).
 *
 * @returns {{ progress: number[], skipped: number[] }}
 */
export function readTourStorage() {
  let progress = [];
  let skipped = [];
  try {
    const rawProgress = localStorage.getItem(PROGRESS_KEY);
    if (rawProgress) {
      const parsed = JSON.parse(rawProgress);
      if (Array.isArray(parsed)) progress = parsed;
    }
  } catch (_) {
    // malformed JSON or SecurityError — use default []
  }
  try {
    const rawSkipped = localStorage.getItem(SKIPPED_KEY);
    if (rawSkipped) {
      const parsed = JSON.parse(rawSkipped);
      if (Array.isArray(parsed)) skipped = parsed;
    }
  } catch (_) {
    // malformed JSON or SecurityError — use default []
  }
  return { progress, skipped };
}

/**
 * Write both tour storage keys to localStorage.
 * Silently swallows SecurityError and QuotaExceededError.
 *
 * @param {number[]} progress
 * @param {number[]} skipped
 */
export function writeTourStorage(progress, skipped) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    localStorage.setItem(SKIPPED_KEY, JSON.stringify(skipped));
  } catch (_) {
    // SecurityError or QuotaExceededError — operate in-memory only
  }
}

// ─── URL params ────────────────────────────────────────────────────────────────

/**
 * Parse ?completed=N and ?skip=N from the current URL.
 *
 * @returns {{ completed: number|null, skip: number|null }}
 */
export function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const completedStr = params.get("completed");
  const skipStr = params.get("skip");
  return {
    completed: completedStr !== null ? parseInt(completedStr, 10) : null,
    skip: skipStr !== null ? parseInt(skipStr, 10) : null,
  };
}

/**
 * Strip ?completed and ?skip query params from the browser address bar
 * without triggering a navigation (history.replaceState).
 */
export function cleanURLParams() {
  const params = new URLSearchParams(window.location.search);
  params.delete("completed");
  params.delete("skip");
  const newSearch = params.toString() ? "?" + params.toString() : "";
  const newURL =
    window.location.pathname + newSearch + window.location.hash;
  history.replaceState(null, "", newURL);
}

// ─── DOM helpers ───────────────────────────────────────────────────────────────

/**
 * Remove .tour-highlight from all category cards.
 */
export function clearAllHighlights() {
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById("cat-" + i);
    if (el) {
      el.classList.remove("tour-highlight");
    }
  }
}

/**
 * Compute pixel position for the tooltip relative to a given step's card.
 * Prefers below the card; falls above if near the bottom of the viewport.
 * Horizontally centred and clamped within the viewport.
 *
 * @param {number} stepIndex 1–6
 * @returns {{ top: number, left: number }}
 */
export function positionTooltip(stepIndex) {
  const TOOLTIP_W = 320;
  const TOOLTIP_H = 240;
  const MARGIN = 12;
  const EDGE_GUARD = 8;

  const cardEl = document.getElementById("cat-" + stepIndex);
  if (!cardEl) return { top: 120, left: 16 };

  const rect = cardEl.getBoundingClientRect();
  const viewH = window.innerHeight;
  const viewW = window.innerWidth;
  const scrollY = window.scrollY || 0;

  // Vertical: prefer below, fall back to above
  let top;
  if (rect.bottom + TOOLTIP_H + MARGIN < viewH) {
    top = rect.bottom + MARGIN + scrollY;
  } else {
    top = rect.top - TOOLTIP_H - MARGIN + scrollY;
  }

  // Horizontal: centre on card, clamp inside viewport
  let left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
  left = Math.max(EDGE_GUARD, Math.min(left, viewW - TOOLTIP_W - EDGE_GUARD));

  return { top, left };
}
