import React from "react";

export const HomeAIEngine = ({ t }) => {
  return (
    <section className="section section--warm" id="ai-engine">
      <div className="container ai-grid">
        <div className="ai-left">
          <span className="section-label">{t?.ai?.label || "Core AI Innovation"}</span>
          <h2 className="section__title section__title--left">
            {t?.ai?.title || "AI-Powered Adaptive Cognitive Engine"}
          </h2>
          <p className="ai-desc">
            {t?.ai?.desc || "Instead of generic exercises, our adaptive AI continuously monitors gameplay metrics and automatically calibrates difficulty to prevent cognitive fatigue or frustration."}
          </p>

          <div className="ai-metrics">
            <div className="ai-metric">
              <div className="ai-metric-icon ai-metric-icon--blue">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
                  <path d="M7 10l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <strong>{t?.ai?.m1t || "Accuracy Tracking"}</strong>
                <p>{t?.ai?.m1d || "Real-time correct vs. incorrect response ratios"}</p>
              </div>
            </div>

            <div className="ai-metric">
              <div className="ai-metric-icon ai-metric-icon--amber">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
                  <path d="M10 6v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <strong>{t?.ai?.m2t || "Response Latency"}</strong>
                <p>{t?.ai?.m2d || "Time taken to formulate and execute decisions"}</p>
              </div>
            </div>

            <div className="ai-metric">
              <div className="ai-metric-icon ai-metric-icon--rose">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 14l3-4 3 2 4-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="3" y="3" width="14" height="14" rx="3" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <strong>{t?.ai?.m3t || "Longitudinal Trends"}</strong>
                <p>{t?.ai?.m3d || "Session-over-session performance trajectories"}</p>
              </div>
            </div>

            <div className="ai-metric">
              <div className="ai-metric-icon ai-metric-icon--green">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
                  <path d="M10 7v3M10 13h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <strong>{t?.ai?.m4t || "Hint & Retry Analytics"}</strong>
                <p>{t?.ai?.m4d || "Frequency and timing of supportive interventions"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual Card showing adaptive difficulty */}
        <div className="ai-right">
          <div className="ai-visual-card">
            <div className="avc-header">
              <strong>{t?.ai?.vc?.title || "Live Cognitive Profile"}</strong>
              <span className="avc-live">{t?.ai?.vc?.live || "● AI Active"}</span>
            </div>
            <div className="avc-bars">
              <div className="avc-bar-row">
                <span>{t?.ai?.vc?.memory || "Memory"}</span>
                <div className="avc-bar"><div className="avc-fill" style={{ width: "78%" }}></div></div>
                <span>78%</span>
              </div>
              <div className="avc-bar-row">
                <span>{t?.ai?.vc?.attention || "Attention"}</span>
                <div className="avc-bar"><div className="avc-fill avc-fill--amber" style={{ width: "62%" }}></div></div>
                <span>62%</span>
              </div>
              <div className="avc-bar-row">
                <span>{t?.ai?.vc?.routine || "Routine"}</span>
                <div className="avc-bar"><div className="avc-fill avc-fill--green" style={{ width: "85%" }}></div></div>
                <span>85%</span>
              </div>
              <div className="avc-bar-row">
                <span>{t?.ai?.vc?.pattern || "Pattern"}</span>
                <div className="avc-bar"><div className="avc-fill avc-fill--rose" style={{ width: "45%" }}></div></div>
                <span>45%</span>
              </div>
              <div className="avc-bar-row">
                <span>{t?.ai?.vc?.object || "Object"}</span>
                <div className="avc-bar"><div className="avc-fill" style={{ width: "71%" }}></div></div>
                <span>71%</span>
              </div>
              <div className="avc-bar-row">
                <span>{t?.ai?.vc?.emotion || "Emotional"}</span>
                <div className="avc-bar"><div className="avc-fill avc-fill--green" style={{ width: "90%" }}></div></div>
                <span>90%</span>
              </div>
            </div>
            <div className="avc-insight">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#001A4C" strokeWidth="1.5" />
                <path d="M8 5v3M8 10.5h0" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>{t?.ai?.vc?.insight || "AI Clinical Insight: Recommend additional practice in Pattern Recognition"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
