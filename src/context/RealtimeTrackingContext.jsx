import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { realtimeTracker, TRACKING_EVENT_TYPES } from "../services/realtimeTrackingService";

const RealtimeTrackingContext = createContext(null);

export const RealtimeTrackingProvider = ({ children }) => {
  const [trackingState, setTrackingState] = useState(() => realtimeTracker.getState());

  useEffect(() => {
    const unsubscribe = realtimeTracker.subscribe((state) => {
      setTrackingState({ ...state });
    });
    return () => unsubscribe();
  }, []);

  const startLiveGame = useCallback((taskOrGame, profile, options = {}) => {
    return realtimeTracker.startSession({
      patientId: profile?.patientCode || profile?.id || "PT-7241",
      patientName: profile?.name || "Lakshmi Devi",
      gameId: taskOrGame?.id,
      gameTitle: taskOrGame?.title || "Cognitive Game",
      domain: taskOrGame?.domain || "Memory",
      difficulty: taskOrGame?.difficulty || options.difficulty || "Medium",
      totalSteps: options.totalSteps || 10,
      baselineAccuracy: profile?.baselineMemory || 88,
      baselineResponseTime: 4.5
    });
  }, []);

  const recordEvent = useCallback((eventData) => {
    realtimeTracker.recordEvent(eventData);
  }, []);

  const pauseGame = useCallback(() => {
    realtimeTracker.recordEvent({
      eventType: TRACKING_EVENT_TYPES.GAME_PAUSED
    });
  }, []);

  const resumeGame = useCallback(() => {
    realtimeTracker.recordEvent({
      eventType: TRACKING_EVENT_TYPES.GAME_RESUMED
    });
  }, []);

  const completeGame = useCallback((finalResult = {}) => {
    realtimeTracker.recordEvent({
      eventType: TRACKING_EVENT_TYPES.GAME_COMPLETED,
      ...finalResult
    });
  }, []);

  const abandonGame = useCallback(() => {
    realtimeTracker.recordEvent({
      eventType: TRACKING_EVENT_TYPES.GAME_ABANDONED
    });
  }, []);

  // Simulator for Doctor Dashboard / Demonstrations
  const simulateLiveEvent = useCallback((customEvent) => {
    realtimeTracker.recordEvent(customEvent);
  }, []);

  const value = {
    activeSession: trackingState.activeSession,
    isLiveActive: trackingState.isLiveActive,
    sessionHistory: trackingState.sessionHistory,
    offlineQueueLength: trackingState.offlineQueueLength,
    startLiveGame,
    recordEvent,
    pauseGame,
    resumeGame,
    completeGame,
    abandonGame,
    simulateLiveEvent,
    TRACKING_EVENT_TYPES
  };

  return (
    <RealtimeTrackingContext.Provider value={value}>
      {children}
    </RealtimeTrackingContext.Provider>
  );
};

export const useRealtimeTracking = () => {
  const context = useContext(RealtimeTrackingContext);
  if (!context) {
    throw new Error("useRealtimeTracking must be used within a RealtimeTrackingProvider");
  }
  return context;
};
