export const initialPatientProfile = {
  id: "pat-1002",
  name: "Lakshmi Devi",
  preferredName: "Lakshmi",
  age: 72,
  gender: "Female",
  condition: "Mild Cognitive Observation \xB7 Baseline Monitoring",
  language: "en",
  fontSizeScale: "large",
  voiceAssistanceEnabled: true,
  caregiverName: "Ananya Sharma (Daughter)",
  caregiverPhone: "+91 98765 43210",
  doctorName: "Dr. Debabrata Roy, MD",
  doctorHospital: "Apollo Neurological & Cognitive Care Centre",
  nextAppointment: "Tomorrow, 4:00 PM (Tele-Consult)",
  streakDays: 5,
  activitiesCompletedThisWeek: 18,
  totalActivitiesWeek: 21,
  isOffline: false,
  pendingSyncCount: 0
};
export const initialTasks = [
  {
    id: "task-1",
    title: "MEMORY MATCH",
    domain: "Memory",
    difficulty: "Easy",
    durationMinutes: 5,
    doctorAssigned: true,
    assignedTime: "08:00",
    status: "completed",
    score: 92,
    accuracy: 92,
    timeSpentSeconds: 240,
    // 4 min
    errors: 1,
    iconName: "Brain",
    description: "Find matching pairs of familiar traditional items.",
    required: true
  },
  {
    id: "task-2",
    title: "PATTERN RECALL",
    domain: "Attention",
    difficulty: "Easy",
    durationMinutes: 4,
    doctorAssigned: true,
    assignedTime: "11:00",
    status: "completed",
    score: 88,
    accuracy: 86,
    timeSpentSeconds: 210,
    // 3.5 min
    errors: 2,
    iconName: "Sparkles",
    description: "Remember the sequence of lighting lamps in order.",
    required: true
  },
  {
    id: "task-3",
    title: "STORY RECALL",
    domain: "Recall",
    difficulty: "Medium",
    durationMinutes: 5,
    doctorAssigned: true,
    assignedTime: "17:00",
    status: "pending",
    score: 0,
    accuracy: 0,
    timeSpentSeconds: 0,
    errors: 0,
    iconName: "BookOpen",
    description: "Listen to a short tale about a village festival and answer 3 simple questions.",
    required: true
  }
];
export const initialFreePlayGames = [
  {
    id: "game-1-mem",
    title: "1. Memory Match",
    domain: "Memory",
    durationMinutes: 4,
    iconName: "Brain",
    description: "Flip cards and find matching pairs of familiar objects.",
    isOptional: true,
    category: "memory"
  },
  {
    id: "game-2-number",
    title: "2. Number Recall",
    domain: "Recall",
    durationMinutes: 3,
    iconName: "Hash",
    description: "Remember a sequence of numbers and enter them on the keypad.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "game-3-picture",
    title: "3. Picture Recall",
    domain: "Recall",
    durationMinutes: 4,
    iconName: "Eye",
    description: "Observe 4\u20136 shown objects, remember them, then select them.",
    isOptional: true,
    category: "visual"
  },
  {
    id: "game-4-pattern",
    title: "4. Pattern Recall",
    domain: "Attention",
    durationMinutes: 4,
    iconName: "Sparkles",
    description: "Remember the highlighted lighting sequence and reproduce it.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "game-5-sound",
    title: "5. Sound Match",
    domain: "Attention",
    durationMinutes: 3,
    iconName: "Volume2",
    description: "Listen carefully to ambient sounds and select the matching source.",
    isOptional: true,
    category: "memory"
  },
  {
    id: "game-6-puzzle",
    title: "6. Simple Puzzle",
    domain: "Pattern",
    durationMinutes: 4,
    iconName: "Puzzle",
    description: "Arrange jigsaw pieces to complete a familiar cultural scene.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "game-7-find-object",
    title: "7. Find the Object",
    domain: "Attention",
    durationMinutes: 3,
    iconName: "Search",
    description: "Spot the target object hidden among various items as quickly as you can.",
    isOptional: true,
    category: "visual"
  },
  {
    id: "game-8-color-shape",
    title: "8. Color & Shape Match",
    domain: "Attention",
    durationMinutes: 3,
    iconName: "Palette",
    description: "Match objects dynamically based on changing color and shape rules.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "game-9-routine",
    title: "9. Daily Routine Recall",
    domain: "Recall",
    durationMinutes: 4,
    iconName: "ListOrdered",
    description: "Arrange daily activities in chronological sequence (wake \u2192 breakfast \u2192 medicine \u2192 walk).",
    isOptional: true,
    category: "words"
  },
  {
    id: "game-10-place",
    title: "10. Familiar Place Memory",
    domain: "Memory",
    durationMinutes: 5,
    iconName: "Home",
    description: "Explore a familiar room/veranda scene, then answer memory questions.",
    isOptional: true,
    category: "visual"
  }
];
export const initialPhysicalActivities = [
  {
    id: "phys-1",
    title: "Morning Walk",
    iconName: "Footprints",
    durationMinutes: 10,
    tagline: "Take a comfortable, relaxed walk in the garden or room.",
    instructions: [
      "Put on comfortable flat walking slippers or shoes.",
      "Walk at an easy, rhythmic, natural pace.",
      "Keep your eyes ahead and breathe gently through your nose.",
      "Hold a caregiver or wall support if you feel unsteady."
    ],
    safetyMessage: "Stop if you feel pain, dizziness, or unwell.",
    status: "completed",
    completedAt: "07:30 AM",
    doctorAssigned: true
  },
  {
    id: "phys-2",
    title: "Sit-to-Stand Exercise",
    iconName: "Armchair",
    durationMinutes: 5,
    repetitions: 10,
    tagline: "Gently stand up from your chair, then sit down slowly.",
    instructions: [
      "Sit comfortably on a sturdy, non-slipping chair.",
      "Keep your feet flat on the floor, shoulder-width apart.",
      "Lean forward slightly and stand up smoothly without rushing.",
      "Pause for 2 seconds at the top, then slowly sit back down."
    ],
    safetyMessage: "Stop if you feel pain, dizziness, or unwell.",
    status: "pending",
    doctorAssigned: true
  },
  {
    id: "phys-3",
    title: "Hand & Finger Exercise",
    iconName: "Hand",
    durationMinutes: 5,
    tagline: "Open and close hands, gently stretch fingers to maintain agility.",
    instructions: [
      "Rest your elbows comfortably on a table or armrest.",
      "Slowly open your palms wide, spreading all fingers.",
      "Gently curl your fingers into a soft, relaxed fist.",
      "Touch each fingertip one by one to your thumb."
    ],
    safetyMessage: "Stop if you feel pain, dizziness, or unwell.",
    status: "pending",
    doctorAssigned: true
  },
  {
    id: "phys-4",
    title: "Breathing & Relaxation",
    iconName: "Heart",
    durationMinutes: 5,
    tagline: "Slow diaphragmatic calming breath to soothe the nervous system.",
    instructions: [
      "Sit back with relaxed shoulders and close your eyes.",
      "Breathe in slowly through your nose for 4 gentle seconds.",
      "Hold the breath lightly for 2 seconds.",
      "Exhale slowly and smoothly through your mouth for 4 seconds."
    ],
    safetyMessage: "Stop if you feel pain, dizziness, or unwell.",
    status: "pending",
    doctorAssigned: true
  },
  {
    id: "phys-5",
    title: "Gentle Stretching",
    iconName: "Activity",
    durationMinutes: 8,
    tagline: "Neck, shoulder, and upper back gentle stretches for comfort.",
    instructions: [
      "Gently tilt your head towards your right shoulder, then left.",
      "Slowly roll your shoulders backwards in 5 smooth circles.",
      "Reach both arms gently forward and stretch your fingers.",
      "Breathe freely throughout each gentle movement."
    ],
    safetyMessage: "Stop if you feel pain, dizziness, or unwell.",
    status: "pending",
    doctorAssigned: true
  }
];
export const initialOfflineGames = [
  {
    id: "off-1-mem",
    title: "Memory Match",
    domain: "Memory",
    durationMinutes: 4,
    iconName: "Brain",
    description: "Find two matching pictures of familiar fruits, flowers, and objects.",
    isOptional: true,
    category: "memory"
  },
  {
    id: "off-2-pic",
    title: "Picture Recall",
    domain: "Recall",
    durationMinutes: 4,
    iconName: "Eye",
    description: "Observe 4\u20138 familiar objects for a few seconds, then identify what was shown.",
    isOptional: true,
    category: "visual"
  },
  {
    id: "off-3-num",
    title: "Number Recall",
    domain: "Recall",
    durationMinutes: 3,
    iconName: "Hash",
    description: "Memorize a short number sequence and enter it in the same order.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "off-4-pat",
    title: "Pattern Recall",
    domain: "Attention",
    durationMinutes: 4,
    iconName: "Sparkles",
    description: "Observe a colored grid pattern, then recreate it on the board.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "off-5-find",
    title: "Find the Object",
    domain: "Attention",
    durationMinutes: 3,
    iconName: "Search",
    description: "Spot the specific target object hidden among various items.",
    isOptional: true,
    category: "visual"
  },
  {
    id: "off-6-routine",
    title: "Daily Routine Recall",
    domain: "Routine",
    durationMinutes: 4,
    iconName: "ListOrdered",
    description: "Arrange daily activities in order: Wake Up \u2192 Breakfast \u2192 Medicine \u2192 Walk.",
    isOptional: true,
    category: "words"
  },
  {
    id: "off-7-puzzle",
    title: "Simple Puzzle",
    domain: "Pattern",
    durationMinutes: 4,
    iconName: "Puzzle",
    description: "Arrange 4\u201316 jigsaw pieces to recreate a familiar cultural scene.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "off-8-shape",
    title: "Shape Matching",
    domain: "Attention",
    durationMinutes: 3,
    iconName: "Square",
    description: "Look at the target shape and select the matching card.",
    isOptional: true,
    category: "puzzle"
  },
  {
    id: "off-9-wordpic",
    title: "Word / Picture Match",
    domain: "Language",
    durationMinutes: 4,
    iconName: "BookOpen",
    description: "Look at the picture and select the matching word in your preferred language.",
    isOptional: true,
    category: "words"
  },
  {
    id: "off-10-count",
    title: "Simple Counting",
    domain: "Attention",
    durationMinutes: 3,
    iconName: "Layers",
    description: "Count familiar household objects and select the correct number.",
    isOptional: true,
    category: "puzzle"
  }
];
export const initialOfflineGameRecords = [
  {
    id: "rec-1",
    date: "2026-08-25",
    timestamp: "08:15 AM",
    gameId: "off-1-mem",
    gameTitle: "Memory Match",
    difficulty: "Easy",
    score: 92,
    accuracy: 92,
    errors: 1,
    attempts: 4,
    completionTimeSeconds: 120,
    reactionTimeMs: 1450,
    synced: true
  },
  {
    id: "rec-2",
    date: "2026-08-25",
    timestamp: "08:35 AM",
    gameId: "off-2-pic",
    gameTitle: "Picture Recall",
    difficulty: "Medium",
    score: 88,
    accuracy: 85,
    errors: 1,
    attempts: 5,
    completionTimeSeconds: 160,
    reactionTimeMs: 1820,
    synced: true
  }
];
export const initialReminders = [
  {
    id: "rem-1",
    title: "MEDICINE (Blood Pressure)",
    time: "9:00 PM",
    category: "medicine",
    actionLabel: "TAKEN",
    completed: true,
    note: "1 tablet with warm water after dinner"
  },
  {
    id: "rem-2",
    title: "DRINK WATER (Evening Glass)",
    time: "10:00 PM",
    category: "water",
    actionLabel: "DRINK WATER",
    completed: false,
    note: "Stay hydrated for calm restful sleep"
  },
  {
    id: "rem-3",
    title: "DOCTOR APPOINTMENT (Dr. Roy)",
    time: "Tomorrow \xB7 4:00 PM",
    category: "appointment",
    actionLabel: "VIEW DETAILS",
    completed: false,
    note: "Tele-consult with caregiver assistance"
  },
  {
    id: "rem-4",
    title: "MORNING WALK (Garden)",
    time: "10:30 AM",
    category: "walk",
    actionLabel: "DONE",
    completed: true,
    note: "15 min gentle walk with daughter"
  }
];
export const sevenDayPerformance = [
  {
    day: "Day 1 (19 Aug)",
    date: "19 Aug",
    memory: 92,
    attention: 88,
    recall: 85,
    pattern: 90,
    overall: 89,
    baseline: 88,
    timeMinutesEasy: 3.2,
    timeMinutesMed: 6.8,
    errorsCount: 2
  },
  {
    day: "Day 2 (20 Aug)",
    date: "20 Aug",
    memory: 89,
    attention: 90,
    recall: 84,
    pattern: 92,
    overall: 89,
    baseline: 88,
    timeMinutesEasy: 3.5,
    timeMinutesMed: 7,
    errorsCount: 2
  },
  {
    day: "Day 3 (21 Aug)",
    date: "21 Aug",
    memory: 86,
    attention: 87,
    recall: 80,
    pattern: 91,
    overall: 86,
    baseline: 88,
    timeMinutesEasy: 3.8,
    timeMinutesMed: 7.2,
    errorsCount: 3
  },
  {
    day: "Day 4 (22 Aug)",
    date: "22 Aug",
    memory: 82,
    attention: 86,
    recall: 75,
    pattern: 90,
    overall: 83,
    baseline: 88,
    timeMinutesEasy: 4.4,
    timeMinutesMed: 8.1,
    errorsCount: 5
  },
  {
    day: "Day 5 (23 Aug)",
    date: "23 Aug",
    memory: 76,
    attention: 85,
    recall: 68,
    pattern: 89,
    overall: 79,
    baseline: 88,
    timeMinutesEasy: 5.2,
    timeMinutesMed: 8.9,
    errorsCount: 6
  },
  {
    day: "Day 6 (24 Aug)",
    date: "24 Aug",
    memory: 71,
    attention: 84,
    recall: 64,
    pattern: 92,
    overall: 78,
    baseline: 88,
    timeMinutesEasy: 6.5,
    timeMinutesMed: 9.5,
    errorsCount: 8
  },
  {
    day: "Day 7 (25 Aug - Today)",
    date: "25 Aug",
    memory: 68,
    attention: 86,
    recall: 60,
    pattern: 91,
    overall: 76,
    baseline: 88,
    timeMinutesEasy: 7.8,
    timeMinutesMed: 10.2,
    errorsCount: 9
  }
];
export const activeAlert = {
  id: "alert-2026-08-25",
  title: "PERFORMANCE CHANGE DETECTED",
  severity: "persistent_change",
  patientName: "Lakshmi Devi",
  patientAge: 72,
  message: "Memory and Recall domain performance is below the personal baseline across 4 consecutive comparable sessions.",
  metricComparison: {
    accuracyBaseline: 88,
    accuracyCurrent: 68,
    timeBaseline: 4.2,
    timeCurrent: 7.8,
    sessionsObserved: 4
  },
  timelineData: [
    { day: "Day 1", accuracy: 92, time: 3.2 },
    { day: "Day 2", accuracy: 89, time: 3.5 },
    { day: "Day 3", accuracy: 86, time: 3.8 },
    { day: "Day 4", accuracy: 82, time: 4.4 },
    { day: "Day 5", accuracy: 76, time: 5.2 },
    { day: "Day 6", accuracy: 71, time: 6.5 },
    { day: "Day 7", accuracy: 68, time: 7.8 }
  ],
  aiExplanation: "Recent comparable sessions show a persistent change relative to personal baseline (accuracy dropped from 88% to 68%, completion time rose from 4.2 min to 7.8 min). Attention and Pattern domains remain stable at 86-91%. Lowering cognitive load to Easy tier is recommended.",
  isAcknowledged: false,
  timestamp: "25 Aug 2026, 09:15 AM"
};
export const initialNotes = [
  {
    id: "note-1",
    date: "25 Aug 2026",
    author: "Ananya Sharma",
    authorRole: "family",
    category: "General observation",
    content: "She seemed tired this morning after poor sleep. Needed gentle encouragement to finish the pattern session.",
    followUpRequired: false
  },
  {
    id: "note-2",
    date: "24 Aug 2026",
    author: "Dr. Debabrata Roy, MD",
    authorRole: "doctor",
    category: "Clinical",
    content: "Adjusted afternoon schedule to lighter Story Recall session. Blood pressure normal at 128/82. Recommend routine hydration checks.",
    followUpRequired: true
  },
  {
    id: "note-3",
    date: "25 Aug 2026",
    author: "MindSathi AI Engine",
    authorRole: "ai",
    category: "AI Summary",
    content: "Memory accuracy is 68% (baseline 88%). Attention is 86% (stable). Suggested plan: keep morning sessions on Easy difficulty with 4-minute time cap.",
    followUpRequired: true
  }
];
export const sessionHistoryRecords = [
  {
    id: "sess-1",
    date: "25 Aug, 08:30 AM",
    game: "Memory Match",
    domain: "Memory",
    difficulty: "Medium",
    score: 55,
    accuracy: "55%",
    time: "10.0 min",
    errors: 10,
    status: "Completed"
  },
  {
    id: "sess-2",
    date: "24 Aug, 08:15 AM",
    game: "Memory Match",
    domain: "Memory",
    difficulty: "Medium",
    score: 59,
    accuracy: "59%",
    time: "9.5 min",
    errors: 8,
    status: "Completed"
  },
  {
    id: "sess-3",
    date: "24 Aug, 11:20 AM",
    game: "Pattern Recall",
    domain: "Attention",
    difficulty: "Easy",
    score: 88,
    accuracy: "88%",
    time: "3.4 min",
    errors: 2,
    status: "Completed"
  },
  {
    id: "sess-4",
    date: "23 Aug, 08:20 AM",
    game: "Memory Match",
    domain: "Memory",
    difficulty: "Medium",
    score: 65,
    accuracy: "65%",
    time: "8.8 min",
    errors: 6,
    status: "Completed"
  },
  {
    id: "sess-5",
    date: "22 Aug, 08:10 AM",
    game: "Memory Match",
    domain: "Memory",
    difficulty: "Easy",
    score: 82,
    accuracy: "82%",
    time: "4.4 min",
    errors: 4,
    status: "Completed"
  },
  {
    id: "sess-6",
    date: "21 Aug, 05:00 PM",
    game: "Story Recall",
    domain: "Recall",
    difficulty: "Easy",
    score: 85,
    accuracy: "85%",
    time: "4.0 min",
    errors: 2,
    status: "Completed"
  },
  {
    id: "sess-7",
    date: "20 Aug, 08:15 AM",
    game: "Memory Match",
    domain: "Memory",
    difficulty: "Easy",
    score: 91,
    accuracy: "91%",
    time: "3.5 min",
    errors: 1,
    status: "Completed"
  }
];
export const allFramesList = [
  { id: "f1", frameNumber: "FRAME 01", title: "Patient Home", device: "Mobile", category: "Patient", description: "Greeting, Today\u2019s Activities, big START button, doctor assigned tasks, reminders & play anytime." },
  { id: "f2", frameNumber: "FRAME 02", title: "Daily Tasks List", device: "Mobile", category: "Patient", description: "Vertical task cards with doctor-assigned badges, difficulty indicators, progress bar, completed checks." },
  { id: "f3", frameNumber: "FRAME 03", title: "Interactive Cognitive Game", device: "Mobile", category: "Patient", description: "Large picture tiles, step indicator, repeat instruction voice button, pause control, elderly-safe interaction." },
  { id: "f4", frameNumber: "FRAME 04", title: "Game Result Screen", device: "Mobile", category: "Patient", description: "Great job celebration, score, accuracy, completion time, reassuring non-alarming AI feedback." },
  { id: "f5", frameNumber: "FRAME 05", title: "AI Daily Analysis (Patient)", device: "Mobile", category: "Patient", description: "Reassuring status cards (Stable, Needs Attention, Good) and supportive AI insight without alarming numbers." },
  { id: "f6", frameNumber: "FRAME 06", title: "Simple Patient Progress", device: "Mobile", category: "Patient", description: "My Week, 18 activities completed, 5-day streak, clean 7-day trend line chart." },
  { id: "f7", frameNumber: "FRAME 07", title: "Play Anytime (Free Play)", device: "Mobile", category: "Patient", description: "2-column optional game cards with warm cultural objects, soft neutral styling." },
  { id: "f8", frameNumber: "FRAME 08", title: "Elderly Reminders", device: "Mobile", category: "Patient", description: "Large tap targets for Medicine 9:00 PM, Water 10:00 PM, Doctor Appointment with quick action labels." },
  { id: "f9", frameNumber: "FRAME 09", title: "Weather & Walk Assistance", device: "Mobile", category: "Patient", description: "Simple 28\xB0C weather, rain warning, and caregiver check advice before outdoor walks." },
  { id: "f10", frameNumber: "FRAME 10", title: "Voice Assistant & Multi-Language", device: "Mobile", category: "Patient", description: "Pills for English, Hindi, Assamese, Bengali, Manipuri, Mizo; voice synthesis & command prompt." },
  { id: "f11", frameNumber: "FRAME 11", title: "Family Monitoring Dashboard", device: "Desktop", category: "Family", description: "Read-only loved one status, task completion (86%), memory & attention gauges, 7-day trend, AI summary." },
  { id: "f12", frameNumber: "FRAME 12", title: "Doctor Clinical Dashboard", device: "Desktop", category: "Doctor", description: "Multi-column clinical overview, patient search, cognitive trend, session logs, alert indicator." },
  { id: "f13", frameNumber: "FRAME 13", title: "Doctor Patient Profile", device: "Desktop", category: "Doctor", description: "Patient tabs: Overview, Tasks, Analytics, AI Analysis, Alerts, and History." },
  { id: "f14", frameNumber: "FRAME 14", title: "Doctor Task Scheduler", device: "Desktop", category: "Doctor", description: "Timeline view (08:00, 11:00, 17:00), + Add Task, difficulty changer, required flags." },
  { id: "f15", frameNumber: "FRAME 15", title: "AI Longitudinal Analytics", device: "Desktop", category: "Doctor", description: "Memory 68%, Attention 86%, Recall 60%, Pattern 91%, multi-series trend vs baseline, completion times." },
  { id: "f16", frameNumber: "FRAME 16", title: "Cognitive Performance Graph", device: "Desktop", category: "Doctor", description: "Clean 7-day multi-line chart with personal baseline line, hover tooltips, and domain toggles." },
  { id: "f17", frameNumber: "FRAME 17", title: "Completion Time vs Difficulty", device: "Desktop", category: "Doctor", description: "Easy vs Medium session duration chart highlighting slowing trends across consecutive days." },
  { id: "f18", frameNumber: "FRAME 18", title: "Performance Alert Center", device: "Desktop", category: "Doctor", description: "Performance change detected card with baseline comparison (88%->68%, 4.2->7.8 min), acknowledge button." },
  { id: "f19", frameNumber: "FRAME 19", title: "Alert Evidence Breakdown", device: "Desktop", category: "Doctor", description: "Day 1-7 longitudinal timeline data, clinical rationale, explainable AI recommendation without diagnosis jargon." },
  { id: "f20", frameNumber: "FRAME 20", title: "Clinical Session History", device: "Desktop", category: "Doctor", description: "Filterable clinical table with date, game, difficulty, score, accuracy, time spent, errors count." },
  { id: "f21", frameNumber: "FRAME 21", title: "AI Recommended Plan", device: "Desktop", category: "Doctor", description: "Doctor approval interface for AI-adjusted daily cognitive load based on recent slowing." },
  { id: "f22", frameNumber: "FRAME 22", title: "Reminder Management", device: "Desktop", category: "Doctor", description: "Family and doctor view of scheduled medicine, hydration, and appointment completion statuses." },
  { id: "f23", frameNumber: "FRAME 23", title: "Non-Alarming Offline Mode", device: "Mobile", category: "System", description: "Friendly calm offline screen allowing continuous local memory activities with pending sync." },
  { id: "f24", frameNumber: "FRAME 24", title: "Sync Completed State", device: "Mobile", category: "System", description: "Clear confirmation when network reconnects and sessions are safely saved to cloud storage." },
  { id: "f25", frameNumber: "FRAME 25", title: "Cultural Content & Familiar Assets", device: "Mobile", category: "Patient", description: "Familiar traditional tea cups, bells, oil lamps, birds, flowers tailored to user cultural preferences." },
  { id: "f26", frameNumber: "FRAME 26", title: "Family Observation Logger", device: "Mobile", category: "Family", description: "Family can log sleep/mood observations clearly separated from machine analytics." },
  { id: "f27", frameNumber: "FRAME 27", title: "Physician Clinical Notes", device: "Desktop", category: "Doctor", description: "Care notes distinguishing AI analysis, game metrics, caregiver logs, and physician orders." },
  { id: "f28", frameNumber: "FRAME 28", title: "Weekly Cognitive Report", device: "Desktop", category: "Doctor", description: "Comprehensive weekly summary with export/print layout, average score, domain trend, alerts summary." },
  { id: "f29", frameNumber: "FRAME 29", title: "Mobile Family View", device: "Mobile", category: "Family", description: "Companion mobile view for relatives on-the-go with quick call and alert status." },
  { id: "f30", frameNumber: "FRAME 30", title: "Mobile Doctor Triage View", device: "Mobile", category: "Doctor", description: "Mobile physician triage list with alert badges and quick patient review." }
];
export const culturalGameCards = [
  { id: "c1", pairId: 1, name: "Brass Tea Kettle", icon: "Coffee", color: "from-amber-100 to-amber-200", text: "#B45309" },
  { id: "c2", pairId: 1, name: "Brass Tea Kettle", icon: "Coffee", color: "from-amber-100 to-amber-200", text: "#B45309" },
  { id: "c3", pairId: 2, name: "Clay Diya Lamp", icon: "Flame", color: "from-orange-100 to-orange-200", text: "#C2410C" },
  { id: "c4", pairId: 2, name: "Clay Diya Lamp", icon: "Flame", color: "from-orange-100 to-orange-200", text: "#C2410C" },
  { id: "c5", pairId: 3, name: "Marigold Blossom", icon: "Sun", color: "from-yellow-100 to-yellow-200", text: "#A16207" },
  { id: "c6", pairId: 3, name: "Marigold Blossom", icon: "Sun", color: "from-yellow-100 to-yellow-200", text: "#A16207" },
  { id: "c7", pairId: 4, name: "Temple Bell", icon: "Bell", color: "from-teal-100 to-teal-200", text: "#0F766E" },
  { id: "c8", pairId: 4, name: "Temple Bell", icon: "Bell", color: "from-teal-100 to-teal-200", text: "#0F766E" },
  { id: "c9", pairId: 5, name: "Peacock Feather", icon: "Feather", color: "from-emerald-100 to-emerald-200", text: "#047857" },
  { id: "c10", pairId: 5, name: "Peacock Feather", icon: "Feather", color: "from-emerald-100 to-emerald-200", text: "#047857" },
  { id: "c11", pairId: 6, name: "Bamboo Flute", icon: "Music", color: "from-cyan-100 to-cyan-200", text: "#0E7490" },
  { id: "c12", pairId: 6, name: "Bamboo Flute", icon: "Music", color: "from-cyan-100 to-cyan-200", text: "#0E7490" }
];
