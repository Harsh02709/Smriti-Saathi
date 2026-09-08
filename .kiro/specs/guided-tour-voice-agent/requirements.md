# Requirements Document

## Introduction

The Guided Tour Driver + Voice Agent is an onboarding feature for the Smriti Saathi React/Vite patient portal. It walks elderly patient users step-by-step through the 6 cognitive category cards using a floating tooltip overlay, optional multilingual text-to-speech (TTS) narration, localStorage-based progress tracking, a pending-tasks panel for skipped steps, and a celebration modal when all 6 tasks are completed. The feature is implemented as a single self-contained `TourDriver` component mounted inside `PatientHome`, with no structural changes to any other existing component.

---

## Glossary

- **TourDriver**: The root React orchestrator component (`src/components/patient/TourDriver.jsx`) that owns all tour state, mounts overlay/panel/modal sub-components, and drives step logic.
- **TourOverlay**: The semi-transparent backdrop and floating tooltip bubble rendered inside TourDriver.
- **PendingPanel**: A fixed bottom-right panel listing steps the patient has skipped but not yet completed.
- **CelebrationModal**: A full-screen modal shown when all 6 cognitive tasks are completed.
- **Voice_Agent**: The `voiceAgent.js` utility module (`src/utils/voiceAgent.js`) that wraps the W3C Web Speech API.
- **Tour_Data**: The `tourData.js` data module (`src/data/tourData.js`) containing multilingual tour instructions keyed by step index and language code.
- **Step**: A single tour entry corresponding to one of the 6 cognitive category cards (indices 1–6).
- **Progress**: The `sih_tour_progress` localStorage key, storing a JSON array of completed step indices.
- **Skipped**: The `sih_tour_skipped` localStorage key, storing a JSON array of skipped step indices.
- **Category_Card**: A DOM element with id `cat-1` through `cat-6` rendered inside `PatientHome` representing each cognitive training category.
- **BCP47**: An IETF language tag string (e.g., `"hi-IN"`, `"en-US"`) used by the W3C Web Speech API.
- **TASK_GAME_MAP**: The mapping from step index (1–6) to cognitive game domain string used by `onLaunchGame`.

---

## Requirements

### Requirement 1: Tour Initialization and Progress Tracking

**User Story:** As an elderly patient, I want the tour to remember where I left off so that I never have to restart from the beginning.

#### Acceptance Criteria

1. WHEN the TourDriver component mounts, THE TourDriver SHALL read `sih_tour_progress` and `sih_tour_skipped` from localStorage and compute the next incomplete step as the minimum index in {1, 2, 3, 4, 5, 6} not present in the progress array.
2. WHEN the URL contains a `?completed=N` query parameter on mount, THE TourDriver SHALL add N to the progress array, persist the updated array to `sih_tour_progress` in localStorage, and remove the query parameter from the browser address bar.
3. WHEN the URL contains a `?skip=N` query parameter on mount, THE TourDriver SHALL add N to the skipped array, persist the updated array to `sih_tour_skipped` in localStorage, and remove the query parameter from the browser address bar.
4. WHEN all 6 steps are present in the progress array, THE TourDriver SHALL show the CelebrationModal instead of a tour step.
5. IF `localStorage.setItem` throws a `SecurityError` or `QuotaExceededError`, THEN THE TourDriver SHALL catch the error silently and continue operating with in-memory state for the remainder of the session.
6. IF `localStorage.getItem` returns malformed JSON for either key, THEN THE TourDriver SHALL treat the value as an empty array and continue initialization normally.

---

### Requirement 2: Tour Step Display and Navigation

**User Story:** As an elderly patient, I want each category card to be highlighted clearly with a tooltip so that I understand exactly what to do next.

#### Acceptance Criteria

1. WHEN the active step is determined, THE TourDriver SHALL scroll the corresponding Category_Card into view, add the `.tour-highlight` CSS class to that element, and display TourOverlay with the step title, description, step badge ("Step N of 6"), and progress bar for that step.
2. WHEN the Start button is clicked on step N and the `onLaunchGame` prop is provided, THE TourDriver SHALL remove `.tour-highlight` from the Category_Card, dismiss TourOverlay, and call `onLaunchGame(N)` with the correct step index.
3. WHEN the Start button is clicked on step N and the `onLaunchGame` prop is not provided, THE TourDriver SHALL navigate to `TASK_URLS[N]` with the query parameter `?completed=N` appended.
4. WHEN the Skip button is clicked on step N, THE TourDriver SHALL add N to `sih_tour_skipped`, advance TourOverlay to the next incomplete step, and update the PendingPanel to list the skipped step.
5. WHEN the TourOverlay backdrop is clicked, THE TourDriver SHALL dismiss TourOverlay without modifying the progress array or the skipped array.
6. WHEN a step is shown, THE TourDriver SHALL ensure that exactly one Category_Card element carries the `.tour-highlight` CSS class at any given time.
7. WHEN a step is completed or skipped, THE TourDriver SHALL apply a `.cat-card--completed` class with a green checkmark badge to completed cards, and a `.cat-card--skipped` class with an amber badge to skipped-but-incomplete cards.

---

### Requirement 3: Voice Agent (TTS)

**User Story:** As an elderly patient, I want the tour to speak the step instructions aloud in my language so that I can understand them without reading.

#### Acceptance Criteria

1. WHEN TourOverlay is shown for a step, THE Voice_Agent SHALL call `speakInstruction` with the step's title and description text after a 350 ms delay to ensure the overlay animation completes first.
2. WHEN `speakInstruction` is called, THE Voice_Agent SHALL call `window.speechSynthesis.cancel()` before calling `window.speechSynthesis.speak()` to prevent overlapping utterances.
3. WHEN the voice button in TourOverlay is clicked, THE Voice_Agent SHALL replay `speakInstruction` for the current step's title and description.
4. WHEN `window.speechSynthesis` is undefined, THE Voice_Agent SHALL treat `speakInstruction` as a no-op and THE TourDriver SHALL continue displaying the tour normally.
5. WHEN the preferred BCP-47 voice for the patient's language is not found in `speechSynthesis.getVoices()`, THE Voice_Agent SHALL select the first voice whose `lang` attribute starts with the same two-letter language prefix, or fall back to the browser default voice if no partial match is found.
6. WHEN `speechSynthesis.getVoices()` returns an empty array on first call, THE Voice_Agent SHALL attach a `voiceschanged` event listener and retry voice selection when voices become available.
7. THE Voice_Agent SHALL set utterance `rate` to 0.88 and `pitch` to 1.0 for all speech synthesis calls to improve comprehension for elderly users.
8. WHEN the TourDriver component is unmounted, THE Voice_Agent SHALL call `stopVoice()` to cancel any in-progress speech synthesis.

---

### Requirement 4: Multilingual Tour Instructions

**User Story:** As an elderly patient who prefers my regional language, I want the tour instructions shown and spoken in my language so that I can follow along without confusion.

#### Acceptance Criteria

1. THE Tour_Data SHALL contain `title` and `desc` entries for all 6 steps in the English ("en") language as the mandatory fallback.
2. THE Tour_Data SHALL contain `title` and `desc` entries for all 6 steps in Hindi ("hi"), and SHOULD contain entries in Assamese ("as"), Manipuri ("mni"), and Nagamese ("nag").
3. WHEN a step instruction is requested for `profile.language` and that language code has no corresponding entry in Tour_Data for that step, THE TourDriver SHALL use the English ("en") entry as the fallback.
4. THE `speakInstruction` function SHALL map language codes to BCP-47 tags as follows: `hi` → `"hi-IN"`, `en` → `"en-US"`, `as` → `"as-IN"`, `mni` → `"bn-IN"` (Meitei fallback), `nag` → `"en-IN"`.
5. WHEN `speakInstruction` receives a language code not present in the BCP-47 mapping, THE Voice_Agent SHALL default to `"en-US"`.

---

### Requirement 5: Tooltip Positioning

**User Story:** As an elderly patient, I want the tooltip to appear near the highlighted card and stay within the screen so that I can read it without scrolling.

#### Acceptance Criteria

1. WHEN TourOverlay is positioned for step N, THE TourDriver SHALL call `document.getElementById("cat-N")` to obtain the card's bounding rectangle and compute the tooltip position using `getBoundingClientRect`.
2. WHEN the tooltip is positioned below the card, THE TourDriver SHALL place the tooltip at `rect.bottom + 12px + window.scrollY` vertically.
3. WHEN the card is too close to the bottom of the viewport and the tooltip would overflow, THE TourDriver SHALL place the tooltip above the card at `rect.top − tooltipHeight − 12px + window.scrollY`.
4. THE TourDriver SHALL horizontally clamp the tooltip so that `left ≥ 8px` and `left + 300px ≤ viewportWidth − 8px` at all times.
5. IF `document.getElementById("cat-N")` returns null, THE TourDriver SHALL position the tooltip at the safe fallback coordinates `{ top: 120, left: 16 }` and omit the `.tour-highlight` class application.
6. WHEN the browser viewport is resized, THE TourDriver SHALL recompute and update the tooltip position using a `ResizeObserver` without polling.

---

### Requirement 6: Pending Panel

**User Story:** As an elderly patient, I want to see a list of steps I have skipped so that I can come back and complete them later.

#### Acceptance Criteria

1. THE PendingPanel SHALL be displayed in the fixed bottom-right corner of the viewport whenever there is at least one step that is present in the skipped array but not present in the progress array.
2. WHEN the PendingPanel is visible, THE PendingPanel SHALL list the name and a Start link for each step that is skipped but not yet completed.
3. WHEN a previously skipped step is completed via its Start link in the PendingPanel, THE TourDriver SHALL remove that step from the PendingPanel list and update both `sih_tour_progress` and the visual state.
4. WHEN the close button on the PendingPanel is clicked, THE PendingPanel SHALL hide until a new step is skipped.

---

### Requirement 7: Celebration Modal

**User Story:** As an elderly patient, I want to see a celebration screen when I finish all 6 tasks so that I feel rewarded for completing the tour.

#### Acceptance Criteria

1. WHEN `findNextIncompleteStep` returns null (all 6 steps in progress), THE TourDriver SHALL hide TourOverlay and display the CelebrationModal.
2. WHEN the CelebrationModal is displayed, THE TourDriver SHALL trigger a `canvas-confetti` burst animation.
3. WHEN the close button on the CelebrationModal is clicked, THE TourDriver SHALL dismiss CelebrationModal and render null (zero DOM nodes) for the rest of the session.

---

### Requirement 8: Patient Home Integration

**User Story:** As a developer integrating the tour, I want the TourDriver to plug into PatientHome with minimal changes so that no existing functionality is broken.

#### Acceptance Criteria

1. THE PatientHome SHALL add `id="cat-1"` through `id="cat-6"` to the 6 cognitive category card wrapper elements to enable DOM targeting by TourDriver.
2. THE PatientHome SHALL mount TourDriver as a child component, passing `language={profile.language}` and `onLaunchGame={handleTourLaunchGame}`.
3. THE TourDriver SHALL use `ReactDOM.createPortal` to render TourOverlay, PendingPanel, and CelebrationModal into `document.body` so that z-index stacking is unaffected by PatientHome's layout.
4. THE TourDriver SHALL NOT mutate `profile`, `tasks`, or any other prop passed to it from PatientHome; its only external side-effects SHALL be localStorage writes and DOM class additions/removals on `#cat-1` through `#cat-6`.

---

### Requirement 9: CSS Isolation and Animation

**User Story:** As a developer, I want the tour styles to be isolated so that they do not conflict with existing PatientHome or app-wide styles.

#### Acceptance Criteria

1. ALL tour-specific styles SHALL be defined in `src/components/patient/TourDriver.css` and SHALL NOT override any existing CSS class used by PatientHome or other components.
2. THE `.tour-highlight` class SHALL apply a pulsing teal glow border animation using the `@keyframes tourCardGlow` keyframe defined in TourDriver.css.
3. THE `.tour-start-btn` element SHALL apply a pulse scale animation using the `@keyframes tourTooltipBtnPulse` keyframe defined in TourDriver.css.
4. THE `.cat-card--completed` class SHALL apply a subtle green overlay to the card, and THE `.cat-card__done-badge` element SHALL display a green ✓ badge in the top-right corner of the completed card.
5. THE `.cat-card--skipped` class SHALL apply a subtle amber/orange overlay to the card, and THE `.cat-card__skip-badge` element SHALL display an amber ↩ badge in the top-right corner of the skipped card.
