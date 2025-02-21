import { useState } from 'react';
import AgentLee from '@/components/AgentLee';
import VoiceInterface from '@/components/VoiceInterface';
import CyberAnimation from '@/components/CyberAnimation';
import Settings from '@/components/Settings';

export default function Home() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const handleNewMessage = (message: {role: 'user' | 'assistant', content: string}) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <CyberAnimation />

      <div className="relative z-20">
        <div className="container mx-auto px-4 py-8">
          {/* Settings button positioned at top-right */}
          <div className="fixed top-4 right-4 z-50">
            <Settings onVoiceChange={setSelectedVoice} />
          </div>

          <div className="min-h-screen relative">
            <AgentLee messages={messages} selectedVoice={selectedVoice} />
            <div className="fixed bottom-8 left-0 right-0 px-4">
              <VoiceInterface onMessage={handleNewMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}