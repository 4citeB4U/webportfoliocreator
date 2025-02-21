import { useState, useCallback, useEffect } from 'react';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const synth = window.speechSynthesis;

    // Load available voices
    function loadVoices() {
      const availableVoices = synth.getVoices();
      console.log('Loading voices:', availableVoices.length);
      if (availableVoices.length > 0) {
        setVoices(availableVoices);

        // Try to find Microsoft Aria Online as the default voice
        const preferred = availableVoices.find(voice => 
          voice.name === "Microsoft Aria Online (Natural) - English (United States)"
        );

        if (preferred && !currentVoice) {
          console.log('Setting preferred voice:', preferred.name);
          setCurrentVoice(preferred);
        }
      }
    }

    loadVoices();

    // Chrome requires this event handler
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      if (synth.speaking) {
        synth.cancel();
      }
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = null;
      }
    };
  }, [currentVoice]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSupported || !text) {
      console.log('Speech not supported or no text provided');
      return;
    }

    const synth = window.speechSynthesis;

    // Stop any ongoing speech
    if (synth.speaking) {
      console.log('Canceling ongoing speech');
      synth.cancel();
      setCurrentUtterance(null);
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      if (currentVoice) {
        console.log('Using voice:', currentVoice.name);
        utterance.voice = currentVoice;
      }

      // Configure speech parameters
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Event handlers
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentUtterance(null);
        if (onEnd) {
          onEnd();
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      synth.speak(utterance);
    } catch (error) {
      console.error('Error in speak:', error);
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    }
  }, [isSupported, currentVoice]);

  const pause = useCallback(() => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;
    if (synth.speaking && synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      console.log('Stopping speech');
      synth.cancel();
      setCurrentUtterance(null);
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    currentVoice,
    setVoice: setCurrentVoice,
    availableVoices: voices,
    isSupported,
    currentUtterance
  };
}