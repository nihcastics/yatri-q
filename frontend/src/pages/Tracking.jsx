import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { 
  Train, 
  MapPin, 
  Clock, 
  Utensils, 
  Wifi, 
  Coffee, 
  Star,
  Navigation,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { TrackingAdapter } from '../adapters';
import { mockTrackingData } from '../adapters/mock';

const Tracking = () => {
  const [trainNo, setTrainNo] = useState('');
  const [pnr, setPnr] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showStationSheet, setShowStationSheet] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const startTracking = async () => {
    if (!trainNo.trim()) return;
    
    setLoading(true);
    setIsSimulating(false);
    
    try {
      const data = await TrackingAdapter.track({
        trainNo: trainNo.trim(),
        date: new Date().toISOString().split('T')[0],
        pnr: pnr.trim() || null
      });
      
      setTrackingData(data);
      setIsSimulating(true);
      startSimulation(data);
    } catch (error) {
      console.error('Tracking error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const startSimulation = (initialData) => {
    let currentData = { ...initialData };
    let simulationIndex = currentData.currentIndex;
    
    const simulateMovement = () => {
      if (simulationIndex < currentData.path.length - 1) {
        simulationIndex++;
        
        // Update visited status
        currentData.path.forEach((station, index) => {
          station.visited = index < simulationIndex;
        });
        
        currentData.currentIndex = simulationIndex;
        setTrackingData({ ...currentData });
        
        // Continue simulation after delay
        setTimeout(simulateMovement, 8000 + Math.random() * 4000);
      }
    };
    
    // Start simulation after 3 seconds
    setTimeout(simulateMovement, 3000);
  };
  
  const handleStationClick = (station, index) => {
    setSelectedStation({ ...station, index });
    setShowStationSheet(true);
  };
  
  const getStationAmenities = () => [
    { icon: Utensils, label: 'Food Court', available: Math.random() > 0.3 },
    { icon: Wifi, label: 'Free WiFi', available: Math.random() > 0.4 },
    { icon: Coffee, label: 'Cafeteria', available: Math.random() > 0.5 },
    { icon: Clock, label: '24/7 Service', available: Math.random() > 0.6 }
  ];
  
  const getNearbyPlaces = () => [
    { name: 'Hotel Paradise', type: 'Hotel', distance: '0.5 km', rating: 4.2 },
    { name: 'City Mall', type: 'Shopping', distance: '1.2 km', rating: 4.0 },
    { name: 'Local Restaurant', type: 'Restaurant', distance: '0.3 km', rating: 4.5 }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <Train className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Connecting to live tracking...
            </h3>
            <p className="text-slate-600">
              Fetching real-time location data
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {!trackingData ? (
          <div className="max-w-md mx-auto">
            {/* Entry Form */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-slate-900 mb-4">Live Train Tracking</h1>
              <p className="text-slate-600">Track your train's real-time location and status</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-card">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="trainNo" className="text-sm font-medium text-slate-700">
                    Train Number *
                  </Label>
                  <Input
                    id="trainNo"
                    placeholder="e.g., 12951"
                    value={trainNo}
                    onChange={(e) => setTrainNo(e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pnr" className="text-sm font-medium text-slate-700">
                    PNR Number (Optional)
                  </Label>
                  <Input
                    id="pnr"
                    placeholder="e.g., 4567891234"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}
                    className="mt-2 h-12"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    PNR helps provide personalized updates
                  </p>
                </div>
                
                <Button 
                  onClick={startTracking}
                  disabled={!trainNo.trim()}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Start Tracking
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tracking Header */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    Train {trackingData.trainNo}
                  </h1>
                  <p className="text-slate-600">
                    {trackingData.path[0]?.stationName} → {trackingData.path[trackingData.path.length - 1]?.stationName}
                  </p>
                </div>
                
                <div className="text-right">
                  <Badge 
                    className={`text-sm ${
                      trackingData.status === 'Running' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                    }`}
                  >
                    {trackingData.status}
                  </Badge>
                  {trackingData.delayMin > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      +{trackingData.delayMin}m delay
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setTrackingData(null);
                  setTrainNo('');
                  setPnr('');
                }}
              >
                Track Different Train
              </Button>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-slate-100 to-slate-200 relative">
                {/* Simulated Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto animate-bounce" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Live Map View</h3>
                      <p className="text-slate-600">Interactive route tracking</p>
                    </div>
                  </div>
                </div>
                
                {/* Route Line Simulation */}
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset={`${(trackingData.currentIndex / (trackingData.path.length - 1)) * 100}%`} stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset={`${(trackingData.currentIndex / (trackingData.path.length - 1)) * 100}%`} stopColor="#e5e7eb" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 50 150 Q 200 100 350 150 Q 500 200 650 150"
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Current Train Position */}
                <div 
                  className="absolute w-4 h-4 bg-blue-600 rounded-full animate-pulse"
                  style={{
                    left: `${20 + (trackingData.currentIndex / (trackingData.path.length - 1)) * 60}%`,
                    top: '45%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Train className="w-3 h-3 text-white absolute inset-0 m-auto" />
                </div>
              </div>
            </div>
            
            {/* Timeline Rail */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Journey Progress</h2>
              <div className="space-y-4">
                {trackingData.path.map((station, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                      index === trackingData.currentIndex ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                    onClick={() => handleStationClick(station, index)}
                  >
                    {/* Status Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      station.visited 
                        ? 'bg-green-100 text-green-600' 
                        : index === trackingData.currentIndex
                        ? 'bg-blue-100 text-blue-600 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {station.visited ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : index === trackingData.currentIndex ? (
                        <Train className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    
                    {/* Station Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-900">
                          {station.stationName}
                        </h3>
                        <div className="text-right">
                          <p className={`text-sm font-medium tabular-nums ${
                            station.visited ? 'text-green-600' : 'text-slate-900'
                          }`}>
                            {station.eta}
                          </p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">
                            {station.stationCode}
                          </p>
                        </div>
                      </div>
                      
                      {index === trackingData.currentIndex && (
                        <p className="text-sm text-blue-600 mt-1 animate-fade-in">
                          Currently here • Next: {trackingData.path[index + 1]?.stationName || 'Destination'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Station Report Sheet */}
      <Sheet open={showStationSheet} onOpenChange={setShowStationSheet}>
        <SheetContent side="bottom" className="h-[60vh]">
          {selectedStation && (
            <div className="py-6">
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-6" />
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {selectedStation.stationName}
                </h2>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{selectedStation.stationCode}</Badge>
                  <p className="text-sm text-slate-600">
                    ETA: {selectedStation.eta}
                  </p>
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-900 mb-3">Station Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {getStationAmenities().map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div 
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          amenity.available 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${
                          amenity.available ? 'text-green-600' : 'text-slate-400'
                        }`} />
                        <span className={`text-sm ${
                          amenity.available ? 'text-green-900' : 'text-slate-500'
                        }`}>
                          {amenity.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Nearby Places */}
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Nearby Places</h3>
                <div className="space-y-3">
                  {getNearbyPlaces().map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">{place.name}</h4>
                        <p className="text-sm text-slate-600">{place.type} • {place.distance}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{place.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 400ms ease-out;
        }
        
        .shadow-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 26px rgba(17,24,39,0.07);
        }
      `}</style>
    </div>
  );
};

export default Tracking;