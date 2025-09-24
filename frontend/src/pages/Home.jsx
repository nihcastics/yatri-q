import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeftRight, 
  Calendar as CalendarIcon, 
  Users, 
  Search, 
  Sparkles, 
  MapPin,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { SchedulesAdapter, ChatbotAdapter } from '../adapters';
import LoadingScreen from '../components/LoadingScreen';

const Home = ({ onSearchComplete }) => {
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '', 
    date: new Date(),
    class: 'All',
    quota: 'GENERAL',
    passengers: 1,
    options: {
      flexibleDates: false,
      includeConnecting: false,
      premiumTatkal: false
    }
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatSuggestions, setChatSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [showChatLoading, setShowChatLoading] = useState(false);
  
  // Station suggestions for autocomplete
  const stations = [
    { code: "NDLS", name: "New Delhi", city: "Delhi" },
    { code: "CSTM", name: "Mumbai CST", city: "Mumbai" },
    { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
    { code: "MAS", name: "Chennai Central", city: "Chennai" },
    { code: "SBC", name: "Bangalore City", city: "Bangalore" },
    { code: "HYB", name: "Hyderabad", city: "Hyderabad" },
    { code: "PUNE", name: "Pune Junction", city: "Pune" },
    { code: "ADI", name: "Ahmedabad", city: "Ahmedabad" }
  ];
  
  // Initialize chat suggestions
  useEffect(() => {
    const suggestions = ChatbotAdapter.getSuggestions();
    setChatSuggestions(suggestions);
    
    // Rotate suggestions every 4 seconds
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % suggestions.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearch = async () => {
    if (!searchForm.from || !searchForm.to) {
      return;
    }
    
    setIsSearching(true);
    setSearchProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    
    try {
      const results = await SchedulesAdapter.searchTrains(searchForm);
      setSearchProgress(100);
      
      setTimeout(() => {
        setIsSearching(false);
        onSearchComplete?.(results, searchForm);
      }, 300);
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
    
    clearInterval(progressInterval);
  };
  
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    setShowChatLoading(true);
    
    try {
      const response = await ChatbotAdapter.chat({ 
        prompt: chatInput,
        context: searchForm 
      });
      
      // Handle different response types
      if (response.type === 'search_suggestion') {
        setSearchForm(prev => ({ ...prev, ...response.suggestions }));
        setTimeout(() => handleSearch(), 500);
      } else if (response.type === 'pnr_status') {
        // Navigate to tracking or show PNR status
        console.log('PNR Status:', response);
      }
      
      setChatInput('');
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setShowChatLoading(false);
    }
  };
  
  const updatePassengers = (delta) => {
    setSearchForm(prev => ({
      ...prev,
      passengers: Math.max(1, Math.min(6, prev.passengers + delta))
    }));
  };
  
  const swapStations = () => {
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };
  
  if (isSearching) {
    return (
      <LoadingScreen
        message="Searching trains..."
        showProgress={true}
        progress={searchProgress}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-semibold text-slate-900 mb-4 animate-fade-in-up"
            style={{ 
              clipPath: 'inset(0 0 0 0)',
              animation: 'text-reveal 600ms cubic-bezier(0.22,0.61,0.36,1) forwards'
            }}
          >
            Book Ticket
          </h1>
          <p className="text-lg text-slate-600 animate-fade-in-up animation-delay-200">
            Plan, predict, and travel smarter.
          </p>
        </div>
        
        {/* Main Booking Form */}
        <div className="bg-white rounded-2xl p-8 shadow-card mb-8 animate-fade-in-up animation-delay-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From/To Row */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* From Station */}
              <div className="space-y-2">
                <Label htmlFor="from" className="text-sm font-medium text-slate-700">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="from"
                    placeholder="Origin station"
                    value={searchForm.from}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, from: e.target.value }))}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={swapStations}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
              
              {/* To Station */}
              <div className="space-y-2">
                <Label htmlFor="to" className="text-sm font-medium text-slate-700">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="to"
                    placeholder="Destination station"
                    value={searchForm.to}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, to: e.target.value }))}
                    className="pl-10 h-12 border-slate-200 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Journey Date</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal border-slate-200 hover:border-blue-500 transition-colors"
                  >
                    <CalendarIcon className="mr-3 w-4 h-4 text-slate-400" />
                    {format(searchForm.date, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white shadow-lg">
                  <Calendar
                    mode="single"
                    selected={searchForm.date}
                    onSelect={(date) => {
                      setSearchForm(prev => ({ ...prev, date }));
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date(new Date().toDateString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Class Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Class</Label>
              <div className="flex gap-2 flex-wrap">
                {['SL', '3A', '2A', '1A', 'All'].map((cls) => (
                  <Button
                    key={cls}
                    type="button"
                    variant={searchForm.class === cls ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchForm(prev => ({ ...prev, class: cls }))}
                    className={`transition-all duration-200 ${
                      searchForm.class === cls
                        ? 'bg-blue-600 text-white scale-105'
                        : 'hover:scale-105 border-slate-200 hover:border-blue-500'
                    }`}
                  >
                    {cls}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Quota Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-700">Quota</Label>
                <Info className="w-4 h-4 text-slate-400 cursor-help" title="Quota decides who gets priority. GENERAL fits most travelers." />
              </div>
              <Select 
                value={searchForm.quota} 
                onValueChange={(value) => setSearchForm(prev => ({ ...prev, quota: value }))}
              >
                <SelectTrigger className="h-12 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="LADIES">Ladies</SelectItem>
                  <SelectItem value="SENIOR_CITIZEN">Senior Citizen</SelectItem>
                  <SelectItem value="TATKAL">Tatkal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Passengers */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Passengers</Label>
              <div className="flex items-center border border-slate-200 rounded-lg h-12">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => updatePassengers(-1)}
                  disabled={searchForm.passengers <= 1}
                  className="p-2 hover:bg-slate-50"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="font-medium tabular-nums">{searchForm.passengers}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => updatePassengers(1)}
                  disabled={searchForm.passengers >= 6}
                  className="p-2 hover:bg-slate-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Options */}
            <div className="md:col-span-2 space-y-4">
              <Label className="text-sm font-medium text-slate-700">Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flexible"
                    checked={searchForm.options.flexibleDates}
                    onCheckedChange={(checked) => 
                      setSearchForm(prev => ({
                        ...prev,
                        options: { ...prev.options, flexibleDates: checked }
                      }))
                    }
                  />
                  <Label htmlFor="flexible" className="text-sm text-slate-600">
                    Flexible dates (±3 days)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="connecting"
                    checked={searchForm.options.includeConnecting}
                    onCheckedChange={(checked) => 
                      setSearchForm(prev => ({
                        ...prev,
                        options: { ...prev.options, includeConnecting: checked }
                      }))
                    }
                  />
                  <Label htmlFor="connecting" className="text-sm text-slate-600">
                    Include connecting trains
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tatkal"
                    checked={searchForm.options.premiumTatkal}
                    onCheckedChange={(checked) => 
                      setSearchForm(prev => ({
                        ...prev,
                        options: { ...prev.options, premiumTatkal: checked }
                      }))
                    }
                  />
                  <Label htmlFor="tatkal" className="text-sm text-slate-600">
                    Premium Tatkal
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={!searchForm.from || !searchForm.to}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all duration-300 disabled:opacity-50"
              style={{
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.25)';
                  e.target.style.transform = 'translateY(-1px) scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <Search className="w-5 h-5 mr-2" />
              Search Trains
            </Button>
          </div>
        </div>
        
        {/* AI Chat Search Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in-up animation-delay-600">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder={chatSuggestions[currentSuggestion] || "Ask me anything about train travel..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                  className="h-12 border-slate-200 focus:border-purple-500 transition-all duration-200 pr-12"
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                />
                {showChatLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Try: "Fastest train to Mumbai" or "Check PNR status"
              </p>
            </div>
            <Button
              onClick={handleChatSubmit}
              disabled={!chatInput.trim() || showChatLoading}
              variant="ghost"
              size="sm"
              className="px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors"
            >
              Ask
            </Button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes text-reveal {
          from {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          to {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 600ms cubic-bezier(0.22,0.61,0.36,1) forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .shadow-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 26px rgba(17,24,39,0.07);
        }
      `}</style>
    </div>
  );
};

export default Home;