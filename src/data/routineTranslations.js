/**
 * routineTranslations.js — Complete Multilingual Translations for Guided Routine,
 * Memory Games, Nostalgia Recall, Neuro-Acoustic Music, and Health Reminders.
 *
 * Supported Languages:
 *   - en: English
 *   - hi: हिंदी (Hindi with accurate Devanagari and matra pronunciation)
 *   - as: অসমীয়া (Assamese)
 *   - bn: বাংলা (Bengali)
 *   - mni: মৈতৈলোন্ (Manipuri)
 *   - lus: Mizo ṭawng (Mizo)
 */

export const routineTranslations = {
  en: {
    routineTitle: "Beginner's Mode: Doctor's Appointed Care Routine",
    exitRoutine: "Exit Routine",
    skipGame: "Skip Game",
    nextExercise: "Next Exercise",
    stepOf: (curr, total) => `Step ${curr} of ${total}`,
    routineProgress: "Routine Progress",
    supervisedBy: "Supervised by Dr. Debabrata Roy, Neurologist (NIMHANS)",
    
    // 9 Games
    games: [
      {
        id: "game-1-mem",
        title: "1. MEMORY MATCH",
        domain: "Memory",
        difficulty: "Gentle",
        instruction: "Welcome to Step 1: Memory Cards. Flip the cards gently to find and match the identical pairs."
      },
      {
        id: "game-4-pattern",
        title: "2. PATTERN RECALL",
        domain: "Sequencing",
        difficulty: "Gentle",
        instruction: "Step 2: Pattern Recognition. Watch which colored lamp lights up, and tap them in the same order."
      },
      {
        id: "game-7-object",
        title: "3. FIND THE OBJECT",
        domain: "Visual Search",
        difficulty: "Gentle",
        instruction: "Step 3: Object Detection. Look at the real target item at the top and spot it in the grid below."
      },
      {
        id: "game-3-pic",
        title: "4. PICTURE RECALL",
        domain: "Visual Memory",
        difficulty: "Gentle",
        instruction: "Step 4: Picture Recall. Memorize the familiar items shown on screen, then pick them from memory."
      },
      {
        id: "game-8-color",
        title: "5. COLOR & SHAPE MATCH",
        domain: "Attention",
        difficulty: "Gentle",
        instruction: "Step 5: Attention & Focus. Read the gentle rule and tap the card that matches the color and shape."
      },
      {
        id: "game-9-routine",
        title: "6. DAILY ROUTINE SEQUENCING",
        domain: "Executive Function",
        difficulty: "Gentle",
        instruction: "Step 6: Daily Routines. Arrange these daily activities in order from morning to afternoon."
      },
      {
        id: "pm-4-cross",
        title: "7. CROSS-BODY PHYSICAL COORDINATION",
        domain: "Motor & Dual-Tasking",
        difficulty: "Gentle",
        isPhysical: true,
        instruction: "Step 7: Top Physical Exercise. Reach across gently with one hand to touch your opposite ear and nose to stimulate brain connectivity."
      },
      {
        id: "game-5-sound",
        title: "8. MEMORY SHARPENING THERAPEUTIC MUSIC",
        domain: "Neuro-Acoustic Memory Therapy",
        difficulty: "Gentle",
        isMusicSession: true,
        instruction: "Step 8: Memory-Sharpening Neuro-Acoustic Music. Sit back and listen peacefully as gentle 40Hz and 432Hz harmonic sound waves stimulate your memory synapses and clear mental fatigue."
      },
      {
        id: "game-10-place",
        title: "9. NOSTALGIA & PAST MEMORY RECALL",
        domain: "Reminiscence & Past Memory",
        difficulty: "Gentle",
        isNostalgiaRecall: true,
        instruction: "Step 9: Past Memory & Reminiscence. Observe the peaceful veranda scene and recall the exact nostalgic items from memory."
      }
    ],

    // Reminders
    remindersHeading: "Daily Health & Memory Nutrition Reminders",
    remindersSub: "Step 10 of 11 · Prescribed by Dr. Debabrata Roy",
    remindersIntroSpeech: "Well done on completing all nine prescribed exercises! Now, let's review your daily health reminders, medicine adherence, and memory-boosting nutrition one by one.",
    questionCount: (curr, total) => `Question ${curr} of ${total}`,
    yesDone: "Yes, Done!",
    remindLater: "Remind Me Later",
    markedComplete: "Wonderful! Marked as completed.",
    markedPending: "Noted. Please take care of this on schedule.",
    allRemindersDone: "All daily health reminders and memory nutrition have been checked! Click below to view your Clinical Progress Dashboard.",
    viewDashboard: "View Clinical Progress Dashboard",

    reminderItems: [
      {
        id: "morningMeds",
        heading: "08:30 AM · Morning Medicine",
        badge: "08:30 AM · Morning",
        title: "Donepezil 5mg & Multivitamin 💊",
        desc: "Take with a glass of lukewarm water after breakfast as prescribed by Dr. Debabrata Roy.",
        question: "Did you take your morning medicine: Donepezil 5mg and Multivitamin today?",
        voiceSpeech: "Did you take your morning medicine: Donepezil 5 milligrams and Multivitamin today?"
      },
      {
        id: "eveningMeds",
        heading: "08:00 PM · Evening Medicine",
        badge: "08:00 PM · Evening",
        title: "Memantine 10mg & Omega-3 💊",
        desc: "Take after dinner to support neuroplasticity and calming deep sleep.",
        question: "Did you take or set your reminder for evening medicine: Memantine 10mg and Omega-3?",
        voiceSpeech: "Did you take or set your reminder for evening medicine: Memantine 10 milligrams and Omega-3?"
      },
      {
        id: "hydration",
        heading: "Hydration Goal: 8 Glasses",
        badge: "Hydration Goal: 8 Glasses",
        title: "Drink Fresh Water / Brahmi Herbal Tea 💧",
        desc: "Maintains brain cellular hydration, prevents mental fatigue, and improves alertness.",
        question: "Did you drink plenty of fresh water or your Brahmi herbal tea for brain hydration today?",
        voiceSpeech: "Did you drink plenty of fresh water or your Brahmi herbal tea for brain hydration today?"
      },
      {
        id: "memoryNutrition",
        heading: "Superfoods for Memory",
        badge: "Superfoods for Memory",
        title: "Walnuts, Almonds & Turmeric Milk 🥑🫐🥜",
        desc: "Rich in antioxidants, DHA Omega-3, and curcumin to strengthen synaptic memory connections.",
        question: "Did you eat memory-boosting superfoods like walnuts, almonds, or turmeric milk today?",
        voiceSpeech: "Did you eat memory-boosting superfoods like walnuts, almonds, or turmeric milk today?"
      }
    ],

    // Clinical Summary
    summaryHeading: "Routine Completed! Clinical Progress Summary",
    summarySub: "Step 11 of 11 · Comprehensive Cognitive Assessment",
    summarySpeech: (name) => `Great achievement, ${name || "Lakshmi Devi"}! You have successfully completed all nine cognitive, physical, and music exercises with an overall score of 96%. Let's synchronize this clinical progress update with your doctor.`,
    overallScore: "Overall Cognitive Score",
    scoreRank: "Excellent · Top 5% Cognitive Stability",
    syncWithDoctor: "Synchronize with Doctor Dashboard",
    syncing: "Synchronizing Report with Dr. Debabrata Roy...",
    syncSuccess: "✓ Successfully Synchronized with Dr. Debabrata Roy (NIMHANS Clinic)",
    continueGames: "Continue to Free Play Games",
    homePortal: "Return to Home Portal",

    // Nostalgia Game
    nostalgia: {
      observeTitle: "Step 1: Observe the Scene Carefully",
      observeDesc: "Take a deep breath and observe these 3 nostalgic veranda items. In 10 seconds, we will ask you gentle recall questions.",
      secRemaining: (sec) => `${sec}s remaining to observe`,
      startRecallNow: "I am ready, start questions now",
      recallTitle: "Step 2: Nostalgic Recall Questions",
      correctPraise: "Excellent! That is exactly correct.",
      tryAgain: "Good try! Look at the correct picture.",
      congratsTitle: "Nostalgia Memory Recall Complete!",
      congratsDesc: "You scored 100% on episodic visual recall. Your long-term memory retrieval pathways are active and strong!",
      nextToReminders: "Continue to Daily Health Reminders (Step 10)",
      items: [
        {
          id: "cat",
          title: "Sleeping Ginger Cat",
          location: "Veranda Porch Mat",
          caption: "A fluffy ginger cat sleeping peacefully on the handwoven veranda porch mat under warm sunlight."
        },
        {
          id: "curtains",
          title: "Ocean Blue Curtains",
          location: "Veranda Window",
          caption: "Soft ocean blue cotton curtains gently swaying in the pleasant morning breeze by the window."
        },
        {
          id: "kettle",
          title: "Brass Tea Kettle & Cup",
          location: "Central Wooden Table",
          caption: "A steaming brass tea kettle and ceramic chai cup resting on the central polished wooden table."
        }
      ],
      questions: [
        {
          id: "q1",
          question: "What was resting peacefully on the veranda porch mat?",
          voiceSpeech: "Question 1: What was resting peacefully on the veranda porch mat?",
          hint: "Think about the gentle pet resting in the warm morning shade.",
          options: [
            { name: "Sleeping Ginger Cat", desc: "Curled up comfortably on the handwoven porch mat" },
            { name: "Vintage Bicycle", desc: "Parked beside the veranda gate" },
            { name: "Playful Puppy", desc: "Running in the front garden lawn" }
          ]
        },
        {
          id: "q2",
          question: "What color were the soft curtains near the veranda window?",
          voiceSpeech: "Question 2: What color were the soft curtains near the veranda window?",
          hint: "Recall the serene hue of the morning sky and ocean waves.",
          options: [
            { name: "Bright Crimson Red", desc: "Vibrant ruby drape fabric" },
            { name: "Ocean Blue Curtains", desc: "Soft sky and ocean blue cotton curtains" },
            { name: "Golden Yellow Drapes", desc: "Warm marigold colored fabric" }
          ]
        },
        {
          id: "q3",
          question: "What object was placed on the central wooden table?",
          voiceSpeech: "Question 3: What object was placed on the central wooden table?",
          hint: "Think about the warm morning beverage prepared for breakfast.",
          options: [
            { name: "Brass Tea Kettle & Cup", desc: "Steaming hot spiced cardamom chai kettle" },
            { name: "Vintage Radio Set", desc: "Antique wooden radio receiver" },
            { name: "Artist Paint Box & Brushes", desc: "Watercolor pigments and wooden palette" }
          ]
        }
      ]
    },

    // Music Session
    music: {
      title: "Step 8: Memory Sharpening Therapeutic Music",
      sub: "Neuro-Acoustic Stimulation · 40Hz Gamma & 432Hz Harmonic Frequency",
      instructions: "Sit comfortably, relax your shoulders, and listen to the therapeutic frequencies. Sound waves stimulate synaptic connections in the brain's memory centers.",
      listeningTime: "Therapeutic Listening Time",
      goal: "Goal: 30 seconds for brainwave synchronization",
      play: "Play Music",
      pause: "Pause",
      completedBadge: "✓ Brainwave Sync Goal Reached",
      finishSession: "Complete Music Therapy & Advance",
      tracks: [
        {
          id: "gamma_40hz",
          title: "40 Hz Gamma Wave Synapse Sharpener",
          badge: "Clinical Neuro-Sharpener",
          description: "40Hz Gamma acoustic stimulation activates hippocampal microglia, improving synaptic transmission and memory recall speed."
        },
        {
          id: "432hz_alpha",
          title: "432 Hz Alpha Brainwave Memory Retain",
          badge: "Cognitive Fog Cleanser",
          description: "Harmonizes brain hemispheres, clears mental fatigue, and strengthens short-term memory consolidation."
        },
        {
          id: "raga_yaman",
          title: "Raga Yaman Flute & Tanpura Harmony",
          badge: "Mind-Calm & Grounding",
          description: "Ancient meditative melody proven to induce calming alpha synchrony and awaken long-term episodic memories."
        },
        {
          id: "528hz_solfeggio",
          title: "528 Hz Solfeggio Nostalgia Awakening",
          badge: "Emotional Memory Stimulation",
          description: "Stimulates deep limbic memory centers, easing anxiety and promoting emotional well-being."
        }
      ]
    }
  },

  hi: {
    routineTitle: "शुरुआती मोड: डॉक्टर द्वारा निर्धारित दिनचर्या",
    exitRoutine: "दिनचर्या से बाहर निकलें",
    skipGame: "खेल छोड़ें",
    nextExercise: "अगला अभ्यास",
    stepOf: (curr, total) => `चरण ${curr} / ${total}`,
    routineProgress: "दिनचर्या प्रगति",
    supervisedBy: "डॉ. देबब्रत रॉय (न्यूरोलॉजिस्ट, निमहंस) द्वारा निर्देशित",

    // 9 Games
    games: [
      {
        id: "game-1-mem",
        title: "1. स्मृति मिलान (Memory Match)",
        domain: "स्मृति",
        difficulty: "सरल",
        instruction: "चरण 1 में आपका स्वागत है: मेमोरी कार्ड। कार्ड्स को धीरे से पलटें और एक जैसे जोड़े खोजें।"
      },
      {
        id: "game-4-pattern",
        title: "2. पैटर्न स्मरण (Pattern Recall)",
        domain: "अनुक्रम",
        difficulty: "सरल",
        instruction: "चरण 2: पैटर्न पहचान। ध्यान से देखें कि कौन सा रंगीन दीया जलता है, और उसी क्रम में स्पर्श करें।"
      },
      {
        id: "game-7-object",
        title: "3. वस्तु खोजें (Find the Object)",
        domain: "विज़ुअल खोज",
        difficulty: "सरल",
        instruction: "चरण 3: वस्तु पहचान। ऊपर दिए गए मुख्य चित्र को देखें और नीचे ग्रिड में खोजें।"
      },
      {
        id: "game-3-pic",
        title: "4. चित्र स्मरण (Picture Recall)",
        domain: "दृश्य स्मृति",
        difficulty: "सरल",
        instruction: "चरण 4: चित्र स्मरण। स्क्रीन पर दिखाई गई परिचित वस्तुओं को याद रखें, फिर उन्हें स्मृति से चुनें।"
      },
      {
        id: "game-8-color",
        title: "5. रंग व आकार मिलान (Color & Shape)",
        domain: "एकाग्रता",
        difficulty: "सरल",
        instruction: "चरण 5: ध्यान और एकाग्रता। सरल नियम पढ़ें और उसी रंग व आकार वाले कार्ड को स्पर्श करें।"
      },
      {
        id: "game-9-routine",
        title: "6. दैनिक दिनचर्या क्रम (Daily Routine)",
        domain: "कार्यकारी क्षमता",
        difficulty: "सरल",
        instruction: "चरण 6: दैनिक दिनचर्या। इन दैनिक गतिविधियों को सुबह से दोपहर के सही क्रम में लगाएं।"
      },
      {
        id: "pm-4-cross",
        title: "7. शारीरिक समन्वय अभ्यास (Cross-Body)",
        domain: "शारीरिक व मानसिक",
        difficulty: "सरल",
        isPhysical: true,
        instruction: "चरण 7: मुख्य शारीरिक व्यायाम। एक हाथ से विपरीत कान और नाक को धीरे से छुएं ताकि मस्तिष्क के दोनों हिस्सों में सक्रियता बढ़े।"
      },
      {
        id: "game-5-sound",
        title: "8. स्मृति तेज करने वाला संगीत (Brain Music)",
        domain: "न्यूरो-ध्वनि स्मृति थेरेपी",
        difficulty: "सरल",
        isMusicSession: true,
        instruction: "चरण 8: स्मृति तेज करने वाला संगीत। शांति से बैठें और 40 हर्ट्ज़ और 432 हर्ट्ज़ की मधुर ध्वनि सुनें जो याददाश्त की नसों को सक्रिय करती है।"
      },
      {
        id: "game-10-place",
        title: "9. पुरानी यादें और स्मरण (Nostalgia Recall)",
        domain: "पुनः स्मरण व यादें",
        difficulty: "सरल",
        isNostalgiaRecall: true,
        instruction: "चरण 9: पुरानी यादें और स्मरण। बरामदे के शांत दृश्य को ध्यान से देखें और पुरानी यादों से सही वस्तुओं को पहचानें।"
      }
    ],

    // Reminders
    remindersHeading: "दैनिक स्वास्थ्य व स्मृति पोषण अनुस्मारक",
    remindersSub: "चरण 10 / 11 · डॉ. देबब्रत रॉय द्वारा निर्धारित",
    remindersIntroSpeech: "सभी नौ अभ्यास सफलतापूर्वक पूरे करने पर बहुत-बहुत बधाई! अब आइए आपके दैनिक स्वास्थ्य अनुस्मारक, दवाइयों और स्मृति बढ़ाने वाले पोषण की समीक्षा करें।",
    questionCount: (curr, total) => `प्रश्न ${curr} / ${total}`,
    yesDone: "हाँ, ले लिया!",
    remindLater: "बाद में याद दिलाएं",
    markedComplete: "बहुत बढ़िया! पूरा चिह्नित किया गया।",
    markedPending: "नोट कर लिया गया। कृपया समय पर ध्यान रखें।",
    allRemindersDone: "सभी चार दैनिक स्वास्थ्य अनुस्मारक और स्मृति पोषण की जांच पूरी हो गई है! नीचे क्लिक करके अपना मेडिकल प्रोग्रेस डैशबोर्ड देखें।",
    viewDashboard: "चिकित्सीय प्रगति डैशबोर्ड देखें",

    reminderItems: [
      {
        id: "morningMeds",
        heading: "सुबह 08:30 · सुबह की दवा",
        badge: "सुबह 08:30 · सुबह",
        title: "डोनेपेज़िल 5mg और मल्टीविटामिन 💊",
        desc: "नाश्ते के बाद गुनगुने पानी के साथ लें, जैसा कि डॉ. देबब्रत रॉय ने बताया है।",
        question: "क्या आपने आज सुबह की दवा: डोनेपेज़िल 5 मिलीग्राम और मल्टीविटामिन ली?",
        voiceSpeech: "क्या आपने आज सुबह की दवा: डोनेपेज़िल 5 मिलीग्राम और मल्टीविटामिन ली?"
      },
      {
        id: "eveningMeds",
        heading: "रात 08:00 · शाम की दवा",
        badge: "रात 08:00 · शाम",
        title: "मेमेंटाइन 10mg और ओमेगा-3 💊",
        desc: "रात के खाने के बाद लें ताकि गहरी और शांत नींद में मस्तिष्क की नसें मजबूत हों।",
        question: "क्या आपने शाम की दवा: मेमेंटाइन 10 मिलीग्राम और ओमेगा-3 ली या रिमाइंडर सेट किया?",
        voiceSpeech: "क्या आपने शाम की दवा: मेमेंटाइन 10 मिलीग्राम और ओमेगा-3 ली या रिमाइंडर सेट किया?"
      },
      {
        id: "hydration",
        heading: "जल सेवन लक्ष्य: 8 गिलास",
        badge: "जल सेवन लक्ष्य: 8 गिलास",
        title: "ताज़ा पानी / ब्राह्मी हर्बल चाय 💧",
        desc: "मस्तिष्क की कोशिकाओं को सक्रिय रखता है, मानसिक थकान दूर करता है और सतर्कता बढ़ाता है।",
        question: "क्या आपने मस्तिष्क को तरोताजा रखने के लिए पर्याप्त पानी या ब्राह्मी हर्बल चाय पी?",
        voiceSpeech: "क्या आपने मस्तिष्क को तरोताजा रखने के लिए पर्याप्त पानी या ब्राह्मी हर्बल चाय पी?"
      },
      {
        id: "memoryNutrition",
        heading: "स्मृति बढ़ाने वाले सुपरफूड्स",
        badge: "स्मृति सुपरफूड्स",
        title: "अखरोट, बादाम और हल्दी वाला दूध 🥑🫐🥜",
        desc: "एंटीऑक्सीडेंट, ओमेगा-3 और करक्यूमिन से भरपूर जो याददाश्त के न्यूरॉन्स को मजबूत बनाते हैं।",
        question: "क्या आपने आज अखरोट, बादाम या हल्दी वाला दूध जैसे स्मृति बढ़ाने वाले सुपरफूड्स लिए?",
        voiceSpeech: "क्या आपने आज अखरोट, बादाम या हल्दी वाला दूध जैसे स्मृति बढ़ाने वाले सुपरफूड्स लिए?"
      }
    ],

    // Clinical Summary
    summaryHeading: "दिनचर्या पूर्ण! चिकित्सीय प्रगति सारांश",
    summarySub: "चरण 11 / 11 · संपूर्ण संज्ञानात्मक मूल्यांकन",
    summarySpeech: (name) => `शानदार उपलब्धि, ${name || "लक्ष्मी देवी"} जी! आपने सभी नौ संज्ञानात्मक, शारीरिक और संगीत अभ्यास 96% स्कोर के साथ पूरे कर लिए हैं। आइए इस रिपोर्ट को आपके डॉक्टर के साथ साझा करें।`,
    overallScore: "कुल संज्ञानात्मक स्कोर",
    scoreRank: "उत्कृष्ट · शीर्ष 5% संज्ञानात्मक स्थिरता",
    syncWithDoctor: "डॉक्टर डैशबोर्ड के साथ साझा करें",
    syncing: "डॉ. देबब्रत रॉय के साथ रिपोर्ट सिंक हो रही है...",
    syncSuccess: "✓ डॉ. देबब्रत रॉय (निमहंस क्लिनिक) के साथ सफलतापूर्वक साझा किया गया",
    continueGames: "अन्य सभी खेल खेलें",
    homePortal: "होम पेज पर वापस जाएं",

    // Nostalgia Game
    nostalgia: {
      observeTitle: "चरण 1: दृश्य को ध्यान से देखें",
      observeDesc: "गहरी सांस लें और बरामदे की इन 3 पुरानी वस्तुओं को ध्यान से देखें। 10 सेकंड में हम आपसे सरल प्रश्न पूछेंगे।",
      secRemaining: (sec) => `देखने के लिए ${sec} सेकंड शेष`,
      startRecallNow: "मैं तैयार हूँ, अभी प्रश्न शुरू करें",
      recallTitle: "चरण 2: पुरानी यादों के प्रश्न",
      correctPraise: "अति उत्तम! आपका उत्तर बिल्कुल सही है।",
      tryAgain: "अच्छा प्रयास! सही चित्र को ध्यान से देखें।",
      congratsTitle: "पुरानी यादों का स्मरण अभ्यास पूर्ण!",
      congratsDesc: "आपने दृश्य स्मरण में 100% स्कोर हासिल किया। आपकी दीर्घकालिक याददाश्त के रास्ते पूरी तरह सक्रिय और मजबूत हैं!",
      nextToReminders: "दैनिक स्वास्थ्य अनुस्मारक पर आगे बढ़ें (चरण 10)",
      items: [
        {
          id: "cat",
          title: "सोती हुई बिल्ली",
          location: "बरामदे की चटाई पर",
          caption: "गुनगुनी धूप में हाथ से बुनी बरामदे की चटाई पर शांति से सोती हुई सुनहरी बिल्ली।"
        },
        {
          id: "curtains",
          title: "नीले रंग के पर्दे",
          location: "बरामदे की खिड़की पर",
          caption: "खिड़की के पास सुबह की सुहानी हवा में धीरे-धीरे लहराते हल्के नीले सूती पर्दे।"
        },
        {
          id: "kettle",
          title: "पीतल की चाय की केतली व कप",
          location: "बीच की लकड़ी की मेज़ पर",
          caption: "बीच की पॉलिश की हुई लकड़ी की मेज़ पर रखी गर्म इलायची वाली चाय की पीतल की केतली और कप।"
        }
      ],
      questions: [
        {
          id: "q1",
          question: "बरामदे की चटाई पर शांति से क्या आराम कर रहा था?",
          voiceSpeech: "पहला प्रश्न: बरामदे की चटाई पर शांति से क्या आराम कर रहा था?",
          hint: "सुबह की छाया में सो रहे प्यारे पालतू जानवर के बारे में सोचें।",
          options: [
            { name: "सोती हुई बिल्ली", desc: "हाथ से बुनी चटाई पर आराम से लेटी हुई" },
            { name: "पुरानी साइकिल", desc: "बरामदे के गेट के पास खड़ी" },
            { name: "चंचल पिल्ला", desc: "सामने के बगीचे में दौड़ता हुआ" }
          ]
        },
        {
          id: "q2",
          question: "बरामदे की खिड़की के पास के पर्दे किस रंग के थे?",
          voiceSpeech: "दूसरा प्रश्न: बरामदे की खिड़की के पास के पर्दे किस रंग के थे?",
          hint: "सुबह के शांत नीले आसमान और समुद्र की लहरों के रंग को याद करें।",
          options: [
            { name: "गहरा लाल रंग", desc: "चमकदार लाल कपड़ा" },
            { name: "समुद्री नीला रंग", desc: "हल्के नीले सूती पर्दे" },
            { name: "सुनहरा पीला रंग", desc: "गेंदे के फूल जैसे पीले पर्दे" }
          ]
        },
        {
          id: "q3",
          question: "बीच की लकड़ी की मेज़ पर क्या रखा हुआ था?",
          voiceSpeech: "तीसरा प्रश्न: बीच की लकड़ी की मेज़ पर क्या रखा हुआ था?",
          hint: "सुबह के नाश्ते के लिए तैयार किए गए गर्म पेय के बारे में सोचें।",
          options: [
            { name: "पीतल की चाय की केतली व कप", desc: "गरमा-गरम इलायची चाय की केतली" },
            { name: "पुराना रेडियो सेट", desc: "लकड़ी का विंटेज रेडियो" },
            { name: "रंगों का डिब्बा व ब्रश", desc: "चित्रकारी के रंग और ब्रश" }
          ]
        }
      ]
    },

    // Music Session
    music: {
      title: "चरण 8: स्मृति तेज करने वाला संगीत",
      sub: "न्यूरो-ध्वनि उत्तेजना · 40Hz गामा और 432Hz प्राकृतिक आवृत्ति",
      instructions: "आराम से बैठें, अपने कंधों को ढीला छोड़ें, और इस शांतिपूर्ण संगीत को सुनें। यह ध्वनि तरंगें मस्तिष्क के स्मृति केंद्रों को सक्रिय करती हैं।",
      listeningTime: "उपचारात्मक सुनने का समय",
      goal: "लक्ष्य: मस्तिष्क तरंगों के संतुलन के लिए 30 सेकंड",
      play: "संगीत चलाएं",
      pause: "रोकें",
      completedBadge: "✓ मस्तिष्क तरंग संतुलन लक्ष्य पूर्ण",
      finishSession: "संगीत थेरेपी पूर्ण करें व आगे बढ़ें",
      tracks: [
        {
          id: "gamma_40hz",
          title: "40 Hz गामा तरंग स्मृति शार्पनर",
          badge: "न्यूरो-स्मृति सक्रियक",
          description: "40Hz गामा ध्वनि तरंगे हिप्पोकैम्पस की नसों को सक्रिय करती हैं, जिससे याददाश्त और सोचने की गति तेज होती है।"
        },
        {
          id: "432hz_alpha",
          title: "432 Hz अल्फा तरंग स्मृति संधारण",
          badge: "मानसिक स्पष्टता",
          description: "मस्तिष्क के दोनों हिस्सों में तालमेल बनाती है, मानसिक थकान दूर करती है और अल्पकालिक याददाश्त को मजबूत करती है।"
        },
        {
          id: "raga_yaman",
          title: "राग यमन बांसुरी व तानपुरा",
          badge: "मन को शांत व स्थिर करने वाला",
          description: "प्राचीन ध्यान संगीत जो मन को गहरी शांति देता है और पुरानी सुखद यादों को ताजा करता है।"
        },
        {
          id: "528hz_solfeggio",
          title: "528 Hz सोल्फ़ेगियो यादें जागृत राग",
          badge: "भावनात्मक शांति",
          description: "मस्तिष्क के गहरे भावनात्मक स्मृति केंद्रों को सक्रिय करता है, चिंता मिटाता है और शांति देता है।"
        }
      ]
    }
  },

  as: {
    routineTitle: "প্ৰাৰম্ভিক ম'ড: ডাক্তৰৰ নিৰ্দেশিত যত্ন ৰুটিন",
    exitRoutine: "ৰুটিনৰ পৰা ওলাই যাওক",
    skipGame: "খেল এৰি যাওক",
    nextExercise: "পৰৱৰ্তী অনুশীলন",
    stepOf: (curr, total) => `ধাপ ${curr} / ${total}`,
    routineProgress: "ৰুটিনৰ অগ্ৰগতি",
    supervisedBy: "ড° দেবব্ৰত ৰায় (স্নায়ুৰোগ বিশেষজ্ঞ, নিমহান্স) দ্বাৰা পৰিচালিত",

    games: [
      {
        id: "game-1-mem",
        title: "1. স্মৃতি মিলোৱা (Memory Match)",
        domain: "স্মৃতি",
        difficulty: "সহজ",
        instruction: "ধাপ ১ লৈ স্বাগতম: স্মৃতি কাৰ্ড। কাৰ্ডবোৰ লাহেকৈ ওলোটাওক আৰু একে জোৰা মিলাওক।"
      },
      {
        id: "game-4-pattern",
        title: "2. পেটাৰ্ন স্মৰণ (Pattern Recall)",
        domain: "ক্ৰমিক",
        difficulty: "সহজ",
        instruction: "ধাপ ২: পেটাৰ্ন চিনাক্তকৰণ। কোনটো চাকি জ্বলে চাই একে ক্ৰমত স্পৰ্শ কৰক।"
      },
      {
        id: "game-7-object",
        title: "3. বস্তু বিচাৰক (Find Object)",
        domain: "দৃষ্টি সন্ধান",
        difficulty: "সহজ",
        instruction: "ধাপ ৩: বস্তু চিনাক্তকৰণ। ওপৰৰ ছবিখন চাই তলৰ গ্ৰিডত বিচাৰক।"
      },
      {
        id: "game-3-pic",
        title: "4. ছবি স্মৰণ (Picture Recall)",
        domain: "দৃশ্য স্মৃতি",
        difficulty: "সহজ",
        instruction: "ধাপ ৪: ছবি স্মৰণ। স্ক্ৰীনত দেখা পৰিচিত বস্তুবোৰ মনত ৰাখক আৰু বাছক।"
      },
      {
        id: "game-8-color",
        title: "5. ৰং আৰু আকৃতি মিল (Color & Shape)",
        domain: "মনোযোগ",
        difficulty: "সহজ",
        instruction: "ধাপ ৫: মনোযোগ। নিৰ্দেশ পঢ়ক আৰু একে ৰং আৰু আকৃতিৰ কাৰ্ড স্পৰ্শ কৰক।"
      },
      {
        id: "game-9-routine",
        title: "6. দৈনিক ক্ৰম (Daily Routine)",
        domain: "কাৰ্যনিৰ্বাহক",
        difficulty: "সহজ",
        instruction: "ধাপ ৬: দৈনিক কামকাজ। কামবোৰ ৰাতিপুৱাৰ পৰা আবেলিৰ সঠিক ক্ৰমত সজাওক।"
      },
      {
        id: "pm-4-cross",
        title: "7. শাৰীৰিক সমন্বয় (Cross-Body)",
        domain: "শাৰীৰিক",
        difficulty: "সহজ",
        isPhysical: true,
        instruction: "ধাপ ৭: শাৰীৰিক অনুশীলন। এখন হাতেৰে বিপৰীত কাণ আৰু নাক লাহেকৈ স্পৰ্শ কৰক।"
      },
      {
        id: "game-5-sound",
        title: "8. স্মৃতি তীক্ষ্ণকাৰী সংগীত (Brain Music)",
        domain: "সংগীত থেৰাপী",
        difficulty: "সহজ",
        isMusicSession: true,
        instruction: "ধাপ ৮: স্মৃতি তীক্ষ্ণকাৰী সংগীত। শান্ত হৈ বহক আৰু ৪০ হাৰ্টজৰ ধ্বনি উপভোগ কৰক।"
      },
      {
        id: "game-10-place",
        title: "9. অতীত স্মৃতি স্মৰণ (Nostalgia Recall)",
        domain: "অতীত স্মৃতি",
        difficulty: "সহজ",
        isNostalgiaRecall: true,
        instruction: "ধাপ ৯: পুৰণি স্মৃতি। বাৰাণ্ডাৰ দৃশ্যটো চাই অতীতৰ পৰিচিত বস্তুবোৰ মনত পেলাওক।"
      }
    ],

    remindersHeading: "দৈনিক স্বাস্থ্য আৰু স্মৃতি পুষ্টি সংকেত",
    remindersSub: "ধাপ ১০ / ১১ · ড° দেবব্ৰত ৰায়ৰ নিৰ্দেশনা",
    remindersIntroSpeech: "সকলো অনুশীলন সম্পূৰ্ণ কৰাৰ বাবে অভিনন্দন! এতিয়া আপোনাৰ দৈনিক ঔষধ আৰু স্মৃতিবৰ্ধক পুষ্টি পৰীক্ষা কৰোঁ আহক।",
    questionCount: (curr, total) => `প্ৰশ্ন ${curr} / ${total}`,
    yesDone: "হয়, ললোঁ!",
    remindLater: "পাছত সোঁৱৰাব",
    markedComplete: "বৰ সুন্দৰ! সম্পূৰ্ণ বুলি চিহ্নিত কৰা হ'ল।",
    markedPending: "টোকাত ৰখা হ'ল। অনুগ্ৰহ কৰি সময়ত ল'ব।",
    allRemindersDone: "সকলো স্বাস্থ্য সংকেত পৰীক্ষা কৰা হ'ল! প্ৰগ্ৰেছ ডাছবৰ্ড চাবলৈ তলত ক্লিক কৰক।",
    viewDashboard: "চিকিৎসা প্ৰগ্ৰেছ ডাছবৰ্ড চাওক",

    reminderItems: [
      {
        id: "morningMeds",
        heading: "ৰাতিপুৱা ০৮:৩০ · ৰাতিপুৱাৰ ঔষধ",
        badge: "০৮:৩০ · ৰাতিপুৱা",
        title: "ডনেপেজিল ৫mg আৰু মাল্টিভিটামিন 💊",
        desc: "ৰাতিপুৱাৰ জলপানৰ পিছত কুহুমীয়া পানীৰে খাওক।",
        question: "আপুনি আজি ৰাতিপুৱাৰ ঔষধ ডনেপেজিল আৰু মাল্টিভিটামিন খালে নে?",
        voiceSpeech: "আপুনি আজি ৰাতিপুৱাৰ ঔষধ ডনেপেজিল আৰু মাল্টিভিটামিন খালে নে?"
      },
      {
        id: "eveningMeds",
        heading: "ৰাতি ০৮:০০ · গধূলিৰ ঔষধ",
        badge: "০৮:০০ · গধূলি",
        title: "মেমণ্টাইন ১০mg আৰু ওমেগা-৩ 💊",
        desc: "ৰাতিৰ আহাৰৰ পিছত খাওক শান্ত টোপনিৰ বাবে।",
        question: "আপুনি গধূলিৰ ঔষধ মেমণ্টাইন আৰু ওমেগা-৩ খালে নে বা ৰিমাইণ্ডাৰ দিলে নে?",
        voiceSpeech: "আপুনি গধূলিৰ ঔষধ মেমণ্টাইন আৰু ওমেগা-৩ খালে নে বা ৰিমাইণ্ডাৰ দিলে নে?"
      },
      {
        id: "hydration",
        heading: "পানী খোৱাৰ লক্ষ্য: ৮ গিলাচ",
        badge: "পানীৰ লক্ষ্য: ৮ গিলাচ",
        title: "পানী / ব্ৰাহ্মী চাহ 💧",
        desc: "মগজু সতেজ ৰাখে আৰু ক্লান্তি দূৰ কৰে।",
        question: "আপুনি আজি পৰ্যাপ্ত পানী বা ব্ৰাহ্মী চাহ খালে নে?",
        voiceSpeech: "আপুনি আজি পৰ্যাপ্ত পানী বা ব্ৰাহ্মী চাহ খালে নে?"
      },
      {
        id: "memoryNutrition",
        heading: "স্মৃতিবৰ্ধক পুষ্টিকৰ খাদ্য",
        badge: "স্মৃতি পুষ্টি",
        title: "আখৰোট, বাদাম আৰু হালধি গাখীৰ 🥑🫐🥜",
        desc: "মগজুৰ কোষসমূহ সক্ৰিয় আৰু স্মৃতি শক্তিশালী কৰে।",
        question: "আপুনি আজি আখৰোট, বাদাম বা হালধি গাখীৰ খালে নে?",
        voiceSpeech: "আপুনি আজি আখৰোট, বাদাম বা হালধি গাখীৰ খালে নে?"
      }
    ],

    summaryHeading: "ৰুটিন সম্পূৰ্ণ! চিকিৎসা অগ্ৰগতিৰ সাৰাংশ",
    summarySub: "ধাপ ১১ / ১১ · সামগ্ৰিক স্মৃতি মূল্যায়ন",
    summarySpeech: (name) => `অভিনন্দন ${name || "লক্ষ্মী দেৱী"}! আপুনি ৯৬% নম্বৰেৰে সকলো অনুশীলন সম্পূৰ্ণ কৰিলে। এতিয়া আপোনাৰ ডাক্তৰৰ লগত সংযোগী কৰোঁ আহক।`,
    overallScore: "সামগ্ৰিক কগনিটিভ স্ক'ৰ",
    scoreRank: "উৎকৃষ্ট · শীৰ্ষ ৫% স্থিৰতা",
    syncWithDoctor: "ডাক্তৰৰ সৈতে প্ৰতিবেদন সংযোগী কৰক",
    syncing: "ড° দেবব্ৰত ৰায়ৰ সৈতে প্ৰতিবেদন পঠিয়াই থকা হৈছে...",
    syncSuccess: "✓ সফলতাৰে ড° দেবব্ৰত ৰায়ৰ লগত সংযোগী হ'ল",
    continueGames: "অন্যান্য খেল খেলক",
    homePortal: "মূল পৃষ্ঠালৈ উভতি যাওক",

    nostalgia: {
      observeTitle: "ধাপ ১: দৃশ্যটো মনোযোগেৰে চাওক",
      observeDesc: "বাৰাণ্ডাৰ এই ৩টা পৰিচিত বস্তু ১০ ছেকেণ্ড চাওক। আমি ইয়াৰ পৰা প্ৰশ্ন সুধিম।",
      secRemaining: (sec) => `চাবলৈ ${sec} ছেকেণ্ড বাকী`,
      startRecallNow: "মই প্ৰস্তুত, প্ৰশ্ন আৰম্ভ কৰক",
      recallTitle: "ধাপ ২: অতীত স্মৃতিৰ প্ৰশ্ন",
      correctPraise: "বৰ ধুনীয়া! আপোনাৰ উত্তৰ সঠিক হৈছে।",
      tryAgain: "ভাল চেষ্টা! সঠিক ছবিখন চাওক।",
      congratsTitle: "অতীত স্মৃতি অনুশীলন সম্পূৰ্ণ!",
      congratsDesc: "আপুনি ১০০% নম্বৰ পালে। আপোনাৰ স্মৃতিশক্তি অতি শক্তিশালী আৰু সক্ৰিয়!",
      nextToReminders: "দৈনিক স্বাস্থ্য সংকেতলৈ আগবাঢ়ক (ধাপ ১০)",
      items: [
        { id: "cat", title: "শুই থকা মেকুৰী", location: "বাৰাণ্ডাৰ কঠত", caption: "ৰ'দত বাৰাণ্ডাৰ কঠত শান্তিৰে শুই থকা মেকুৰী।" },
        { id: "curtains", title: "নীলা পৰ্দা", location: "বাৰাণ্ডাৰ খিৰিকীত", caption: "বতাহত লাহে লাহে লৰি থকা নীলা কপাহী পৰ্দা।" },
        { id: "kettle", title: "পিতলৰ চাহৰ কেটলি আৰু কাপ", location: "কাঠৰ মেজত", caption: "কাঠৰ মেজত থকা গৰম চাহৰ পিতলৰ কেটলি আৰু কাপ।" }
      ],
      questions: [
        {
          id: "q1",
          question: "বাৰাণ্ডাৰ কঠত শান্তিৰে কি আছিল?",
          voiceSpeech: "প্ৰথম প্ৰশ্ন: বাৰাণ্ডাৰ কঠত শান্তিৰে কি আছিল?",
          hint: "ৰাতিপুৱাৰ ছাঁত শুই থকা মৰমৰ পোহনীয়া জন্তুটো মনত পেলাওক।",
          options: [
            { name: "শুই থকা মেকুৰী", desc: "বাৰাণ্ডাৰ কঠত শুই থকা" },
            { name: "পুৰণি চাইকেল", desc: "গেটৰ কাষত ৰখা" },
            { name: "কুকুৰ পোৱালি", desc: "বাগিচাত দৌৰি থকা" }
          ]
        },
        {
          id: "q2",
          question: "খিৰিকীৰ পৰ্দাৰ ৰং কি আছিল?",
          voiceSpeech: "দ্বিতীয় প্ৰশ্ন: খিৰিকীৰ পৰ্দাৰ ৰং কি আছিল?",
          hint: "পুৱাৰ শান্ত আকাশৰ ৰং মনত পেলাওক।",
          options: [
            { name: "উজ্জ্বল ৰঙা", desc: "ৰঙা কাপোৰ" },
            { name: "সাগৰীয় নীলা", desc: "হালকা নীলা পৰ্দা" },
            { name: "সোণালী হালধীয়া", desc: "হালধীয়া কাপোৰ" }
          ]
        },
        {
          id: "q3",
          question: "কাঠৰ মেজৰ ওপৰত কি বস্তু আছিল?",
          voiceSpeech: "তৃতীয় প্ৰশ্ন: কাঠৰ মেজৰ ওপৰত কি বস্তু আছিল?",
          hint: "ৰাতিপুৱাৰ গৰম চাহৰ কথা মনত পেলাওক।",
          options: [
            { name: "পিতলৰ চাহৰ কেটলি আৰু কাপ", desc: "গৰম চাহৰ কেটলি" },
            { name: "পুৰণি ৰেডিঅ'", desc: "কাঠৰ ৰেডিঅ'" },
            { name: "ৰং আৰু তুলিকা", desc: "ছবি অঁকা সামগ্ৰী" }
          ]
        }
      ]
    },

    music: {
      title: "ধাপ ৮: স্মৃতি তীক্ষ্ণকাৰী সংগীত",
      sub: "নিউৰো-অ্যাকোষ্টিক থেৰাপী · ৪০Hz আৰু ৪৩২Hz কম্পাঙ্ক",
      instructions: "আৰামেৰে বহক আৰু সংগীত উপভোগ কৰক। ই মগজুৰ স্মৃতি কেন্দ্ৰ সক্ৰিয় কৰে।",
      listeningTime: "শুনাৰ সময়",
      goal: "লক্ষ্য: ৩০ ছেকেণ্ড",
      play: "সংগীত চলাওক",
      pause: "ৰখাওক",
      completedBadge: "✓ লক্ষ্য সম্পূৰ্ণ হ'ল",
      finishSession: "সংগীত থেৰাপী সম্পূৰ্ণ কৰক",
      tracks: [
        { id: "gamma_40hz", title: "৪০ Hz গামা তৰংগ", badge: "স্মৃতি সক্ৰিয়ক", description: "মগজুৰ কোষসমূহ সক্ৰিয় কৰি স্মৃতিশক্তি বৃদ্ধি কৰে।" },
        { id: "432hz_alpha", title: "৪৩২ Hz আলফা তৰংগ", badge: "মানসিক স্থিৰতা", description: "মানসিক ক্লান্তি দূৰ কৰে আৰু মনোযোগ বৃদ্ধি কৰে।" },
        { id: "raga_yaman", title: "ৰাগ য়মন বাঁহী আৰু তানপুৰা", badge: "মন প্ৰশান্তিকৰণ", description: "মন শান্ত কৰে আৰু পুৰণি স্মৃতি জাগ্ৰত কৰে।" },
        { id: "528hz_solfeggio", title: "৫২৮ Hz ছলফেগিয়'", badge: "আৱেগিক স্থিৰতা", description: "উদ্বেগ হ্ৰাস কৰি মানসিক শান্তি প্ৰদান কৰে।" }
      ]
    }
  },

  bn: {
    routineTitle: "বিগিনার মোড: ডাক্তারের নির্ধারিত কেয়ার রুটিন",
    exitRoutine: "রুটিন থেকে বের হন",
    skipGame: "খেলা এড়িয়ে যান",
    nextExercise: "পরবর্তী ব্যায়াম",
    stepOf: (curr, total) => `ধাপ ${curr} / ${total}`,
    routineProgress: "রুটিনের অগ্রগতি",
    supervisedBy: "ডাঃ দেবব্রত রায় (নিউরোলজিস্ট, নিমহ্যান্স) দ্বারা পরিচালিত",

    games: [
      { id: "game-1-mem", title: "1. স্মৃতি মেলানো (Memory Match)", domain: "স্মৃতি", difficulty: "সহজ", instruction: "ধাপ ১-এ স্বাগতম: মেমোরি কার্ড। কার্ডগুলো উল্টে একই জোড়া মেলান।" },
      { id: "game-4-pattern", title: "2. প্যাটার্ন স্মরণ (Pattern Recall)", domain: "ক্রম", difficulty: "সহজ", instruction: "ধাপ ২: প্যাটার্ন শনাক্তকরণ। প্রদীপের আলো দেখে একই ক্রমে স্পর্শ করুন।" },
      { id: "game-7-object", title: "3. বস্তু খোঁজা (Find Object)", domain: "দৃষ্টি সন্ধান", difficulty: "সহজ", instruction: "ধাপ ৩: বস্তু শনাক্তকরণ। উপরের ছবিটি দেখে নিচের গ্রিডে খুঁজুন।" },
      { id: "game-3-pic", title: "4. ছবি স্মরণ (Picture Recall)", domain: "স্মৃতি", difficulty: "সহজ", instruction: "ধাপ ৪: ছবি স্মরণ। স্ক্রিনের পরিচিত ছবিগুলো মনে রেখে বেছে নিন।" },
      { id: "game-8-color", title: "5. রঙ ও আকার মিল (Color & Shape)", domain: "মনোযোগ", difficulty: "সহজ", instruction: "ধাপ ৫: মনোযোগ। নিয়ম পড়ে একই রঙ ও আকারের কার্ড স্পর্শ করুন।" },
      { id: "game-9-routine", title: "6. দৈনিক রুটিন ক্রম (Daily Routine)", domain: "কার্যক্রম", difficulty: "সহজ", instruction: "ধাপ ৬: দৈনিক রুটিন। সকাল থেকে দুপুরের কাজগুলো সঠিক ক্রমে সাজান।" },
      { id: "pm-4-cross", title: "7. শারীরিক সমন্বয় (Cross-Body)", domain: "শারীরিক", difficulty: "সহজ", isPhysical: true, instruction: "ধাপ ৭: শারীরিক ব্যায়াম। হাত দিয়ে বিপরীত কান ও নাক আস্তে ছুঁয়ে দিন।" },
      { id: "game-5-sound", title: "8. স্মৃতি তীক্ষ্ণকারী সঙ্গীত (Brain Music)", domain: "সঙ্গীত থেরাপি", difficulty: "সহজ", isMusicSession: true, instruction: "ধাপ ৮: স্মৃতি সঙ্গীত। শান্ত হয়ে বসুন এবং ৪০ হার্টজ সুরের স্মৃতি থেরাপি শুনুন।" },
      { id: "game-10-place", title: "9. অতীত স্মৃতি স্মরণ (Nostalgia Recall)", domain: "অতীত স্মৃতি", difficulty: "সহজ", isNostalgiaRecall: true, instruction: "ধাপ ৯: অতীত স্মৃতি। বারান্দার শান্ত দৃশ্যটি দেখে পুরোনো স্মৃতি স্মরণ করুন।" }
    ],

    remindersHeading: "দৈনিক স্বাস্থ্য ও স্মৃতি পুষ্টি অনুস্মারক",
    remindersSub: "ধাপ ১০ / ১১ · ডাঃ দেবব্রত রায়ের পরামর্শ",
    remindersIntroSpeech: "সব ব্যায়াম সম্পন্ন করার জন্য অভিনন্দন! এখন আপনার দৈনিক ওষুধ ও স্মৃতিবর্ধক খাবারের তালিকা পরীক্ষা করি।",
    questionCount: (curr, total) => `প্রশ্ন ${curr} / ${total}`,
    yesDone: "হ্যাঁ, নিয়েছি!",
    remindLater: "পরে মনে করিয়ে দিন",
    markedComplete: "চমৎকার! সম্পন্ন হিসেবে চিহ্নিত হয়েছে।",
    markedPending: "নোট করা হয়েছে। অনুগ্রহ করে সময়মতো নেবেন।",
    allRemindersDone: "সব স্বাস্থ্য অনুস্মারক পরীক্ষা সম্পন্ন! প্রগ্রেস ড্যাশবোর্ড দেখতে নিচে ক্লিক করুন।",
    viewDashboard: "ক্লিনিকাল প্রগ্রেস ড্যাশবোর্ড দেখুন",

    reminderItems: [
      { id: "morningMeds", heading: "সকাল ০৮:৩০ · সকালের ওষুধ", badge: "০৮:৩০ · সকাল", title: "ডনেপেজিল ৫mg ও মাল্টিভিটামিন 💊", desc: "সকালের নাস্তার পর কুসুম গরম পানি দিয়ে খান।", question: "আপনি কি সকালের ওষুধ ডনেপেজিল ও মাল্টিভিটামিন নিয়েছেন?", voiceSpeech: "আপনি কি সকালের ওষুধ ডনেপেজিল ও মাল্টিভিটামিন নিয়েছেন?" },
      { id: "eveningMeds", heading: "রাত ০৮:০০ · সন্ধ্যার ওষুধ", badge: "০৮:০০ · সন্ধ্যা", title: "মেম্যান্টাইন ১০mg ও ওমেগা-৩ 💊", desc: "রাতের খাবারের পর ভালো ঘুমের জন্য খান।", question: "আপনি কি সন্ধ্যার ওষুধ মেম্যান্টাইন ও ওমেগা-৩ নিয়েছেন?", voiceSpeech: "আপনি কি সন্ধ্যার ওষুধ মেম্যান্টাইন ও ওমেগা-৩ নিয়েছেন?" },
      { id: "hydration", heading: "পানি পানের লক্ষ্য: ৮ গ্লাস", badge: "পানি লক্ষ্য: ৮ গ্লাস", title: "তাজা পানি / ব্রাহ্মী চা 💧", desc: "মস্তিষ্ক সতেজ রাখে ও ক্লান্তি দূর করে।", question: "আপনি কি পর্যাপ্ত পানি বা ব্রাহ্মী চা খেয়েছেন?", voiceSpeech: "আপনি কি পর্যাপ্ত পানি বা ব্রাহ্মী চা খেয়েছেন?" },
      { id: "memoryNutrition", heading: "স্মৃতিবর্ধক পুষ্টিকর খাবার", badge: "স্মৃতি পুষ্টি", title: "আখরোট, কাঠবাদাম ও হলুদের দুধ 🥑🫐🥜", desc: "স্মৃতিশক্তি মজবুত করতে সাহায্য করে।", question: "আপনি কি আখরোট, কাঠবাদাম বা হলুদের দুধ খেয়েছেন?", voiceSpeech: "আপনি কি আখরোট, কাঠবাদাম বা হলুদের দুধ খেয়েছেন?" }
    ],

    summaryHeading: "রুটিন সম্পন্ন! ক্লিনিকাল অগ্রগতির সারসংক্ষেপ",
    summarySub: "ধাপ ১১ / ১১ · সামগ্রিক মূল্যায়ন",
    summarySpeech: (name) => `অভিনন্দন ${name || "লক্ষ্মী দেবী"}! আপনি ৯৬% স্কোরের সাথে সব ব্যায়াম সম্পন্ন করেছেন। এখন আপনার ডাক্তারের সাথে এটি শেয়ার করা যাক।`,
    overallScore: "সামগ্রিক কগনিটিভ স্কোর",
    scoreRank: "চমৎকার · শীর্ষ ৫% মানসিক স্থায়িত্ব",
    syncWithDoctor: "ডাক্তারের সাথে রিপোর্ট শেয়ার করুন",
    syncing: "ডাঃ দেবব্রত রায়ের সাথে রিপোর্ট সিঙ্ক হচ্ছে...",
    syncSuccess: "✓ ডাঃ দেবব্রত রায়ের সাথে সফলভাবে সিঙ্ক হয়েছে",
    continueGames: "অন্যান্য খেলা খেলুন",
    homePortal: "মূল পাতায় ফিরে যান",

    nostalgia: {
      observeTitle: "ধাপ ১: দৃশ্যটি মনোযোগ দিয়ে দেখুন",
      observeDesc: "বারান্দার এই ৩টি পরিচিত বস্তু ১০ সেকেন্ড দেখুন। আমরা এ থেকে প্রশ্ন করব।",
      secRemaining: (sec) => `দেখার জন্য ${sec} সেকেন্ড বাকি`,
      startRecallNow: "আমি প্রস্তুত, প্রশ্ন শুরু করুন",
      recallTitle: "ধাপ ২: অতীত স্মৃতির প্রশ্ন",
      correctPraise: "দারুণ! আপনার উত্তর একদম সঠিক।",
      tryAgain: "ভালো চেষ্টা! সঠিক ছবিটি দেখুন।",
      congratsTitle: "অতীত স্মৃতি অনুশীলন সম্পন্ন!",
      congratsDesc: "আপনি ১০০% স্কোর করেছেন। আপনার স্মৃতিশক্তি অত্যন্ত সক্রিয় ও মজবুত!",
      nextToReminders: "দৈনিক স্বাস্থ্য অনুস্মারকে যান (ধাপ ১০)",
      items: [
        { id: "cat", title: "ঘুমন্ত বিড়াল", location: "বারান্দার মাদুরে", caption: "বারান্দার মাদুরে শান্তিতে ঘুমিয়ে থাকা সোনালী বিড়াল।" },
        { id: "curtains", title: "নীল পর্দা", location: "বারান্দার জানালায়", caption: "হাওয়ায় দুলতে থাকা হালকা নীল সুতি পর্দা।" },
        { id: "kettle", title: "পিতলের চায়ের কেটলি ও কাপ", location: "কাঠের টেবিলে", caption: "কাঠের টেবিলে রাখা গরম চায়ের পিতলের কেটলি।" }
      ],
      questions: [
        { id: "q1", question: "বারান্দার মাদুরে শান্তিতে কে ঘুমাচ্ছিল?", voiceSpeech: "প্রথম প্রশ্ন: বারান্দার মাদুরে শান্তিতে কে ঘুমাচ্ছিল?", hint: "সকালের মিষ্টি রোদে ঘুমন্ত বিড়ালের কথা ভাবুন।", options: [{ name: "ঘুমন্ত বিড়াল", desc: "মাদুরে শুয়ে থাকা" }, { name: "সাইকেল", desc: "গেটের পাশে" }, { name: "কুকুরছানা", desc: "বাগানে খেলা করছে" }] },
        { id: "q2", question: "জানালার পর্দার রঙ কী ছিল?", voiceSpeech: "দ্বিতীয় প্রশ্ন: জানালার পর্দার রঙ কী ছিল?", hint: "সকালের নীল আকাশের রঙ মনে করুন।", options: [{ name: "উজ্জ্বল লাল", desc: "লাল পর্দা" }, { name: "সমুদ্র নীল", desc: "হালকা নীল পর্দা" }, { name: "হলুদ", desc: "হলুদ পর্দা" }] },
        { id: "q3", question: "কাঠের টেবিলের উপর কী ছিল?", voiceSpeech: "তৃতীয় প্রশ্ন: কাঠের টেবিলের উপর কী ছিল?", hint: "সকালের গরম চায়ের কথা মনে করুন।", options: [{ name: "পিতলের চায়ের কেটলি ও কাপ", desc: "গরম চায়ের কেটলি" }, { name: "পুরোনো রেডিও", desc: "কাঠের রেডিও" }, { name: "রঙের বাক্স", desc: "ছবি আঁকার রঙ" }] }
      ]
    },

    music: {
      title: "ধাপ ৮: স্মৃতি তীক্ষ্ণকারী সঙ্গীত",
      sub: "নিউরো-অ্যাকোস্টিক থেরাপি · ৪০Hz ও ৪৩২Hz সুর",
      instructions: "আরামে বসুন এবং সুর উপভোগ করুন। এটি মস্তিষ্কের স্মৃতি কেন্দ্র সচল রাখে।",
      listeningTime: "শোনার সময়",
      goal: "লক্ষ্য: ৩০ সেকেন্ড",
      play: "সঙ্গীত চালান",
      pause: "থামান",
      completedBadge: "✓ লক্ষ্য পূর্ণ হয়েছে",
      finishSession: "সঙ্গীত থেরাপি সম্পন্ন করুন",
      tracks: [
        { id: "gamma_40hz", title: "৪০ Hz গামা তরঙ্গ", badge: "স্মৃতি সক্রিয়কারী", description: "মস্তিষ্কের কোষ সচল করে দ্রুত চিন্তা ও স্মৃতি ফিরিয়ে আনে।" },
        { id: "432hz_alpha", title: "৪৩২ Hz আলফা তরঙ্গ", badge: "মানসিক স্পষ্টতা", description: "মানসিক ক্লান্তি দূর করে এবং একাগ্রতা বাড়ায়।" },
        { id: "raga_yaman", title: "রাগ ইমন বাঁশি ও তানপুরা", badge: "মন প্রশান্তিকারী", description: "মন শান্ত করে এবং পুরোনো মধুর স্মৃতি জাগিয়ে তোলে।" },
        { id: "528hz_solfeggio", title: "৫২৮ Hz সলফেগিও", badge: "মানসিক শান্তি", description: "উদ্বেগ কমায় এবং গভীর প্রশান্তি দেয়।" }
      ]
    }
  },

  mni: {
    routineTitle: "হৌরকপগী মোদ: লাইয়েংবগী নিংথিনা চৎন-পথাপ",
    exitRoutine: "মোদ থাদোকপা",
    skipGame: "খেল হেন্দোকপা",
    nextExercise: "মথংগী এক্সরসাইজ",
    stepOf: (curr, total) => `তাংকক ${curr} / ${total}`,
    routineProgress: "চৎন-পথাপগী মায়পাকপা",
    supervisedBy: "ডাঃ দেবব্রত রায়না লুচিংবা",

    games: [
      { id: "game-1-mem", title: "1. ৱাখল কাউদনা থম্বা (Memory Match)", domain: "ৱাখল", difficulty: "লাইবা", instruction: "তাংকক ১ দা তরাম্না ওকচরি: মেমোরি কার্দ। কার্দশিং অসুম্না ওন্থোক্তুনা চপ মান্নবা কার্দশিং য়েন্থোকউ।" },
      { id: "game-4-pattern", title: "2. পেতর্ন নীংশিংবা (Pattern Recall)", domain: "মথং-মনাও", difficulty: "লাইবা", instruction: "তাংকক ২: মচুগী মৈঙাল য়েংলগা মথং-মনাও চয়নবা তৌ।" },
      { id: "game-7-object", title: "3. পোৎলম থিবা (Find Object)", domain: "উবা", difficulty: "লাইবা", instruction: "তাংকক ৩: মথক্তা পীবা পোৎলম অদু মখাদা থিদোকউ।" },
      { id: "game-3-pic", title: "4. ফোতো নীংশিংবা (Picture Recall)", domain: "ৱাখল", difficulty: "লাইবা", instruction: "তাংকক ৪: উরিবা ফোতোশিং অদু ৱাখলদা থম্লগা খল্লু।" },
      { id: "game-8-color", title: "5. মচু অমসুং শক্তম (Color & Shape)", domain: "মিৎয়েং", difficulty: "লাইবা", instruction: "তাংকক ৫: নিয়ম পাবা অমসুং চপ মান্নবা কার্দ নম্বা।" },
      { id: "game-9-routine", title: "6. নোংমগী থবক (Daily Routine)", domain: "থবক", difficulty: "লাইবা", instruction: "তাংকক ৬: নোংমগী থবকশিং অয়ুকতগী নুমিৎথাং ফাওবা মথং-মনাও চয়নবা।" },
      { id: "pm-4-cross", title: "7. হকচাংগী এক্সরসাইজ (Cross-Body)", domain: "হকচাং", difficulty: "লাইবা", isPhysical: true, instruction: "তাংকক ৭: খুৎ অমনা নাতোন অমসুং নাকোং লাহেক্না সোকপা।" },
      { id: "game-5-sound", title: "8. ৱাখল শেংহনবা ঈশৈ (Brain Music)", domain: "ঈশৈ", difficulty: "লাইবা", isMusicSession: true, instruction: "তাংকক ৮: ঈশৈ তাবগী থেরাপী।" },
      { id: "game-10-place", title: "9. অরিবা ৱাখল নীংশিংবা (Nostalgia Recall)", domain: "অরিবা ৱাখল", difficulty: "লাইবা", isNostalgiaRecall: true, instruction: "তাংকক ৯: অরিবা মতমগী মমি অদু য়েংলগা নীংশিংবা।" }
    ],

    remindersHeading: "নোংমগী হকশেল অমসুং হিদাক-লাংথক",
    remindersSub: "তাংকক ১০ / ১১",
    remindersIntroSpeech: "এক্সরসাইজ পুম্নমক লোইশিনবগীদমক হরাওচরি! হৌজিক অদোমগী হিদাক-লাংথক অমসুং মচি ওম্বা চীঞ্জাক নীংশিংমিন্নসি।",
    questionCount: (curr, total) => `ৱাহং ${curr} / ${total}`,
    yesDone: "হোই, চারবনি!",
    remindLater: "কনাহৈ নীংশিংহল্লু",
    markedComplete: "য়াম্না ফরে! লোইরে হাপ্লে।",
    markedPending: "মতম চানা লৌবা ফবা।",
    allRemindersDone: "পুম্নমক লোইরে! মখাদা নম্বীয়ু।",
    viewDashboard: "প্রোগ্রেস দেশবোর্দ য়েংবা",

    reminderItems: [
      { id: "morningMeds", heading: "অয়ুক ০৮:৩০ · অয়ুক্কী হিদাক", badge: "০৮:৩০ · অয়ুক", title: "দনেপেজিল ৫mg অমসুং মল্টিভিতামিন 💊", desc: "অয়ুক্কী চা-থক চারগা ইশিংগা লোয়ননা চাবিয়ু।", question: "অদোম অয়ুক্কী হিদাক চারেব্রা?", voiceSpeech: "অদোম অয়ুক্কী হিদাক চারেব্রা?" },
      { id: "eveningMeds", heading: "নুমিদাং ০৮:০০ · নুমিদাংগী হিদাক", badge: "০৮:০০ · নুমিদাং", title: "মেমন্তাইন ১০mg অমসুং ওমেগা-৩ 💊", desc: "নুমিদাংগী চাক চারগা চাবিয়ু।", question: "অদোম নুমিদাংগী হিদাক চারেব্রা?", voiceSpeech: "অদোম নুমিদাংগী হিদাক চারেব্রা?" },
      { id: "hydration", heading: "ইশিং থকপগী পান্দম: গ্লাস ৮", badge: "ইশিং: গ্লাস ৮", title: "অশেংবা ইশিং / ব্রাহ্মী চা 💧", desc: "ৱাখল শেংহনবা অমসুং হকচাং ফহনবা।", question: "অদোম ইশিং নত্রগা ব্রাহ্মী চা থকখ্রেব্রা?", voiceSpeech: "অদোম ইশিং নত্রগা ব্রাহ্মী চা থকখ্রেব্রা?" },
      { id: "memoryNutrition", heading: "ৱাখল কন্থনবা চীঞ্জাক", badge: "মচি ওম্বা চীঞ্জাক", title: "হীদাক্কী বাদাম অমসুং কুসমলৈ য়াবা শংগোম 🥑🫐🥜", desc: "ৱাখল থৌনা কনহনবা চীঞ্জাক।", question: "অদোম বাদাম নত্রগা শংগোম চারেব্রা?", voiceSpeech: "অদোম বাদাম নত্রগা শংগোম চারেব্রা?" }
    ],

    summaryHeading: "চৎন-পথাপ লোইরে! হকশেলগী প্রোগ্রেস",
    summarySub: "তাংকক ১১ / ১১",
    summarySpeech: (name) => `অভিনন্দন ${name || "লক্ষ্মী দেবী"}! অদোম ৯৬% স্কোরগা লোয়ননা লোইশিনখ্রে।`,
    overallScore: "কগনিটিভ স্কোর",
    scoreRank: "য়াম্না ফবা",
    syncWithDoctor: "দাস্তারদা প্রোগ্রেস শেয়ার তৌবা",
    syncing: "দাস্তারদা শেয়ার তৌরি...",
    syncSuccess: "✓ দাঃ দেবব্রত রায়দা মপুংফানা থাখ্রে",
    continueGames: "অতোপ্পা শান্নবা",
    homePortal: "অহানবা লামাইদা চৎপা",

    nostalgia: {
      observeTitle: "তাংকক ১: অরিবা মমি য়েংবা",
      observeDesc: "সেকেন্ড ১০ নিংথিনা য়েংবিয়ু।",
      secRemaining: (sec) => `সেকেন্ড ${sec} ঙাইরি`,
      startRecallNow: "ৱাহং হৌরো",
      recallTitle: "তাংকক ২: অরিবা ৱাখলগী ৱাহং",
      correctPraise: "য়াম্না ফরে! চুম্লে।",
      tryAgain: "ফনা হোৎনরে! চপ চাবা মমি য়েংউ।",
      congratsTitle: "অরিবা ৱাখল নীংশিংবা লোইরে!",
      congratsDesc: "অদোম ১০০% ফংলে!",
      nextToReminders: "মথংগী তাংকক (১০)",
      items: [
        { id: "cat", title: "তুম্লিবা হৌদোং", location: "কঠতা", caption: "কঠতা তুম্লিবা হৌদোং।" },
        { id: "curtains", title: "মচু নীংথিবা পর্দ্দা", location: "থোংনাওদা", caption: "নুংশিৎনা থোংনাওদা লাহেক্না য়েংলিবা পর্দ্দা।" },
        { id: "kettle", title: "পিতলগী চা কেতলি", location: "তেবলদা", caption: "তেবলদা থম্বা চা কেতলি।" }
      ],
      questions: [
        { id: "q1", question: "কঠতা কনা তুম্লিবগে?", voiceSpeech: "অহানবা ৱাহং: কঠতা কনা তুম্লিবগে?", hint: "হৌদোংগী মতাংদা খল্লু।", options: [{ name: "তুম্লিবা হৌদোং", desc: "কঠতা তুম্লিবা" }, { name: "সাইকল", desc: "থোং কাছাদা" }, { name: "হুই মচা", desc: "শান্নরিবা" }] },
        { id: "q2", question: "পর্দ্দাগী মচুদু করিনো?", voiceSpeech: "অনিশুবা ৱাহং: পর্দ্দাগী মচুদু করিনো?", hint: "নীলা মচুগী মতাংদা খল্লু।", options: [{ name: "ঙাংবা", desc: "ঙাংবা" }, { name: "নীলা", desc: "নীলা পর্দ্দা" }, { name: "য়াইঙং", desc: "য়াইঙং" }] },
        { id: "q3", question: "তেবল মথক্তা করি লৈবগে?", voiceSpeech: "অহুমশুবা ৱাহং: তেবল মথক্তা করি লৈবগে?", hint: "চাগী মতাংদা খল্লু।", options: [{ name: "পিতলগী চা কেতলি", desc: "চা কেতলি" }, { name: "রেদিও", desc: "রেদিও" }, { name: "মচুগী বাকচ", desc: "আর্ট" }] }
      ]
    },

    music: {
      title: "তাংকক ৮: ৱাখল শেংহনবা ঈশৈ",
      sub: "৪০Hz & ৪৩২Hz",
      instructions: "ঈশৈ তারগা ৱাখল শেংহল্লু।",
      listeningTime: "তাবগী মতম",
      goal: "পান্দম: সেকেন্ড ৩০",
      play: "ঈশৈ শান্নবা",
      pause: "লেপপা",
      completedBadge: "✓ লোইরে",
      finishSession: "মথংদা চৎপা",
      tracks: [
        { id: "gamma_40hz", title: "৪০ Hz গামা তৰংগ", badge: "ৱাখল সক্রিয়ক", description: "মস্তিষ্ক সক্রিয় তৌই।" },
        { id: "432hz_alpha", title: "৪৩২ Hz আলফা তৰংগ", badge: "মানসিক শান্তি", description: "মানসিক ক্লান্তি দূর তৌই।" },
        { id: "raga_yaman", title: "রাগ ইমন বাঁশি", badge: "শান্তি", description: "মন শান্ত তৌই।" },
        { id: "528hz_solfeggio", title: "৫২৮ Hz সলফেগিও", badge: "নুংশিবা", description: "শান্তি পীব।" }
      ]
    }
  },

  lus: {
    routineTitle: "Beginner Mode: Daktawr Ruahman Thiltih Dan",
    exitRoutine: "Chhuak rawh",
    skipGame: "Khêl kalsan rawh",
    nextExercise: "A dawt chhunzawm rawh",
    stepOf: (curr, total) => `Step ${curr} / ${total}`,
    routineProgress: "Hmasawnna",
    supervisedBy: "Dr. Debabrata Roy (NIMHANS) enkawlna hnuaiah",

    games: [
      { id: "game-1-mem", title: "1. Hriatrengna Match (Memory Match)", domain: "Hriatrengna", difficulty: "Awlsam", instruction: "Step 1-ah kan lo lawm a che: Card inangte zawng rawh le." },
      { id: "game-4-pattern", title: "2. Pattern Hriatreng (Pattern Recall)", domain: "Indawt dan", difficulty: "Awlsam", instruction: "Step 2: Khawnvar eng dan en la, a indawtin hmet rawh." },
      { id: "game-7-object", title: "3. Thil Zawnchhuah (Find Object)", domain: "Mit", difficulty: "Awlsam", instruction: "Step 3: Chunga thil awm hi hnuai lamah zawng rawh le." },
      { id: "game-3-pic", title: "4. Thlalak Hriatna (Picture Recall)", domain: "Hriatna", difficulty: "Awlsam", instruction: "Step 4: Thlalak hmuhte hi hria la, thlang chhuak rawh." },
      { id: "game-8-color", title: "5. Rawng leh Pianhmang (Color & Shape)", domain: "Ngaihtuahna", difficulty: "Awlsam", instruction: "Step 5: A rawng leh a pianhmang inmil thlang rawh." },
      { id: "game-9-routine", title: "6. Nitin Thiltih Indawt (Daily Routine)", domain: "Thiltih", difficulty: "Awlsam", instruction: "Step 6: Zing aṭanga tlai thlenga thiltihte a indawtin rem rawh." },
      { id: "pm-4-cross", title: "7. Taksa Insawizawina (Cross-Body)", domain: "Taksa", difficulty: "Awlsam", isPhysical: true, instruction: "Step 7: Kut lehlam hmangin beng leh hnar tawk rawh le." },
      { id: "game-5-sound", title: "8. Hriatna Tichak Rimawi (Brain Music)", domain: "Rimawi", difficulty: "Awlsam", isMusicSession: true, instruction: "Step 8: 40Hz rimawi hahdam takin ngaithla rawh le." },
      { id: "game-10-place", title: "9. Hmanlai Hriatna (Nostalgia Recall)", domain: "Hmanlai", difficulty: "Awlsam", isNostalgiaRecall: true, instruction: "Step 9: Veranda hmun mawi tak en la, hmanlai thilte hrechhuak rawh." }
    ],

    remindersHeading: "Nitin Hriselna leh Damdawi Hriattirna",
    remindersSub: "Step 10 / 11 · Dr. Debabrata Roy chawh",
    remindersIntroSpeech: "I ti ṭha hle mai! Tunah i nitin damdawi leh eitur ṭhate i enfiah ang aw.",
    questionCount: (curr, total) => `Zawhna ${curr} / ${total}`,
    yesDone: "Aw, ka ti zo e!",
    remindLater: "Nakinah min hrilh leh rawh",
    markedComplete: "A ṭha e! Tih zawhah dah a ni.",
    markedPending: "Hriat a ni e. A hun takah ei ngei ang che.",
    allRemindersDone: "Hriselna hriattirna zawng zawng i zo ta! Dashboard en turin hmet rawh.",
    viewDashboard: "Clinical Dashboard En rawh",

    reminderItems: [
      { id: "morningMeds", heading: "08:30 AM · Zing Damdawi", badge: "08:30 AM · Zing", title: "Donepezil 5mg & Multivitamin 💊", desc: "Zing chaw eikhamah tui lum nen ei rawh.", question: "Zing damdawi Donepezil leh Multivitamin i ei tawh em?", voiceSpeech: "Zing damdawi Donepezil leh Multivitamin i ei tawh em?" },
      { id: "eveningMeds", heading: "08:00 PM · Zan Damdawi", badge: "08:00 PM · Zan", title: "Memantine 10mg & Omega-3 💊", desc: "Zan mut hahdam nan chaw eikhamah ei rawh.", question: "Zan damdawi Memantine leh Omega-3 i ei tawh em?", voiceSpeech: "Zan damdawi Memantine leh Omega-3 i ei tawh em?" },
      { id: "hydration", heading: "Tui In Tur: No 8", badge: "Tui: No 8", title: "Tui Thianghlim / Brahmi Thingpui 💧", desc: "Thluak tichaktu leh hahdamna.", question: "Vawiinah tui tam tawk i in tawh em?", voiceSpeech: "Vawiinah tui tam tawk i in tawh em?" },
      { id: "memoryNutrition", heading: "Hriatna Tichak Eitur", badge: "Eitur Ṭha", title: "Walnut, Almond & Aieng Hnute 🥑🫐🥜", desc: "Thluak hriatna tichaktu.", question: "Walnut emaw Aieng Hnute i in tawh em?", voiceSpeech: "Walnut emaw Aieng Hnute i in tawh em?" }
    ],

    summaryHeading: "Zo Ta! Hmasawnna Enna",
    summarySub: "Step 11 / 11 · Enkawlna Pumhlum",
    summarySpeech: (name) => `I ti ṭha hle mai ${name || "Lakshmi"}! 96% score nen i zo e. Daktawr hnenah i thawn ang aw.`,
    overallScore: "Hriatna Score",
    scoreRank: "A ṭha ber · Top 5%",
    syncWithDoctor: "Daktawr hnenah thawn rawh",
    syncing: "Dr. Debabrata Roy hnenah a thawn mek...",
    syncSuccess: "✓ Dr. Debabrata Roy hnenah hlawhtling takin a thleng ta",
    continueGames: "Infiamna dang khel rawh",
    homePortal: "Home-ah kir rawh",

    nostalgia: {
      observeTitle: "Step 1: Ngun takin en rawh",
      observeDesc: "Second 10 chhung heng thil pathumte hi ngun takin en rawh le.",
      secRemaining: (sec) => `Second ${sec} chhung en rawh`,
      startRecallNow: "Ka inpeih e, tan rawh",
      recallTitle: "Step 2: Hriatrengna Zawhnate",
      correctPraise: "A dik chiah e! I ti ṭha hle mai.",
      tryAgain: "Tum ṭha e! Thlalak dik zawk en rawh le.",
      congratsTitle: "Hmanlai Hriatna Khêl Zo Ta!",
      congratsDesc: "100% score i hmu e! I hriatrengna a la ṭha hle mai.",
      nextToReminders: "Damdawi Hriattirnah kal rawh (Step 10)",
      items: [
        { id: "cat", title: "Zawhte Muhil", location: "Veranda phah chungah", caption: "Nisa hnuaiah zawhte a muhil siai siai." },
        { id: "curtains", title: "Puanzar Pawl", location: "Tukverhah", caption: "Thli tleh zawnga puanzar pawl inthlep diai diai." },
        { id: "kettle", title: "Dar Ketli leh Thingpui No", location: "Dawhkan chungah", caption: "Thingpui sa ver vawr dar ketli." }
      ],
      questions: [
        { id: "q1", question: "Veranda phah chungah eng nge awm?", voiceSpeech: "Zawhna 1: Veranda phah chungah eng nge awm?", hint: "Rannung muhil chungchang ngaihtuah rawh.", options: [{ name: "Zawhte Muhil", desc: "Phah chunga muhil" }, { name: "Bicycle", desc: "Gate bulah" }, { name: "Ui note", desc: "Tualah a tlan" }] },
        { id: "q2", question: "Puanzar rawng eng nge ni?", voiceSpeech: "Zawhna 2: Puanzar rawng eng nge ni?", hint: "Van rawng pawl ngaihtuah rawh.", options: [{ name: "Sen", desc: "Puan sen" }, { name: "Pawl", desc: "Puanzar pawl" }, { name: "Eng", desc: "Puan eng" }] },
        { id: "q3", question: "Dawhkan chungah eng nge awm?", voiceSpeech: "Zawhna 3: Dawhkan chungah eng nge awm?", hint: "Zing thingpui sa ver vawr ngaihtuah rawh.", options: [{ name: "Dar Ketli leh Thingpui No", desc: "Thingpui ketli" }, { name: "Radio", desc: "Hmanlai radio" }, { name: "Rawng hnawihna", desc: "Art box" }] }
      ]
    },

    music: {
      title: "Step 8: Hriatna Tichak Rimawi",
      sub: "40Hz & 432Hz",
      instructions: "Hahdam takin ngaithla la, i thluak a tiharh ang.",
      listeningTime: "Ngaihthlak hun",
      goal: "Pandum: Second 30",
      play: "Rimawi Ti Nung Rawh",
      pause: "Chawlhlawk",
      completedBadge: "✓ Zo Ta",
      finishSession: "Chhunzawm rawh",
      tracks: [
        { id: "gamma_40hz", title: "40 Hz Gamma Wave", badge: "Thluak Tichaktu", description: "Hriatna tichak zualtu rimawi." },
        { id: "432hz_alpha", title: "432 Hz Alpha Wave", badge: "Hahdamna", description: "Hahdam tak leh hriatna nghet siamtu." },
        { id: "raga_yaman", title: "Raga Yaman Flute", badge: "Thlamuanna", description: "Thinlung tituaitu hmanlai rimawi." },
        { id: "528hz_solfeggio", title: "528 Hz Solfeggio", badge: "Hlimna", description: "Lungngaihna tirehtu rimawi." }
      ]
    }
  }
};
