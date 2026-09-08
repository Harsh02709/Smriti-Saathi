import React from "react";

export const HomeCategories = ({
  t,
  completedTasks = {},
  skippedTasks = {},
  onCategoryLaunch,
  onSkipCategory,
}) => {
  const catData = [
    {
      id: 1,
      name: "memory",
      img: `${import.meta.env.BASE_URL}images/cat_real_memory.jpg`,
      title: t?.cat?.["1t"] || "Memory Enhancement",
      desc: t?.cat?.["1d"] || "Memory card pairs, image recall, family face recognition — AI detects difficulty patterns to strengthen retention.",
      g1: t?.cat?.["1g1"] || "Memory Cards",
      g1Game: "1. Memory Match",
      g2: t?.cat?.["1g2"] || "Photo Recall",
      g2Game: "3. Picture Recall",
      gameTitle: "1. Memory Match"
    },
    {
      id: 2,
      name: "attention",
      img: `${import.meta.env.BASE_URL}images/cat_real_attention.jpg`,
      title: t?.cat?.["2t"] || "Attention & Focus",
      desc: t?.cat?.["2d"] || "Color matching and focused attention exercises — tracking response time and motor precision.",
      g1: t?.cat?.["2g1"] || "Color Match",
      g1Game: "8. Color & Shape Match",
      g2: t?.cat?.["2g2"] || "Sound Match",
      g2Game: "5. Sound Match",
      gameTitle: "8. Color & Shape Match"
    },
    {
      id: 3,
      name: "routine",
      img: `${import.meta.env.BASE_URL}images/cat_real_routine.jpg`,
      title: t?.cat?.["3t"] || "Daily Routines",
      desc: t?.cat?.["3d"] || "Medication schedules, morning routines, grocery lists — sequencing real-life daily tasks.",
      g1: t?.cat?.["3g1"] || "Routine Steps",
      g1Game: "9. Daily Routine Recall",
      g2: t?.cat?.["3g2"] || "Medicine Reminder",
      g2Game: "9. Daily Routine Recall",
      gameTitle: "9. Daily Routine Recall"
    },
    {
      id: 4,
      name: "pattern",
      img: `${import.meta.env.BASE_URL}images/cat_real_pattern.jpg`,
      title: t?.cat?.["4t"] || "Pattern Recognition",
      desc: t?.cat?.["4d"] || "Shape matching, visual sequence completion — fostering logical thinking and visual-spatial reasoning.",
      g1: t?.cat?.["4g1"] || "Shape Puzzle",
      g1Game: "6. Simple Puzzle",
      g2: t?.cat?.["4g2"] || "Pattern Recall",
      g2Game: "4. Pattern Recall",
      gameTitle: "4. Pattern Recall"
    },
    {
      id: 5,
      name: "object",
      img: `${import.meta.env.BASE_URL}images/cat_real_object.jpg`,
      title: t?.cat?.["5t"] || "Object Identification",
      desc: t?.cat?.["5d"] || "Familiar household items, fruits, traditional tools — building object-naming confidence with culturally familiar visuals.",
      g1: t?.cat?.["5g1"] || "Find Object",
      g1Game: "7. Find the Object",
      g2: t?.cat?.["5g2"] || "Name Item",
      g2Game: "3. Picture Recall",
      gameTitle: "7. Find the Object"
    },
    {
      id: 6,
      name: "emotional",
      img: `${import.meta.env.BASE_URL}images/cat_real_emotion.jpg`,
      title: t?.cat?.["6t"] || "Emotional Engagement",
      desc: t?.cat?.["6d"] || "Folk songs, nostalgic storytelling, family memories — uplifting emotional well-being and social connection.",
      g1: t?.cat?.["6g1"] || "Music & Photos",
      g1Game: "16. Memory Art Gallery",
      g2: t?.cat?.["6g2"] || "Story Recall",
      g2Game: "11. Story Recall",
      gameTitle: "16. Memory Art Gallery"
    }
  ];

  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t?.cat?.label || "Cognitive Training Modules"}</span>
          <h2 className="section__title">
            {t?.cat?.title || "6 Cognitive Categories Keeping Minds Active & Healthy"}
          </h2>
          <p className="section__sub">
            {t?.cat?.sub || "Each category features gentle, elder-friendly exercises — including Memory Cards, Pattern Recall, Object Identification, and Daily Routine Sequencing."}
          </p>
        </div>

        <div className="cat-grid">
          {catData.map((cat) => {
            const isCompleted = !!completedTasks[cat.id];
            const isSkipped = !!skippedTasks[cat.id];

            return (
              <div
                key={cat.id}
                className={`cat-card cat-card--${cat.name} ${isCompleted ? "cat-card--completed" : ""} ${isSkipped ? "cat-card--skipped" : ""}`}
                id={`cat-${cat.id}`}
              >
                <div className="cat-card__done-badge" id={`done-${cat.id}`}>✅</div>
                <div className="cat-card__skip-badge" id={`skip-${cat.id}`}>
                  🔔 {t?.cat?.pending || "Saved in Notifications"}
                </div>
                <div className="cat-img-wrapper">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="cat-img"
                    onError={(e) => {
                      e.currentTarget.src = "/images/cat_memory_elder.svg";
                    }}
                  />
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.desc}</p>
                <div className="cat-games">
                  <button
                    type="button"
                    onClick={() => onCategoryLaunch && onCategoryLaunch(cat.id, cat.g1Game)}
                    className="cat-game cursor-pointer hover:bg-teal-100 hover:text-teal-900 transition flex items-center gap-1 border-0"
                    title={`Play ${cat.g1}`}
                  >
                    <span>▶</span> {cat.g1}
                  </button>
                  <button
                    type="button"
                    onClick={() => onCategoryLaunch && onCategoryLaunch(cat.id, cat.g2Game)}
                    className="cat-game cursor-pointer hover:bg-teal-100 hover:text-teal-900 transition flex items-center gap-1 border-0"
                    title={`Play ${cat.g2}`}
                  >
                    <span>▶</span> {cat.g2}
                  </button>
                </div>

                {/* Card Action Buttons (Enlarged Start Therapy & Skip Task) */}
                <div className="cat-card-actions">
                  <button
                    type="button"
                    onClick={() => onCategoryLaunch && onCategoryLaunch(cat.id, cat.gameTitle)}
                    className="btn btn--cat-start cursor-pointer"
                    aria-label={`Start ${cat.title} therapy`}
                  >
                    <span className="text-xl">🎮</span>
                    <span>{t?.hero?.cta1 || "Start Therapy"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSkipCategory && onSkipCategory(cat)}
                    className={`btn btn--cat-skip cursor-pointer ${isSkipped ? "is-skipped" : ""}`}
                    title={isSkipped ? "Task is in your notification bell. Click to undo." : "Skip this task and send it to your Notification Bell"}
                    aria-label={isSkipped ? "Undo skip task" : "Skip task and send to notifications"}
                  >
                    <span>{isSkipped ? "🔔 In Notifications" : "⏭️ Skip Task"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
