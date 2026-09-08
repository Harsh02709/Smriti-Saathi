import React from "react";

export const HomeTimeline = ({ t }) => {
  return (
    <section className="section section--warm" id="howit">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t?.how?.label || "How It Works"}</span>
          <h2 className="section__title">{t?.how?.title || "Get Started in 3 Simple Steps"}</h2>
        </div>
      </div>

      <div className="timeline-wrapper">
        {/* STEP 1 */}
        <div className="tl-row">
          <div className="tl-line-col">
            <div className="tl-line tl-line--top-half"></div>
            <div className="tl-dot tl-dot--active"></div>
            <div className="tl-line"></div>
          </div>
          <div className="tl-content tl-content--left">
            <div className="tl-text-block">
              <h3>{t?.how?.s1t || "Create Elder Profile"}</h3>
              <p>{t?.how?.s1d || "Caregivers add elder details, photos, routines, and language preferences. AI prepares a tailored cognitive plan."}</p>
            </div>
          </div>
          <div className="tl-content tl-content--right">
            <div className="tl-chat-card">
              <div className="helpee-chat-inner">
                <div className="hc-msg hc-msg--agent">
                  <img
                    src={`${import.meta.env.BASE_URL}images/nedtx_hero.svg`}
                    className="hc-avatar"
                    alt="AI Agent"
                  />
                  <div className="hc-bubble">
                    {t?.how?.c1a || "Hello! I am Smriti Saathi. How old is your elder?"}
                  </div>
                </div>
                <div className="hc-msg hc-msg--user">
                  <div className="hc-bubble hc-bubble--user">
                    {t?.how?.c1b || "She is 72 years old and experiences mild forgetfulness."}
                  </div>
                </div>
                <div className="hc-msg hc-msg--agent">
                  <img
                    src={`${import.meta.env.BASE_URL}images/nedtx_hero.svg`}
                    className="hc-avatar"
                    alt="AI Agent"
                  />
                  <div className="hc-bubble">
                    {t?.how?.c1c || "Understood! Preparing a gentle, personalized memory plan 🧠"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="tl-row tl-row--reverse">
          <div className="tl-line-col">
            <div className="tl-line"></div>
            <div className="tl-dot"></div>
            <div className="tl-line"></div>
          </div>
          <div className="tl-content tl-content--left">
            <div className="tl-chat-card tl-chat-card--light">
              <div className="helpee-chat-inner">
                <div className="hc-msg hc-msg--agent">
                  <img
                    src={`${import.meta.env.BASE_URL}images/nedtx_hero.svg`}
                    className="hc-avatar"
                    alt="AI Agent"
                  />
                  <div className="hc-bubble">
                    {t?.how?.c2a || "Today's Activity: Can you spot your daughter among these photos?"}
                  </div>
                </div>
                <div className="hc-msg hc-msg--user">
                  <div className="hc-bubble hc-bubble--user">
                    {t?.how?.c2b || "Here she is! Card number two! ✅"}
                  </div>
                </div>
                <div className="hc-msg hc-msg--agent">
                  <img
                    src={`${import.meta.env.BASE_URL}images/nedtx_hero.svg`}
                    className="hc-avatar"
                    alt="AI Agent"
                  />
                  <div className="hc-bubble">
                    {t?.how?.c2c || "Wonderful! Accuracy: 94% 🎉 Next activity ready."}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tl-content tl-content--right">
            <div className="tl-text-block">
              <h3>{t?.how?.s2t || "Play Adaptive Activities"}</h3>
              <p>{t?.how?.s2d || "Elders play gentle, voice-assisted games while AI automatically adjusts challenge levels in real time."}</p>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="tl-row">
          <div className="tl-line-col">
            <div className="tl-line"></div>
            <div className="tl-dot"></div>
            <div className="tl-line tl-line--bottom-half"></div>
          </div>
          <div className="tl-content tl-content--left">
            <div className="tl-text-block">
              <h3>{t?.how?.s3t || "Caregivers Monitor Insights"}</h3>
              <p>{t?.how?.s3d || "Caregiver dashboard visualizes domain-wise performance, progress trends, and alerts for noticeable changes."}</p>
            </div>
          </div>
          <div className="tl-content tl-content--right">
            <div className="tl-app-card">
              <div className="app-card-header">
                <strong>{t?.how?.dash || "Caregiver Dashboard Preview"}</strong>
              </div>
              <div className="dash-preview">
                <div className="dash-stat">
                  <span className="dash-stat-val">78%</span>
                  <span className="dash-stat-label">{t?.how?.d1 || "Memory Score"}</span>
                </div>
                <div className="dash-stat">
                  <span className="dash-stat-val">↑12%</span>
                  <span className="dash-stat-label">{t?.how?.d2 || "Weekly Growth"}</span>
                </div>
                <div className="dash-stat">
                  <span className="dash-stat-val">14</span>
                  <span className="dash-stat-label">{t?.how?.d3 || "Sessions Done"}</span>
                </div>
              </div>
              <div className="dash-alert">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L1 12h12L7 1z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M7 5v3M7 10h0" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{t?.how?.alert || "Clinical Note: Minor dip in pattern recall — supplemental practice scheduled"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
