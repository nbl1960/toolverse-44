"use client";

import * as React from "react";

// The Web Speech API's SpeechRecognition interface isn't in TypeScript's
// default DOM lib and is still vendor-prefixed in some browsers — this
// is a minimal shape covering only what's actually used here.
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface UseVoiceSearchResult {
  /** True only if the browser actually supports the Web Speech API — callers should hide the mic button entirely when false, not show a disabled/broken one. */
  isSupported: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

/**
 * Wraps the browser's native Web Speech API for voice search. Support
 * is genuinely inconsistent across browsers (notably weak-to-absent in
 * Firefox) — `isSupported` reflects real feature detection, not an
 * assumption, so the UI can omit the mic entirely rather than offer a
 * button that silently does nothing.
 */
export function useVoiceSearch(onResult: (transcript: string) => void): UseVoiceSearchResult {
  const [isSupported, setIsSupported] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = React.useRef(onResult);
  onResultRef.current = onResult;

  React.useEffect(() => {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1]?.[0]?.transcript;
      if (transcript) onResultRef.current(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, []);

  const startListening = React.useCallback(() => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // start() throws if recognition is already active — safe to ignore.
      setIsListening(false);
    }
  }, []);

  const stopListening = React.useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isSupported, isListening, startListening, stopListening };
}
