import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  Menu, 
  Home, 
  Search, 
  Info, 
  Route, 
  MapPin, 
  BookOpen, 
  User, 
  ArrowRight 
} from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, isMobile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const primaryTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'results', label: 'Results', icon: Search },
    { id: 'details', label: 'Details', icon: Info },
    { id: 'planner', label: 'Planner', icon: Route },
    { id: 'tracking', label: 'Tracking', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];
  
  const menuItems = [
    {
      id: 'planner',
      title: 'Round Trip Planner',
      subtitle: 'Best confirmation odds, round trip.',
      icon: Route
    },
    {
      id: 'tracking', 
      title: 'Live Train Tracking',
      subtitle: 'Map with stations & delays.',
      icon: MapPin
    },
    {
      id: 'bookings',
      title: 'Recent Bookings', 
      subtitle: 'Your last PNRs & drafts.',
      icon: BookOpen
    },
    {
      id: 'profile',
      title: 'Profile & Settings',
      subtitle: 'Auth, preferences, dark preview.',
      icon: User
    }
  ];
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    setIsMenuOpen(false);
  };
  
  // Desktop Navigation
  if (!isMobile) {
    return (
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">YQ</span>
              </div>
              <span className="font-semibold text-slate-900 text-lg">YATRI-Q</span>
            </div>
            
            {/* Primary Tabs */}
            <div className="flex items-center bg-slate-50 rounded-full p-1">
              {primaryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)'
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full transition-all duration-200"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)' }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            {/* Menu Sheet Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-slate-100 transition-colors duration-200"
                >
                  <Menu className="w-5 h-5 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200"
              >
                <div className="py-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Access</h3>
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleMenuItemClick(item.id)}
                          className="w-full p-4 text-left rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                          style={{ transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px) translateX(2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) translateX(0)';
                          }}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-slate-200 transition-colors duration-200">
                              <IconComponent className="w-5 h-5 text-slate-600 group-hover:rotate-6 transition-transform duration-200" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                                  {item.title}
                                </h4>
                                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                              </div>
                              <p className="text-sm text-slate-500 mt-1">{item.subtitle}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    );
  }
  
  // Mobile Navigation (Bottom Sheet + Overflow Menu)
  return (
    <>
      {/* Top Bar Mobile */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <div className="w-7 h-7 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xs">YQ</span>
            </div>
            <span className="font-semibold text-slate-900">YATRI-Q</span>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-5 h-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] bg-white/95 backdrop-blur-xl">
              <div className="py-6">
                <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-6" />
                <h3 className="text-lg font-semibold text-slate-900 mb-6 text-center">Navigate</h3>
                <div className="grid grid-cols-1 gap-2">
                  {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuItemClick(item.id)}
                        className="w-full p-4 text-left rounded-xl hover:bg-slate-50 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 text-slate-600 mr-4" />
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">{item.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{item.subtitle}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      
      {/* Bottom Tab Bar Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200">
        <div className="flex items-center justify-around py-2">
          {primaryTabs.slice(0, 4).map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-3 transition-colors duration-200 ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center py-2 px-3 text-slate-500"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;