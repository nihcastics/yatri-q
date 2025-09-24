import React, { useState, useEffect } from "react";
import "./App.css";
import CinematicIntro from "./components/CinematicIntro";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Details from "./pages/Details";
import Planner from "./pages/Planner";
import Tracking from "./pages/Tracking";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [showIntro, setShowIntro] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    // Check if intro has been seen
    const introSeen = localStorage.getItem('yatri-intro-seen');
    if (!introSeen) {
      setShowIntro(true);
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleIntroSkip = () => {
    setShowIntro(false);
  };

  const handleSearchComplete = (results, params) => {
    setSearchResults(results);
    setSearchParams(params);
    setActiveTab('results');
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setActiveTab('details');
  };

  const handleEditSearch = () => {
    setActiveTab('home');
  };

  const handleBackToResults = () => {
    setActiveTab('results');
  };

  // Show intro if it hasn't been seen
  if (showIntro) {
    return (
      <CinematicIntro 
        onComplete={handleIntroComplete}
        onSkip={handleIntroSkip}
      />
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onSearchComplete={handleSearchComplete} />;
      case 'results':
        return (
          <Results 
            searchResults={searchResults}
            searchParams={searchParams}
            onTrainSelect={handleTrainSelect}
            onEditSearch={handleEditSearch}
          />
        );
      case 'details':
        return (
          <Details 
            selectedTrain={selectedTrain}
            onBack={handleBackToResults}
          />
        );
      case 'planner':
        return <Planner />;
      case 'tracking':
        return <Tracking />;
      case 'bookings':
        return <Bookings />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onSearchComplete={handleSearchComplete} />;
    }
  };

  return (
    <div className="App min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />
      
      {/* Main Content */}
      <main className={`${isMobile ? 'pb-20' : ''}`}>
        {renderActiveTab()}
      </main>
      
      {/* Toast Notifications */}
      <Toaster />
      
      {/* Page Transition Styles */}
      <style jsx>{`
        .App {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif;
        }
        
        /* Page transitions */
        main {
          animation: page-enter 400ms cubic-bezier(0.22,0.61,0.36,1);
        }
        
        @keyframes page-enter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Focus ring styles */
        *:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
        
        /* Selection styles */
        ::selection {
          background: rgba(59, 130, 246, 0.15);
          color: inherit;
        }
      `}</style>
    </div>
  );
}

export default App;