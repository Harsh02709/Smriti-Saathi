# Implementation Plan: Guided Tour Driver + Voice Agent

## Overview

Implement the guided tour onboarding system as a self-contained `TourDriver` React component with multilingual TTS voice support. The implementation uses plain JSX (matching the project's existing `.jsx` convention), the W3C Web Speech API, `localStorage` for persistence, `canvas-confetti` for the celebration, and `lucide-react` for icons — all already present in the project. No new npm packages are required.

---

## Tasks

- [x] 1. Create `tourData.js` — static tour instruction data
  - Create `src/data/tourData.js` exporting:
    - `TOUR_INSTRUCTIONS`: an object keyed 1–6, each value being an object keyed by language code (`en`, `hi`, `as`, `mni`, `nag`) with `{ title, desc }` entries. English must be present for all 6 steps as the mandatory fallback.
    - `TASK_NAMES`: an array of display names for steps 1–6 (used by PendingPanel).
    - `TASK_GAME_MAP`: the mapping `{ 1: "memory", 2: "attention", 3: "daily_routine", 4: "pattern", 5: "object", 6: "emotional" }`.
  - Populate Hindi (`hi`) and English (`en`) entries for all 6 steps using the category descriptions from `translations.js` (`cat["1t"]`/`cat["1d"]` … `cat["6t"]`/`cat["6d"]`).
  - Add placeholder Assamese, Manipuri, and Nagamese entries that fall back to the English text (to be localised later).
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2. Create `voiceAgent.js` — Web Speech API utility
  - [x] 2.1 Create `src/utils/voiceAgent.js` with three exported functions:
    - `speakInstruction(text, lang)`: cancels any current speech, strips emoji, maps `lang` to BCP-47 (`hi`→`hi-IN`, `en`→`en-US`, `as`→`as-IN`, `mni`→`bn-IN`, `nag`→`en-IN`), selects the best matching voice, sets `rate=0.88` and `pitch=1.0`, and calls `speechSynthesis.speak(utterance)`. If `window.speechSynthesis` is undefined the function is a no-op.
    - `stopVoice()`: calls `window.speechSynthesis.cancel()` if available.
    - `stripEmojis(text)`: removes Unicode emoji ranges (U+1F300–U+1FAFF, U+2600–U+27BF, U+2300–U+23FF, U+FE00–U+FEFF) while preserving Devanagari (U+0900–U+097F), Bengali/Assamese (U+0980–U+09FF), and other Indic script ranges.
    - Cache the voice list in module scope; attach a `voiceschanged` listener on first call to repopulate the cache when Chrome loads voices asynchronously.
  - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 4.4, 4.5_

  - [ ]* 2.2 Write unit tests for `voiceAgent.js`
    - Test `stripEmojis`: emoji-only string returns `""`, mixed emoji + Devanagari preserves Devanagari, pure ASCII is unchanged.
    - Test `speakInstruction` no-op: when `window.speechSynthesis` is mocked as `undefined`, calling the function does not throw.
    - Test BCP-47 mapping: `hi` maps to `hi-IN`, unknown code maps to `en-US`.
    - _Requirements: 3.4, 3.5, 4.4, 4.5_

  - [ ]* 2.3 Write property test for `stripEmojis`
    - **Property 2: Emoji Stripping Preserves Indic Scripts**
    - For any arbitrary string, the output length ≤ input length and all Indic Unicode characters present in the input are present in the output.
    - Use `fast-check` with `fc.string()` and string generators containing mixed emoji/Indic characters.
    - **Validates: Requirements 3.4**

- [x] 3. Implement `findNextIncompleteStep` and core state helpers
  - [x] 3.1 Create `src/components/patient/tourHelpers.js` exporting:
    - `findNextIncompleteStep(progress)`: returns the minimum integer in {1..6} not in `progress`, or `null` if all 6 are present.
    - `readTourStorage()`: reads and JSON-parses `sih_tour_progress` and `sih_tour_skipped` with try/catch, returning `{ progress: [], skipped: [] }` on any error.
    - `writeTourStorage(progress, skipped)`: JSON-stringifies and writes both keys with try/catch that silently swallows `SecurityError`/`QuotaExceededError`.
    - `parseURLParams()`: reads `window.location.search` and returns `{ completed: number|null, skip: number|null }` from `?completed=N` / `?skip=N`.
    - `cleanURLParams()`: calls `history.replaceState` to strip all tour-related query params from the address bar.
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_

  - [ ]* 3.2 Write property test for `findNextIncompleteStep`
    - **Property 1: Progress Completeness**
    - For any subset of {1..6} as `progress`, the function returns `null` if and only if all 6 are present; otherwise returns the minimum absent index.
    - Use `fast-check` with `fc.subarray([1,2,3,4,5,6])`.
    - **Validates: Requirements 1.1, 7.1**

- [x] 4. Create `TourDriver.css` — isolated tour styles
  - Create `src/components/patient/TourDriver.css` with all tour-specific styles:
    - Overlay: `.tour-overlay` (fixed full-screen, pointer-events none), `.tour-backdrop` (rgba(0,0,0,0.45) background, pointer-events auto), `.tour-tooltip` (white card, absolute, z-index 10001, box-shadow).
    - Tooltip internals: `.tour-tooltip__top-row`, `.tour-tooltip__step-badge`, `.tour-voice-btn`, `.tour-progress-bar`, `.tour-progress-fill`.
    - Action buttons: `.tour-skip-btn`, `.tour-start-btn`.
    - Keyframes: `@keyframes tourCardGlow` (pulsing teal glow) and `@keyframes tourTooltipBtnPulse` (scale + glow pulse on start button).
    - Card state classes: `.tour-highlight` (teal glow border animation), `.cat-card--completed` + `.cat-card__done-badge` (green overlay + ✓ badge), `.cat-card--skipped` + `.cat-card__skip-badge` (amber overlay + ↩ badge).
    - Pending panel: `.pending-panel` (fixed bottom-right, z-index 9999), `.pending-panel__header`, `.pending-panel__item`.
    - Celebration modal: `.tour-celebration` (fixed inset, z-index 10002), `.celebration-content`.
  - No class name in this file may match or override any class used in `PatientHome.jsx` or `index.css`.
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 5. Implement `TourOverlay` sub-component (inline in TourDriver)
  - [x] 5.1 Implement `positionTooltip(stepIndex)` inside TourDriver:
    - Look up `document.getElementById("cat-" + stepIndex)`.
    - If null, return `{ top: 120, left: 16 }`.
    - Otherwise compute `top` (below card, or above if too close to bottom edge) and `left` (centred on card, clamped so `left ≥ 8` and `left + 300 ≤ viewportWidth − 8`).
  - Render the TourOverlay JSX using the DOM IDs: `#tourOverlay`, `#tourBackdrop`, `#tourTooltip`, `#tourStepBadge`, `#tourVoiceBtn`, `#tourTitle`, `#tourDesc`, `#tourProgress`, `#tourProgressFill`, `#tourSkipBtn`, `#tourStartBtn`.
  - Attach a `ResizeObserver` on mount to recompute tooltip position on viewport resize; disconnect on unmount.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 5.2 Write unit tests for `positionTooltip`
    - Card near bottom of viewport → tooltip placed above card.
    - Card near top → tooltip placed below.
    - Card whose centred position would overflow right edge → `left` is clamped to `viewportWidth − 308`.
    - `getElementById` returns null → returns `{ top: 120, left: 16 }`.
    - _Requirements: 5.3, 5.4, 5.5_

  - [ ]* 5.3 Write property test for `positionTooltip`
    - **Property 3: Tooltip Viewport Containment**
    - For any viewport width W and any card bounding rect, the returned `left` satisfies `left ≥ 8` and `left + 300 ≤ W − 8`.
    - Use `fast-check` with `fc.integer` for viewport widths and card rects.
    - **Validates: Requirements 5.4**

- [x] 6. Implement `PendingPanel` sub-component (inline in TourDriver)
  - Render the fixed bottom-right panel using DOM IDs `#pendingPanel`, `#pendingList`, `#pendingClose`.
  - Show the panel only when `skipped.filter(n => !progress.includes(n)).length > 0`.
  - List each skipped-not-completed step by name (from `TASK_NAMES`) with a Start link that calls `handleStart(n)`.
  - Wire the close button to a local `panelOpen` flag.
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 6.1 Write property test for PendingPanel item set
    - **Property 7: PendingPanel Reflects Skipped-Not-Completed Set**
    - For any `progress` and `skipped` arrays, the items rendered in PendingPanel equal exactly `skipped.filter(n => !progress.includes(n))`.
    - Use `fast-check` to generate arbitrary subsets of {1..6} for both arrays.
    - **Validates: Requirements 6.1, 6.2**

- [x] 7. Implement `CelebrationModal` sub-component (inline in TourDriver)
  - Render the full-screen modal using DOM IDs `#tourCelebration`, `#celebrationClose`.
  - On modal mount, fire a `canvas-confetti` burst using the existing `canvas-confetti` package.
  - Wire the close button to set `showCelebration: false` in TourDriver state, causing TourDriver to return null.
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 8. Implement `TourDriver.jsx` — root orchestrator
  - [x] 8.1 Create `src/components/patient/TourDriver.jsx`:
    - Accept props `{ language, onLaunchGame }`.
    - On mount: call `readTourStorage()`, call `parseURLParams()`, update storage if params found, call `cleanURLParams()`, compute `nextStep` via `findNextIncompleteStep`.
    - Maintain React state: `{ activeStep, progress, skipped, visible, showCelebration, tooltipStyle, panelOpen }`.
    - Implement `handleStart(n)`: remove `.tour-highlight`, dismiss overlay, call `onLaunchGame(n)` or navigate to `TASK_URLS[n]` with `?completed=n`.
    - Implement `handleSkip(n)`: add n to skipped, persist, advance to next step via `findNextIncompleteStep`, update PendingPanel; call `advanceToStep`.
    - Implement `handleBackdropClick`: set `visible: false` without touching progress or skipped.
    - Implement `handleVoiceBtn`: call `speakInstruction(title + " " + desc, language)` for the current step.
    - On `activeStep` change: add `.tour-highlight` to the new card, remove it from all others, scroll into view, compute `tooltipStyle`, set `visible: true`, and call `speakInstruction` after a 350 ms delay.
    - On unmount: call `stopVoice()` and disconnect `ResizeObserver`.
    - Use `ReactDOM.createPortal` for TourOverlay, PendingPanel, and CelebrationModal (all render into `document.body`).
    - Return `null` when `showCelebration: false` and all steps are completed.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.3, 3.8, 8.3, 8.4_

  - [ ]* 8.2 Write integration test for TourDriver — skip flow
    - Mount TourDriver in jsdom with mocked `#cat-1` … `#cat-6` elements and `localStorage`.
    - Simulate clicking Skip on step 1 → verify `sih_tour_skipped` is `[1]`, tour advances to step 2, PendingPanel shows step 1.
    - Simulate clicking Skip on step 2 → verify tour shows step 3, PendingPanel shows steps 1 and 2.
    - _Requirements: 2.4, 2.6, 6.1, 6.2_

  - [ ]* 8.3 Write integration test for TourDriver — start flow
    - Mount TourDriver with an `onLaunchGame` spy.
    - Simulate clicking Start on step 1 → verify spy called with `1`, `.tour-highlight` removed.
    - _Requirements: 2.2, 2.6_

  - [ ]* 8.4 Write integration test for TourDriver — all tasks completed
    - Mount TourDriver with `sih_tour_progress` pre-seeded as `[1,2,3,4,5,6]` in localStorage.
    - Verify CelebrationModal is rendered on mount.
    - Simulate closing CelebrationModal → verify TourDriver renders null.
    - _Requirements: 7.1, 7.3_

  - [ ]* 8.5 Write property test for Single Active Highlight
    - **Property 4: Single Active Highlight**
    - For any sequence of `handleSkip` and `handleStart` calls on a TourDriver instance, the count of DOM elements with `.tour-highlight` is always ≤ 1.
    - Use `fast-check` to generate sequences of skip/start actions over steps 1–6 and assert the invariant after each action.
    - **Validates: Requirements 2.6**

  - [ ]* 8.6 Write property test for `handleSkip` advancement
    - **Property 8: handleSkip Advances to Next Incomplete Step**
    - For any initial `progress` array and any step N not in progress, after calling `handleSkip(N)`, the new `activeStep` equals `findNextIncompleteStep(progress)` (computed on the post-skip state).
    - Use `fast-check` with `fc.subarray([1,2,3,4,5,6])` for progress and valid step indices.
    - **Validates: Requirements 2.4, 6.1**

- [x] 9. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Integrate TourDriver into `PatientHome.jsx`
  - [x] 10.1 Add `id="cat-1"` through `id="cat-6"` to the 6 cognitive category card wrapper `<div>` elements in `PatientHome.jsx` (the cards in the "ALL GAMES & ACTIVITIES" grid section, mapped to `coreCategoryLabel` order: memory_improvement=1, attention_concentration=2, daily_routine_recall=3, pattern_recognition=4, object_recognition=5, emotional_mental_engagement=6).
  - [x] 10.2 Import `TourDriver` in `PatientHome.jsx` and mount it as the first child inside the top-level `<div>`:
    ```jsx
    import { TourDriver } from './TourDriver';
    // ... inside PatientHome return:
    <TourDriver
      language={profile.language}
      onLaunchGame={handleTourLaunchGame}
    />
    ```
  - [x] 10.3 Add `handleTourLaunchGame(taskIndex)` to PatientHome that looks up the matching game in `allUnifiedGames` using `TASK_GAME_MAP[taskIndex]` as the domain filter and calls `onStartTask(matchedTask)`.
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 11. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; the core tour will function without them.
- `fast-check` and `vitest` must be installed as dev dependencies before running property tests: `bun add -D vitest fast-check`.
- Each property test references its corresponding design document property for traceability.
- The TourDriver returns `null` when fully complete and dismissed — confirmed zero-cost after onboarding is done.
- Category card IDs (`cat-1` … `cat-6`) must be added before mounting TourDriver to avoid the null-element fallback path.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2", "3", "4"] },
    { "wave": 2, "tasks": ["5", "6", "7"] },
    { "wave": 3, "tasks": ["8"] },
    { "wave": 4, "tasks": ["9"] },
    { "wave": 5, "tasks": ["10"] },
    { "wave": 6, "tasks": ["11"] }
  ]
}
```
