import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Phone, Video, MapPin, Heart, Activity, Users, Award, Camera, FileText, Zap, Shield, Flame, Ambulance, Clock, CheckCircle, User, Settings, Bell, LogOut, Menu, X, Home, BarChart3, Database, Lock, Mail, Eye, EyeOff, Save, Upload, Download, ChevronRight, Plus, TrendingUp, AlertTriangle, Info, Signal } from 'lucide-react';

// Floating Loader Component
const FloatingLoader = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative">
        <div className="w-16 h-16 relative">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
                animation: `pulse-dot 1.4s ease-in-out ${i * 0.15}s infinite`,
                opacity: 0
              }}
            />
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700 text-center">Loading...</p>
      </div>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0; transform: scale(0.8) rotate(${0}deg) translateY(-20px); }
          50% { opacity: 1; transform: scale(1.2) rotate(${0}deg) translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

// App Configuration
const APP_CONFIG = {
  app: {
    name: "Fast Aide",
    version: "1.0.0",
    theme: "silver",
    emergencyTimeout: 5,
    offlineMode: true
  },
  emergency: {
    autoLocationSharing: true,
    autoContactNotification: true,
    videoCallEnabled: true,
    satelliteBackup: true,
    multiNetworkSupport: true
  },
  integrations: {
    hospitalAPI: "https://api.hospital.example.com",
    policeAPI: "https://api.police.example.com",
    ambulanceAPI: "https://api.ambulance.example.com",
    mapsAPI: "https://api.maps.example.com",
    telecomAPI: "https://api.telecom.example.com"
  },
  points: {
    quickResponse: 50,
    successfulHelp: 100,
    goodDeed: 75,
    accurateReport: 25
  }
};

const FastAideApp = () => {
  // Core State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fadeTransition, setFadeTransition] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Emergency State
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyType, setEmergencyType] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [emergencyDescription, setEmergencyDescription] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  
  // Config & Settings
  const [appConfig, setAppConfig] = useState(APP_CONFIG);
  
  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [profileForm, setProfileForm] = useState({});
  
  const fileInputRef = useRef(null);

  // Navigation with loading animation
  const navigateTo = (view) => {
    setLoading(true);
    setFadeTransition(true);
    setTimeout(() => {
      setCurrentView(view);
      setFadeTransition(false);
      setTimeout(() => setLoading(false), 300);
    }, 200);
  };

  // Emergency countdown effect
  useEffect(() => {
    if (emergencyActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && emergencyActive) {
      navigateTo('emergency-dispatch');
    }
  }, [countdown, emergencyActive]);

  // Login handler
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: '1',
        name: 'John Doe',
        email: loginForm.email,
        role: loginForm.email.includes('admin') ? 'admin' : loginForm.email.includes('doctor') ? 'doctor' : 'user',
        phone: '+1234567890',
        points: 450,
        emergenciesHandled: 12
      };
      setCurrentUser(user);
      setProfileForm(user);
      setIsAuthenticated(true);
      navigateTo(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
    }, 800);
  };

  // Register handler
  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        ...registerForm,
        role: 'user',
        points: 0,
        emergenciesHandled: 0
      };
      setCurrentUser(user);
      setProfileForm(user);
      setIsAuthenticated(true);
      navigateTo('dashboard');
    }, 800);
  };

  // Logout handler
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      navigateTo('login');
    }, 500);
  };

  // Photo upload handler
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          preview: reader.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    setUploadedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  // Emergency Types
  const emergencyTypes = [
    { 
      id: 'medical', 
      name: 'Medical Emergency', 
      icon: Heart, 
      gradient: 'from-rose-50 to-red-50',
      border: 'border-red-200',
      iconColor: 'text-red-500',
      desc: 'Injury, illness, or health crisis'
    },
    { 
      id: 'fire', 
      name: 'Fire Emergency', 
      icon: Flame, 
      gradient: 'from-orange-50 to-red-50',
      border: 'border-orange-200',
      iconColor: 'text-orange-500',
      desc: 'Fire, smoke, or burns'
    },
    { 
      id: 'police', 
      name: 'Police/Security', 
      icon: Shield, 
      gradient: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      iconColor: 'text-blue-600',
      desc: 'Crime, threat, or security'
    },
    { 
      id: 'accident', 
      name: 'Accident', 
      icon: AlertCircle, 
      gradient: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      desc: 'Vehicle or workplace accident'
    },
    { 
      id: 'disaster', 
      name: 'Natural Disaster', 
      icon: Zap, 
      gradient: 'from-purple-50 to-pink-50',
      border: 'border-purple-200',
      iconColor: 'text-purple-600',
      desc: 'Earthquake, flood, natural event'
    },
    { 
      id: 'other', 
      name: 'Other Emergency', 
      icon: AlertTriangle, 
      gradient: 'from-gray-50 to-slate-50',
      border: 'border-gray-300',
      iconColor: 'text-gray-600',
      desc: 'Any urgent situation'
    }
  ];

  // Body Parts
  const bodyParts = [
    { id: 'head', name: 'Head/Skull', region: 'Head', x: 50, y: 12, size: 8 },
    { id: 'eyes', name: 'Eyes', region: 'Head', x: 50, y: 14, size: 3 },
    { id: 'neck', name: 'Neck', region: 'Neck', x: 50, y: 20, size: 4 },
    { id: 'left-shoulder', name: 'Left Shoulder', region: 'Upper Body', x: 35, y: 26, size: 5 },
    { id: 'right-shoulder', name: 'Right Shoulder', region: 'Upper Body', x: 65, y: 26, size: 5 },
    { id: 'chest', name: 'Chest', region: 'Torso', x: 50, y: 32, size: 10 },
    { id: 'left-arm', name: 'Left Upper Arm', region: 'Arms', x: 30, y: 35, size: 4 },
    { id: 'right-arm', name: 'Right Upper Arm', region: 'Arms', x: 70, y: 35, size: 4 },
    { id: 'abdomen', name: 'Abdomen', region: 'Torso', x: 50, y: 45, size: 9 },
    { id: 'left-hand', name: 'Left Hand', region: 'Arms', x: 20, y: 54, size: 3 },
    { id: 'right-hand', name: 'Right Hand', region: 'Arms', x: 80, y: 54, size: 3 },
    { id: 'pelvis', name: 'Pelvis/Hips', region: 'Lower Body', x: 50, y: 55, size: 8 },
    { id: 'left-thigh', name: 'Left Thigh', region: 'Legs', x: 43, y: 65, size: 5 },
    { id: 'right-thigh', name: 'Right Thigh', region: 'Legs', x: 57, y: 65, size: 5 },
    { id: 'left-knee', name: 'Left Knee', region: 'Legs', x: 42, y: 73, size: 3 },
    { id: 'right-knee', name: 'Right Knee', region: 'Legs', x: 58, y: 73, size: 3 },
    { id: 'left-foot', name: 'Left Foot', region: 'Legs', x: 39, y: 94, size: 4 },
    { id: 'right-foot', name: 'Right Foot', region: 'Legs', x: 61, y: 94, size: 4 }
  ];

  // Symptoms
  const symptoms = [
    { id: 'severe-pain', name: 'Severe Pain', icon: '😣', severity: 'high' },
    { id: 'bleeding', name: 'Bleeding', icon: '🩸', severity: 'high' },
    { id: 'breathing', name: 'Breathing Difficulty', icon: '😮‍💨', severity: 'critical' },
    { id: 'unconscious', name: 'Unconscious', icon: '😵', severity: 'critical' },
    { id: 'burn', name: 'Burn Injury', icon: '🔥', severity: 'high' },
    { id: 'fracture', name: 'Fracture/Break', icon: '🦴', severity: 'high' },
    { id: 'chest-pain', name: 'Chest Pain', icon: '💔', severity: 'critical' },
    { id: 'allergic', name: 'Allergic Reaction', icon: '🤧', severity: 'high' }
  ];

  // ==================== HEADER ====================
  const Header = () => (
    <header className="bg-white/95 border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {appConfig.app.name}
              </h1>
              <p className="text-xs text-gray-500">v{appConfig.app.version}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg px-3 py-1.5 text-xs">
            <Signal className="w-3 h-3 text-green-500" />
            <span className="text-gray-600">Online</span>
          </div>
          
          {isAuthenticated && (
            <>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-gray-200">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {currentUser?.name?.charAt(0)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );

  // ==================== SIDEBAR ====================
  const Sidebar = () => {
    const menuItems = currentUser?.role === 'admin' ? [
      { icon: Home, label: 'Dashboard', view: 'admin-dashboard' },
      { icon: BarChart3, label: 'Analytics', view: 'analytics' },
      { icon: Users, label: 'Users', view: 'user-management' },
      { icon: Database, label: 'Database', view: 'database-config' },
      { icon: Settings, label: 'Settings', view: 'system-settings' },
      { icon: User, label: 'Profile', view: 'profile' }
    ] : [
      { icon: Home, label: 'Dashboard', view: 'dashboard' },
      { icon: Zap, label: 'Emergency', view: 'emergency-select', highlight: true },
      { icon: Clock, label: 'History', view: 'history' },
      { icon: Users, label: 'Contacts', view: 'contacts' },
      { icon: Award, label: 'Points', view: 'points' },
      { icon: User, label: 'Profile', view: 'profile' },
      { icon: Settings, label: 'Settings', view: 'settings' }
    ];

    return (
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-30 ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
        <div className="flex flex-col h-full pt-20 lg:pt-4">
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  navigateTo(item.view);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  currentView === item.view
                    ? item.highlight
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${item.highlight && currentView !== item.view ? 'border-2 border-red-200' : ''}`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${item.highlight && currentView !== item.view ? 'text-red-500' : ''}`} />
                <span className={`font-medium ${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-2 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium ${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    );
  };

  // ==================== LOGIN SCREEN ====================
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-100 rounded-full opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg mb-4">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access Fast Aide</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button onClick={() => navigateTo('register')} className="text-red-500 font-semibold hover:text-red-600">
                Sign Up
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-3">Quick Demo:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button onClick={() => setLoginForm({email: 'user@demo.com', password: 'demo'})} className="py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">User</button>
              <button onClick={() => setLoginForm({email: 'doctor@demo.com', password: 'demo'})} className="py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">Doctor</button>
              <button onClick={() => setLoginForm({email: 'admin@demo.com', password: 'demo'})} className="py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">Admin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== REGISTER SCREEN ====================
  const RegisterScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-500">Join Fast Aide network</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigateTo('login')} className="text-red-500 font-semibold hover:text-red-600">
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== USER DASHBOARD ====================
  const UserDashboard = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser?.name}</h1>
          <p className="text-gray-500 mt-1">Your emergency dashboard</p>
        </div>
        <button
          onClick={() => navigateTo('emergency-select')}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Quick Emergency</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: '24/7 Coverage', value: 'Active', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
          { icon: Clock, label: 'Response Time', value: '< 5 sec', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
          { icon: Award, label: 'Your Points', value: currentUser?.points || 0, bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
          { icon: Users, label: 'Contacts', value: '5', bgColor: 'bg-red-50', iconColor: 'text-red-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Emergency Types</h3>
          <div className="grid grid-cols-2 gap-3">
            {emergencyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setEmergencyType(type.id);
                  navigateTo(type.id === 'medical' ? 'body-map' : 'emergency-form');
                }}
                className={`p-4 rounded-xl border-2 ${type.border} bg-gradient-to-br ${type.gradient} hover:shadow-md transition-all duration-200 text-left group`}
              >
                <type.icon className={`w-8 h-8 ${type.iconColor} mb-2 group-hover:scale-110 transition-transform`} />
                <h4 className="font-semibold text-gray-800 text-sm">{type.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{type.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { icon: MapPin, label: 'Update Location', desc: 'Ensure accurate response', color: 'blue' },
              { icon: Users, label: 'Manage Contacts', desc: 'Emergency contacts', color: 'green' },
              { icon: FileText, label: 'Medical Profile', desc: 'Health information', color: 'purple' },
              { icon: Settings, label: 'Settings', desc: 'Preferences', color: 'gray', action: () => navigateTo('settings') }
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 text-left flex items-center space-x-3 group"
              >
                <action.icon className={`w-5 h-5 text-${action.color}-500 group-hover:scale-110 transition-transform`} />
                <div>
                  <p className="font-medium text-gray-800 text-sm">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-500 rounded-lg">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2">System Status: All Services Operational</h3>
            <p className="text-gray-600 text-sm mb-3">
              All emergency services online. Your location is tracked for optimal response time.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              {['Medical', 'Fire', 'Police', 'Ambulance'].map(service => (
                <div key={service} className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== EMERGENCY SELECT ====================
  const EmergencySelectScreen = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <div>
        <button onClick={() => navigateTo('dashboard')} className="text-gray-500 hover:text-gray-700 mb-4 flex items-center space-x-2 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Select Emergency Type</h1>
        <p className="text-gray-500 mt-1">Choose the assistance you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emergencyTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setEmergencyType(type.id);
              navigateTo(type.id === 'medical' ? 'body-map' : 'emergency-form');
            }}
            className={`group p-6 rounded-xl border-2 ${type.border} bg-gradient-to-br ${type.gradient} hover:shadow-xl transition-all duration-300 text-left`}
          >
            <type.icon className={`w-12 h-12 ${type.iconColor} mb-4 group-hover:scale-110 transition-transform`} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{type.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{type.desc}</p>
            <div className="flex items-center text-sm text-gray-500">
              <ChevronRight className="w-4 h-4 mr-1" />
              <span>Continue</span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-500" />
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Select Type', desc: 'Choose emergency category', color: 'blue' },
            { step: '2', title: 'Provide Details', desc: 'Quick form or body map', color: 'green' },
            { step: '3', title: 'Instant Connect', desc: 'Help in 5 seconds', color: 'red' }
          ].map((item) => (
            <div key={item.step} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 bg-${item.color}-100 rounded-full flex items-center justify-center text-${item.color}-600 font-bold text-sm`}>{item.step}</div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== BODY MAP ====================
  const BodyMapScreen = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <div>
        <button onClick={() => navigateTo('emergency-select')} className="text-gray-500 hover:text-gray-700 mb-4 flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Medical Emergency</h1>
        <p className="text-gray-500 mt-1">Select affected area and symptoms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Select Affected Body Part</h3>
          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 h-[500px]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="bodyGradient">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              <ellipse cx="50" cy="12" rx="6" ry="7" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="47" y="18" width="6" height="4" rx="1" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="35" cy="26" rx="6" ry="4" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="65" cy="26" rx="6" ry="4" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="50" cy="32" rx="12" ry="8" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="50" cy="45" rx="10" ry="7" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="50" cy="55" rx="11" ry="5" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="28" y="28" width="4" height="14" rx="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="68" y="28" width="4" height="14" rx="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="22" cy="56" rx="2.5" ry="3" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="78" cy="56" rx="2.5" ry="3" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="41" y="59" width="5" height="16" rx="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="54" y="59" width="5" height="16" rx="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="40" y="75" width="5" height="15" rx="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <rect x="55" y="75" width="5" height="15" rx="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="41" cy="92" rx="3" ry="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />
              <ellipse cx="58" cy="92" rx="3" ry="2" fill="url(#bodyGradient)" stroke="#60a5fa" strokeWidth="0.3" />

              {bodyParts.map((part) => (
                <g key={part.id}>
                  <circle
                    cx={part.x}
                    cy={part.y}
                    r={selectedBodyPart === part.id ? part.size * 1.3 : part.size}
                    fill={selectedBodyPart === part.id ? "#ef4444" : "#3b82f6"}
                    opacity={selectedBodyPart === part.id ? "0.8" : "0.3"}
                    onClick={() => setSelectedBodyPart(part.id)}
                    className="cursor-pointer transition-all duration-300 hover:opacity-70"
                  />
                  {selectedBodyPart === part.id && (
                    <circle
                      cx={part.x}
                      cy={part.y}
                      r={part.size * 1.8}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="0.5"
                      opacity="0.5"
                    >
                      <animate attributeName="r" from={part.size * 1.8} to={part.size * 2.5} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              ))}
            </svg>
          </div>
          
          {selectedBodyPart && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-gray-800 text-sm mb-1">
                Selected: {bodyParts.find(p => p.id === selectedBodyPart)?.name}
              </h4>
              <p className="text-xs text-gray-600">
                Region: {bodyParts.find(p => p.id === selectedBodyPart)?.region}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              Select Symptoms
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {symptoms.map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => {
                    setSelectedSymptoms(prev =>
                      prev.includes(symptom.id)
                        ? prev.filter(s => s !== symptom.id)
                        : [...prev, symptom.id]
                    );
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'bg-red-50 border-red-300 scale-105'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-1">{symptom.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{symptom.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Additional Info</h3>
            <textarea
              value={emergencyDescription}
              onChange={(e) => setEmergencyDescription(e.target.value)}
              placeholder="Describe the situation..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Upload Photo</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload</p>
            </button>
            
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {uploadedPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img src={photo.preview} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setEmergencyActive(true);
              setCountdown(5);
            }}
            disabled={!selectedBodyPart && selectedSymptoms.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedBodyPart || selectedSymptoms.length > 0
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>ACTIVATE FAST AIDE</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== EMERGENCY FORM ====================
  const EmergencyFormScreen = () => {
    const currentEmergencyType = emergencyTypes.find(t => t.id === emergencyType);
    
    return (
      <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
        <div>
          <button onClick={() => navigateTo('emergency-select')} className="text-gray-500 hover:text-gray-700 mb-4 flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4">
            {currentEmergencyType && <currentEmergencyType.icon className={`w-12 h-12 ${currentEmergencyType.iconColor}`} />}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{currentEmergencyType?.name}</h1>
              <p className="text-gray-500 mt-1">{currentEmergencyType?.desc}</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={emergencyDescription}
                onChange={(e) => setEmergencyDescription(e.target.value)}
                placeholder="Describe the emergency in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo/Video</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-red-400 transition-colors"
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload evidence</p>
                <p className="text-xs text-gray-400 mt-1">Photos or videos help responders</p>
              </button>
              
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img src={photo.preview} alt="" className="w-full h-20 object-cover rounded-lg" />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setEmergencyActive(true);
                setCountdown(5);
              }}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>ACTIVATE FAST AIDE</span>
            </button>
          </div>
        </div>

        <div className="max-w-2xl bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-800 flex items-center">
            <Info className="w-4 h-4 inline mr-2" />
            Your location will be automatically shared with emergency responders for fastest response.
          </p>
        </div>
      </div>
    );
  };

  // ==================== EMERGENCY DISPATCH ====================
  const EmergencyDispatchScreen = () => {
    const [connectedServices, setConnectedServices] = useState([]);

    useEffect(() => {
      const services = [
        { id: 1, name: 'Emergency Doctor', specialty: 'General Medicine', delay: 500, icon: Heart, status: 'connected' },
        { id: 2, name: 'Ambulance Unit', specialty: 'Mobile ICU', delay: 800, icon: Ambulance, status: 'connected' },
        { id: 3, name: 'Emergency Contact', specialty: 'Family', delay: 1000, icon: Users, status: 'notified' }
      ];

      services.forEach((service) => {
        setTimeout(() => {
          setConnectedServices(prev => [...prev, service]);
        }, service.delay);
      });
    }, []);

    return (
      <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg mb-4">
            <CheckCircle className="w-12 h-12 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency Services Connected</h1>
          <p className="text-gray-500">Help is on the way • Stay calm</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {connectedServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <service.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{service.name}</h3>
                    <p className="text-xs text-gray-500">{service.specialty}</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-white mx-auto" />
                </button>
                <button className="flex-1 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                  <Video className="w-4 h-4 text-white mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <MapPin className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Location Shared</h3>
            <p className="text-sm text-gray-600 mb-3">Live GPS tracking active</p>
            <p className="text-xs text-blue-600 font-medium">Bengaluru, Karnataka</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
            <Clock className="w-10 h-10 text-green-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">ETA to You</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">4-6 min</p>
            <p className="text-sm text-gray-600">Ambulance en route</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <Award className="w-10 h-10 text-purple-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Points Earned</h3>
            <p className="text-3xl font-bold text-purple-600 mb-1">+50</p>
            <p className="text-sm text-gray-600">Quick response</p>
          </div>
        </div>

        {uploadedPhotos.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Shared Evidence</h3>
            <div className="grid grid-cols-4 gap-3">
              {uploadedPhotos.map((photo) => (
                <div key={photo.id} className="relative">
                  <img src={photo.preview} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={() => {
              setEmergencyActive(false);
              setCountdown(5);
              setUploadedPhotos([]);
              navigateTo('dashboard');
            }}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Emergency Resolved
          </button>
        </div>
      </div>
    );
  };

  // ==================== SETTINGS ====================
  const SettingsScreen = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <h3 className="font-bold text-gray-800 mb-4">Emergency Settings</h3>
        {[
          { label: 'Auto Location Sharing', key: 'autoLocationSharing' },
          { label: 'Auto Contact Notification', key: 'autoContactNotification' },
          { label: 'Video Call Enabled', key: 'videoCallEnabled' },
          { label: 'Satellite Backup', key: 'satelliteBackup' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="font-medium text-gray-800">{setting.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={appConfig.emergency[setting.key]}
                onChange={(e) => setAppConfig({
                  ...appConfig,
                  emergency: {...appConfig.emergency, [setting.key]: e.target.checked}
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        ))}
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        <Save className="w-4 h-4 inline mr-2" />
        Save Settings
      </button>
    </div>
  );

  // ==================== ADMIN DASHBOARD ====================
  const AdminDashboard = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: AlertCircle, label: 'Total Emergencies', value: '1,247', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
          { icon: Users, label: 'Active Responders', value: '89', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
          { icon: Clock, label: 'Avg Response', value: '3.2 min', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
          { icon: TrendingUp, label: 'Success Rate', value: '98.5%', bgColor: 'bg-red-50', iconColor: 'text-red-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigateTo('database-config')} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all text-left">
          <Database className="w-8 h-8 text-green-500 mb-3" />
          <h4 className="font-bold text-gray-800 mb-1">Database Config</h4>
          <p className="text-sm text-gray-500">Configure integrations</p>
        </button>
        <button onClick={() => navigateTo('system-settings')} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all text-left">
          <Settings className="w-8 h-8 text-purple-500 mb-3" />
          <h4 className="font-bold text-gray-800 mb-1">System Settings</h4>
          <p className="text-sm text-gray-500">App configuration</p>
        </button>
        <button onClick={() => navigateTo('profile')} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all text-left">
          <User className="w-8 h-8 text-blue-500 mb-3" />
          <h4 className="font-bold text-gray-800 mb-1">Profile</h4>
          <p className="text-sm text-gray-500">Manage account</p>
        </button>
      </div>
    </div>
  );

  // ==================== DATABASE CONFIG ====================
  const DatabaseConfigScreen = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="text-3xl font-bold text-gray-800">Database Configuration</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-yellow-800">Configuration Instructions</p>
          <p className="text-sm text-yellow-700 mt-1">
            Enter your API endpoints and keys below. All connections are encrypted and secure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(appConfig.integrations).map((key) => (
          <div key={key} className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 capitalize flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-500" />
              {key.replace('API', ' API')}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                <input
                  type="text"
                  value={appConfig.integrations[key]}
                  onChange={(e) => setAppConfig({
                    ...appConfig,
                    integrations: {...appConfig.integrations, [key]: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
                  placeholder="https://api.example.com"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ready to Connect
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Test Connection</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Configuration JSON</h3>
        <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto max-h-64 overflow-y-auto">
          <pre>{JSON.stringify(appConfig, null, 2)}</pre>
        </div>
        <div className="flex space-x-3 mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import Config
          </button>
        </div>
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        <Save className="w-4 h-4 inline mr-2" />
        Save All Configurations
      </button>
    </div>
  );

  // ==================== SYSTEM SETTINGS ====================
  const SystemSettingsScreen = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="text-3xl font-bold text-gray-800">System Settings</h1>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Application Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
            <input
              type="text"
              value={appConfig.app.name}
              onChange={(e) => setAppConfig({...appConfig, app: {...appConfig.app, name: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input
              type="text"
              value={appConfig.app.version}
              onChange={(e) => setAppConfig({...appConfig, app: {...appConfig.app, version: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Timeout (seconds)</label>
            <input
              type="number"
              value={appConfig.app.emergencyTimeout}
              onChange={(e) => setAppConfig({...appConfig, app: {...appConfig.app, emergencyTimeout: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={appConfig.app.theme}
              onChange={(e) => setAppConfig({...appConfig, app: {...appConfig.app, theme: e.target.value}})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="silver">Silver</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Points System</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(appConfig.points).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                value={appConfig.points[key]}
                onChange={(e) => setAppConfig({
                  ...appConfig,
                  points: {...appConfig.points, [key]: parseInt(e.target.value)}
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        <Save className="w-4 h-4 inline mr-2" />
        Save System Settings
      </button>
    </div>
  );

  // ==================== PROFILE ====================
  const ProfileScreen = () => (
    <div className={`p-6 space-y-6 transition-opacity duration-300 ${fadeTransition ? 'opacity-0' : 'opacity-100'}`}>
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {currentUser?.name?.charAt(0)}
          </div>
          <h3 className="text-xl font-bold text-gray-800">{currentUser?.name}</h3>
          <p className="text-gray-500 text-sm capitalize mt-1">{currentUser?.role}</p>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-600">
              <Award className="w-4 h-4 inline mr-1 text-purple-500" />
              {currentUser?.points} Points
            </div>
            <div className="text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
              {currentUser?.emergenciesHandled} Emergencies
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={profileForm.email || ''}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profileForm.phone || ''}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                <option>Select...</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Emergency Contacts</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
              <input type="text" placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="text" placeholder="Relationship" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input type="tel" placeholder="Phone" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <button className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium">
                Remove
              </button>
            </div>
          ))}
          <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-red-400 hover:text-red-600 transition-colors font-medium text-sm">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Emergency Contact
          </button>
        </div>
      </div>

      <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
        <Save className="w-4 h-4 inline mr-2" />
        Save Profile
      </button>
    </div>
  );

  // ==================== MAIN RENDER ====================
  const renderMainContent = () => {
    if (!isAuthenticated) {
      return currentView === 'register' ? <RegisterScreen /> : <LoginScreen />;
    }

    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {currentView === 'dashboard' && <UserDashboard />}
            {currentView === 'admin-dashboard' && <AdminDashboard />}
            {currentView === 'emergency-select' && <EmergencySelectScreen />}
            {currentView === 'body-map' && <BodyMapScreen />}
            {currentView === 'emergency-form' && <EmergencyFormScreen />}
            {currentView === 'emergency-dispatch' && <EmergencyDispatchScreen />}
            {currentView === 'settings' && <SettingsScreen />}
            {currentView === 'profile' && <ProfileScreen />}
            {currentView === 'database-config' && <DatabaseConfigScreen />}
            {currentView === 'system-settings' && <SystemSettingsScreen />}
          </main>
        </div>
      </div>
    );
  };

  return (
    <>
      <FloatingLoader show={loading} />
      {renderMainContent()}
    </>
  );
};

export default FastAideApp