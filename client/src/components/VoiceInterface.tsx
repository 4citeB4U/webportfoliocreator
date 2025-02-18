import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, Square, History, Repeat } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getBusinessAdvice } from '@/lib/openai';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChatHistory } from '@/components/ChatHistory';

interface Props {
  onMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
}

export default function VoiceInterface({ onMessage }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [currentConversation, setCurrentConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const synth = window.speechSynthesis;
  const queryClient = useQueryClient();
  const conversationId = useRef<number | null>(null);
  const isSpeakingRef = useRef(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Initialize voice selection
  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        // Prefer Microsoft voices if available
        const microsoftVoice = englishVoices.find(v => 
          v.name.includes('Microsoft') || v.name.includes('Google')
        );
        selectedVoiceRef.current = microsoftVoice || englishVoices[0];
        console.log('Selected voice:', selectedVoiceRef.current.name);
      }
    };

    loadVoices();
    // Some browsers need a little time to load voices
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const saveChatMutation = useMutation({
    mutationFn: async (messages: typeof currentConversation) => {
      const endpoint = conversationId.current ? 
        `/api/chats/${conversationId.current}` : 
        "/api/chats";

      const method = conversationId.current ? "PATCH" : "POST";

      const response = await apiRequest(method, endpoint, {
        title: messages[0]?.content.substring(0, 50) + "...",
        messages: messages.map(msg => ({
          ...msg,
          timestamp: new Date().toISOString()
        }))
      });

      if (!conversationId.current) {
        const chat = await response.json();
        conversationId.current = chat.id;
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chats'] });
    },
    onError: (error: Error) => {
      console.error('Failed to save conversation:', error);
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
        handleStopSpeaking();
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
    if (!selectedVoiceRef.current) {
      console.error('No voice selected for speech synthesis');
      return;
    }

    if (synth.speaking) {
      synth.cancel();
    }

    setIsSpeaking(true);
    isSpeakingRef.current = true;

    // Create smaller chunks for better synchronization
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = sentences.reduce((acc: string[], sentence) => {
      // Split long sentences into smaller parts at commas or natural breaks
      if (sentence.length > 100) {
        const parts = sentence.split(/,(?=\s)/);
        return [...acc, ...parts];
      }
      return [...acc, sentence];
    }, []);

    try {
      for (const chunk of chunks) {
        if (!isSpeakingRef.current) break;

        const utterance = new SpeechSynthesisUtterance(chunk.trim());
        utterance.voice = selectedVoiceRef.current;
        utterance.rate = 0.9; // Slightly slower rate for better clarity
        utterance.pitch = 1.0;

        await new Promise<void>((resolve, reject) => {
          utterance.onend = () => {
            console.log('Finished speaking chunk:', chunk);
            resolve();
          };
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            reject(event);
          };
          synth.speak(utterance);
        });

        // Small pause between chunks for natural rhythm
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Speech synthesis error:', error);
      toast({
        title: "Speech Error",
        description: "Failed to speak the response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user' as const, content: inputText };
    onMessage(userMessage);

    const updatedConversation = [...currentConversation, userMessage];
    setCurrentConversation(updatedConversation);

    try {
      // Automatically save after user message
      await saveChatMutation.mutateAsync(updatedConversation);

      const response = await getBusinessAdvice(inputText, updatedConversation);
      const assistantMessage = { role: 'assistant' as const, content: response.content };
      onMessage(assistantMessage);

      const finalConversation = [...updatedConversation, assistantMessage];
      setCurrentConversation(finalConversation);
      setLastResponse(response.content);

      // Automatically save after AI response
      await saveChatMutation.mutateAsync(finalConversation);

      // Speak the response
      await speakText(response.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI",
        variant: "destructive"
      });
    }

    setInputText('');
    setTranscript('');
  };

  const handleStopSpeaking = () => {
    synth.cancel();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  };

  const handleRepeatLast = async () => {
    if (lastResponse) {
      await speakText(lastResponse);
    } else {
      toast({
        title: "No response to repeat",
        description: "There hasn't been any AI response yet.",
        variant: "destructive"
      });
    }
  };

  const handleSelectChat = (chat: any) => {
    // Load the selected chat into the current conversation
    setCurrentConversation(chat.messages);
    setShowHistory(false);
    conversationId.current = chat.id;
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
          onClick={handleRepeatLast}
          className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white border-none"
          title="Repeat Last Response"
        >
          <Repeat className="h-6 w-6" />
        </Button>

        <Button
          onClick={() => setShowHistory(true)}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white border-none"
          title="View Chat History"
        >
          <History className="h-6 w-6" />
        </Button>
      </div>

      {saveChatMutation.isPending && (
        <div className="text-center text-sm text-gray-400">
          Saving conversation...
        </div>
      )}

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-[800px] bg-black/95 border-cyan-500/50">
          <DialogTitle>Chat History</DialogTitle>
          <ChatHistory onSelectChat={handleSelectChat} />
        </DialogContent>
      </Dialog>
    </div>
  );
}