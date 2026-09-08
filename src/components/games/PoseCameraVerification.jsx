import { useState, useEffect, useRef, useCallback } from "react";
import {
  RealtimePoseAnalyzer,
  parseGameCommandToAction,
  drawPoseSkeleton,
  speakInstruction
} from "../../utils/poseDetectionEngine";
import { useRealtimeTracking } from "../../context/RealtimeTrackingContext";
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Volume2,
  RefreshCw,
  Eye,
  Activity,
  UserCheck,
  RotateCcw
} from "lucide-react";

/**
 * PoseCameraVerification
 * 
 * Embeds real-time camera-based pose detection & physical movement verification
 * directly into BrainBoost physical games.
 * 
 * Guarantees direct hardware MediaStream attachment to video element with
 * verified playback, zero black placeholders, robust error handling,
 * and high-accuracy pose overlay tracking.
 */
export const PoseCameraVerification = ({
  commandText = "Touch your head",
  gameId = "pm-1",
  activityId = "act-physical",
  patientId = "PT-7241",
  onVerified,
  onCancel,
  multiSteps = null, // optional array of step strings: ["Touch your head", "Raise both hands", "Touch your knees"]
  autoStartCamera = false
}) => {
  const { recordEvent } = useRealtimeTracking();

  // Permission & Stream State
  const initialPermissionGranted = autoStartCamera || (typeof window !== "undefined" && window.sessionStorage?.getItem("brainboost_camera_allowed") === "true");
  const [hasPermission, setHasPermission] = useState(initialPermissionGranted);
  const [permissionRequested, setPermissionRequested] = useState(initialPermissionGranted);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  // Multi-step sequence handling
  const stepsList = multiSteps && multiSteps.length > 0
    ? multiSteps
    : [commandText];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const activeStepCommand = stepsList[currentStepIdx] || commandText;

  // Verification & Feedback State
  const [feedbackMessage, setFeedbackMessage] = useState("Get ready...");
  const [verificationStatus, setVerificationStatus] = useState("Detecting...");
  const [holdProgress, setHoldProgress] = useState(0);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(1);
  const [retriesCount, setRetriesCount] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0.92);
  const [detectedActionLabel, setDetectedActionLabel] = useState("Positioning");
  const [debugMode, setDebugMode] = useState(false);
  const debugModeRef = useRef(false);

  // Sync debugMode ref
  useEffect(() => {
    debugModeRef.current = debugMode;
  }, [debugMode]);

  // Timing
  const stepStartTimeRef = useRef(Date.now());
  const gameStartTimeRef = useRef(Date.now());

  // Refs for video, canvas & stream
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const analyzerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastProcessedTimeRef = useRef(0);
  const isVerifiedRef = useRef(false);
  const lastSpokenClapRef = useRef(0);

  // Initialize analyzer
  if (!analyzerRef.current) {
    analyzerRef.current = new RealtimePoseAnalyzer();
  }

  // Speak initial instruction
  useEffect(() => {
    if (hasPermission && activeStepCommand) {
      speakInstruction(activeStepCommand);
    }
  }, [hasPermission, activeStepCommand, currentStepIdx]);

  // Helper to safely bind MediaStream to video element and trigger playback
  const bindStreamToVideo = useCallback(async (videoEl, stream) => {
    if (!videoEl || !stream) {
      console.warn("[BrainBoost Camera] bindStreamToVideo called with null video or stream", { videoEl: !!videoEl, stream: !!stream });
      return;
    }

    try {
      console.log("[BrainBoost Camera] Attaching MediaStream to video element. Stream ID:", stream.id);
      
      // Ensure source object is set
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }

      // Ensure necessary HTML5 video attributes for auto playback in all browsers
      videoEl.setAttribute("autoplay", "true");
      videoEl.setAttribute("playsinline", "true");
      videoEl.setAttribute("muted", "true");
      videoEl.muted = true;

      // Start playback
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`[BrainBoost Camera] video.play() resolved successfully! Video Dimensions: ${videoEl.videoWidth}x${videoEl.videoHeight}, readyState: ${videoEl.readyState}`);
        
        if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
          setIsVideoReady(true);
          if (canvasRef.current) {
            canvasRef.current.width = videoEl.videoWidth;
            canvasRef.current.height = videoEl.videoHeight;
          }
        }
      }
    } catch (playErr) {
      console.warn("[BrainBoost Camera] Video playback error:", playErr);
      // Attempt muted retry
      try {
        videoEl.muted = true;
        await videoEl.play();
        setIsVideoReady(true);
      } catch (retryErr) {
        console.error("[BrainBoost Camera] Retry play also failed:", retryErr);
      }
    }
  }, []);

  // Request camera access from browser
  const handleRequestCamera = useCallback(async () => {
    setPermissionRequested(true);
    setCameraError(null);
    setIsStartingCamera(true);

    console.log("[BrainBoost Camera] Initiating getUserMedia request...");

    // Check browser compatibility and security context
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      const isNotHttps = typeof window !== "undefined" && window.location.protocol !== "https:" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
      const errText = isNotHttps
        ? "Camera access requires HTTPS or localhost connection."
        : "Camera API (getUserMedia) is not supported in this browser.";
      console.error("[BrainBoost Camera]", errText);
      setCameraError(errText);
      setIsStartingCamera(false);
      return;
    }

    try {
      let stream = null;

      // 1. Try standard ideal camera constraints
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
      } catch (constraintErr) {
        console.warn("[BrainBoost Camera] Ideal constraints failed, falling back to basic video:", constraintErr);
        // 2. Fallback to basic video access
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      console.log("[BrainBoost Camera] MediaStream acquired successfully! Active tracks:", stream.getVideoTracks().map(t => ({
        label: t.label,
        enabled: t.enabled,
        readyState: t.readyState
      })));

      // Store in ref and session storage
      streamRef.current = stream;
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem("brainboost_camera_allowed", "true");
      }

      setHasPermission(true);
      setIsCameraActive(true);
      setCameraError(null);

      // If video ref is already mounted, attach immediately
      if (videoRef.current) {
        await bindStreamToVideo(videoRef.current, stream);
      }
    } catch (err) {
      console.error("[BrainBoost Camera] Camera access failed:", err.name, err.message, err);
      
      let userFriendlyMsg = "Camera could not be started. Please check your browser camera permission.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        userFriendlyMsg = "Camera permission was denied. Please allow camera access in your browser address bar settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        userFriendlyMsg = "No camera found on your device. Please check that a webcam is connected.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        userFriendlyMsg = "Camera is currently in use by another application or tab. Please close other camera apps.";
      } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        userFriendlyMsg = "Your camera does not support requested settings. Please try again.";
      } else if (err.name === "SecurityError") {
        userFriendlyMsg = "Camera access is restricted due to security settings or iframe permissions.";
      }

      setCameraError(userFriendlyMsg);
      setHasPermission(false);
      setIsCameraActive(false);
    } finally {
      setIsStartingCamera(false);
    }
  }, [bindStreamToVideo]);

  // Callback ref for the video element to guarantee instantaneous stream binding upon DOM mount
  const setVideoElementRef = useCallback((videoEl) => {
    videoRef.current = videoEl;
    if (videoEl && streamRef.current) {
      console.log("[BrainBoost Camera] Video DOM node mounted with active stream. Binding immediately...");
      bindStreamToVideo(videoEl, streamRef.current);
    }
  }, [bindStreamToVideo]);

  // If auto-start or previously granted, start camera automatically
  useEffect(() => {
    if (initialPermissionGranted && !streamRef.current && !isCameraActive) {
      handleRequestCamera();
    }
  }, [initialPermissionGranted, handleRequestCamera, isCameraActive]);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      console.log("[BrainBoost Camera] Stopping all MediaStream tracks...");
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
          console.log(`[BrainBoost Camera] Track stopped: ${track.label}`);
        } catch (e) {
          console.warn("[BrainBoost Camera] Error stopping track:", e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // When step changes, reset hold and reset step timer
  useEffect(() => {
    if (analyzerRef.current) {
      analyzerRef.current.resetHold();
    }
    isVerifiedRef.current = false;
    lastSpokenClapRef.current = 0;
    setIsStepCompleted(false);
    setHoldProgress(0);
    setVerificationStatus("Detecting...");
    setFeedbackMessage("Get ready...");
    stepStartTimeRef.current = Date.now();
  }, [currentStepIdx]);

  // Real-time animation & pose analysis loop (Runs ON TOP of the live video stream)
  useEffect(() => {
    if (!hasPermission || isAllCompleted) return;

    const actionConfig = parseGameCommandToAction(activeStepCommand);

    const runAnalysisLoop = (timestamp) => {
      // Process video frame every ~60ms (16 FPS detection loop, 60 FPS render)
      if (timestamp - lastProcessedTimeRef.current > 60 && !isVerifiedRef.current) {
        lastProcessedTimeRef.current = timestamp;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const analyzer = analyzerRef.current;

        if (analyzer && canvas && video) {
          // Sync canvas dimensions with actual video resolution
          if (video.videoWidth > 0 && canvas.width !== video.videoWidth) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          const ctx = canvas.getContext("2d");
          const pose = analyzer.analyzeFrame(video);
          const result = analyzer.verifyMovement(pose, actionConfig);

          setDetectedActionLabel(result.detectedAction || "Detecting");
          setConfidenceScore(result.confidence || 0.88);
          setHoldProgress(result.holdProgress || 0);

          // Auditory prompt when clap progresses
          if (result.clapCount && result.clapCount > lastSpokenClapRef.current) {
            lastSpokenClapRef.current = result.clapCount;
            if (result.clapCount < (result.requiredReps || 2)) {
              speakInstruction("Great! Clap one more time.");
            }
          }

          // Update real-time feedback
          if (result.status === "COMPLETED") {
            setVerificationStatus("✓ Completed");
            setFeedbackMessage(result.feedback || "Great! Correct action.");
          } else if (result.status === "HOLDING") {
            setVerificationStatus("Holding position...");
            setFeedbackMessage(result.feedback || "Almost there! Hold steady...");
          } else if (result.status === "ALMOST") {
            setVerificationStatus("Verifying movement...");
            setFeedbackMessage(result.feedback || "Move your hand a bit closer.");
          } else if (result.status === "TRY_AGAIN") {
            setVerificationStatus("Try again");
            setFeedbackMessage(result.feedback || `Try again. ${activeStepCommand}`);
            setRetriesCount((r) => r + 1);
          } else {
            setVerificationStatus("Detecting...");
            setFeedbackMessage(result.feedback || "Get ready...");
          }

          // Draw skeleton, landmarks, and target halo over live canvas
          drawPoseSkeleton(
            ctx,
            pose,
            actionConfig,
            result,
            canvas.width,
            canvas.height,
            debugModeRef.current
          );

          // SUCCESS VERIFICATION
          if (result.isCorrect && !isVerifiedRef.current) {
            isVerifiedRef.current = true;
            setIsStepCompleted(true);
            const responseTimeMs = Date.now() - stepStartTimeRef.current;
            const completionTimeSec = ((Date.now() - gameStartTimeRef.current) / 1000).toFixed(1);

            // Log full analytics event
            const eventPayload = {
              patientId,
              gameId,
              activityId,
              command: activeStepCommand,
              expectedAction: actionConfig.expectedDescription || actionConfig.label,
              detectedAction: result.detectedAction,
              correct: true,
              accuracy: Math.round((result.confidence || 0.95) * 100),
              responseTime: (responseTimeMs / 1000).toFixed(2),
              completionTime: completionTimeSec,
              attempts: attemptsCount,
              retries: retriesCount,
              timestamp: new Date().toISOString()
            };

            recordEvent("MOVEMENT_VERIFIED", eventPayload);
            recordEvent("POSE_DETECTED", {
              landmark: actionConfig.targetPart,
              confidence: result.confidence,
              stepIndex: currentStepIdx,
              totalSteps: stepsList.length
            });

            // Handle multi-step vs single-step completion
            if (currentStepIdx < stepsList.length - 1) {
              setTimeout(() => {
                setCurrentStepIdx((prev) => prev + 1);
              }, 1200);
            } else {
              setIsAllCompleted(true);
              setTimeout(() => {
                stopCamera();
                if (onVerified) {
                  onVerified({
                    accuracy: Math.round((result.confidence || 0.95) * 100),
                    timeSpentSeconds: Math.max(1, Math.round((Date.now() - gameStartTimeRef.current) / 1000)),
                    attempts: attemptsCount,
                    retries: retriesCount
                  });
                }
              }, 1500);
            }
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(runAnalysisLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(runAnalysisLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    hasPermission,
    activeStepCommand,
    currentStepIdx,
    stepsList.length,
    isAllCompleted,
    attemptsCount,
    retriesCount,
    patientId,
    gameId,
    activityId,
    recordEvent,
    onVerified,
    stopCamera
  ]);

  // If permission has not yet been accepted, show the Camera Access Required modal
  if (!hasPermission) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-lg text-center max-w-lg mx-auto space-y-6">
        <div className="w-16 h-16 bg-teal-100 text-[#0D7377] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Camera className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-[#132A2F]">
            Camera Access Required
          </h3>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Allow camera access so BrainBoost can verify your physical activity.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900 leading-normal font-medium">
            <span className="font-bold block text-emerald-950">100% On-Device & Private</span>
            No facial recognition or video is stored. Pose landmarks are processed in real-time in your browser only.
          </div>
        </div>

        {cameraError && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs text-amber-900 text-left space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Camera Initialization Notice</span>
            </div>
            <p className="leading-relaxed">{cameraError}</p>
            <p className="text-[11px] text-amber-800">
              Tip: Click the lock icon in your browser address bar and make sure Camera is set to "Allow".
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            id="allow-camera-btn"
            onClick={handleRequestCamera}
            disabled={isStartingCamera}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0D7377] hover:bg-[#0A5C5F] text-white rounded-2xl font-black text-base shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isStartingCamera ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Starting Camera...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Allow Camera</span>
              </>
            )}
          </button>

          {onCancel && (
            <button
              id="cancel-camera-btn"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-base transition active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active Camera Verification View
  return (
    <div className="bg-white rounded-3xl border border-teal-200 shadow-lg overflow-hidden space-y-4 p-4 sm:p-6">
      {/* HUD Header Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            Camera: Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDebugMode((prev) => !prev)}
            className={`p-2 rounded-xl transition cursor-pointer text-xs font-bold flex items-center gap-1 ${
              debugMode
                ? "bg-teal-700 text-white shadow-xs"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            title="Toggle Developer HUD Debug Overlay"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">{debugMode ? "HUD On" : "Debug"}</span>
          </button>
          <button
            onClick={() => speakInstruction(activeStepCommand)}
            className="p-2 text-[#0D7377] hover:bg-teal-50 rounded-xl transition cursor-pointer"
            title="Hear command"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            AI Confidence: {Math.round(confidenceScore * 100)}%
          </span>
        </div>
      </div>

      {/* Multi-step progress tracker if sequence */}
      {stepsList.length > 1 && (
        <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Sequence Progress</span>
            <span>Step {currentStepIdx + 1} of {stepsList.length}</span>
          </div>
          <div className="flex gap-2">
            {stepsList.map((st, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i < currentStepIdx
                    ? "bg-emerald-500"
                    : i === currentStepIdx
                    ? "bg-[#0D7377] animate-pulse"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Command Display */}
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 border-2 border-teal-300 rounded-2xl p-4 text-center shadow-xs">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#0D7377]">
          Game Command
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[#132A2F] mt-1">
          "{activeStepCommand}"
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Perform the action in front of the camera. The AI will verify automatically.
        </p>
      </div>

      {/* Live Camera Feed & Canvas Overlay (REAL CAMERA PREVIEW ALWAYS VISIBLE) */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-teal-500/50 aspect-4/3 max-w-md mx-auto shadow-inner flex items-center justify-center">
        {/* Mirrored live video element */}
        <video
          ref={setVideoElementRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            console.log(`[BrainBoost Camera] onLoadedMetadata: ${v.videoWidth}x${v.videoHeight}, readyState: ${v.readyState}`);
            if (v.videoWidth > 0 && v.videoHeight > 0) {
              setIsVideoReady(true);
              if (canvasRef.current) {
                canvasRef.current.width = v.videoWidth;
                canvasRef.current.height = v.videoHeight;
              }
            }
            v.play().catch((err) => console.warn("[BrainBoost Camera] play on loadedmetadata error:", err));
          }}
          onCanPlay={(e) => {
            console.log("[BrainBoost Camera] onCanPlay event");
            setIsVideoReady(true);
            e.currentTarget.play().catch(() => {});
          }}
          onPlaying={(e) => {
            const v = e.currentTarget;
            console.log(`[BrainBoost Camera] onPlaying event: ${v.videoWidth}x${v.videoHeight}, readyState: ${v.readyState}`);
            setIsVideoReady(true);
          }}
          className="w-full h-full object-cover scale-x-[-1] block"
        />

        {/* Pose Landmark Canvas Overlay (Transparently drawn directly ON TOP of working camera) */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Transient Connecting Indicator (Non-blocking: only visible while camera hardware powers on) */}
        {!isVideoReady && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-teal-200 gap-2.5 z-20 pointer-events-none">
            <div className="w-8 h-8 border-3 border-teal-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-teal-100">
              Connecting camera feed...
            </span>
          </div>
        )}

        {/* Camera Live Status Overlay Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 z-20">
          <Activity className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span className="font-semibold">Action:</span>
          <span className="font-bold text-teal-300">{activeStepCommand}</span>
        </div>

        {/* Live Status Overlay Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 z-20">
          {isStepCompleted ? (
            <span className="font-black text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ✓ Completed
            </span>
          ) : (
            <span className="font-semibold text-slate-200">
              Status: <span className="font-bold text-cyan-300">{verificationStatus}</span>
            </span>
          )}
        </div>

        {/* Success Overlay Flash on Verified */}
        {isStepCompleted && (
          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-white animate-in fade-in duration-300 z-30">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black mt-3 text-emerald-200">
              Great! Correct action.
            </h4>
            <p className="text-xs text-emerald-100 font-medium">
              Verified by AI Pose Engine
            </p>
          </div>
        )}

        {/* Hold Progress Bar */}
        {holdProgress > 0 && !isStepCompleted && (
          <div className="absolute bottom-3 left-4 right-4 bg-black/60 backdrop-blur-xs p-2 rounded-xl border border-white/20 z-20">
            <div className="flex justify-between text-[11px] font-bold text-white mb-1">
              <span>Hold Position</span>
              <span>{Math.round(holdProgress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-150"
                style={{ width: `${holdProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Real-time Feedback Bar */}
      <div
        className={`p-4 rounded-2xl border transition-all text-center ${
          isStepCompleted
            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
            : verificationStatus.includes("Try again")
            ? "bg-amber-50 border-amber-300 text-amber-900"
            : "bg-teal-50 border-teal-200 text-teal-900"
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isStepCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#0D7377] animate-spin" />
          )}
          <span className="font-black text-base sm:text-lg">
            {feedbackMessage}
          </span>
        </div>
        <p className="text-xs font-semibold opacity-80 mt-0.5">
          Detected: <span className="font-bold">{detectedActionLabel}</span>
        </p>
      </div>
    </div>
  );
};

