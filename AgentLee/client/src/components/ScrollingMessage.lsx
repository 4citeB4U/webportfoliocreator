import { useEffect, useState } from 'react';

interface Props {
  message: string;
  onComplete?: () => void;
  isSpeaking?: boolean;
}

export default function ScrollingMessage({ message, onComplete, isSpeaking }: Props) {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isAnimating, setIsAnimating] = useState(true);
  const animationDuration = 15; // 15 seconds for one complete scroll

  useEffect(() => {
    setCurrentMessage(message);
    setIsAnimating(true);

    // Reset animation after it completes
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onComplete) {
        onComplete();
      }
    }, animationDuration * 1000); 

    return () => clearTimeout(timer);
  }, [message, onComplete]);

  if (!isAnimating) return null;

  return (
    <div className="message-container">
      <div className="message-wrapper">
        <div className="message">{currentMessage}</div>
      </div>
      <style>
        {`
          .message-container {
            position: absolute;
            bottom: 40px;
            width: 100%;
            height: 50px;
            z-index: 10;
            overflow: hidden;
          }

          .message-wrapper {
            position: relative;
            width: 80%;
            height: 100%;
            margin: 0 auto;
            overflow: hidden;
            mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 25%,
              black 75%,
              transparent 100%
            );
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0%,
              black 25%,
              black 75%,
              transparent 100%
            );
          }

          .message {
            position: absolute;
            width: 100%;
            height: 100%;
            color: #0ff;
            font-family: 'Arial', sans-serif;
            font-size: 24px;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            text-shadow: 0 0 10px #0ff,
                        0 0 20px #0ff,
                        0 0 30px #0ff;
            animation: scrollText ${animationDuration}s linear;
            opacity: ${isSpeaking ? '1' : '0.6'};
            transition: opacity 0.3s ease;
          }

          @keyframes scrollText {
            0% {
              transform: translateX(100%);
            }
            10% {
              transform: translateX(50%);
            }
            90% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </div>
  );
}