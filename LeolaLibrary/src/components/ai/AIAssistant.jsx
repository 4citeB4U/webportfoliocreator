import { FC, useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, Wand, Mic, MicOff } from "lucide-react";
import { processAICommand } from '@/lib/ai/aiService';
import { useToast } from "@/hooks/use-toast";
import { useSpeech } from "@/hooks/use-speech";
import type { DraggableItemProps } from "@/components/dnd/DraggableComponent";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  components?: DraggableItemProps[];
}

interface AIAssistantProps {
  onGenerateVariants?: (variants: DraggableItemProps[]) => void;
  onUpdateComponent?: (id: string, modifications: any) => void;
}

// Add type declarations for browser Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export const AIAssistant: FC<AIAssistantProps> = ({ 
  onGenerateVariants, 
  onUpdateComponent 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Get speech recognition from browser
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  const startRecording = () => {
    if (!recognition) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    setInput(''); // Clear existing input
    recognition.start();
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  // Set up speech recognition handlers
  if (recognition) {
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        title: "Speech Recognition Error",
        description: "There was an error with speech recognition. Please try again.",
        variant: "destructive",
      });
    };
  }

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsProcessing(true);

    try {
      const aiResponse = await processAICommand(input);
      let responseMessage = "I'll help you with that.";

      if (aiResponse.action === 'create' && aiResponse.components) {
        responseMessage = `I've created ${aiResponse.components.length} new components based on your request.`;
        onGenerateVariants?.(aiResponse.components);
      } else if (aiResponse.action === 'modify' && aiResponse.modifications) {
        responseMessage = "I've applied the requested modifications to the component.";
        const targetId = (aiResponse.modifications as any).targetId;
        if (targetId) {
          onUpdateComponent?.(targetId, aiResponse.modifications);
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant',
        content: responseMessage,
        components: aiResponse.components
      }]);
    } catch (error) {
      console.error('Error processing request:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, onGenerateVariants, onUpdateComponent, toast]);

  return (
    <Card className="w-full h-[400px] flex flex-col bg-background">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Bot className="w-5 h-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'assistant'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.components && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium">Generated Components:</p>
                      {message.components.map((comp, i) => (
                        <div key={i} className="text-sm opacity-90">
                          {comp.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground max-w-[80%] rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Describe what you want to create or modify..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSubmit()}
            className="flex-1 bg-background text-foreground border-input"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            <Send className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setMessages([])}
            disabled={isProcessing || messages.length === 0}
          >
            <Wand className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};