import React, { useState, useEffect } from 'react';
import { Train, Sparkles } from 'lucide-react';

const LoadingScreen = ({ 
  message = "Loading...", 
  showProgress = false, 
  progress = 0,
  showSuccess = false,
  onComplete 
}) => {
  const [animationStage, setAnimationStage] = useState('loading');
  const [sparkles, setSparkles] = useState([]);
  
  useEffect(() => {
    if (showSuccess) {
      setAnimationStage('success');
      
      // Create sparkle particles
      const newSparkles = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        delay: Math.random() * 200,
        duration: 600 + Math.random() * 200
      }));
      setSparkles(newSparkles);
      
      // Auto complete after sparkle animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center">
      {/* Background Gradient Animation */}
      <div 
        className="absolute inset-0 opacity-60 transition-opacity duration-1400"
        style={{
          background: `linear-gradient(45deg, 
            rgba(248, 250, 252, 0) 0%, 
            rgba(236, 254, 255, 0.3) 50%, 
            rgba(248, 250, 252, 0) 100%)`,
          animation: 'gradient-drift 1.4s ease-in-out infinite alternate'
        }}
      />
      
      <div className="relative flex flex-col items-center space-y-6">
        {/* Main Loading Animation */}
        <div className="relative">
          {/* Circular Progress Ring */}
          <div className="relative w-16 h-16">
            <svg 
              className="w-16 h-16 -rotate-90 transition-transform duration-200" 
              viewBox="0 0 64 64"
            >
              {/* Background ring */}
              <circle
                cx="32"
                cy="32" 
                r="28"
                stroke="#e5e7eb"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#3b82f6"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - (showProgress ? progress / 100 : 0))}`}
                className="transition-all duration-300 ease-out"
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.1))'
                }}
              />
            </svg>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              {animationStage === 'success' ? (
                <Sparkles 
                  className="w-6 h-6 text-yellow-500 animate-pulse"
                  style={{ animationDuration: '600ms' }}
                />
              ) : (
                <Train 
                  className="w-6 h-6 text-blue-600 animate-pulse"
                  style={{ 
                    animationDuration: '1200ms',
                    transform: `translateX(${Math.sin(Date.now() / 800) * 2}px)`
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Success Sparkles */}
          {animationStage === 'success' && sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-0"
              style={{
                left: `calc(50% + ${sparkle.x}px)`,
                top: `calc(50% + ${sparkle.y}px)`,
                animation: `sparkle-burst ${sparkle.duration}ms ease-out ${sparkle.delay}ms forwards`
              }}
            />
          ))}
        </div>
        
        {/* Loading Message */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-slate-700 tracking-wide">
            {animationStage === 'success' ? 'Ready!' : message}
          </p>
          
          {/* Progress Percentage */}
          {showProgress && animationStage !== 'success' && (
            <p 
              className="text-xs text-slate-500 tabular-nums transition-all duration-200"
              style={{ 
                transform: `translateY(${progress > 0 ? '0' : '4px'})`,
                opacity: progress > 0 ? 1 : 0
              }}
            >
              {Math.round(progress)}%
            </p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient-drift {
          0% { transform: translateX(-10px) translateY(-5px); }
          100% { transform: translateX(10px) translateY(5px); }
        }
        
        @keyframes sparkle-burst {
          0% { 
            opacity: 0; 
            transform: scale(0) translate(0, 0); 
          }
          20% { 
            opacity: 1; 
            transform: scale(1) translate(0, 0); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.5) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); 
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;