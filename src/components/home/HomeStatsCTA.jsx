import React from "react";

export const HomeStatsCTA = ({ t, onSelectRole }) => {
  return (
    <>
      {/* ═══════════════ STATS ═══════════════ */}
      <section className="section" id="stats">
        <div className="container">
          <h2 className="section__title">{t?.stats?.title || "Empowering Families Across the Region"}</h2>
          <div className="stats-grid">
            <div className="scard">
              <div className="scard-num">95<span>%</span></div>
              <p>{t?.stats?.s1 || "Average improvement in elder cognitive engagement"}</p>
              <svg className="trend-svg" viewBox="0 0 120 40" fill="none">
                <path d="M5 35C20 30 40 25 55 18C70 10 90 8 115 4" stroke="#001A4C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="115" cy="4" r="3.5" fill="#001A4C" />
              </svg>
            </div>
            <div className="scard">
              <div className="scard-num">2,000<span>+</span></div>
              <p>{t?.stats?.s2 || "Active families utilizing daily AI therapy"}</p>
            </div>
            <div className="scard">
              <div className="scard-num">6</div>
              <p>{t?.stats?.s3 || "AI-calibrated cognitive training domains"}</p>
            </div>
            <div className="scard">
              <div className="scard-num">7<span>+</span></div>
              <p>{t?.stats?.s4 || "North-Eastern states actively supported"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="section cta-section" id="contact">
        <div className="container cta-inner">
          <h2 className="cta-title">
            {t?.cta?.title || "Start an AI Cognitive Journey for Your Elder Today"}
          </h2>
          <p className="cta-desc">
            {t?.cta?.desc || "Whether you are a devoted family member, neurologist, or healthcare professional — we are here to support every step."}
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn--white btn--xl cursor-pointer"
              onClick={() => onSelectRole && onSelectRole("patient")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 4l5 5-5 5" stroke="#001A4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{t?.cta?.start || "Get Started Free"}</span>
            </button>
            <button
              className="btn btn--outline-white btn--xl cursor-pointer"
              onClick={() => onSelectRole && onSelectRole("showcase")}
            >
              <span>{t?.cta?.demo || "View Interactive Demo"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="white" fillOpacity="0.15" />
              <path d="M8 22 C8 16 13 10 16 10 C19 10 24 16 24 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="9" r="2.5" fill="white" />
            </svg>
            <span>Smriti Saathi</span>
          </div>
          <div className="footer__links">
            <a href="#categories">{t?.nav?.categories || "Categories"}</a>
            <a href="#ai-engine">{t?.nav?.ai || "AI Engine"}</a>
            <a href="#caregiver">{t?.nav?.caregiver || "Caregiver"}</a>
            <a href="#ner">{t?.nav?.ner || "NER Focus"}</a>
          </div>
          <div className="footer__copy">BrainBoost — AI-Powered Cognitive Companion · © 2026</div>
        </div>
      </footer>
    </>
  );
};
