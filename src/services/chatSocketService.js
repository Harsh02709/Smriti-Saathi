// Real-time WebSocket Client and WebRTC Signaling Service for Smriti-Saathi
// Supports dual-mode: WebSocket connection to server + cross-tab BroadcastChannel fallback

const STORAGE_KEY_PREFIX = "smriti_chat_history_";
const BROADCAST_CHANNEL_NAME = "smriti_realtime_chat_call_channel";

export const defaultSeedMessages = {
  "PT-7241": [
    {
      id: "msg-seed-1",
      patientCode: "PT-7241",
      senderRole: "doctor",
      senderName: "Dr. Debabrata Roy, MD",
      text: "Namaste Lakshmi ji. I reviewed your cognitive assessment and morning telemetry. Your pattern recognition scores are showing great consistency!",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      type: "text",
      readByPatient: true,
      readByDoctor: true,
    },
    {
      id: "msg-seed-2",
      patientCode: "PT-7241",
      senderRole: "patient",
      senderName: "Lakshmi Devi",
      text: "Namaste Doctor Sahab. Today I felt energetic and completed the Color Pattern game with Ananya's help.",
      timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
      type: "text",
      readByPatient: true,
      readByDoctor: true,
    },
    {
      id: "msg-seed-3",
      patientCode: "PT-7241",
      senderRole: "doctor",
      senderName: "Dr. Debabrata Roy, MD",
      text: "Wonderful to hear. I have prescribed the 'Object Identification' activity for 2:00 PM today. Let's do a quick video check-in this afternoon.",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: "prescription",
      prescriptionData: {
        taskTitle: "OBJECT IDENTIFICATION",
        domain: "Identification",
        time: "14:00",
        difficulty: "Easy",
        instructions: "Identify household items from clues.",
      },
      readByPatient: true,
      readByDoctor: true,
    },
  ],
};

class ChatSocketService {
  constructor() {
    this.ws = null;
    this.currentUser = null;
    this.activeRoom = null;
    this.subscribers = {
      message: new Set(),
      typing: new Set(),
      presence: new Set(),
      callSignal: new Set(),
      connection: new Set(),
    };
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectTimeout = null;
    this.isExplicitlyClosed = false;

    // Cross-tab broadcast channel for instant multi-tab sync
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        this.handleIncomingPayload(event.data, false);
      };
    }
  }

  // Connect to WebSocket server
  connect(user) {
    if (user) this.currentUser = user;
    this.isExplicitlyClosed = false;

    if (typeof window === "undefined") return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host || "localhost:3000";
      const wsUrl = `${protocol}//${host}/ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifySubscribers("connection", { status: "connected", mode: "websocket" });

        // If user is set, join global & patient room
        if (this.currentUser) {
          this.joinUserRooms(this.currentUser);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingPayload(data, true);
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn("WebSocket connection warning (fallback active):", err);
        this.notifySubscribers("connection", { status: "fallback", mode: "broadcast_channel" });
      };

      this.ws.onclose = () => {
        this.notifySubscribers("connection", { status: "disconnected", mode: "broadcast_channel" });
        if (!this.isExplicitlyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
          this.reconnectTimeout = setTimeout(() => this.connect(), delay);
        }
      };
    } catch (e) {
      console.warn("WebSocket initialization warning:", e);
      this.notifySubscribers("connection", { status: "fallback", mode: "broadcast_channel" });
    }
  }

  joinUserRooms(user) {
    if (!user) return;
    const patientCode = user.patientCode || (user.role === "patient" ? user.id : "PT-7241");
    const room = `patient_${patientCode}`;
    this.activeRoom = room;

    this.sendRaw({
      type: "join",
      room,
      role: user.role || "patient",
      name: user.name || "User",
      patientCode,
    });
  }

  joinRoom(patientCode, role = "doctor", name = "Doctor") {
    const room = `patient_${patientCode}`;
    this.activeRoom = room;
    this.sendRaw({
      type: "join",
      room,
      role,
      name,
      patientCode,
    });
  }

  handleIncomingPayload(data, fromWs = false) {
    if (!data || !data.type) return;

    if (data.type === "chat_message") {
      // Save to localStorage if not already saved
      if (data.message && data.message.patientCode) {
        this.saveMessageToStorage(data.message.patientCode, data.message);
      }
      this.notifySubscribers("message", data.message || data);
    } else if (data.type === "typing") {
      this.notifySubscribers("typing", data);
    } else if (data.type === "presence") {
      this.notifySubscribers("presence", data);
    } else if (
      [
        "call_signal",
        "call_offer",
        "call_answer",
        "call_ice",
        "call_end",
        "call_reject",
        "call_start",
      ].includes(data.type)
    ) {
      this.notifySubscribers("callSignal", data);
    }
  }

  sendRaw(payload) {
    // Send via WebSocket if open
    let sentViaWs = false;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(payload));
        sentViaWs = true;
      } catch (e) {
        console.error("Failed to send WS message", e);
      }
    }

    // Always broadcast locally to other browser tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {
        console.error("Failed to post to BroadcastChannel", e);
      }
    }

    return sentViaWs;
  }

  // Send a chat message
  sendMessage({
    patientCode,
    text,
    senderRole,
    senderName,
    type = "text",
    prescriptionData = null,
    audioUrl = null,
    metadata = {},
  }) {
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      patientCode,
      senderRole,
      senderName,
      text,
      type,
      prescriptionData,
      audioUrl,
      metadata,
      timestamp: new Date().toISOString(),
      readByPatient: senderRole === "patient",
      readByDoctor: senderRole === "doctor",
    };

    // Save locally
    this.saveMessageToStorage(patientCode, message);

    // Broadcast
    const payload = {
      type: "chat_message",
      room: `patient_${patientCode}`,
      message,
      patientCode,
      includeSelf: false,
    };

    this.sendRaw(payload);
    this.notifySubscribers("message", message);

    return message;
  }

  // Send typing notification
  sendTyping(patientCode, isTyping, senderName, senderRole) {
    const payload = {
      type: "typing",
      room: `patient_${patientCode}`,
      patientCode,
      isTyping,
      senderName,
      senderRole,
      timestamp: new Date().toISOString(),
    };
    this.sendRaw(payload);
  }

  // Send Call Signals (Offer, Answer, ICE, End, Reject, Start)
  sendCallSignal(patientCode, signalType, data = {}) {
    const payload = {
      type: signalType,
      room: `patient_${patientCode}`,
      patientCode,
      ...data,
      timestamp: new Date().toISOString(),
    };
    this.sendRaw(payload);
  }

  // Storage Helpers
  getHistory(patientCode) {
    if (!patientCode) return [];
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${patientCode}`);
      if (stored) {
        return JSON.parse(stored);
      }
      // Return seeds if available
      const seeds = defaultSeedMessages[patientCode] || [];
      if (seeds.length > 0) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${patientCode}`, JSON.stringify(seeds));
      }
      return seeds;
    } catch (e) {
      console.error("Failed to load chat history", e);
      return defaultSeedMessages[patientCode] || [];
    }
  }

  saveMessageToStorage(patientCode, message) {
    if (!patientCode || !message) return;
    try {
      const history = this.getHistory(patientCode);
      // Check if message already in list
      if (!history.some((m) => m.id === message.id)) {
        history.push(message);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${patientCode}`, JSON.stringify(history));
      }
    } catch (e) {
      console.error("Failed to save message to storage", e);
    }
  }

  markAsRead(patientCode, readerRole) {
    if (!patientCode) return;
    try {
      const history = this.getHistory(patientCode);
      let updated = false;
      const newHistory = history.map((msg) => {
        if (readerRole === "patient" && !msg.readByPatient) {
          updated = true;
          return { ...msg, readByPatient: true };
        }
        if (readerRole === "doctor" && !msg.readByDoctor) {
          updated = true;
          return { ...msg, readByDoctor: true };
        }
        return msg;
      });
      if (updated) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${patientCode}`, JSON.stringify(newHistory));
      }
    } catch (e) {
      console.error("Failed to mark messages as read", e);
    }
  }

  getUnreadCount(patientCode, forRole) {
    const history = this.getHistory(patientCode);
    if (forRole === "patient") {
      return history.filter((m) => m.senderRole === "doctor" && !m.readByPatient).length;
    }
    if (forRole === "doctor") {
      return history.filter((m) => m.senderRole !== "doctor" && !m.readByDoctor).length;
    }
    return 0;
  }

  // Subscription helpers
  subscribe(event, callback) {
    if (this.subscribers[event]) {
      this.subscribers[event].add(callback);
      return () => this.subscribers[event].delete(callback);
    }
    return () => {};
  }

  notifySubscribers(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in ${event} subscriber`, e);
        }
      });
    }
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const chatSocketService = new ChatSocketService();
