/**
 * TourDriver.jsx — Guided Tour root orchestrator
 *
 * Renders a step-by-step onboarding tour over the 6 cognitive category cards
 * in PatientHome. All sub-components (TourOverlay, PendingPanel, CelebrationModal)
 * are rendered via ReactDOM.createPortal into document.body to avoid z-index issues.
 *
 * Props:
 *   language     {string}    — patient language code: "hi" | "en" | "as" | "mni" | "nag"
 *   onLaunchGame {function}  — (taskIndex: 1-6) => void  (optional)
 */

import { useEffect, useReducer, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Volume2, SkipForward, Play, X, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

import "./TourDriver.css";
import { TOUR_INSTRUCTIONS, TASK_NAMES } from "../../data/tourData";
import {
  findNextIncompleteStep,
  readTourStorage,
  writeTourStorage,
  parseURLParams,
  cleanURLParams,
  clearAllHighlights,
  positionTooltip,
} from "./tourHelpers";
import { speakInstruction, stopVoice } from "../../utils/voiceAgent";

// ─── State shape ────────────────────────────────────────────────────────────────
const initialState = {
  activeStep: null,       // number 1-6 | null
  progress: [],           // completed step indices
  skipped: [],            // skipped step indices
  visible: false,         // overlay visible
  showCelebration: false, // celebration modal visible
  tooltipStyle: { top: 120, left: 16 },
  panelOpen: true,        // pending panel open
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload };
    case "SET_TOOLTIP_STYLE":
      return { ...state, tooltipStyle: action.style };
    case "SET_VISIBLE":
      return { ...state, visible: action.visible };
    case "ADVANCE":
      return {
        ...state,
        activeStep: action.nextStep,
        progress: action.progress,
        skipped: action.skipped,
        visible: action.nextStep !== null,
        showCelebration: action.nextStep === null,
        panelOpen: true,
      };
    case "DISMISS_OVERLAY":
      return { ...state, visible: false };
    case "CLOSE_CELEBRATION":
      return { ...state, showCelebration: false };
    case "CLOSE_PANEL":
      return { ...state, panelOpen: false };
    case "REOPEN_PANEL":
      return { ...state, panelOpen: true };
    default:
      return state;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getInstruction(step, language) {
  const stepData = TOUR_INSTRUCTIONS[step];
  if (!stepData) return { title: "", desc: "" };
  return stepData[language] ?? stepData["en"] ?? { title: "", desc: "" };
}

// ─── TourDriver ─────────────────────────────────────────────────────────────────

export function TourDriver({ language = "en", onLaunchGame }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const resizeObserverRef = useRef(null);
  const speakTimerRef = useRef(null);

  // ── Mount: read storage, parse URL params, compute first step ──────────────
  useEffect(() => {
    const { progress, skipped } = readTourStorage();
    const { completed, skip } = parseURLParams();

    let updatedProgress = [...progress];
    let updatedSkipped = [...skipped];

    if (completed !== null && !isNaN(completed) && !updatedProgress.includes(completed)) {
      updatedProgress = [...updatedProgress, completed];
    }
    if (skip !== null && !isNaN(skip) && !updatedSkipped.includes(skip)) {
      updatedSkipped = [...updatedSkipped, skip];
    }

    cleanURLParams();
    writeTourStorage(updatedProgress, updatedSkipped);

    const nextStep = findNextIncompleteStep(updatedProgress);

    dispatch({
      type: "INIT",
      payload: {
        progress: updatedProgress,
        skipped: updatedSkipped,
        activeStep: nextStep,
        showCelebration: nextStep === null,
        visible: nextStep !== null,
      },
    });
  }, []);

  // ── Step change: highlight card, compute tooltip, speak ───────────────────
  useEffect(() => {
    if (!state.activeStep) return;

    clearAllHighlights();

    const cardEl = document.getElementById("cat-" + state.activeStep);
    if (cardEl) {
      cardEl.classList.add("tour-highlight");
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const style = positionTooltip(state.activeStep);
    dispatch({ type: "SET_TOOLTIP_STYLE", style });

    // Attach ResizeObserver to reposition on resize
    if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    const ro = new ResizeObserver(() => {
      const newStyle = positionTooltip(state.activeStep);
      dispatch({ type: "SET_TOOLTIP_STYLE", style: newStyle });
    });
    ro.observe(document.body);
    resizeObserverRef.current = ro;

    // Speak after 350 ms delay
    clearTimeout(speakTimerRef.current);
    if (state.visible) {
      const { title, desc } = getInstruction(state.activeStep, language);
      speakTimerRef.current = setTimeout(() => {
        speakInstruction(title + ". " + desc, language);
      }, 350);
    }

    return () => {
      clearTimeout(speakTimerRef.current);
    };
  }, [state.activeStep, state.visible, language]);

  // ── Celebration confetti ───────────────────────────────────────────────────
  useEffect(() => {
    if (!state.showCelebration) return;
    clearAllHighlights();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#0d9488", "#14b8a6", "#fbbf24", "#f472b6", "#60a5fa"],
    });
  }, [state.showCelebration]);

  // ── Unmount cleanup ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopVoice();
      clearTimeout(speakTimerRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      clearAllHighlights();
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = useCallback(
    (stepIndex) => {
      const newProgress = state.progress.includes(stepIndex)
        ? state.progress
        : [...state.progress, stepIndex];

      clearAllHighlights();
      stopVoice();

      writeTourStorage(newProgress, state.skipped);

      if (onLaunchGame) {
        dispatch({ type: "DISMISS_OVERLAY" });
        // Advance to next step on return
        const nextStep = findNextIncompleteStep(newProgress);
        dispatch({
          type: "ADVANCE",
          nextStep,
          progress: newProgress,
          skipped: state.skipped,
        });
        onLaunchGame(stepIndex);
      } else {
        // External navigation — page reloads with ?completed=N
        window.location.href =
          window.location.pathname + "?completed=" + stepIndex;
      }
    },
    [state.progress, state.skipped, onLaunchGame]
  );

  const handleSkip = useCallback(
    (stepIndex) => {
      const newSkipped = state.skipped.includes(stepIndex)
        ? state.skipped
        : [...state.skipped, stepIndex];

      const nextStep = findNextIncompleteStep(state.progress);
      // Move to next that isn't the current step
      let advanceTo = null;
      for (let i = 1; i <= 6; i++) {
        if (!state.progress.includes(i) && i !== stepIndex) {
          advanceTo = i;
          break;
        }
      }

      clearAllHighlights();
      stopVoice();
      writeTourStorage(state.progress, newSkipped);

      dispatch({
        type: "ADVANCE",
        nextStep: advanceTo,
        progress: state.progress,
        skipped: newSkipped,
      });
    },
    [state.progress, state.skipped]
  );

  const handleBackdropClick = useCallback(() => {
    stopVoice();
    dispatch({ type: "DISMISS_OVERLAY" });
  }, []);

  const handleVoiceBtn = useCallback(() => {
    if (!state.activeStep) return;
    const { title, desc } = getInstruction(state.activeStep, language);
    speakInstruction(title + ". " + desc, language);
  }, [state.activeStep, language]);

  const handleCloseCelebration = useCallback(() => {
    dispatch({ type: "CLOSE_CELEBRATION" });
  }, []);

  const handleClosePanel = useCallback(() => {
    dispatch({ type: "CLOSE_PANEL" });
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const pendingItems = state.skipped.filter(
    (n) => !state.progress.includes(n)
  );

  // Nothing to render if tour is fully done and no celebration
  if (
    !state.showCelebration &&
    !state.visible &&
    pendingItems.length === 0 &&
    state.activeStep === null
  ) {
    return null;
  }

  const currentInstruction = state.activeStep
    ? getInstruction(state.activeStep, language)
    : { title: "", desc: "" };

  const progressPct = state.activeStep
    ? Math.round(((state.activeStep - 1) / 6) * 100)
    : 100;

  // Language-aware labels
  const stepBadgeLabel = language === "hi" ? "चरण" : language === "as" ? "পদক্ষেপ" : "Step";
  const voiceBtnLabel  = language === "hi" ? "आवाज़ लें" : language === "as" ? "শুনক" : "Listen";
  const skipBtnLabel   = language === "hi" ? "छोड़ें" : language === "as" ? "এৰক" : "Skip";
  const startBtnLabel  = language === "hi" ? "शुरू करें" : language === "as" ? "আৰম্ভ কৰক" : "Start";

  // ── Render portals ────────────────────────────────────────────────────────

  return (
    <>
      {/* ── TourOverlay ──────────────────────────────────────────────── */}
      {state.visible &&
        createPortal(
          <div id="tourOverlay" className="tour-overlay" role="dialog" aria-modal="true" aria-label={`Tour step ${state.activeStep} of 6`}>
            {/* Backdrop */}
            <div
              id="tourBackdrop"
              className="tour-backdrop"
              onClick={handleBackdropClick}
              aria-label="Dismiss tour"
            />

            {/* Floating tooltip */}
            <div
              id="tourTooltip"
              className="tour-tooltip"
              style={{ top: state.tooltipStyle.top, left: state.tooltipStyle.left }}
            >
              {/* Top row: step badge + voice btn */}
              <div className="tour-tooltip__top-row">
                <span id="tourStepBadge" className="tour-tooltip__step-badge">
                  {stepBadgeLabel} {state.activeStep}
                </span>
                <button
                  id="tourVoiceBtn"
                  className="tour-voice-btn"
                  onClick={handleVoiceBtn}
                  title={voiceBtnLabel}
                  aria-label={voiceBtnLabel}
                >
                  <Volume2 size={14} />
                  <span>{voiceBtnLabel}</span>
                </button>
              </div>

              {/* Title */}
              <h3 id="tourTitle" className="tour-tooltip__title">
                🧠 {currentInstruction.title}
              </h3>

              {/* Description */}
              <p id="tourDesc" className="tour-tooltip__desc">
                {currentInstruction.desc}
              </p>

              {/* Progress row: "1/6" label + track */}
              <div id="tourProgress" className="tour-progress-row">
                <span className="tour-progress-label">{state.activeStep}/6</span>
                <div className="tour-progress-bar">
                  <div
                    id="tourProgressFill"
                    className="tour-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="tour-btn-row">
                <button
                  id="tourSkipBtn"
                  className="tour-skip-btn"
                  onClick={() => handleSkip(state.activeStep)}
                  aria-label={skipBtnLabel}
                >
                  <span>✕</span>
                  <span>{skipBtnLabel}</span>
                </button>
                <button
                  id="tourStartBtn"
                  className="tour-start-btn"
                  onClick={() => handleStart(state.activeStep)}
                  aria-label={startBtnLabel}
                >
                  <Play size={14} style={{ fill: "currentColor" }} />
                  <span id="tourStartText">{startBtnLabel}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── PendingPanel ─────────────────────────────────────────────── */}
      {pendingItems.length > 0 &&
        state.panelOpen &&
        createPortal(
          <div id="pendingPanel" className="pending-panel" role="complementary" aria-label="Skipped tasks">
            <div className="pending-panel__header">
              <span className="pending-panel__header-title">
                Skipped Tasks ({pendingItems.length})
              </span>
              <button
                id="pendingClose"
                className="pending-panel__close"
                onClick={handleClosePanel}
                aria-label="Close pending panel"
              >
                <X size={14} />
              </button>
            </div>
            <ul id="pendingList" className="pending-panel__list">
              {pendingItems.map((n) => (
                <li key={n} className="pending-panel__item">
                  <span className="pending-panel__item-name">
                    {TASK_NAMES[n]}
                  </span>
                  <button
                    className="pending-panel__item-link"
                    onClick={() => handleStart(n)}
                    aria-label={`Start ${TASK_NAMES[n]}`}
                  >
                    Start →
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}

      {/* ── CelebrationModal ─────────────────────────────────────────── */}
      {state.showCelebration &&
        createPortal(
          <div
            id="tourCelebration"
            className="tour-celebration"
            role="dialog"
            aria-modal="true"
            aria-label="Tour completed"
          >
            <div className="celebration-content">
              <div className="celebration-content__icon">🎉</div>
              <h2 className="celebration-content__title">
                All 6 Activities Done!
              </h2>
              <p className="celebration-content__desc">
                Wonderful work! You have explored all 6 cognitive training
                categories. Keep practising every day to stay sharp and healthy.
              </p>
              <button
                id="celebrationClose"
                className="celebration-close-btn"
                onClick={handleCloseCelebration}
                aria-label="Close celebration"
              >
                <PartyPopper size={16} />
                Continue
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default TourDriver;
