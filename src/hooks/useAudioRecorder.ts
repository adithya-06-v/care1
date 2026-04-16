import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioRecorderReturn {
  isRecording: boolean;
  transcript: string;
  audioBlob: Blob | null;
  error: string | null;
  status: string;
  audioLevel: number;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((ev: any) => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((ev: any) => void) | null;
  onaudiostart?: ((ev: Event) => void) | null;
  onaudioend?: ((ev: Event) => void) | null;
  onspeechstart?: ((ev: Event) => void) | null;
  onspeechend?: ((ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionInstance) | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Tap start to begin recording.");
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isStartingRef = useRef(false);
  const stopRequestedRef = useRef(false);
  const recognitionEndedRef = useRef(false);
  const stopFallbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearStopFallback = useCallback(() => {
    if (stopFallbackTimeoutRef.current) {
      clearTimeout(stopFallbackTimeoutRef.current);
      stopFallbackTimeoutRef.current = null;
    }
  }, []);

  // Single clean up function to completely destroy recognition instance
  const cleanupRecognition = useCallback((shouldAbort = true) => {
    if (recognitionRef.current) {
      try {
        // Detach handlers to prevent memory leaks and zombie events triggering states
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onaudioend = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onspeechend = null;
        if (shouldAbort) {
          recognitionRef.current.abort();
        }
      } catch (e) {
        console.error("Error cleaning up speech recognition:", e);
      }
      recognitionRef.current = null;
    }
  }, []);

  const cleanupMediaStream = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    analyserRef.current = null;
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const cleanupAll = useCallback((shouldAbortRecognition = true) => {
    clearStopFallback();
    cleanupRecognition(shouldAbortRecognition);
    cleanupMediaStream();
    isStartingRef.current = false;
    stopRequestedRef.current = false;
    recognitionEndedRef.current = false;
  }, [clearStopFallback, cleanupRecognition, cleanupMediaStream]);

  const startRecording = useCallback(() => {
    if (isStartingRef.current || isRecording) return;

    // 1. Make sure previous session is fully cleaned up before starting a new one
    cleanupAll();
    isStartingRef.current = true;
    stopRequestedRef.current = false;
    recognitionEndedRef.current = false;
    
    // 2. Reset states for a fresh start
    setError(null);
    setTranscript("");
    setAudioBlob(null);
    setStatus("Starting microphone...");
    setAudioLevel(0);
    setIsRecording(false); // Will be set to true on the onstart callback

    // 3. Initialize Speech Recognition
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari over HTTPS.");
      isStartingRef.current = false;
      return;
    }

    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setError("Microphone access requires HTTPS or localhost in most browsers.");
      isStartingRef.current = false;
      return;
    }

    try {
      const recognition = new Ctor();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("RECORDING STARTED");
        isStartingRef.current = false;
        recognitionEndedRef.current = false;
        setIsRecording(true);
        setStatus("Listening... start speaking now.");
      };

      recognition.onresult = (event) => {
        let nextTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          nextTranscript += event.results[i][0].transcript;
        }
        const cleanTranscript = nextTranscript.trim();
        setTranscript((prev) => {
          const combinedTranscript = `${prev} ${cleanTranscript}`.trim();
          return combinedTranscript;
        });
        setStatus(
          cleanTranscript
            ? "Live preview updating from your voice."
            : "Listening... start speaking now.",
        );
      };

      recognition.onaudiostart = () => {
        setStatus("Microphone connected. Listening...");
      };

      recognition.onspeechstart = () => {
        setStatus("Speech detected. Building live preview...");
      };

      recognition.onspeechend = () => {
        setStatus("Speech paused. Tap stop when you're done.");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setIsRecording(false);
          isStartingRef.current = false;
          setError("Microphone access denied. Please allow microphone permissions in your browser.");
          setStatus("Microphone permission was denied.");
          cleanupAll();
        } else if (event.error === "audio-capture") {
          setIsRecording(false);
          isStartingRef.current = false;
          setError("No microphone was found or it is being used by another app.");
          setStatus("No working microphone was detected.");
          cleanupAll();
        } else if (event.error === "no-speech") {
          setError(null);
          setStatus("No speech heard yet. Try speaking louder or closer to the mic.");
        } else if (event.error === "aborted" && stopRequestedRef.current) {
          cleanupAll();
        } else {
          setIsRecording(false);
          isStartingRef.current = false;
          setError(`Microphone error: ${event.error}`);
          setStatus(`Microphone error: ${event.error}`);
          cleanupAll();
        }
      };

      recognition.onend = () => {
        console.log("RECORDING ENDED");
        recognitionEndedRef.current = true;
        setIsRecording(false);
        isStartingRef.current = false;
        setStatus("Recording stopped.");

        const recorderStillFinishing =
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive";

        if (!recorderStillFinishing) {
          cleanupAll(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

      void navigator.mediaDevices
        .getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (typeof MediaRecorder !== "undefined") {
            try {
              const mediaRecorder = new MediaRecorder(stream);
              mediaChunksRef.current = [];
              mediaRecorder.ondataavailable = (recorderEvent) => {
                if (recorderEvent.data.size > 0) {
                  mediaChunksRef.current.push(recorderEvent.data);
                }
              };
              mediaRecorder.onstop = () => {
                if (mediaChunksRef.current.length > 0) {
                  setAudioBlob(new Blob(mediaChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" }));
                }
                mediaChunksRef.current = [];
                mediaRecorderRef.current = null;

                if (stopRequestedRef.current && recognitionEndedRef.current) {
                  cleanupAll(false);
                }
              };
              mediaRecorderRef.current = mediaRecorder;
              mediaRecorder.start();
            } catch (recorderError) {
              console.error("MediaRecorder error:", recorderError);
            }
          }

          const AudioContextCtor =
            window.AudioContext ||
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).webkitAudioContext;
          if (!AudioContextCtor) {
            return;
          }

          const audioContext = new AudioContextCtor();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          source.connect(analyser);

          audioContextRef.current = audioContext;
          analyserRef.current = analyser;

          const samples = new Uint8Array(analyser.frequencyBinCount);

          const updateAudioLevel = () => {
            if (!analyserRef.current) {
              return;
            }

            analyserRef.current.getByteTimeDomainData(samples);
            let sumSquares = 0;
            for (let i = 0; i < samples.length; i++) {
              const normalized = (samples[i] - 128) / 128;
              sumSquares += normalized * normalized;
            }

            const rms = Math.sqrt(sumSquares / samples.length);
            setAudioLevel(rms);

            if (rms > 0.035) {
              setStatus((prev) =>
                prev.includes("Live preview")
                  ? prev
                  : "Voice detected. Waiting for live preview text...",
              );
            }

            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };

          updateAudioLevel();
        })
        .catch((streamError) => {
          console.error("Microphone stream error:", streamError);
        });
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setError("Microphone could not be started. Please allow mic access and try again.");
      setStatus("Microphone could not be started.");
      setIsRecording(false);
      cleanupAll();
    }
  }, [cleanupAll, isRecording]);

  const stopRecording = useCallback(() => {
    console.log("STOP CLICKED");
    stopRequestedRef.current = true;
    setIsRecording(false);
    setStatus("Stopping recording...");

    if (recognitionRef.current) {
      try {
        clearStopFallback();
        stopFallbackTimeoutRef.current = setTimeout(() => {
          setIsRecording(false);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            try {
              mediaRecorderRef.current.stop();
            } catch (recorderError) {
              console.error("Fallback MediaRecorder stop error:", recorderError);
            }
          }
          cleanupAll();
        }, 3000);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
        cleanupAll();
      }
    } else {
      setIsRecording(false);
      cleanupAll();
    }
  }, [cleanupAll, clearStopFallback]);

  const resetRecording = useCallback(() => {
    cleanupAll();
    setIsRecording(false);
    setTranscript("");
    setError(null);
    setStatus("Tap start to begin recording.");
  }, [cleanupAll]);

  // Cleanup effect: Handle page unmounts and visibility changes (like tab switching)
  // to ensure microphone is released gracefully to avoid OS-level deadlocks.
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If user switches tabs, stop recording automatically to prevent unexpected background mic usage
      if (document.hidden && isRecording) {
        stopRecording();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Ensures complete teardown of SpeechRecognition instance on component dismount. 
      cleanupAll(); 
    };
  }, [cleanupAll, isRecording, stopRecording]);

  return {
    isRecording,
    transcript,
    audioBlob,
    error,
    status,
    audioLevel,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
