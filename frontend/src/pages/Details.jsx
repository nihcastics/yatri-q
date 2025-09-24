import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  Info, 
  Eye, 
  Star,
  Shield,
  Wifi,
  Coffee,
  ArrowLeft
} from 'lucide-react';
import { SeatAdapter, TatkalAdapter, SentimentAdapter } from '../adapters';

const Details = ({ selectedTrain, onBack }) => {
  const [trainDetails, setTrainDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSnippets, setShowSnippets] = useState(false);
  const [tatkalCalendar, setTatkalCalendar] = useState([]);
  
  useEffect(() => {
    if (selectedTrain) {
      loadTrainDetails();
      generateTatkalCalendar();
    }
  }, [selectedTrain]);
  
  const loadTrainDetails = async () => {
    if (!selectedTrain) return;
    
    setLoading(true);
    try {
      const [seatPred, tatkalPred, sentiment] = await Promise.all([
        SeatAdapter.predictSeat({ 
          trainNo: selectedTrain.trainNo, 
          date: new Date(), 
          class: '3A',
          quota: 'GENERAL' 
        }),
        TatkalAdapter.predictTatkal({ 
          trainNo: selectedTrain.trainNo, 
          date: new Date(), 
          class: '3A' 
        }),
        SentimentAdapter.getSentiment({ 
          trainNo: selectedTrain.trainNo, 
          windowDays: 7 
        })
      ]);
      
      setTrainDetails({ seatPred, tatkalPred, sentiment });
    } catch (error) {
      console.error('Error loading train details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateTatkalCalendar = () => {
    const calendar = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      calendar.push({
        date,
        bestMinute: Math.floor(Math.random() * 3), // 0-2 minutes after 10:00
        probability: 70 + Math.random() * 25 // 70-95%
      });
    }
    setTatkalCalendar(calendar);
  };
  
  const getPredictorRingColor = (probability) => {
    if (probability >= 70) return 'stroke-green-500';
    if (probability >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };
  
  const getSentimentEmoji = (tag) => {
    switch (tag) {
      case 'positive': return '😊';
      case 'mixed': return '😐';
      case 'negative': return '⚠️';
      default: return '😐';
    }
  };
  
  const formatTime = (timeString) => timeString;
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  if (!selectedTrain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">No train selected</h3>
          <p className="text-slate-600">Please select a train from the results page.</p>
          <Button onClick={onBack}>Back to Results</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Strip */}
        <div className="bg-white rounded-xl p-6 shadow-card mb-6 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {selectedTrain.type}
              </Badge>
              <Badge 
                variant={selectedTrain.status === 'On time' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {selectedTrain.status || 'On time'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                {selectedTrain.trainNo} {selectedTrain.trainName}
              </h1>
              <div className="flex items-center gap-4 text-lg font-semibold text-slate-900 tabular-nums">
                <div className="flex items-center gap-2">
                  <span>{formatTime(selectedTrain.depTime)}</span>
                  <span className="text-sm text-slate-500 font-normal">
                    {selectedTrain.from?.name || selectedTrain.from?.code}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 font-normal">
                  <div className="w-8 h-px bg-slate-300" />
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(selectedTrain.durationMin)}</span>
                  <div className="w-8 h-px bg-slate-300" />
                </div>
                
                <div className="flex items-center gap-2">
                  <span>{formatTime(selectedTrain.arrTime)}</span>
                  <span className="text-sm text-slate-500 font-normal">
                    {selectedTrain.to?.name || selectedTrain.to?.code}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            <span className="ml-3 text-lg text-slate-600">Loading insights...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Booking Options Row */}
            <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Booking Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.25)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  IRCTC Official
                </Button>
                <Button variant="outline" className="hover:border-blue-500">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ConfirmTkt
                </Button>
                <Button variant="outline" className="hover:border-blue-500">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  RailYatri
                </Button>
                <Button variant="outline" className="hover:border-blue-500">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Trainman
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Links open booking providers. We don't handle bookings directly.
              </p>
            </div>
            
            {/* Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seat/Tatkal Intelligence */}
              <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-300">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Seat Intelligence
                </h2>
                
                {/* Bigger Predictor Ring */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="#e5e7eb"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          strokeDashoffset={`${2 * Math.PI * 35 * (1 - (trainDetails?.seatPred?.probability || 0) / 100)}`}
                          className={`transition-all duration-1000 ${getPredictorRingColor(trainDetails?.seatPred?.probability || 0)}`}
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-lg font-bold text-slate-900 tabular-nums">
                          {trainDetails?.seatPred?.probability || 0}%
                        </span>
                        <p className="text-xs text-slate-600 capitalize">
                          {trainDetails?.seatPred?.band || 'uncertain'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 mb-2">Confirmation Likelihood</h3>
                    <div className="space-y-2">
                      {trainDetails?.seatPred?.insights?.slice(0, 2).map((insight, index) => (
                        <p key={index} className="text-sm text-slate-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Tatkal Calendar Strip */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    Tatkal Calendar (Next 7 Days)
                  </h3>
                  <div className="grid grid-cols-7 gap-1">
                    {tatkalCalendar.map((day, index) => (
                      <div 
                        key={index}
                        className="text-center p-2 rounded-lg border transition-all duration-200 hover:border-orange-300"
                      >
                        <div className="text-xs text-slate-600 mb-1">
                          {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs font-medium text-slate-900">
                          {day.date.getDate()}
                        </div>
                        <div className={`text-xs mt-1 px-1 py-0.5 rounded ${
                          day.probability > 85 ? 'bg-green-100 text-green-700' : 
                          day.probability > 75 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          10:0{day.bestMinute}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sentiment Capsule */}
              <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-400">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-slate-600" />
                  Recent Feedback
                </h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">
                    {getSentimentEmoji(trainDetails?.sentiment?.tag)}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">
                      {trainDetails?.sentiment?.tag || 'Neutral'} feedback last week
                    </p>
                    <p className="text-sm text-slate-600">
                      {trainDetails?.sentiment?.reason}
                    </p>
                  </div>
                </div>
                
                <Sheet open={showSnippets} onOpenChange={setShowSnippets}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Recent Reviews
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-96">
                    <div className="py-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Reviews</h3>
                      <div className="space-y-4">
                        {trainDetails?.sentiment?.snippets?.map((snippet, index) => (
                          <div 
                            key={index}
                            className="bg-slate-50 rounded-lg p-4 border animate-slide-in-up"
                            style={{ animationDelay: `${index * 60}ms` }}
                          >
                            <p className="text-sm text-slate-700 mb-2">"{snippet}"</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">Anonymous traveler</span>
                              <div className="flex items-center gap-1">
                                {[...Array(Math.floor(Math.random() * 2) + 3)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Fare & Classes */}
            <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-500">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Fare & Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {selectedTrain.classes?.map((cls) => (
                  <div 
                    key={cls}
                    className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{cls}</span>
                      <span className="text-lg font-bold text-slate-900 tabular-nums">
                        ₹{selectedTrain.fares?.[cls] || Math.floor(Math.random() * 2000) + 500}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {cls === '1A' ? 'AC First Class - Premium comfort' :
                       cls === '2A' ? 'AC 2-Tier - Good comfort' :
                       cls === '3A' ? 'AC 3-Tier - Standard comfort' :
                       'Sleeper - Basic comfort'}
                    </p>
                  </div>
                )) || (
                  ['1A', '2A', '3A', 'SL'].map((cls) => (
                    <div 
                      key={cls}
                      className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">{cls}</span>
                        <span className="text-lg font-bold text-slate-900 tabular-nums">
                          ₹{Math.floor(Math.random() * 2000) + 500}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        {cls === '1A' ? 'AC First Class - Premium comfort' :
                         cls === '2A' ? 'AC 2-Tier - Good comfort' :
                         cls === '3A' ? 'AC 3-Tier - Standard comfort' :
                         'Sleeper - Basic comfort'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Safety/Comfort Notes */}
            <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-600">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Safety & Comfort
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">WiFi Available</h3>
                    <p className="text-sm text-slate-600">Free WiFi in AC coaches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Pantry Service</h3>
                    <p className="text-sm text-slate-600">Hot meals and beverages available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Security</h3>
                    <p className="text-sm text-slate-600">RPF security throughout journey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 600ms cubic-bezier(0.22,0.61,0.36,1) forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
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

export default Details;