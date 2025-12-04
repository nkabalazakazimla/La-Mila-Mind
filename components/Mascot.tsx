import React, { useEffect, useState } from 'react';
import { COLORS } from '../constants';

interface MascotProps {
  message: string;
  emotion: 'happy' | 'neutral' | 'thinking' | 'celebrating';
  isSpeaking: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ message, emotion, isSpeaking }) => {
  const [displayedMessage, setDisplayedMessage] = useState(message);

  useEffect(() => {
    setDisplayedMessage(message);
    if (isSpeaking && message) {
       // Simple browser TTS integration
       const utterance = new SpeechSynthesisUtterance(message);
       utterance.lang = 'en-ZA'; // South African English accent if available
       utterance.rate = 1.1;
       utterance.pitch = 1.2; // Slightly higher pitch for child-friendly voice
       window.speechSynthesis.cancel();
       window.speechSynthesis.speak(utterance);
    }
  }, [message, isSpeaking]);

  return (
    <div className="fixed bottom-0 right-4 md:right-10 z-50 flex flex-col items-end pointer-events-none">
      {/* Speech Bubble - Designed not to block content */}
      {displayedMessage && (
        <div 
          className="mb-4 mr-12 p-4 rounded-2xl relative max-w-[250px] shadow-lg animate-bounce-slight pointer-events-auto"
          style={{ backgroundColor: COLORS.primaryYellow, color: '#000' }}
        >
          <p className="font-bold text-lg leading-snug font-comic">{displayedMessage}</p>
          {/* Bubble tail */}
          <div 
            className="absolute -bottom-2 right-6 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-r-[10px] border-r-transparent"
            style={{ borderTopColor: COLORS.primaryYellow }}
          />
        </div>
      )}

      {/* Lebo the Lion SVG */}
      <div className={`w-32 h-32 md:w-40 md:h-40 transition-transform duration-300 ${emotion === 'celebrating' ? 'animate-bounce' : ''}`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Mane */}
          <circle cx="100" cy="100" r="90" fill={COLORS.accentOrange} />
          <circle cx="100" cy="100" r="80" fill="#F6E05E" /> {/* Face */}
          
          {/* Ears */}
          <circle cx="40" cy="50" r="20" fill={COLORS.accentOrange} />
          <circle cx="160" cy="50" r="20" fill={COLORS.accentOrange} />
          <circle cx="40" cy="50" r="12" fill="#F6E05E" />
          <circle cx="160" cy="50" r="12" fill="#F6E05E" />

          {/* Eyes */}
          <circle cx="70" cy="90" r="10" fill="black" />
          <circle cx="130" cy="90" r="10" fill="black" />
          <circle cx="73" cy="87" r="3" fill="white" />
          <circle cx="133" cy="87" r="3" fill="white" />

          {/* Nose */}
          <path d="M90 110 L110 110 L100 125 Z" fill={COLORS.accentRed} />

          {/* Mouth */}
          <path d="M100 125 Q80 145 70 135" stroke="black" strokeWidth="4" fill="none" />
          <path d="M100 125 Q120 145 130 135" stroke="black" strokeWidth="4" fill="none" />

          {/* Cheeks */}
          <circle cx="60" cy="115" r="10" fill={COLORS.accentRed} opacity="0.3" />
          <circle cx="140" cy="115" r="10" fill={COLORS.accentRed} opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};
