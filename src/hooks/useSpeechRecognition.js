import { useCallback, useEffect, useRef, useState } from "react";

// Check for Web Speech API browser compatibility
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const isMounted = useRef(true); // To prevent state updates on unmounted component

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setError("Trình duyệt của bạn không hỗ trợ Web Speech API.");
      return;
    }

    // Initialize SpeechRecognition if not already
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Listen for a single utterance
      recognitionRef.current.interimResults = false; // Only return final results
      recognitionRef.current.lang = "en-US"; // Set language to English (US)

      recognitionRef.current.onstart = () => {
        if (isMounted.current) {
          setIsListening(true);
          setTranscript(""); // Clear previous transcript on start
          setError("");
        }
      };

      recognitionRef.current.onresult = (event) => {
        if (isMounted.current) {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          setIsListening(false); // Stop listening after result
        }
      };

      recognitionRef.current.onerror = (event) => {
        if (isMounted.current) {
          setError(`Lỗi nhận diện giọng nói: ${event.error}`);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        if (isMounted.current && isListening) {
          // If it ended but we were still listening (e.g., no speech detected)
          setIsListening(false);
        }
      };
    }

    // Ensure it's not already listening before starting
    if (!isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]); // Dependency on isListening to prevent unnecessary re-creations

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null; // Clear ref
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript, // Allow clearing transcript from outside
    setError, // Allow clearing error from outside
  };
};
