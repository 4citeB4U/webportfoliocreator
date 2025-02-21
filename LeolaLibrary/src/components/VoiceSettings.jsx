import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

interface Voice {
  name: string;
  lang: string;
}

interface VoiceSettingsProps {
  onVoiceSelect: (voice: SpeechSynthesisVoice) => void;
  selectedVoice: SpeechSynthesisVoice | null;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  onVoiceSelect,
  selectedVoice
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      // Try to find Microsoft Ava Multilingual first
      const avaVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('microsoft ava') &&
        voice.name.toLowerCase().includes('multilingual') &&
        voice.name.toLowerCase().includes('english') &&
        voice.name.toLowerCase().includes('united states')
      );

      if (avaVoice && !selectedVoice) {
        onVoiceSelect(avaVoice);
      }

      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [onVoiceSelect, selectedVoice]);

  return (
    <div className="fixed bottom-24 right-24 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
        aria-label="Voice Settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="voice-settings-dropdown">
          <h3 className="mb-2 font-semibold">Select Voice</h3>
          <div className="voice-list">
            {voices.map((voice) => (
              <button
                key={voice.name}
                onClick={() => {
                  onVoiceSelect(voice);
                  setIsOpen(false);
                }}
                className={`voice-option ${
                  selectedVoice?.name === voice.name ? 'selected' : ''
                }`}
              >
                {voice.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};