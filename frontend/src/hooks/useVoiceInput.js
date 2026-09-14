import { useState, useCallback, useRef, useEffect } from 'react';
import voiceLanguages from '../i18n/voiceLanguages';
import { mapVoiceToValue } from '../utils/voiceMapper';

/**
 * Voice input hook — compatible with IntakeWizard's call pattern:
 *   useVoiceInput(lang) → { isListening, transcript, parsedParams, startListening, stopListening, isSupported }
 *
 * Also supports the original callback pattern:
 *   useVoiceInput(onResultCallback, langCode)
 */
export function useVoiceInput(langOrCallback, maybeLangCode) {
  // Detect call pattern
  const isCallbackMode = typeof langOrCallback === 'function';
  const onResult = isCallbackMode ? langOrCallback : null;
  const langCode = isCallbackMode
    ? (maybeLangCode || 'hi-IN')
    : (langOrCallback === 'hi' ? 'hi-IN' : 'en-IN');

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedParams, setParsedParams] = useState({});
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        // Callback mode
        if (onResult) onResult(text);

        // Auto-parse spoken text into structured params
        const mapped = mapVoiceToValue(text);
        if (mapped !== null && mapped !== text) {
          setParsedParams((prev) => ({ ...prev, _lastParsed: mapped }));
        }
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [langCode, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    parsedParams,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    voiceLanguages,
  };
}
