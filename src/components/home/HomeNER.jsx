import React from "react";

export const HomeNER = ({ t }) => {
  return (
    <section className="section ner-v2-section" id="ner">
      <div className="container">
        <div className="section-header text-center">
          <span className="ner-v2-badge">{t?.ner?.label || "NORTH-EAST INDIA FOCUS"}</span>
          <h2 className="section__title ner-v2-title">
            {t?.ner?.titlePrefix || "Transforming Cognitive Healthcare with"}{" "}
            <span className="ner-title-accent">
              {t?.ner?.titleAccent || "Empathetic Technology"}
              <svg className="title-underline-svg" width="180" height="12" viewBox="0 0 180 12" fill="none">
                <path d="M3 9C45 3 135 3 177 9" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="section__sub">
            {t?.ner?.sub || "Linguistic diversity, culturally resonant content, voice assistance, and 100% offline edge architecture."}
          </p>
        </div>

        <div className="ner-v2-grid">
          {/* Card 1: Regional Languages */}
          <div className="ner-v2-card">
            <div className="ner-v2-card-header">
              <div className="ner-v2-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <h3>{t?.ner?.["1t"] || "Regional Languages (North-East Focus)"}</h3>
            </div>
            <p>
              {t?.ner?.["1d"] || "Hindi, Assamese, Manipuri, Khasi, Nagamese, Bodo, Bengali — Voice AI understands regional accents and dialects so elders converse effortlessly in their mother tongue."}
            </p>
          </div>

          {/* Card 2: Voice Interaction */}
          <div className="ner-v2-card">
            <div className="ner-v2-card-header">
              <div className="ner-v2-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <h3>{t?.ner?.["2t"] || "Voice-First Interaction"}</h3>
            </div>
            <p>
              {t?.ner?.["2d"] || "Speak and respond naturally — speech recognition and synthesis allow elders to engage without touch screen difficulties."}
            </p>
          </div>

          {/* Card 3: Cultural Content */}
          <div className="ner-v2-card">
            <div className="ner-v2-card-header">
              <div className="ner-v2-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <h3>{t?.ner?.["3t"] || "Culturally Resonant Content"}</h3>
            </div>
            <p>
              {t?.ner?.["3d"] || "Bihu, Gamusa, Lai Haraoba, traditional attire — familiar folk tales and cultural motifs evoke joyful nostalgia."}
            </p>
          </div>

          {/* Card 4: Offline Mode */}
          <div className="ner-v2-card">
            <div className="ner-v2-card-header">
              <div className="ner-v2-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
                  <path d="M10.71 5.05A16 16 0 0122.58 9" />
                  <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </div>
              <h3>{t?.ner?.["4t"] || "100% Offline Edge Mode"}</h3>
            </div>
            <p>
              {t?.ner?.["4d"] || "Complete standalone offline sessions — ensuring uninterrupted cognitive therapy even in remote hilly terrain and villages."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
