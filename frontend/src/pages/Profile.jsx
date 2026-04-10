import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Globe, LogOut } from 'lucide-react';

const ROLE_BADGE = {
  ADMIN:      'badge-yellow',
  TECHNICIAN: 'badge-blue',
  USER:       'badge-green',
};

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const handleLogout = () => { window.location.href = '/login'; };

  const fields = [
    { icon: <User size={16} />,   label: 'Full Name',        value: user.name            },
    { icon: <Mail size={16} />,   label: 'Email Address',    value: user.email           },
    { icon: <Shield size={16} />, label: 'Role',             value: user.role, isRole: true },
    { icon: <Globe size={16} />,  label: 'Account Provider', value: user.provider        },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">

      {/* Header Card */}
      <div className="card overflow-hidden">
        <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, #172040 0%, #1a2845 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 50%, #f59e0b, transparent)' }} />
        </div>
        <div className="px-8 pb-8">
          <div className="-mt-12 flex items-end justify-between">
            {/* Avatar */}
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="h-24 w-24 rounded-2xl ring-4 ring-surface-card shadow-card object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl ring-4 ring-surface-card bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shadow-card">
                <span className="text-gold-400 font-bold text-4xl">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <button onClick={handleLogout} className="btn-danger flex items-center gap-2 mb-1">
              <LogOut size={15} /> Logout
            </button>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
            <div className="mt-3">
              <span className={`badge ${ROLE_BADGE[user.role] || 'badge-gray'}`}>{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="card">
        <div className="p-6 border-b border-surface-border">
          <h3 className="text-white font-bold">Account Details</h3>
          <p className="text-slate-400 text-sm mt-0.5">Your profile & authentication info</p>
        </div>
        <div className="divide-y divide-surface-border">
          {fields.map((f, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="text-slate-500 w-5 flex-shrink-0">{f.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{f.label}</p>
                {f.isRole ? (
                  <span className={`badge ${ROLE_BADGE[f.value] || 'badge-gray'}`}>{f.value}</span>
                ) : (
                  <p className="text-white font-medium text-sm truncate">{f.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-gold-400" />
          <h3 className="text-white font-bold">Security</h3>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-emerald-400 text-sm font-medium">Authenticated via Google OAuth 2.0</p>
        </div>
        <p className="text-slate-500 text-xs mt-3 leading-relaxed">
          Your account is secured with Google OAuth 2.0. Your credentials are never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default Profile;
