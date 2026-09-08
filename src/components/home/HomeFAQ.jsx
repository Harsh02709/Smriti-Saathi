import React, { useState } from "react";

export const HomeFAQ = ({ t }) => {
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      q: t?.faq?.q1 || "Who can use the Smriti Saathi platform?",
      a: t?.faq?.a1 || "The platform is specially designed for elders experiencing mild forgetfulness, cognitive decline, dementia, or Alzheimer's, as well as their family caregivers and doctors.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      )
    },
    {
      q: t?.faq?.q2 || "Does the app support North-East Indian languages?",
      a: t?.faq?.a2 || "Yes! Smriti Saathi supports Hindi, Assamese, Manipuri, Khasi, Nagamese, Bengali, and English with full voice and text assistance.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      )
    },
    {
      q: t?.faq?.q3 || "Can the app be used without internet (Offline Mode)?",
      a: t?.faq?.a3 || "Absolutely! All 6 core cognitive exercises and memory activities run completely offline with automatic background sync when connectivity resumes.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0122.58 9" />
          <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )
    },
    {
      q: t?.faq?.q4 || "How do caregivers add personalized photos and routines?",
      a: t?.faq?.a4 || "Caregivers can easily upload family portraits, relative names, daily medicine schedules, and folk songs from the Caregiver Portal. The AI engine integrates them into customized exercises.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      )
    },
    {
      q: t?.faq?.q5 || "How does the AI engine adapt game difficulty?",
      a: t?.faq?.a5 || "The engine measures real-time accuracy, decision latency, and hint requests, dynamically tuning the pace and puzzle complexity to maintain high elder motivation without stress.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#001A4C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 014.44-2.04" />
          <path d="M14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-4.44-2.04" />
        </svg>
      )
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-header text-center">
          <span className="faq-badge">{t?.faq?.badge || "FAQ & Knowledge Base"}</span>
          <h2 className="section__title">{t?.faq?.title || "Frequently Asked Questions"}</h2>
          <p className="section__sub">{t?.faq?.sub || "Learn how Smriti Saathi supports elders and caregivers with adaptive cognitive stimulation."}</p>
        </div>

        <div className="faq-accordion-wrapper">
          {faqs.map((faq, index) => {
            const isActive = activeFaq === index;
            return (
              <div
                key={index}
                className={`faq-item ${isActive ? "faq-item--active" : ""}`}
              >
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <div className="faq-q-left">
                    <span className="faq-icon-q">{faq.icon}</span>
                    <h3>{faq.q}</h3>
                  </div>
                  <span className="faq-toggle-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
