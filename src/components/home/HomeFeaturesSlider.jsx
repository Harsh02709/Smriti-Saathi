import React, { useState } from "react";

export const HomeFeaturesSlider = ({ t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      index: 0,
      title: t?.pers?.["1t"] || "Family Photos",
      desc: t?.pers?.["1d"] || "Upload family photos — seamlessly used in \"Who is this?\" recognition exercises.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    {
      index: 1,
      title: t?.pers?.["2t"] || "Names & Relationships",
      desc: t?.pers?.["2d"] || "Add names and relations to strengthen social memory and recognition.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      )
    },
    {
      index: 2,
      title: t?.pers?.["3t"] || "Daily Routines",
      desc: t?.pers?.["3d"] || "Morning habits, prayer times, walking schedules — practicing sequencing real-life activities.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      index: 3,
      title: t?.pers?.["4t"] || "Voice Reminders",
      desc: t?.pers?.["4d"] || "Medication, doctor visits, festivals — spoken gently in local regional accents.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      )
    },
    {
      index: 4,
      title: t?.pers?.["5t"] || "Familiar Places",
      desc: t?.pers?.["5d"] || "Hometown, local temple, garden — reinforcing spatial awareness through familiar landmarks.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    },
    {
      index: 5,
      title: t?.pers?.["6t"] || "Cherished Music",
      desc: t?.pers?.["6d"] || "Bihu, Bhajans, folk melodies — triggering positive emotional recall through sound.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };

  const translateX = currentIndex * -344;

  return (
    <section className="feat-slider-section" id="personalization">
      <div className="feat-hero-banner">
        <div className="container text-center">
          <div className="feat-pill-dropdown">
            <span>{t?.pers?.label || "Caregiver Personalization"}</span>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="feat-hero-title">{t?.pers?.title || "Personalized Reminiscence Features"}</h2>
          <p className="feat-hero-sub">{t?.pers?.sub || "Caregivers customize familiar elements that the AI instantly turns into meaningful cognitive activities."}</p>
        </div>
      </div>

      <div className="feat-slider-container">
        <div className="feat-track-wrapper">
          <div
            className="feat-track"
            id="featTrack"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {features.map((feat) => {
              const isActive = feat.index === currentIndex;
              return (
                <div
                  key={feat.index}
                  className={`feat-card ${isActive ? "feat-card--active" : ""}`}
                  data-index={feat.index}
                  onClick={() => setCurrentIndex(feat.index)}
                >
                  <div className="feat-icon-wrapper">
                    {feat.icon}
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.desc}</p>
                  <a href="#personalization" className="feat-card-link">
                    {t?.pers?.learnMore || "Learn More"} &rarr;
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls: Prev, Dots, Next */}
        <div className="feat-controls">
          <button className="feat-nav-btn cursor-pointer" id="featPrev" onClick={handlePrev} aria-label="Previous Feature">
            &larr;
          </button>
          <div className="feat-dots" id="featDots">
            {features.map((feat) => (
              <div
                key={feat.index}
                className={`feat-dot ${feat.index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(feat.index)}
              />
            ))}
          </div>
          <button className="feat-nav-btn cursor-pointer" id="featNext" onClick={handleNext} aria-label="Next Feature">
            &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
