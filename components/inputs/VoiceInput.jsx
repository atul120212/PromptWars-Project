"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./VoiceInput.module.css";

export default function VoiceInput({ onTranscript, isProcessing }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      if (finalText) setTranscript((prev) => prev + " " + finalText);
      setInterim(interimText);
    };

    recognition.onerror = (e) => {
      if (e.error !== "aborted") setError(`Microphone error: ${e.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) recognition.start(); // keep going until user stops
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const toggleListening = () => {
    if (!supported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterim("");
    } else {
      setTranscript("");
      setInterim("");
      setError("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = () => {
    const full = transcript.trim();
    if (full && onTranscript) onTranscript(full);
  };

  const handleClear = () => {
    setTranscript("");
    setInterim("");
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>🎤 Voice Input</span>
        {isListening && <span className={styles.liveBadge}>● LIVE</span>}
      </div>

      {!supported ? (
        <div className={styles.unsupported}>
          ⚠️ Web Speech API not supported in this browser. Try Chrome or Edge.
        </div>
      ) : (
        <>
          {/* Waveform visualizer */}
          <div
            className={`${styles.waveform} ${isListening ? styles.waveformActive : ""}`}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.bar} ${isListening ? styles.barActive : ""}`}
                style={{
                  animationDelay: `${i * 0.06}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Mic button */}
          <button
            onClick={toggleListening}
            disabled={isProcessing}
            className={`${styles.micBtn} ${isListening ? styles.micBtnActive : ""}`}
          >
            {isListening ? "⏹ Stop Recording" : "🎤 Start Recording"}
          </button>

          {/* Transcript display */}
          {(transcript || interim) && (
            <div className={styles.transcriptBox}>
              <span className={styles.transcriptText}>{transcript}</span>
              {interim && <span className={styles.interimText}>{interim}</span>}
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {transcript && (
            <div className={styles.actions}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? "⏳ Analyzing..." : "⚡ Analyze Voice Input"}
              </button>
              <button className="btn btn-secondary" onClick={handleClear}>
                🗑 Clear
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
