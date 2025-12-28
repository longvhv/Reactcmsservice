import { ReactNode, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}

export function Tooltip({ content, children, position = 'right', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute ${positionClasses[position]} z-50 animate-slide-in-top`}
        >
          <div className="px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap">
            {content}
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'right' ? '-left-1 top-1/2 -translate-y-1/2' :
              position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
              position === 'top' ? 'left-1/2 -translate-x-1/2 -bottom-1' :
              'left-1/2 -translate-x-1/2 -top-1'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
}