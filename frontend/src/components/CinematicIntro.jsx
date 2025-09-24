import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';

const CinematicIntro = ({ onComplete, onSkip }) => {
  const [stage, setStage] = useState('loading'); // loading, monogram, morph, reveal, ready
  const [showSkip, setShowSkip] = useState(false);
  
  useEffect(() => {
    // Show skip button after 300ms
    const skipTimer = setTimeout(() => setShowSkip(true), 300);
    
    // Stage progression with cinematic timing
    const stages = [
      { stage: 'monogram', delay: 800 },
      { stage: 'morph', delay: 1600 },
      { stage: 'reveal', delay: 2200 },
      { stage: 'ready', delay: 2800 }
    ];
    
    const timers = stages.map(({ stage, delay }) =>
      setTimeout(() => setStage(stage), delay)
    );
    
    return () => {
      clearTimeout(skipTimer);
      timers.forEach(clearTimeout);
    };
  }, []);
  
  const handleEnter = () => {
    localStorage.setItem('yatri-intro-seen', 'true');
    onComplete();
  };
  
  const handleSkip = () => {
    localStorage.setItem('yatri-intro-seen', 'true');
    onSkip();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-white via-slate-50/60 to-emerald-50/40 flex items-center justify-center overflow-hidden">
      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className={`fixed top-6 right-6 text-slate-600 hover:text-slate-900 transition-all duration-200 ${
            showSkip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          Skip intro
        </button>
      )}
      
      {/* Main Content */}
      <div className="flex flex-col items-center space-y-8">
        {/* Monogram/Logo Animation */}
        <div className="relative">
          {/* Monogram Stage */}
          <div 
            className={`transition-all duration-700 ease-out ${
              stage === 'loading' 
                ? 'scale-98 opacity-0' 
                : stage === 'monogram'
                ? 'scale-100 opacity-100'
                : 'scale-110 opacity-0'
            }`}
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)',
              transitionDelay: stage === 'monogram' ? '0ms' : '200ms'
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/10">
              <span className="text-white font-bold text-2xl tracking-tight">YQ</span>
            </div>
          </div>
          
          {/* Morphing Caret */}
          <div 
            className={`absolute inset-0 transition-all duration-600 ${
              stage === 'morph' 
                ? 'scale-100 opacity-100' 
                : 'scale-95 opacity-0'
            }`}
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)',
              transitionDelay: stage === 'morph' ? '0ms' : '100ms'
            }}
          >
            <div className="w-80 h-12 bg-white border border-slate-200 rounded-full flex items-center px-4 shadow-lg shadow-slate-900/8">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <div className="w-0.5 h-5 bg-blue-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Text Reveal */}
        <div className="text-center space-y-3">
          <h1 
            className={`text-4xl font-semibold text-slate-900 transition-all duration-500 ${
              stage === 'reveal' || stage === 'ready'
                ? 'opacity-100 translate-y-0 tracking-normal'
                : 'opacity-0 translate-y-4 tracking-tight'
            }`}
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)',
              transitionDelay: stage === 'reveal' ? '0ms' : '120ms',
              clipPath: stage === 'reveal' || stage === 'ready' ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'
            }}
          >
            Plan, predict, and travel smarter.
          </h1>
          
          <p 
            className={`text-slate-600 text-lg transition-all duration-400 ${
              stage === 'ready'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)',
              transitionDelay: '120ms'
            }}
          >
            Intelligent train booking with live predictions
          </p>
        </div>
        
        {/* Enter Button */}
        <Button
          onClick={handleEnter}
          className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-300 ${
            stage === 'ready'
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95'
          }`}
          style={{ 
            transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)',
            transitionDelay: '200ms',
            boxShadow: stage === 'ready' ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.25)';
            e.target.style.transform = 'translateY(-1px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)';
            e.target.style.transform = 'translateY(0) scale(1)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(0) scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(-1px) scale(1.02)';
          }}
        >
          Enter YATRI-Q
        </Button>
      </div>
      
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-blue-100/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-slate-100/40 to-emerald-50/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </div>
    </div>
  );
};

export default CinematicIntro;