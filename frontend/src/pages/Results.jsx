import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Calendar,
  Edit
} from 'lucide-react';
import { SeatAdapter, TatkalAdapter, SentimentAdapter } from '../adapters';

const Results = ({ searchResults = [], searchParams, onTrainSelect, onEditSearch }) => {
  const [expandedTrain, setExpandedTrain] = useState(null);
  const [trainDetails, setTrainDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const formatTime = (timeString) => {
    return timeString;
  };
  
  const getBandColor = (band) => {
    switch (band) {
      case 'likely': return 'text-green-600 bg-green-50 border-green-200';
      case 'uncertain': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'unlikely': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };
  
  const getSentimentEmoji = (tag) => {
    switch (tag) {
      case 'positive': return '😊';
      case 'mixed': return '😐';
      case 'negative': return '⚠️';
      default: return '😐';
    }
  };
  
  const getPredictorRingColor = (probability) => {
    if (probability >= 70) return 'stroke-green-500';
    if (probability >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };
  
  const loadTrainDetails = async (trainNo) => {
    if (trainDetails[trainNo] || loadingDetails[trainNo]) return;
    
    setLoadingDetails(prev => ({ ...prev, [trainNo]: true }));
    
    try {
      const [seatPred, tatkalPred, sentiment] = await Promise.all([
        SeatAdapter.predictSeat({ 
          trainNo, 
          date: searchParams?.date, 
          class: searchParams?.class,
          quota: searchParams?.quota 
        }),
        TatkalAdapter.predictTatkal({ 
          trainNo, 
          date: searchParams?.date, 
          class: searchParams?.class 
        }),
        SentimentAdapter.getSentiment({ trainNo, windowDays: 7 })
      ]);
      
      setTrainDetails(prev => ({
        ...prev,
        [trainNo]: { seatPred, tatkalPred, sentiment }
      }));
    } catch (error) {
      console.error('Error loading train details:', error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [trainNo]: false }));
    }
  };
  
  const toggleExpand = (trainNo) => {
    if (expandedTrain === trainNo) {
      setExpandedTrain(null);
    } else {
      setExpandedTrain(trainNo);
      loadTrainDetails(trainNo);
    }
  };
  
  if (!searchResults?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No trains found</h3>
          <p className="text-slate-600 max-w-md">
            No direct trains for this day. Try nearby dates or different classes.
          </p>
          <Button onClick={onEditSearch} className="mt-4">
            Try different dates
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Sticky Header Strip */}
        <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-slate-900">
                {searchParams?.from} → {searchParams?.to}
              </span>
              <Badge variant="secondary" className="text-xs">
                {searchParams?.date ? new Date(searchParams.date).toLocaleDateString() : 'Today'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {searchParams?.passengers || 1} Passenger{(searchParams?.passengers || 1) > 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {searchParams?.class || 'All Classes'}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditSearch}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
        
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Available Trains ({searchResults.length})
          </h2>
          <p className="text-slate-600">
            Showing results with live availability predictions
          </p>
        </div>
        
        {/* Train Cards */}
        <div className="space-y-4">
          {searchResults.map((train) => {
            const isExpanded = expandedTrain === train.trainNo;
            const details = trainDetails[train.trainNo];
            const loading = loadingDetails[train.trainNo];
            
            return (
              <div
                key={train.trainNo}
                className="bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Train Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {train.trainNo} {train.trainName}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {train.type}
                        </Badge>
                        {train.status && (
                          <Badge 
                            variant={train.status === 'On time' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {train.status}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Time Info */}
                      <div className="flex items-center gap-6 text-lg font-semibold text-slate-900 tabular-nums">
                        <div className="flex items-center gap-2">
                          <span>{formatTime(train.depTime)}</span>
                          <span className="text-sm text-slate-500 font-normal">
                            {train.from.code}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-normal">
                          <div className="w-8 h-px bg-slate-300" />
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(train.durationMin)}</span>
                          <div className="w-8 h-px bg-slate-300" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span>{formatTime(train.arrTime)}</span>
                          <span className="text-sm text-slate-500 font-normal">
                            {train.to.code}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Prediction Ring & Actions */}
                    <div className="flex items-center gap-4">
                      {/* Seat Predictor Ring */}
                      <div className="relative">
                        <div className="w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#e5e7eb"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - (train.seatPrediction?.probability || 0) / 100)}`}
                              className={`transition-all duration-700 ${getPredictorRingColor(train.seatPrediction?.probability || 0)}`}
                            />
                          </svg>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {train.seatPrediction?.probability || 0}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Sentiment & Tatkal */}
                      <div className="text-center space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getSentimentEmoji(train.sentiment?.tag)}
                          </span>
                          <span className="text-xs text-slate-600 capitalize">
                            {train.sentiment?.tag || 'Neutral'}
                          </span>
                        </div>
                        
                        {train.tatkalPrediction?.note && (
                          <Badge 
                            variant="outline" 
                            className="text-xs text-orange-600 bg-orange-50 border-orange-200 animate-pulse"
                          >
                            Tatkal {train.tatkalPrediction.bestWindows?.[0]?.start || '10:00'}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Details Button */}
                      <Button
                        variant="ghost"
                        onClick={() => toggleExpand(train.trainNo)}
                        className="px-3 py-2 text-blue-600 hover:bg-blue-50"
                      >
                        Details
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => onTrainSelect?.(train)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {isExpanded && (
                  <div 
                    className="border-t border-slate-200 bg-slate-50/50 px-6 py-4 transition-all duration-300"
                    style={{
                      maxHeight: isExpanded ? '400px' : '0',
                      opacity: isExpanded ? 1 : 0
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                        <span className="ml-3 text-sm text-slate-600">Loading insights...</span>
                      </div>
                    ) : details ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Seat Prediction Insights */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            Availability Insights
                          </h4>
                          <div className="space-y-2">
                            {details.seatPred?.insights?.map((insight, index) => (
                              <p key={index} className="text-sm text-slate-600 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                {insight}
                              </p>
                            ))}
                          </div>
                        </div>
                        
                        {/* Tatkal Information */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" />
                            Tatkal Window
                          </h4>
                          <div className="space-y-2">
                            {details.tatkalPred?.bestWindows?.map((window, index) => (
                              <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                <p className="text-sm font-medium text-orange-800">
                                  {window.start} - {window.end}
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                  {details.tatkalPred.note}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Sentiment & Reviews */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-slate-900 flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-600" />
                            Recent Feedback
                          </h4>
                          <div className="space-y-2">
                            <p className="text-sm text-slate-600">
                              {details.sentiment?.reason}
                            </p>
                            {details.sentiment?.snippets?.slice(0, 2).map((snippet, index) => (
                              <p key={index} className="text-xs text-slate-500 bg-white rounded px-2 py-1 border">
                                "{snippet}"
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-slate-500">
                        Failed to load insights. Please try again.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .shadow-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 26px rgba(17,24,39,0.07);
        }
      `}</style>
    </div>
  );
};

export default Results;