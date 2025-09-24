import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  ExternalLink,
  Sparkles,
  Trash2
} from 'lucide-react';
import { BookingsAdapter, TrackingAdapter } from '../adapters';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [trackingData, setTrackingData] = useState({});
  
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async () => {
    try {
      const data = await BookingsAdapter.getRecent();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    if (status === 'Confirmed') {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (status.startsWith('WL/')) {
      return 'bg-orange-100 text-orange-700 border-orange-200';
    } else if (status === 'RAC') {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    } else if (status === 'Cancelled') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };
  
  const trackBooking = async (booking) => {
    if (trackingData[booking.pnr]) {
      // Already tracking, toggle off
      setTrackingData(prev => {
        const newData = { ...prev };
        delete newData[booking.pnr];
        return newData;
      });
      return;
    }
    
    try {
      const tracking = await TrackingAdapter.track({
        trainNo: booking.trainNo,
        date: booking.date,
        pnr: booking.pnr
      });
      
      setTrackingData(prev => ({
        ...prev,
        [booking.pnr]: tracking
      }));
    } catch (error) {
      console.error('Error tracking booking:', error);
    }
  };
  
  const clearDemoData = () => {
    setBookings([]);
    setTrackingData({});
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-slate-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Recent Bookings</h1>
            <p className="text-slate-600">Your PNRs and travel history</p>
          </div>
          
          {bookings.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearDemoData}
              className="text-slate-600 hover:text-slate-900"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Demo Data
            </Button>
          )}
        </div>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-600 mb-6">
              Your recent train bookings will appear here
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Book Your First Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const isExpanded = expandedBooking === booking.pnr;
              const tracking = trackingData[booking.pnr];
              
              return (
                <div 
                  key={booking.pnr}
                  className="bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden animate-slide-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-blue-600" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {booking.trainName}
                          </h3>
                          <p className="text-sm text-slate-600">
                            PNR: {booking.pnr}
                          </p>
                        </div>
                      </div>
                      
                      <Badge className={`border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {booking.from} → {booking.to}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {formatDate(booking.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {booking.class} • {booking.coach || '-'} • {booking.seat || '-'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Train {booking.trainNo}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => trackBooking(booking)}
                          className={tracking ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}
                        >
                          {tracking ? 'Stop Tracking' : 'Track Now'}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Tracking View */}
                  {tracking && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-6 animate-slide-down">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600 animate-pulse" />
                        <h4 className="font-medium text-slate-900">Live Tracking</h4>
                        {booking.status.startsWith('WL/') && booking.status !== 'WL/0' && (
                          <div className="ml-auto">
                            <Sparkles className="w-4 h-4 text-yellow-500 animate-bounce" />
                          </div>
                        )}
                      </div>
                      
                      {/* Mini Timeline */}
                      <div className="space-y-3">
                        {tracking.path?.slice(0, 4).map((station, stationIndex) => (
                          <div 
                            key={stationIndex} 
                            className={`flex items-center gap-3 p-2 rounded-lg ${
                              stationIndex === tracking.currentIndex 
                                ? 'bg-blue-50 border border-blue-200' 
                                : station.visited 
                                ? 'bg-green-50' 
                                : 'bg-white'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              station.visited 
                                ? 'bg-green-500' 
                                : stationIndex === tracking.currentIndex
                                ? 'bg-blue-500 animate-pulse'
                                : 'bg-slate-300'
                            }`} />
                            
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-900">
                                {station.stationName}
                              </span>
                              <span className="text-xs text-slate-500 tabular-nums">
                                {station.eta}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        {tracking.path?.length > 4 && (
                          <div className="text-center">
                            <span className="text-xs text-slate-500">
                              +{tracking.path.length - 4} more stations
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Status:</span>
                          <Badge className={`text-xs ${
                            tracking.status === 'Running' 
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                          }`}>
                            {tracking.status} {tracking.delayMin > 0 && `+${tracking.delayMin}m`}
                          </Badge>
                        </div>
                        
                        {booking.status.startsWith('WL/') && booking.status !== 'WL/0' && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-xs text-yellow-800">
                              🎉 Your waitlist moved up! Check for confirmation.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
        
        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 400px;
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 400ms cubic-bezier(0.22,0.61,0.36,1) forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 300ms cubic-bezier(0.22,0.61,0.36,1) forwards;
        }
        
        .shadow-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 26px rgba(17,24,39,0.07);
        }
      `}</style>
    </div>
  );
};

export default Bookings;