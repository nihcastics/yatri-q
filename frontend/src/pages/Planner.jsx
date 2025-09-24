import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Clock, 
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { mockRoundTripBundles } from '../adapters/mock';

const Planner = () => {
  const [step, setStep] = useState(1);
  const [plannerData, setPlannerData] = useState({
    city: '',
    days: 3,
    budget: 2,
    class: '3A',
    priority: 'confirmation'
  });
  const [bundles, setBundles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa'
  ];
  
  const recentRoutes = [
    'Delhi - Mumbai', 'Bangalore - Chennai', 'Mumbai - Goa'
  ];
  
  const budgetOptions = [
    { value: 1, label: '₹', desc: 'Budget friendly' },
    { value: 2, label: '₹₹', desc: 'Comfortable' },
    { value: 3, label: '₹₹₹', desc: 'Premium' }
  ];
  
  const classOptions = ['SL', '3A', '2A', '1A'];
  const priorityOptions = [
    { value: 'cheapest', label: 'Cheapest' },
    { value: 'confirmation', label: 'Highest Confirmation' },
    { value: 'fastest', label: 'Fastest' }
  ];
  
  const dayOptions = [2, 3, 5, 7, 10, 14];
  
  const generateBundles = async () => {
    setIsGenerating(true);
    
    // Simulate planning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate bundles based on preferences
    const generatedBundles = mockRoundTripBundles.map((bundle, index) => ({
      ...bundle,
      id: index + 1,
      city: plannerData.city,
      days: plannerData.days,
      priority: plannerData.priority,
      totalFare: bundle.totalFare * plannerData.budget * 0.8,
      confirmationScore: bundle.confirmationScore + Math.random() * 10 - 5
    }));
    
    setBundles(generatedBundles);
    setIsGenerating(false);
    setShowResults(true);
  };
  
  const nextStep = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      generateBundles();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const resetPlanner = () => {
    setStep(1);
    setShowResults(false);
    setBundles([]);
    setPlannerData({
      city: '',
      days: 3,
      budget: 2,
      class: '3A',
      priority: 'confirmation'
    });
  };
  
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Your Round Trip Plans</h1>
            <p className="text-slate-600">
              {plannerData.days}-day trip to {plannerData.city} • {plannerData.priority} priority
            </p>
            <Button variant="outline" onClick={resetPlanner} className="mt-4">
              Plan Another Trip
            </Button>
          </div>
          
          {/* Bundle Results */}
          <div className="space-y-6">
            {bundles.map((bundle, index) => (
              <div 
                key={bundle.id}
                className="bg-white rounded-xl p-6 shadow-card border border-slate-200 transition-all duration-300 hover:shadow-lg animate-fan-in"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  transform: `rotate(${index * -1.5}deg)`,
                  transformOrigin: 'center bottom'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `rotate(0deg) translateY(-4px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `rotate(${index * -1.5}deg) translateY(0)`;
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Plan {index + 1}
                    </Badge>
                    <Badge 
                      className={`border ${
                        bundle.confirmationScore > 90 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : bundle.confirmationScore > 80
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {Math.round(bundle.confirmationScore)}% Confirmation
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      ₹{bundle.totalFare.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600">
                      Total for {plannerData.days} days
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Outbound */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-slate-900 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      Outbound Journey
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">
                          {bundle.outbound.trainNo}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {bundle.outbound.class}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        Departure: {bundle.outbound.depTime}
                      </div>
                      <div className="text-sm text-slate-600">
                        Duration: {Math.floor(bundle.totalDuration / 2 / 60)}h {Math.floor((bundle.totalDuration / 2) % 60)}m
                      </div>
                    </div>
                  </div>
                  
                  {/* Return */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-slate-900 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-green-600 rotate-180" />
                      Return Journey
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">
                          {bundle.return.trainNo}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {bundle.return.class}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        Departure: {bundle.return.depTime}
                      </div>
                      <div className="text-sm text-slate-600">
                        Duration: {Math.floor(bundle.totalDuration / 2 / 60)}h {Math.floor((bundle.totalDuration / 2) % 60)}m
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="w-4 h-4" />
                      {Math.floor(bundle.totalDuration / 60)}h total travel
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4" />
                      High confirmation rate
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Save Plan
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fan-in {
            0% {
              opacity: 0;
              transform: rotate(-6deg) translateY(20px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: rotate(var(--final-rotation, 0deg)) translateY(0) scale(1);
            }
          }
          
          .animate-fan-in {
            animation: fan-in 600ms cubic-bezier(0.22,0.61,0.36,1) forwards;
          }
          
          .shadow-card {
            box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 26px rgba(17,24,39,0.07);
          }
        `}</style>
      </div>
    );
  }
  
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Crafting your perfect round trip...
            </h3>
            <p className="text-slate-600">
              Analyzing routes, fares, and availability
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">Round Trip Planner</h1>
          <p className="text-slate-600">One-word magic for perfect round trips</p>
        </div>
        
        {/* Progress Rail */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>1</div>
              <div className="text-sm text-slate-600">Destination</div>
            </div>
            <div className="flex-1 mx-4 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <div className="text-sm text-slate-600">{step}/5</div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-xl p-8 shadow-card mb-8">
          {/* Step 1: City */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Where to?</h2>
                <p className="text-slate-600">Choose your destination city</p>
              </div>
              
              <div className="space-y-4">
                <Input
                  placeholder="Type a city name..."
                  value={plannerData.city}
                  onChange={(e) => setPlannerData(prev => ({ ...prev, city: e.target.value }))}
                  className="text-center text-lg h-14"
                />
                
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 text-center">Popular destinations</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {cities.map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        size="sm"
                        onClick={() => setPlannerData(prev => ({ ...prev, city }))}
                        className={`transition-all duration-200 ${
                          plannerData.city === city ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                        }`}
                      >
                        {city}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {recentRoutes.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600 text-center">Recent routes</p>
                    <div className="space-y-2">
                      {recentRoutes.map((route, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => setPlannerData(prev => ({ ...prev, city: route.split(' - ')[1] }))}
                          className="w-full justify-start text-slate-600 hover:text-slate-900 animate-slide-in-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {route}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Step 2: Days */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">How many days?</h2>
                <p className="text-slate-600">Duration of your stay</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {dayOptions.map((days) => (
                  <Button
                    key={days}
                    variant="outline"
                    onClick={() => setPlannerData(prev => ({ ...prev, days }))}
                    className={`h-16 text-lg font-medium transition-all duration-200 ${
                      plannerData.days === days 
                        ? 'bg-blue-50 border-blue-300 text-blue-700 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {days} day{days > 1 ? 's' : ''}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 3: Budget */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <IndianRupee className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Budget preference?</h2>
                <p className="text-slate-600">Choose your comfort level</p>
              </div>
              
              <div className="space-y-3">
                {budgetOptions.map((budget) => (
                  <Button
                    key={budget.value}
                    variant="outline"
                    onClick={() => setPlannerData(prev => ({ ...prev, budget: budget.value }))}
                    className={`w-full h-16 justify-between p-6 transition-all duration-200 ${
                      plannerData.budget === budget.value 
                        ? 'bg-blue-50 border-blue-300 text-blue-700 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-lg font-medium">{budget.label}</div>
                      <div className="text-sm text-slate-600">{budget.desc}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 4: Class */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Travel class?</h2>
                <p className="text-slate-600">Preferred train class</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {classOptions.map((cls) => (
                  <Button
                    key={cls}
                    variant="outline"
                    onClick={() => setPlannerData(prev => ({ ...prev, class: cls }))}
                    className={`h-16 text-lg font-medium transition-all duration-200 ${
                      plannerData.class === cls 
                        ? 'bg-blue-50 border-blue-300 text-blue-700 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {cls}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 5: Priority */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">What's most important?</h2>
                <p className="text-slate-600">Your booking priority</p>
              </div>
              
              <div className="space-y-3">
                {priorityOptions.map((priority) => (
                  <Button
                    key={priority.value}
                    variant="outline"
                    onClick={() => setPlannerData(prev => ({ ...prev, priority: priority.value }))}
                    className={`w-full h-16 text-lg font-medium transition-all duration-200 ${
                      plannerData.priority === priority.value 
                        ? 'bg-blue-50 border-blue-300 text-blue-700 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    {priority.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={step === 1}
            className="px-6"
          >
            Previous
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={step === 1 && !plannerData.city}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            {step === 5 ? 'Generate Plans' : 'Next'}
          </Button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 400ms cubic-bezier(0.22,0.61,0.36,1) forwards;
        }
        
        .shadow-card {
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 26px rgba(17,24,39,0.07);
        }
      `}</style>
    </div>
  );
};

export default Planner;