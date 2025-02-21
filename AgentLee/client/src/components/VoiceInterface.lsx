import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, Square, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getBusinessAdvice } from '@/lib/openai';

interface Props {
  onMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
}

export default function VoiceInterface({ onMessage }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();
  const synth = window.speechSynthesis;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(transcript);
      setInputText(transcript);

      // Check for stop command
      if (transcript.toLowerCase().includes('stop talking')) {
        synth.cancel();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    onMessage({ role: 'user', content: inputText });

    try {
      const response = await getBusinessAdvice(inputText);
      onMessage({ role: 'assistant', content: response.content });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive"
      });
    }

    setInputText('');
    setTranscript('');
  };

  const handleStopSpeaking = () => {
    synth.cancel();
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsListening(!isListening)}
        className={`w-12 h-12 ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-green-500 hover:bg-green-600 text-white border-none'
        }`}
        title={isListening ? "Stop Voice Input" : "Start Voice Input"}
      >
        <Mic className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleStopSpeaking}
        className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white border-none"
        title="Stop Agent Lee Speaking"
      >
        <Square className="h-6 w-6" />
      </Button>

      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type or speak your message..."
        className="flex-1 h-12 bg-white/5 border-white/20 text-white placeholder-white/50"
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <Button 
        onClick={handleSubmit}
        className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white border-none"
        title="Send Message"
      >
        <Send className="h-6 w-6" />
      </Button>
    </div>
  );
}