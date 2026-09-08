import React, { useState, useCallback } from "react";
import "./LandingHome.css";
import { translations } from "../../data/translations";
import { HomeHero } from "./HomeHero";
import { HomeCategories } from "./HomeCategories";
import { HomeAIEngine } from "./HomeAIEngine";
import { HomeFeaturesSlider } from "./HomeFeaturesSlider";
import { HomeTimeline } from "./HomeTimeline";
import { HomeNER } from "./HomeNER";
import { HomeCaregiverMockup } from "./HomeCaregiverMockup";
import { HomeFAQ } from "./HomeFAQ";
import { HomeStatsCTA } from "./HomeStatsCTA";
import { LandingTourDriver } from "./LandingTourDriver";
import { HomeMemoryTestSection } from "./HomeMemoryTestSection";

export const LandingHome = ({
  onSelectRole,
  onLaunchGame,
  onOpenVoice,
  onOpenCaregiverCall,
  onOpenMemoryTest,
  profile,
  onProfileUpdate,
  tasks = [],
  reminders = [],
  performance = [],
  onTourSkippedChange,   // (skippedSet: Set<number>) => void  — fed to notification bell
  onTourCompletedChange, // (completedSet: Set<number>) => void
  onToggleSkipCategory,  // (cat) => void — feeds category directly into notifications
  showTour = false,      // true when patient just logged in
}) => {
  const t = translations[profile?.language] || translations.hi || translations.en;

  const [completedTasks, setCompletedTasks] = useState({});
  const [skippedTasks, setSkippedTasks] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const handleTourSkipped = useCallback((skippedSet) => {
    // Update local state for badge rendering on cards
    const obj = {};
    skippedSet.forEach(n => { obj[n] = true; });
    setSkippedTasks(prev => ({ ...prev, ...obj }));
    onTourSkippedChange?.(skippedSet);
  }, [onTourSkippedChange]);

  const handleTourCompleted = useCallback((completedSet) => {
    const obj = {};
    completedSet.forEach(n => { obj[n] = true; });
    setCompletedTasks(prev => ({ ...prev, ...obj }));
    onTourCompletedChange?.(completedSet);
  }, [onTourCompletedChange]);

  const handleSkipCategory = (cat) => {
    setSkippedTasks((prev) => {
      const willBeSkipped = !prev[cat.id];
      const updated = { ...prev, [cat.id]: willBeSkipped };
      
      // Update parent notifications
      if (onToggleSkipCategory) {
        onToggleSkipCategory(cat, willBeSkipped);
      } else if (onTourSkippedChange) {
        const skippedIndices = new Set(
          Object.keys(updated).filter(k => updated[k]).map(Number)
        );
        onTourSkippedChange(skippedIndices);
      }

      // Flash feedback toast & advance in loop to next card
      if (willBeSkipped) {
        setToastMessage(`🔔 "${cat.title}" saved to Notifications! Click the bell icon above to resume.`);
        
        // Advance to next card in loop (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 1)
        const nextCardId = (cat.id % 6) + 1;
        const nextEl = document.getElementById(`cat-${nextCardId}`);
        if (nextEl) {
          nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
          nextEl.classList.add("tour-highlight");
          setTimeout(() => {
            nextEl.classList.remove("tour-highlight");
          }, 1500);
        }

        // Also trigger gentle pulse on header bell button
        const bellBtn = document.getElementById("header-notification-btn");
        if (bellBtn) {
          bellBtn.classList.add("ring-4", "ring-amber-400", "scale-105");
          setTimeout(() => {
            bellBtn.classList.remove("ring-4", "ring-amber-400", "scale-105");
          }, 1500);
        }
      } else {
        setToastMessage(`Task "${cat.title}" removed from Notifications.`);
      }

      setTimeout(() => setToastMessage(null), 4000);
      return updated;
    });
  };

  const handleCategoryLaunch = (taskId, gameTitle) => {
    if (onLaunchGame) {
      onLaunchGame(gameTitle);
    } else if (onSelectRole) {
      onSelectRole("patient");
    }
  };

  return (
    <div className="home-landing-page relative">
      {/* Toast banner for notification feedback */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <span className="text-xl">✨</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* ═══════════════ LANDING TOUR DRIVER ═══════════════ */}
      <LandingTourDriver
        language={profile?.language || "en"}
        onLaunchGame={onLaunchGame}
        onSkippedChange={handleTourSkipped}
        onCompletedChange={handleTourCompleted}
        onTourDone={() => {}}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <HomeHero
        onSelectRole={onSelectRole}
        onOpenMemoryTest={onOpenMemoryTest}
        t={t}
      />

      {/* ═══════════════ 6 COGNITIVE CATEGORIES ═══════════════ */}
      <HomeCategories
        t={t}
        completedTasks={completedTasks}
        skippedTasks={skippedTasks}
        onCategoryLaunch={handleCategoryLaunch}
        onSkipCategory={handleSkipCategory}
      />

      {/* ═══════════════ AI PERSONALIZATION ENGINE ═══════════════ */}
      <HomeAIEngine t={t} />

      {/* ═══════════════ FEATURES CAROUSEL SLIDER ═══════════════ */}
      <HomeFeaturesSlider t={t} />

      {/* ═══════════════ HOW IT WORKS TIMELINE ═══════════════ */}
      <HomeTimeline t={t} />

      {/* ═══════════════ NER FOCUS ═══════════════ */}
      <HomeNER t={t} />

      {/* ═══════════════ CAREGIVER DASHBOARD ═══════════════ */}
      <HomeCaregiverMockup t={t} />

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      <HomeFAQ t={t} />

      {/* ═══════════════ STATS, CTA & FOOTER ═══════════════ */}
      <HomeStatsCTA t={t} onSelectRole={onSelectRole} />
    </div>
  );
};
