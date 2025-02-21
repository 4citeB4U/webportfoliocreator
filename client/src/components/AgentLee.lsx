import { useEffect, useState, useRef } from 'react';
import ScrollingMessage from './ScrollingMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  messages: Message[];
  selectedVoice: SpeechSynthesisVoice | null;
}

export default function AgentLee({ messages, selectedVoice }: Props) {
  const [currentMessage, setCurrentMessage] = useState('Welcome to AgentLee.com. I am Agent Lee, your personal and professional advisor. I\'m here to help with any challenges you face, whether they\'re business-related or personal matters. I can also share interesting trivia, or provide you with current time and weather information. How may I assist you today?');
  const [isInitialGreeting, setIsInitialGreeting] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const greetingSpokenRef = useRef(false);
  const synth = window.speechSynthesis;

  // Handle initial greeting only once
  useEffect(() => {
    if (isInitialGreeting && !greetingSpokenRef.current) {
      const speakMessage = () => {
        const utterance = new SpeechSynthesisUtterance(currentMessage);
        if (selectedVoice) {
          console.log('Using voice:', selectedVoice.name);
          utterance.voice = selectedVoice;
        } else {
          console.log('No voice selected, using default voice');
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          console.log('Started speaking with voice:', utterance.voice?.name);
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          greetingSpokenRef.current = true;
        };

        synth.speak(utterance);
      };

      // Ensure voices are loaded before speaking
      if (speechSynthesis.getVoices().length) {
        speakMessage();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          speakMessage();
          speechSynthesis.onvoiceschanged = null;
        };
      }

      return () => {
        synth.cancel();
      };
    }
  }, [isInitialGreeting, selectedVoice, currentMessage]);

  // Handle new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setIsInitialGreeting(false);
        setCurrentMessage(lastMessage.content);

        const speakMessage = () => {
          const utterance = new SpeechSynthesisUtterance(lastMessage.content);
          if (selectedVoice) {
            console.log('Using voice for message:', selectedVoice.name);
            utterance.voice = selectedVoice;
          }
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;

          utterance.onstart = () => {
            console.log('Started speaking message with voice:', utterance.voice?.name);
            setIsSpeaking(true);
          };
          utterance.onend = () => setIsSpeaking(false);

          synth.speak(utterance);
        };

        // Ensure voices are loaded before speaking
        if (speechSynthesis.getVoices().length) {
          speakMessage();
        } else {
          speechSynthesis.onvoiceschanged = () => {
            speakMessage();
            speechSynthesis.onvoiceschanged = null;
          };
        }

        return () => {
          synth.cancel();
        };
      }
    }
  }, [messages, selectedVoice]);

  return (
    <div className="relative min-h-screen">
      {/* Fire Text Effect for Agent Lee */}
      <div className="fire-text">AGENT LEE</div>

      {/* Scrolling Message Display */}
      {(isInitialGreeting || messages.length > 0) && (
        <ScrollingMessage 
          message={currentMessage} 
          isSpeaking={isSpeaking}
          onComplete={() => {
            setIsInitialGreeting(false);
          }}
        />
      )}

      <style>
        {`
          .fire-text {
            position: absolute;
            top: 40px;
            width: 100%;
            text-align: center;
            font-family: 'Arial', sans-serif;
            font-size: 48px;
            font-weight: bold;
            z-index: 10;
            color: #fff;
            text-shadow: 0 0 20px #fefcc9,
                        0 -10px 40px #feec85,
                        0 -20px 50px #ffae34,
                        0 -40px 80px #ec760c,
                        0 0 90px #cd4606;
            animation: flicker 4s linear infinite;
          }

          @keyframes flicker {
            0%, 100% { 
              text-shadow: 0 0 20px #fefcc9,
                          0 -10px 40px #feec85,
                          0 -20px 50px #ffae34,
                          0 -40px 80px #ec760c,
                          0 0 90px #cd4606;
            }
            50% { 
              text-shadow: 0 0 25px #fefcc9,
                          0 -12px 45px #feec85,
                          0 -25px 55px #ffae34,
                          0 -45px 85px #ec760c,
                          0 0 100px #cd4606;
            }
          }
        `}
      </style>
    </div>
  );
}