/**
 * BrainBoost Real-time Game & AI Engine Tracking Service
 * 
 * Central source of truth connecting live gameplay events across
 * cognitive games, physical movement/pose tracking, voice agents,
 * AI baseline comparison, difficulty adaptation, and multi-portal telemetry.
 */

// Supported Event Types
export const TRACKING_EVENT_TYPES = {
  GAME_STARTED: "GAME_STARTED",
  QUESTION_STARTED: "QUESTION_STARTED",
  ANSWER_SUBMITTED: "ANSWER_SUBMITTED",
  ANSWER_CORRECT: "ANSWER_CORRECT",
  ANSWER_INCORRECT: "ANSWER_INCORRECT",
  HINT_USED: "HINT_USED",
  RETRY_STARTED: "RETRY_STARTED",
  MOVEMENT_DETECTED: "MOVEMENT_DETECTED",
  MOVEMENT_VERIFIED: "MOVEMENT_VERIFIED",
  POSE_DETECTED: "POSE_DETECTED",
  SPEECH_DETECTED: "SPEECH_DETECTED",
  TRANSCRIPTION_RECEIVED: "TRANSCRIPTION_RECEIVED",
  QUESTION_COMPLETED: "QUESTION_COMPLETED",
  GAME_PAUSED: "GAME_PAUSED",
  GAME_RESUMED: "GAME_RESUMED",
  GAME_COMPLETED: "GAME_COMPLETED",
  GAME_ABANDONED: "GAME_ABANDONED"
};

class RealtimeTrackingService {
  constructor() {
    this.listeners = new Set();
    this.offlineQueue = this.loadOfflineQueue();
    this.sessionHistory = this.loadSessionHistory();
    this.currentSession = this.createDefaultSession();
    this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleNetworkChange(true));
      window.addEventListener("offline", () => this.handleNetworkChange(false));
    }
  }

  createDefaultSession(initialData = {}) {
    return {
      sessionId: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      patientId: initialData.patientId || "PT-7241",
      patientName: initialData.patientName || "Lakshmi Devi",
      gameId: initialData.gameId || "game-mem",
      gameTitle: initialData.gameTitle || "Memory Match",
      domain: initialData.domain || "Memory",
      difficulty: initialData.difficulty || "Medium",
      recommendedDifficulty: initialData.difficulty || "Medium",
      
      // Progress & Counters
      currentStep: 0,
      totalSteps: initialData.totalSteps || 10,
      score: 100,
      correctCount: 0,
      incorrectCount: 0,
      attemptsCount: 0,
      retriesCount: 0,
      hintsCount: 0,
      pauseTimeSeconds: 0,
      
      // Real-time calculated metrics
      currentAccuracy: 100,
      rollingAccuracy: 100,
      responseTimes: [], // array of numbers (seconds)
      avgResponseTime: 0,
      lastResponseTime: 0,
      responseTimeTrend: "stable", // "improving" | "stable" | "increasing"
      currentStreak: 0,
      maxStreak: 0,
      mistakes: 0,
      
      // Baseline Comparison
      baselineAccuracy: initialData.baselineAccuracy || 88,
      baselineResponseTime: initialData.baselineResponseTime || 4.5,
      accuracyDelta: 0,
      responseTimeDelta: 0,
      baselineStatus: "ON_BASELINE", // "ABOVE_BASELINE" | "ON_BASELINE" | "SLIGHTLY_BELOW" | "BELOW_BASELINE"
      
      // Fatigue & Alerts
      consecutiveSlowResponses: 0,
      fatigueDetected: false,
      fatigueSignal: "NORMAL", // "NORMAL" | "OBSERVING" | "POSSIBLE_SESSION_FATIGUE"
      fatiguePrompt: null,
      
      // Learning Style Metrics
      instructionStats: {
        TEXT: { correct: 0, total: 0, accuracy: 62 },
        VOICE: { correct: 0, total: 0, accuracy: 78 },
        IMAGE: { correct: 0, total: 0, accuracy: 88 },
        ANIMATION: { correct: 0, total: 0, accuracy: 90 },
        DEMONSTRATION: { correct: 0, total: 0, accuracy: 92 }
      },
      preferredInstructionType: "DEMONSTRATION",
      
      // Camera / Motion Specifics
      lastMotion: null,
      motionConfidence: 0.95,
      poseStatus: "optimal",
      
      // Voice Specifics
      lastVoiceTranscription: null,
      voiceConfidence: 0.92,
      
      // Timestamps & State
      startTime: Date.now(),
      lastEventTime: Date.now(),
      elapsedSeconds: 0,
      isPaused: false,
      isActive: false,
      isCompleted: false,
      isAbandoned: false,
      
      // Real-time Event Stream
      events: [],
      aiInsights: [
        "AI Tracking Engine synchronized with patient baseline.",
        "Baseline calibrated to 88% historical accuracy."
      ]
    };
  }

  // Subscribe to live state updates
  subscribe(callback) {
    this.listeners.add(callback);
    // Initial call
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        console.error("Tracking listener error:", err);
      }
    });
  }

  getState() {
    return {
      activeSession: this.currentSession,
      isLiveActive: this.currentSession.isActive,
      offlineQueueLength: this.offlineQueue.length,
      sessionHistory: this.sessionHistory
    };
  }

  // Start a new tracking session
  startSession({
    patientId = "PT-7241",
    patientName = "Lakshmi Devi",
    gameId,
    gameTitle,
    domain = "Memory",
    difficulty = "Medium",
    totalSteps = 10,
    baselineAccuracy = 88,
    baselineResponseTime = 4.5
  }) {
    this.currentSession = this.createDefaultSession({
      patientId,
      patientName,
      gameId: gameId || `game-${Date.now()}`,
      gameTitle: gameTitle || "Cognitive Activity",
      domain,
      difficulty,
      totalSteps,
      baselineAccuracy,
      baselineResponseTime
    });

    this.currentSession.isActive = true;
    this.currentSession.startTime = Date.now();
    this.currentSession.lastEventTime = Date.now();

    this.recordEvent({
      eventType: TRACKING_EVENT_TYPES.GAME_STARTED,
      description: `Session started: ${gameTitle} (${difficulty})`,
      details: { domain, totalSteps }
    });

    return this.currentSession;
  }

  // Record a gameplay event with continuous real-time AI calculations
  recordEvent(eventData) {
    if (!this.currentSession) return;

    const timestamp = Date.now();
    const eventId = `evt-${timestamp}-${Math.random().toString(36).substr(2, 5)}`;
    const timeString = new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const enrichedEvent = {
      id: eventId,
      sessionId: this.currentSession.sessionId,
      patientId: this.currentSession.patientId,
      gameId: this.currentSession.gameId,
      timestamp,
      timeString,
      ...eventData
    };

    // Update session metrics based on event type
    this.processEventData(enrichedEvent);

    // Append to event stream (limit to last 50 for memory safety)
    this.currentSession.events = [enrichedEvent, ...this.currentSession.events.slice(0, 49)];
    this.currentSession.lastEventTime = timestamp;

    // Queue for persistence
    this.queueEvent(enrichedEvent);

    // Emit live state update to all subscribers
    this.notify();
  }

  processEventData(event) {
    const s = this.currentSession;

    switch (event.eventType) {
      case TRACKING_EVENT_TYPES.QUESTION_STARTED:
        s.currentStep = event.stepNumber || (s.currentStep + 1);
        s.lastQuestionStartTime = Date.now();
        break;

      case TRACKING_EVENT_TYPES.ANSWER_SUBMITTED:
      case TRACKING_EVENT_TYPES.ANSWER_CORRECT:
      case TRACKING_EVENT_TYPES.ANSWER_INCORRECT: {
        const isCorrect = event.correct ?? (event.eventType === TRACKING_EVENT_TYPES.ANSWER_CORRECT);
        const responseTime = typeof event.responseTime === "number" 
          ? event.responseTime 
          : s.lastQuestionStartTime 
            ? Math.max(0.5, (Date.now() - s.lastQuestionStartTime) / 1000)
            : 3.5;

        s.attemptsCount += 1;
        s.lastResponseTime = Number(responseTime.toFixed(1));
        s.responseTimes.push(s.lastResponseTime);

        if (isCorrect) {
          s.correctCount += 1;
          s.currentStreak += 1;
          if (s.currentStreak > s.maxStreak) s.maxStreak = s.currentStreak;
        } else {
          s.incorrectCount += 1;
          s.mistakes += 1;
          s.currentStreak = 0;
        }

        // Calculate Real-time Accuracies
        const totalAnswers = s.correctCount + s.incorrectCount;
        s.currentAccuracy = Math.round((s.correctCount / totalAnswers) * 100);

        // Rolling Accuracy (last 5 responses)
        const recentWindow = s.events
          .filter(e => e.correct !== undefined)
          .slice(0, 4);
        const rollingCorrect = (isCorrect ? 1 : 0) + recentWindow.filter(e => e.correct).length;
        const rollingTotal = 1 + recentWindow.length;
        s.rollingAccuracy = Math.round((rollingCorrect / rollingTotal) * 100);

        // Avg Response Time
        const totalResp = s.responseTimes.reduce((a, b) => a + b, 0);
        s.avgResponseTime = Number((totalResp / s.responseTimes.length).toFixed(1));

        // Response Time Trend Analysis
        if (s.responseTimes.length >= 3) {
          const recent3 = s.responseTimes.slice(-3);
          if (recent3[2] > recent3[1] && recent3[1] > recent3[0] && (recent3[2] - recent3[0] > 2.0)) {
            s.responseTimeTrend = "increasing";
            s.consecutiveSlowResponses += 1;
          } else if (recent3[2] < recent3[1] && recent3[1] < recent3[0]) {
            s.responseTimeTrend = "improving";
            s.consecutiveSlowResponses = Math.max(0, s.consecutiveSlowResponses - 1);
          } else {
            s.responseTimeTrend = "stable";
          }
        }

        // Baseline Comparison Calculation
        s.accuracyDelta = s.currentAccuracy - s.baselineAccuracy;
        s.responseTimeDelta = Number((s.avgResponseTime - s.baselineResponseTime).toFixed(1));

        if (s.currentAccuracy >= s.baselineAccuracy + 4) {
          s.baselineStatus = "ABOVE_BASELINE";
        } else if (s.currentAccuracy >= s.baselineAccuracy - 4) {
          s.baselineStatus = "ON_BASELINE";
        } else if (s.currentAccuracy >= s.baselineAccuracy - 15) {
          s.baselineStatus = "SLIGHTLY_BELOW";
        } else {
          s.baselineStatus = "BELOW_BASELINE";
        }

        // Instruction Style Tracking (Text, Voice, Image, Demonstration)
        if (event.instructionType && s.instructionStats[event.instructionType]) {
          const stat = s.instructionStats[event.instructionType];
          stat.total += 1;
          if (isCorrect) stat.correct += 1;
          stat.accuracy = Math.round((stat.correct / stat.total) * 100);
          
          // Re-evaluate preferred instruction type
          let bestType = "DEMONSTRATION";
          let bestAcc = 0;
          Object.entries(s.instructionStats).forEach(([type, obj]) => {
            if (obj.total > 0 && obj.accuracy > bestAcc) {
              bestAcc = obj.accuracy;
              bestType = type;
            }
          });
          s.preferredInstructionType = bestType;
        }

        // Adaptive Difficulty Recommendation (smoothed to prevent sudden switching)
        this.evaluateAdaptiveDifficulty(s);

        // Cognitive Fatigue Signal Detection
        this.evaluateFatigue(s);

        // Generate dynamic AI Insight
        this.generateRealtimeInsight(s, isCorrect, event);
        break;
      }

      case TRACKING_EVENT_TYPES.HINT_USED:
        s.hintsCount += 1;
        this.addAiInsight(s, `Hint provided for task step ${s.currentStep}. Supportive guidance active.`);
        break;

      case TRACKING_EVENT_TYPES.RETRY_STARTED:
        s.retriesCount += 1;
        this.addAiInsight(s, `Patient initiated retry on step ${s.currentStep}.`);
        break;

      case TRACKING_EVENT_TYPES.MOVEMENT_DETECTED:
      case TRACKING_EVENT_TYPES.MOVEMENT_VERIFIED:
        s.lastMotion = {
          expected: event.expectedMovement || "Guided Gesture",
          actual: event.actualMovement || "Detected Movement",
          correct: event.correct ?? true,
          confidence: event.confidence || 0.94,
          timestamp: Date.now()
        };
        s.motionConfidence = event.confidence || 0.94;
        if (event.correct) {
          this.addAiInsight(s, `Camera verified: ${event.expectedMovement || 'Movement'} matched correctly (Confidence ${Math.round(s.motionConfidence * 100)}%).`);
        }
        break;

      case TRACKING_EVENT_TYPES.TRANSCRIPTION_RECEIVED:
        s.lastVoiceTranscription = {
          text: event.transcript || "",
          confidence: event.confidence || 0.9,
          responseTime: event.responseTime || 2.4
        };
        this.addAiInsight(s, `Voice input recognized: "${event.transcript}"`);
        break;

      case TRACKING_EVENT_TYPES.GAME_PAUSED:
        s.isPaused = true;
        s.pauseStartTime = Date.now();
        this.addAiInsight(s, "Game paused by patient. Timer suspended.");
        break;

      case TRACKING_EVENT_TYPES.GAME_RESUMED:
        if (s.isPaused && s.pauseStartTime) {
          s.pauseTimeSeconds += Math.round((Date.now() - s.pauseStartTime) / 1000);
        }
        s.isPaused = false;
        this.addAiInsight(s, "Game resumed. Telemetry active.");
        break;

      case TRACKING_EVENT_TYPES.GAME_COMPLETED:
        s.isCompleted = true;
        s.isActive = false;
        s.elapsedSeconds = Math.round((Date.now() - s.startTime) / 1000) - s.pauseTimeSeconds;
        s.score = event.finalScore || s.currentAccuracy;
        this.finalizeSession(s);
        break;

      case TRACKING_EVENT_TYPES.GAME_ABANDONED:
        s.isAbandoned = true;
        s.isActive = false;
        s.elapsedSeconds = Math.round((Date.now() - s.startTime) / 1000) - s.pauseTimeSeconds;
        this.addAiInsight(s, "Session ended early. Partial telemetry archived.");
        break;

      default:
        break;
    }
  }

  // Smooth Multi-Event Difficulty Adaptation
  evaluateAdaptiveDifficulty(s) {
    if (s.responseTimes.length < 3) return;

    const recentAcc = s.rollingAccuracy;
    const currentDiff = s.difficulty;

    if (recentAcc >= 90 && s.avgResponseTime <= 5.0) {
      if (currentDiff === "Easy") s.recommendedDifficulty = "Medium";
      else if (currentDiff === "Medium") s.recommendedDifficulty = "Hard";
      this.addAiInsight(s, `Performance is consistently strong (${recentAcc}%). Recommend ${s.recommendedDifficulty} difficulty for next task.`);
    } else if (recentAcc <= 60 || s.avgResponseTime >= 9.0) {
      if (currentDiff === "Hard") s.recommendedDifficulty = "Medium";
      else if (currentDiff === "Medium") s.recommendedDifficulty = "Easy";
      this.addAiInsight(s, `Performance is changing compared with recent baseline. Recommend gentle ${s.recommendedDifficulty} tier.`);
    }
  }

  // Multi-event Cognitive Fatigue Signal
  evaluateFatigue(s) {
    // If response time is steadily rising across 3+ tasks and accuracy dips
    if (s.consecutiveSlowResponses >= 3 && s.rollingAccuracy < 70) {
      s.fatigueDetected = true;
      s.fatigueSignal = "POSSIBLE_SESSION_FATIGUE";
      s.fatiguePrompt = {
        title: "You're doing very well!",
        message: "Would you like to pause for a soothing 2-minute tea break?",
        timestamp: Date.now()
      };
      this.addAiInsight(s, "🟡 AI detected possible session fatigue. Gentle break recommendation suggested.");
    } else if (s.fatigueDetected && s.rollingAccuracy >= 80) {
      // Recovery
      s.fatigueDetected = false;
      s.fatigueSignal = "NORMAL";
      s.fatiguePrompt = null;
    }
  }

  // Generate dynamic internal AI insight
  generateRealtimeInsight(s, isCorrect, event) {
    if (s.responseTimes.length === 1) {
      this.addAiInsight(s, `Initial task response recorded in ${s.lastResponseTime}s. Session baseline tracking initiated.`);
      return;
    }

    if (s.responseTimes.length % 2 === 0 || !isCorrect) {
      if (!isCorrect) {
        this.addAiInsight(s, `Question ${s.currentStep} incorrect (${s.lastResponseTime}s). Current accuracy ${s.currentAccuracy}%.`);
      } else if (s.currentStreak >= 3) {
        this.addAiInsight(s, `Active streak of ${s.currentStreak} correct responses! Pace is steady at ${s.lastResponseTime}s.`);
      } else if (s.baselineStatus === "BELOW_BASELINE") {
        this.addAiInsight(s, `Current accuracy (${s.currentAccuracy}%) is below recent baseline (${s.baselineAccuracy}%).`);
      } else if (s.baselineStatus === "ABOVE_BASELINE") {
        this.addAiInsight(s, `Performance (+${s.accuracyDelta}%) is higher than personal historical baseline.`);
      }
    }
  }

  addAiInsight(s, text) {
    if (!text) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const entry = `[${timestamp}] ${text}`;
    if (!s.aiInsights.includes(entry)) {
      s.aiInsights = [entry, ...s.aiInsights.slice(0, 19)];
    }
  }

  // Finalize session and save to persistence
  finalizeSession(s) {
    const summary = {
      id: s.sessionId,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      game: s.gameTitle,
      domain: s.domain,
      difficulty: s.difficulty,
      score: s.score,
      accuracy: `${s.currentAccuracy}%`,
      accuracyNumber: s.currentAccuracy,
      avgResponseTime: s.avgResponseTime,
      time: `${Math.floor(s.elapsedSeconds / 60)}m ${s.elapsedSeconds % 60}s`,
      elapsedSeconds: s.elapsedSeconds,
      errors: s.incorrectCount,
      correctCount: s.correctCount,
      totalSteps: s.attemptsCount || s.totalSteps,
      retries: s.retriesCount,
      hints: s.hintsCount,
      baselineAccuracy: s.baselineAccuracy,
      accuracyDelta: s.accuracyDelta,
      baselineStatus: s.baselineStatus,
      status: "Completed",
      learningStyle: s.preferredInstructionType,
      aiObservation: s.accuracyDelta >= -5 
        ? "Performance remained close to the patient's recent baseline."
        : "Performance changed relative to baseline; recommend gentle pacing in upcoming sessions."
    };

    this.sessionHistory = [summary, ...this.sessionHistory.slice(0, 49)];
    this.saveSessionHistory();

    this.addAiInsight(s, `Session Complete. Final Accuracy: ${s.currentAccuracy}%, Avg Response: ${s.avgResponseTime}s. Results archived.`);
  }

  // Offline event queue handling
  queueEvent(event) {
    this.offlineQueue.push(event);
    if (this.offlineQueue.length > 500) {
      this.offlineQueue = this.offlineQueue.slice(-500);
    }
    this.saveOfflineQueue();

    if (this.isOnline) {
      this.syncOfflineQueue();
    }
  }

  syncOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    // In production, posts events to backend API /api/telemetry/events
    // We retain clean processed state and clear queue once synced
    try {
      this.offlineQueue = [];
      this.saveOfflineQueue();
    } catch (e) {
      console.warn("Queue sync failed", e);
    }
  }

  handleNetworkChange(online) {
    this.isOnline = online;
    if (online) {
      this.syncOfflineQueue();
    }
  }

  loadOfflineQueue() {
    try {
      const saved = localStorage.getItem("brainboost_offline_event_queue");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveOfflineQueue() {
    try {
      localStorage.setItem("brainboost_offline_event_queue", JSON.stringify(this.offlineQueue));
    } catch {}
  }

  loadSessionHistory() {
    try {
      const saved = localStorage.getItem("brainboost_tracked_sessions");
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default initial sessions
    return [
      {
        id: "sess-init-1",
        date: "25 Aug, 08:30 AM",
        game: "Memory Match",
        domain: "Memory",
        difficulty: "Medium",
        score: 84,
        accuracy: "84%",
        accuracyNumber: 84,
        avgResponseTime: 5.4,
        time: "2m 14s",
        elapsedSeconds: 134,
        errors: 2,
        correctCount: 8,
        totalSteps: 10,
        retries: 1,
        hints: 0,
        baselineAccuracy: 88,
        accuracyDelta: -4,
        baselineStatus: "ON_BASELINE",
        status: "Completed",
        learningStyle: "DEMONSTRATION",
        aiObservation: "Performance remained close to the patient's recent baseline."
      }
    ];
  }

  saveSessionHistory() {
    try {
      localStorage.setItem("brainboost_tracked_sessions", JSON.stringify(this.sessionHistory));
    } catch {}
  }
}

export const realtimeTracker = new RealtimeTrackingService();
