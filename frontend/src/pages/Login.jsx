import React from 'react';
import { Building2, Calendar, Wrench, Shield, Star, Zap, Github } from 'lucide-react';

const Login = () => {
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    window.location.href = `${apiUrl.replace('/api', '')}/oauth2/authorization/google`;
  };

  const handleGitHubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    window.location.href = `${apiUrl.replace('/api', '')}/oauth2/authorization/github`;
  };

  const features = [
    { icon: <Building2 size={20} />, label: 'Facility Booking',   desc: 'Reserve lecture halls, labs & rooms'  },
    { icon: <Wrench      size={20} />, label: 'Incident Tickets', desc: 'Report and track maintenance issues'  },
    { icon: <Zap         size={20} />, label: 'Real-time Updates',desc: 'Instant notifications for your requests'},
    { icon: <Shield      size={20} />, label: 'Role-based Access', desc: 'Secure, permission-driven access control'},
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f1629' }}>

      {/* LEFT — Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #172040 0%, #0f1629 60%, #1a2032 100%)' }}>

        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-8"
             style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(30%, 30%)' }} />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-gold">
            <span className="text-navy-900 font-bold text-sm">SC</span>
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none">Smart Campus</p>
            <p className="text-gold-500 text-xs font-semibold tracking-widest uppercase">Operations Hub</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-6">
            <Star size={12} className="fill-gold-400" />
            University Management Platform
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Manage Your<br />
            <span className="text-gold-400">Campus Resources</span><br />
            Effortlessly
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Book facilities, report incidents, and stay connected — all in one intelligent hub.
          </p>

          {/* Feature List */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-surface-border bg-surface/40">
                <div className="text-gold-400 mt-0.5 flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Credit */}
        <div className="relative z-10 text-slate-600 text-xs">
          © 2025 Smart Campus Operations Hub. All rights reserved.
        </div>
      </div>

      {/* RIGHT — Login Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-gold">
              <span className="text-navy-900 font-bold text-sm">SC</span>
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-none">Smart Campus</p>
              <p className="text-gold-500 text-xs font-semibold tracking-widest uppercase">Operations Hub</p>
            </div>
          </div>

          {/* Card */}
          <div className="card p-8 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 text-sm">Sign in to access your campus dashboard</p>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              id="google-login-btn"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm
                         bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg
                         transition-all duration-200 hover:-translate-y-0.5 border border-gray-200"
            >
              {/* Google SVG Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>

            {/* GitHub Login Button */}
            <button
              onClick={handleGitHubLogin}
              id="github-login-btn"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm mt-3
                         bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg
                         transition-all duration-200 hover:-translate-y-0.5 border border-gray-700"
            >
              <Github size={20} />
              Sign in with GitHub
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-surface-border"></div>
              <span className="text-slate-600 text-xs">Secure OAuth 2.0</span>
              <div className="flex-1 h-px bg-surface-border"></div>
            </div>

            {/* Info */}
            <div className="bg-surface/60 border border-surface-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-300 text-xs font-semibold mb-1">Secure University Login</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Use your Google account. Your data is protected and only accessible with proper authentication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            Having trouble? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;