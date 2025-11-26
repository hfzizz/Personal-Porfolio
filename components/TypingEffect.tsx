import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  as?: React.ElementType;
  onComplete?: () => void;
  cursor?: boolean;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ 
  text, 
  speed = 15, 
  delay = 0, 
  className = '',
  as: Component = 'span',
  onComplete,
  cursor = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    setDisplayedText(''); 
    setIsTyping(true);
    let i = 0;
    
    const startTimeout = setTimeout(() => {
      const timer = setInterval(() => {
        if (i < text.length) {
          // Fix: removed unused 'prev' parameter
          setDisplayedText(() => text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, speed);
      
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  return (
    <Component className={className}>
      {displayedText}
      {cursor && isTyping && <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse align-middle"></span>}
    </Component>
  );
};

export default TypingEffect;