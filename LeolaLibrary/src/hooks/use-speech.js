import { useState, useCallback, useEffect } from 'react';

type VoiceType = 'female' | 'male' | 'neutral';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoiceType, setCurrentVoiceType] = useState<VoiceType>('female');
  const synth = window.speechSynthesis;

  useEffect(() => {
    // Load available voices
    function loadVoices() {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    }

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      synth.cancel();
    };
  }, []);

  const getVoiceForType = useCallback((type: VoiceType) => {
    // Filter voices based on type
    const languageVoices = voices.filter(voice => voice.lang.includes('en'));

    switch (type) {
      case 'female':
        return languageVoices.find(voice => voice.name.toLowerCase().includes('female')) ||
               languageVoices[0];
      case 'male':
        return languageVoices.find(voice => voice.name.toLowerCase().includes('male')) ||
               languageVoices[0];
      case 'neutral':
        return languageVoices.find(voice => !voice.name.toLowerCase().includes('female') && 
                                          !voice.name.toLowerCase().includes('male')) ||
               languageVoices[0];
      default:
        return languageVoices[0];
    }
  }, [voices]);

  const speak = useCallback((text: string, voiceType?: VoiceType) => {
    // Stop any ongoing speech
    synth.cancel();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoiceType = voiceType || currentVoiceType;
    const voice = getVoiceForType(selectedVoiceType);

    if (voice) {
      utterance.voice = voice;
      setCurrentVoiceType(selectedVoiceType);
    }

    // Configure speech parameters
    utterance.rate = 1.0;  // Normal speed
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0;

    // Event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  }, [synth, currentVoiceType, getVoiceForType]);

  const stop = useCallback(() => {
    synth.cancel();
    setIsSpeaking(false);
  }, [synth]);

  const previewVoice = useCallback((type: VoiceType) => {
    const previewText = "This is a preview of how this voice sounds.";
    speak(previewText, type);
  }, [speak]);

  return { 
    speak, 
    stop, 
    isSpeaking, 
    currentVoiceType,
    previewVoice,
    availableVoices: voices 
  };
}