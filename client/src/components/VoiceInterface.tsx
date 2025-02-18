import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, Square, Volume2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getBusinessAdvice } from '@/lib/openai';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Props {
  onMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
}

export default function VoiceInterface({ onMessage }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [currentConversation, setCurrentConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const { toast } = useToast();
  const synth = window.speechSynthesis;
  const queryClient = useQueryClient();

  const saveChatMutation = useMutation({
    mutationFn: async (messages: typeof currentConversation) => {
      return await apiRequest("POST", "/api/chats", {
        title: messages[0]?.content.substring(0, 50) + "...",
        messages
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
      toast({
        title: "Conversation saved",
        description: "You can access this conversation in your chat history.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save conversation",
        description: error.message,
        variant: "destructive"
      });
    }
  });

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
        setIsSpeaking(false);
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

  const speakText = async (text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    // Split text into manageable chunks for continuous speech
    const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];

    for (const chunk of chunks) {
      if (!isSpeaking) break;
      const chunkUtterance = new SpeechSynthesisUtterance(chunk);
      await new Promise(resolve => {
        chunkUtterance.onend = resolve;
        synth.speak(chunkUtterance);
      });
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user' as const, content: inputText };
    onMessage(userMessage);
    setCurrentConversation(prev => [...prev, userMessage]);

    try {
      const response = await getBusinessAdvice(inputText, currentConversation);
      const assistantMessage = { role: 'assistant' as const, content: response.content };
      onMessage(assistantMessage);
      setCurrentConversation(prev => [...prev, assistantMessage]);

      // Speak the response
      await speakText(response.content);
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
    setIsSpeaking(false);
  };

  const handleSaveConversation = () => {
    if (currentConversation.length === 0) {
      toast({
        title: "No conversation to save",
        description: "Have a conversation first before saving.",
        variant: "destructive"
      });
      return;
    }

    saveChatMutation.mutate(currentConversation);
  };

  return (
    <div className="flex flex-col gap-4">
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

        <Button
          onClick={handleSaveConversation}
          className="w-12 h-12 bg-cyan-500 hover:bg-cyan-600 text-white border-none"
          title="Save Conversation"
        >
          <Save className="h-6 w-6" />
        </Button>
      </div>

      {saveChatMutation.isPending && (
        <div className="text-center text-sm text-gray-400">
          Saving conversation...
        </div>
      )}
    </div>
  );
}