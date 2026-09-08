import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { chatSocketService } from "../services/chatSocketService";
import { useAuth } from "./AuthContext";

const ChatCallContext = createContext(null);

export const CALL_STATES = {
  IDLE: "IDLE",
  CALLING: "CALLING",
  INCOMING: "INCOMING",
  CONNECTED: "CONNECTED",
  ENDED: "ENDED",
};

export const ChatCallProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Chat State
  const [activePatientCode, setActivePatientCode] = useState("PT-7241");
  const [chatThreads, setChatThreads] = useState({});
  const [typingMap, setTypingMap] = useState({});
  const [presenceMap, setPresenceMap] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [isPatientChatModalOpen, setIsPatientChatModalOpen] = useState(false);

  // Video Call State
  const [callState, setCallState] = useState(CALL_STATES.IDLE);
  const [activeCall, setActiveCall] = useState(null);
  const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callTimerRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Connect WebSocket on mount or when user changes
  useEffect(() => {
    chatSocketService.connect(currentUser);

    const unsubMsg = chatSocketService.subscribe("message", (message) => {
      if (!message || !message.patientCode) return;
      setChatThreads((prev) => {
        const list = prev[message.patientCode] || chatSocketService.getHistory(message.patientCode);
        if (list.some((m) => m.id === message.id)) return prev;
        return {
          ...prev,
          [message.patientCode]: [...list, message],
        };
      });
    });

    const unsubTyping = chatSocketService.subscribe("typing", (data) => {
      if (!data || !data.patientCode) return;
      setTypingMap((prev) => ({
        ...prev,
        [data.patientCode]: data.isTyping ? data : null,
      }));
    });

    const unsubPresence = chatSocketService.subscribe("presence", (data) => {
      if (!data) return;
      const key = data.patientCode || data.role;
      setPresenceMap((prev) => ({
        ...prev,
        [key]: data,
      }));
    });

    const unsubConn = chatSocketService.subscribe("connection", (data) => {
      setConnectionStatus(data.status);
    });

    const unsubCall = chatSocketService.subscribe("callSignal", (signal) => {
      handleIncomingCallSignal(signal);
    });

    return () => {
      unsubMsg();
      unsubTyping();
      unsubPresence();
      unsubConn();
      unsubCall();
    };
  }, [currentUser]);

  // Load initial active patient chat history
  useEffect(() => {
    if (activePatientCode) {
      const history = chatSocketService.getHistory(activePatientCode);
      setChatThreads((prev) => ({
        ...prev,
        [activePatientCode]: history,
      }));
    }
  }, [activePatientCode]);

  // Handle WebRTC & Video Call Signaling
  const handleIncomingCallSignal = useCallback(
    (signal) => {
      const currentRole = currentUser?.role || "patient";

      if (signal.type === "call_start") {
        // If we are the target recipient (e.g. Patient receiving Doctor call, or Doctor receiving Patient call)
        const isRecipient =
          (signal.targetRole === "patient" && currentRole === "patient") ||
          (signal.targetRole === "doctor" && currentRole === "doctor") ||
          (signal.targetRole === "all");

        if (isRecipient && callState === CALL_STATES.IDLE) {
          setActiveCall({
            room: signal.room,
            patientCode: signal.patientCode,
            callerRole: signal.callerRole,
            callerName: signal.callerName,
            targetRole: signal.targetRole,
            targetName: signal.targetName,
            startedAt: new Date().toISOString(),
          });
          setCallState(CALL_STATES.INCOMING);
          setIsIncomingModalOpen(true);
        }
      } else if (signal.type === "call_answer") {
        if (callState === CALL_STATES.CALLING) {
          setCallState(CALL_STATES.CONNECTED);
          setIsVideoModalOpen(true);
          startCallTimer();
        }
      } else if (signal.type === "call_reject" || signal.type === "call_end") {
        cleanupCall();
      }
    },
    [currentUser, callState]
  );

  // Send Chat Message
  const sendMessage = useCallback(
    ({
      patientCode = activePatientCode,
      text,
      type = "text",
      prescriptionData = null,
      audioUrl = null,
      metadata = {},
    }) => {
      const role = currentUser?.role || "patient";
      const name = currentUser?.name || (role === "doctor" ? "Dr. Debabrata Roy, MD" : "Lakshmi Devi");

      const newMsg = chatSocketService.sendMessage({
        patientCode,
        text,
        senderRole: role,
        senderName: name,
        type,
        prescriptionData,
        audioUrl,
        metadata,
      });

      setChatThreads((prev) => {
        const currentList = prev[patientCode] || [];
        if (currentList.some((m) => m.id === newMsg.id)) return prev;
        return {
          ...prev,
          [patientCode]: [...currentList, newMsg],
        };
      });

      return newMsg;
    },
    [activePatientCode, currentUser]
  );

  // Send Typing state
  const sendTyping = useCallback(
    (patientCode, isTyping) => {
      const role = currentUser?.role || "patient";
      const name = currentUser?.name || (role === "doctor" ? "Dr. Debabrata Roy, MD" : "Lakshmi Devi");
      chatSocketService.sendTyping(patientCode, isTyping, name, role);
    },
    [currentUser]
  );

  // Mark as read
  const markAsRead = useCallback(
    (patientCode) => {
      const role = currentUser?.role || "patient";
      chatSocketService.markAsRead(patientCode, role);
      setChatThreads((prev) => {
        const currentList = prev[patientCode] || [];
        const updated = currentList.map((m) =>
          role === "patient" ? { ...m, readByPatient: true } : { ...m, readByDoctor: true }
        );
        return {
          ...prev,
          [patientCode]: updated,
        };
      });
    },
    [currentUser]
  );

  // --- Video Call Controls ---

  const initLocalMedia = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        return stream;
      }
    } catch (err) {
      console.warn("Camera/Mic permission warning or unavailable, using simulated video feed:", err);
    }
    return null;
  };

  const startCallTimer = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // Start outgoing video call (remains in CALLING state until peer accepts via WebSocket)
  const startVideoCall = async ({
    patientCode = activePatientCode,
    targetRole = currentUser?.role === "doctor" ? "patient" : "doctor",
    targetName = currentUser?.role === "doctor" ? "Lakshmi Devi" : "Dr. Debabrata Roy, MD",
  }) => {
    const callerRole = currentUser?.role || "patient";
    const callerName = currentUser?.name || (callerRole === "doctor" ? "Dr. Debabrata Roy, MD" : "Lakshmi Devi");

    await initLocalMedia();

    const callInfo = {
      room: `patient_${patientCode}`,
      patientCode,
      callerRole,
      callerName,
      targetRole,
      targetName,
      startedAt: new Date().toISOString(),
    };

    setActiveCall(callInfo);
    setCallState(CALL_STATES.CALLING);
    setIsVideoModalOpen(true);

    // Send start signal
    chatSocketService.sendCallSignal(patientCode, "call_start", {
      callerRole,
      callerName,
      targetRole,
      targetName,
    });
  };

  // Accept incoming call
  const acceptCall = async () => {
    await initLocalMedia();
    setIsIncomingModalOpen(false);
    setCallState(CALL_STATES.CONNECTED);
    setIsVideoModalOpen(true);
    startCallTimer();

    if (activeCall) {
      chatSocketService.sendCallSignal(activeCall.patientCode, "call_answer", {
        acceptedBy: currentUser?.name || "User",
      });
    }
  };

  // Decline incoming call
  const declineCall = () => {
    if (activeCall) {
      chatSocketService.sendCallSignal(activeCall.patientCode, "call_reject", {
        rejectedBy: currentUser?.name || "User",
      });
    }
    cleanupCall();
  };

  // End active call
  const endCall = () => {
    if (activeCall) {
      chatSocketService.sendCallSignal(activeCall.patientCode, "call_end", {
        endedBy: currentUser?.name || "User",
        duration: callDuration,
      });

      // Add consultation summary note into chat
      chatSocketService.sendMessage({
        patientCode: activeCall.patientCode,
        text: `Teleconsultation session completed. Duration: ${Math.floor(callDuration / 60)}m ${callDuration % 60}s. Clinical audio/video connection closed.`,
        senderRole: "doctor",
        senderName: "Dr. Debabrata Roy, MD",
        type: "consultation_summary",
        metadata: { duration: callDuration, date: new Date().toISOString() },
      });
    }
    cleanupCall();
  };

  const cleanupCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    setCallState(CALL_STATES.IDLE);
    setActiveCall(null);
    setIsIncomingModalOpen(false);
    setIsVideoModalOpen(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setCallDuration(0);
  };

  // Toggle Audio Mute
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted((prev) => !prev);
  };

  // Toggle Camera
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff((prev) => !prev);
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          setLocalStream(screenStream);
          setIsScreenSharing(true);
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            initLocalMedia();
          };
        }
      } catch (e) {
        console.warn("Screen share canceled", e);
      }
    } else {
      setIsScreenSharing(false);
      initLocalMedia();
    }
  };

  const unreadCountForPatient = chatSocketService.getUnreadCount(activePatientCode, "patient");
  const unreadCountForDoctor = chatSocketService.getUnreadCount(activePatientCode, "doctor");

  const value = {
    activePatientCode,
    setActivePatientCode,
    chatThreads,
    messages: chatThreads[activePatientCode] || [],
    typingStatus: typingMap[activePatientCode] || null,
    presenceStatus: presenceMap,
    connectionStatus,
    sendMessage,
    sendTyping,
    markAsRead,
    isPatientChatModalOpen,
    setIsPatientChatModalOpen,
    unreadCountForPatient,
    unreadCountForDoctor,
    // Video Call
    callState,
    activeCall,
    isVideoModalOpen,
    setIsVideoModalOpen,
    isIncomingModalOpen,
    isMuted,
    isVideoOff,
    isScreenSharing,
    localStream,
    remoteStream,
    callDuration,
    startVideoCall,
    acceptCall,
    declineCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  };

  return <ChatCallContext.Provider value={value}>{children}</ChatCallContext.Provider>;
};

export const useChatCall = () => {
  const context = useContext(ChatCallContext);
  if (!context) {
    throw new Error("useChatCall must be used within a ChatCallProvider");
  }
  return context;
};
