import React from "react";

export const HomeCaregiverMockup = ({ t }) => {
  return (
    <section className="section section--warm" id="caregiver">
      <div className="container cg-grid">
        <div className="cg-left">
          <span className="section-label">{t?.cg?.label || "Caregiver Dashboard"}</span>
          <h2 className="section__title section__title--left">{t?.cg?.title || "Caregiver Longitudinal Insights"}</h2>
          <p className="cg-desc">
            {t?.cg?.desc || "A dedicated dashboard tracking category-wise cognitive performance, longitudinal progress graphs, difficulty patterns, and timely shift alerts."}
          </p>
          <ul className="cg-list">
            <li>
              <span className="cg-list-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </span>
              <span>{t?.cg?.l1 || "Category-Wise Cognitive Breakdown"}</span>
            </li>
            <li>
              <span className="cg-list-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </span>
              <span>{t?.cg?.l2 || "Longitudinal Progress & Trajectory Graph"}</span>
            </li>
            <li>
              <span className="cg-list-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              <span>{t?.cg?.l3 || "Early Identification of Challenging Areas"}</span>
            </li>
            <li>
              <span className="cg-list-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </span>
              <span>{t?.cg?.l4 || "Noticeable Shift & Variation Alerts"}</span>
            </li>
            <li>
              <span className="cg-list-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <span>{t?.cg?.l5 || "Medication & Appointment Voice Schedules"}</span>
            </li>
          </ul>
          <div className="cg-note">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#001A4C" strokeWidth="1.5" />
              <path d="M8 5v3M8 10.5h0" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <em>{t?.cg?.note || "Clinical Disclaimer: We track cognitive performance metrics, not clinical dementia diagnoses."}</em>
          </div>
        </div>

        <div className="cg-right">
          <div className="cg-mockup">
            <div className="cgm-header">
              <span>{t?.cg?.mh || "Ram Barua — Weekly Cognitive Summary"}</span>
            </div>
            <div className="cgm-grid">
              <div className="cgm-stat cgm-stat--up">
                <span className="cgm-icon-svg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
                <strong>78%</strong>
                <small>↑12%</small>
              </div>
              <div className="cgm-stat">
                <span className="cgm-icon-svg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </span>
                <strong>62%</strong>
                <small>↑5%</small>
              </div>
              <div className="cgm-stat cgm-stat--up">
                <span className="cgm-icon-svg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <strong>85%</strong>
                <small>↑8%</small>
              </div>
              <div className="cgm-stat cgm-stat--down">
                <span className="cgm-icon-svg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </span>
                <strong>45%</strong>
                <small className="cgm-down-label">↓6%</small>
              </div>
            </div>
            <div className="cgm-chart-area">
              <span className="cgm-chart-title">{t?.cg?.chartLabel || "30-Day Cognitive Performance Trend"}</span>
              <svg viewBox="0 0 300 80" className="cgm-chart-svg">
                <defs>
                  <linearGradient id="cgmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#001A4C" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#001A4C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0,60 Q50,45 100,50 T200,30 T300,18 L300,80 L0,80 Z" fill="url(#cgmGrad)" />
                <path d="M0,60 Q50,45 100,50 T200,30 T300,18" fill="none" stroke="#001A4C" strokeWidth="2.5" />
                <circle cx="100" cy="50" r="4" fill="#001A4C" />
                <circle cx="200" cy="30" r="4" fill="#001A4C" />
                <circle cx="300" cy="18" r="4" fill="#10B981" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
