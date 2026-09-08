/**
 * tourData.js — Guided Tour static instruction data
 * Maps step index (1-6) × language code → { title, desc }
 * English ("en") is the mandatory fallback for all steps.
 */

export const TOUR_INSTRUCTIONS = {
  1: {
    en: {
      title: "Memory Enhancement",
      desc: "Memory card pairs, image recall, family face recognition — AI detects difficulty patterns to strengthen retention.",
    },
    hi: {
      title: "स्मृति सुधार",
      desc: "मेमोरी कार्ड, चित्र याद करना, परिवार के फोटो पहचानना — AI आपकी कमज़ोरी पहचानकर अभ्यास बढ़ाता है।",
    },
    as: {
      title: "স্মৃতি বিকাশ",
      desc: "মেমৰি কাৰ্ড, ছবি মনত পেলোৱা, পৰিয়ালৰ ফটো — AI-এ দুৰ্বলতা চিনাক্ত কৰি সহায় কৰে।",
    },
    mni: {
      title: "Memory Enhancement",
      desc: "Memory card pairs, image recall, family face recognition — AI detects difficulty patterns to strengthen retention.",
    },
    nag: {
      title: "Memory Enhancement",
      desc: "Memory card pairs, image recall, family face recognition — AI detects difficulty patterns to strengthen retention.",
    },
  },
  2: {
    en: {
      title: "Attention & Focus",
      desc: "Color matching and focused attention exercises — tracking response time and motor precision.",
    },
    hi: {
      title: "ध्यान और एकाग्रता",
      desc: "रंग पहचान, ध्यान केंद्रित करने के खेल — प्रतिक्रिया समय और सटीकता को ट्रैक करता है।",
    },
    as: {
      title: "মনোযোগ আৰু একাগ্ৰতা",
      desc: "ৰং চিনাক্তকৰণ আৰু মনোযোগৰ খেল — সময় আৰু সঠিকতা অনুসৰণ কৰে।",
    },
    mni: {
      title: "Attention & Focus",
      desc: "Color matching and focused attention exercises — tracking response time and motor precision.",
    },
    nag: {
      title: "Attention & Focus",
      desc: "Color matching and focused attention exercises — tracking response time and motor precision.",
    },
  },
  3: {
    en: {
      title: "Daily Routines",
      desc: "Medication schedules, morning routines, grocery lists — sequencing real-life daily tasks.",
    },
    hi: {
      title: "दैनिक दिनचर्या",
      desc: "दवा का समय, सुबह की दिनचर्या, खरीदारी सूची — असली जीवन की गतिविधियों को क्रम में लगाना।",
    },
    as: {
      title: "দৈনন্দিন নিয়ম",
      desc: "ঔষধৰ সময়, ৰাতিপুৱাৰ নিয়ম — জীৱনৰ কামবোৰ ক্ৰম অনুসৰি সজোৱা।",
    },
    mni: {
      title: "Daily Routines",
      desc: "Medication schedules, morning routines, grocery lists — sequencing real-life daily tasks.",
    },
    nag: {
      title: "Daily Routines",
      desc: "Medication schedules, morning routines, grocery lists — sequencing real-life daily tasks.",
    },
  },
  4: {
    en: {
      title: "Pattern Recognition",
      desc: "Shape matching, visual sequence completion — fostering logical thinking and visual-spatial reasoning.",
    },
    hi: {
      title: "पैटर्न पहचान",
      desc: "आकार मिलान, अनुक्रम पूरा करना — तार्किक सोच और विज़ुअल-स्थानिक कौशल।",
    },
    as: {
      title: "পেটাৰ্ণ চিনাক্তকৰণ",
      desc: "আকাৰ মিলোৱা আৰু যুক্তিপূৰ্ণ চিন্তাৰ খেল।",
    },
    mni: {
      title: "Pattern Recognition",
      desc: "Shape matching, visual sequence completion — fostering logical thinking and visual-spatial reasoning.",
    },
    nag: {
      title: "Pattern Recognition",
      desc: "Shape matching, visual sequence completion — fostering logical thinking and visual-spatial reasoning.",
    },
  },
  5: {
    en: {
      title: "Object Identification",
      desc: "Familiar household items, fruits, traditional tools — building object-naming confidence with culturally familiar visuals.",
    },
    hi: {
      title: "वस्तु पहचान",
      desc: "परिचित वस्तुएं, फल, घरेलू सामान — सांस्कृतिक रूप से परिचित चित्रों से पहचान अभ्यास।",
    },
    as: {
      title: "বস্তু চিনাক্তকৰণ",
      desc: "ঘৰুৱা বস্তু, ফল-মূল — সাংস্কৃতিকভাৱে চিনাকি ছবিৰে চিনাক্তকৰণ।",
    },
    mni: {
      title: "Object Identification",
      desc: "Familiar household items, fruits, traditional tools — building object-naming confidence with culturally familiar visuals.",
    },
    nag: {
      title: "Object Identification",
      desc: "Familiar household items, fruits, traditional tools — building object-naming confidence with culturally familiar visuals.",
    },
  },
  6: {
    en: {
      title: "Emotional Engagement",
      desc: "Folk songs, nostalgic storytelling, family memories — uplifting emotional well-being and social connection.",
    },
    hi: {
      title: "भावनात्मक जुड़ाव",
      desc: "बिहू संगीत, पुरानी यादें, पारिवारिक फोटो गतिविधियाँ — भावनात्मक स्वास्थ्य और जुड़ाव।",
    },
    as: {
      title: "আৱেগিক সংযোগ",
      desc: "বিহু গান, পুৰণি স্মৃতি — মনৰ আনন্দ আৰু আৱেগিক স্বাস্থ্যৰ বাবে।",
    },
    mni: {
      title: "Emotional Engagement",
      desc: "Folk songs, nostalgic storytelling, family memories — uplifting emotional well-being and social connection.",
    },
    nag: {
      title: "Emotional Engagement",
      desc: "Folk songs, nostalgic storytelling, family memories — uplifting emotional well-being and social connection.",
    },
  },
};

/** Display names for each step, used by PendingPanel */
export const TASK_NAMES = {
  1: "Memory Enhancement",
  2: "Attention & Focus",
  3: "Daily Routines",
  4: "Pattern Recognition",
  5: "Object Identification",
  6: "Emotional Engagement",
};

/** Maps tour step index → cognitive game domain string */
export const TASK_GAME_MAP = {
  1: "memory",
  2: "attention",
  3: "daily_routine",
  4: "pattern",
  5: "object",
  6: "emotional",
};
