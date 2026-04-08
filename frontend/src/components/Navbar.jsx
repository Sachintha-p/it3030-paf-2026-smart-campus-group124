import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LayoutDashboard, BookOpen, Calendar, Wrench, Users, ChevronDown, LogOut, User, Menu, X, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  const navLinks = [
    { to: '/dashboard',     label: 'Dashboard',  icon: <LayoutDashboard size={16} /> },
    { to: '/resources',     label: 'Resources',   icon: <BookOpen size={16} /> },
    { to: '/bookings',      label: 'My Bookings', icon: <Calendar size={16} /> },
    { to: '/tickets',       label: 'Tickets',     icon: <Wrench size={16} /> },
  ];

  const adminLinks = [
    { to: '/admin/bookings', label: 'All Bookings' },
    { to: '/admin/tickets',  label: 'All Tickets'  },
    { to: '/admin/users',    label: 'Users'         },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-border bg-surface-card/80 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center shadow-gold">
              <span className="text-navy-900 font-bold text-sm">SC</span>
            </div>
            <span className="font-bold text-white text-base hidden sm:block group-hover:text-gold-400 transition-colors">
              Smart Campus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-surface-border'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-all duration-200 border border-amber-500/20"
                >
                  <ShieldCheck size={16} />
                  Admin
                  <ChevronDown size={14} className={`transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                </button>
                {adminOpen && (
                  <div className="absolute top-full mt-2 right-0 w-48 card py-1 animate-slide-up" onClick={() => setAdminOpen(false)}>
                    {adminLinks.map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                          isActive(link.to) ? 'text-gold-400 bg-gold-500/10' : 'text-slate-300 hover:text-white hover:bg-surface-border'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg text-slate-400 hover:text-gold-400 hover:bg-gold-500/10 transition-all duration-200"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full ring-2 ring-surface-card animate-pulse-slow" />
            </Link>

            {/* Profile */}
            <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-border transition-colors group">
              {user.profilePicture && !avatarError ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-7 w-7 rounded-full ring-2 ring-gold-500/40 object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-semibold text-xs">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <span className="text-sm text-slate-300 group-hover:text-white hidden sm:block max-w-24 truncate">
                {user.name?.split(' ')[0]}
              </span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Logout"
            >
              <LogOut size={18} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-border transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface-card animate-fade-in px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to) ? 'bg-gold-500/15 text-gold-400' : 'text-slate-400 hover:text-white hover:bg-surface-border'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <div className="pt-2 pb-1 px-3 text-xs font-semibold text-amber-500 uppercase tracking-wider">Admin</div>
              {adminLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-surface-border transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
