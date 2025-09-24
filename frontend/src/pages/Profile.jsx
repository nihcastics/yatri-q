import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  User, 
  Settings, 
  Bell, 
  Moon, 
  Shield, 
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { AuthAdapter } from '../adapters';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: true,
    smsAlerts: false,
    darkMode: false
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalDistance: 0,
    favoriteRoute: '',
    memberSince: ''
  });
  
  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);
  
  const loadProfile = async () => {
    try {
      const userData = await AuthAdapter.me();
      setUser(userData);
      setPreferences(prev => ({
        ...prev,
        ...userData.preferences
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadStats = async () => {
    // Simulate loading stats with animation
    const mockStats = {
      totalBookings: 0,
      totalDistance: 0,
      favoriteRoute: 'Delhi - Mumbai',
      memberSince: 'January 2024'
    };
    
    // Animate counters
    const animateCounter = (key, target, duration = 2000) => {
      const start = 0;
      const increment = target / (duration / 50);
      let current = start;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 50);
    };
    
    setTimeout(() => {
      animateCounter('totalBookings', 12);
      animateCounter('totalDistance', 8750);
    }, 500);
  };
  
  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleLogout = async () => {
    try {
      await AuthAdapter.logout();
      // In a real app, this would redirect to login
      console.log('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-emerald-50/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-8 shadow-card mb-6 animate-slide-in-up">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-semibold">
                {user?.name?.charAt(0) || 'T'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                {user?.name || 'Travel Enthusiast'}
              </h1>
              <p className="text-slate-600 mb-4">
                {user?.email || 'user@example.com'}
              </p>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Star className="w-3 h-3 mr-1" />
                  Premium Member
                </Badge>
                <span className="text-sm text-slate-600">
                  Member since {stats.memberSince}
                </span>
              </div>
            </div>
            
            <Button variant="outline" className="hover:bg-slate-50">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Travel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-card text-center animate-slide-in-up animation-delay-200">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900 tabular-nums mb-1">
              {stats.totalBookings}
            </div>
            <p className="text-sm text-slate-600">Total Bookings</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-card text-center animate-slide-in-up animation-delay-300">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-slate-900 tabular-nums mb-1">
              {stats.totalDistance.toLocaleString()}
            </div>
            <p className="text-sm text-slate-600">Kilometers Traveled</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-card text-center animate-slide-in-up animation-delay-400">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-lg font-semibold text-slate-900 mb-1">
              {stats.favoriteRoute}
            </div>
            <p className="text-sm text-slate-600">Favorite Route</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-500">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-600" />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={user?.name || ''}
                  className="mt-2"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    className="pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone Number
                </Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Update Information
              </Button>
            </div>
          </div>
          
          {/* Preferences & Settings */}
          <div className="bg-white rounded-xl p-6 shadow-card animate-slide-in-up animation-delay-600">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" />
              Preferences
            </h2>
            
            <div className="space-y-6">
              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-600" />
                  Notifications
                </h3>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Push Notifications</p>
                      <p className="text-xs text-slate-600">Booking updates and alerts</p>
                    </div>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Email Updates</p>
                      <p className="text-xs text-slate-600">Booking confirmations and receipts</p>
                    </div>
                    <Switch
                      checked={preferences.emailUpdates}
                      onCheckedChange={(checked) => handlePreferenceChange('emailUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">SMS Alerts</p>
                      <p className="text-xs text-slate-600">Critical updates only</p>
                    </div>
                    <Switch
                      checked={preferences.smsAlerts}
                      onCheckedChange={(checked) => handlePreferenceChange('smsAlerts', checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-slate-600" />
                  Appearance
                </h3>
                
                <div className="pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Dark Mode Preview</p>
                      <p className="text-xs text-slate-600">Coming soon - early access</p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Security */}
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-600" />
                  Security
                </h3>
                
                <div className="pl-6 space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Payment Methods
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
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

export default Profile;