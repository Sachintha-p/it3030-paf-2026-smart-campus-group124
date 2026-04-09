import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Wrench, Building2, Bell,
  ArrowRight, TrendingUp, Clock, CheckCircle2
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  const stats = [
    {
      icon: <Calendar size={22} />,
      label: 'My Bookings',
      value: '—',
      color: 'bg-blue-500/15 text-blue-400',
      link: '/bookings',
    },
    {
      icon: <Wrench size={22} />,
      label: 'Open Tickets',
      value: '—',
      color: 'bg-amber-500/15 text-amber-400',
      link: '/tickets',
    },
    {
      icon: <Building2 size={22} />,
      label: 'Resources',
      value: '—',
      color: 'bg-emerald-500/15 text-emerald-400',
      link: '/resources',
    },
    {
      icon: <Bell size={22} />,
      label: 'Notifications',
      value: '—',
      color: 'bg-purple-500/15 text-purple-400',
      link: '/notifications',
    },
  ];

  const quickActions = [
    { to: '/resources',  icon: <Building2 size={20} />, label: 'Browse & Book Resources',    desc: 'Find and reserve available facilities',  accent: 'group-hover:text-blue-400'    },
    { to: '/bookings',   icon: <Calendar   size={20} />, label: 'View My Bookings',           desc: 'Track status of your reservations',     accent: 'group-hover:text-emerald-400' },
    { to: '/tickets',    icon: <Wrench     size={20} />, label: 'Report an Incident',         desc: 'Submit a maintenance or fault ticket',  accent: 'group-hover:text-amber-400'   },
    { to: '/notifications', icon: <Bell   size={20} />, label: 'Notifications',              desc: 'Check your latest alerts & updates',    accent: 'group-hover:text-purple-400'  },
  ];

  const adminActions = [
    { to: '/admin/bookings', label: 'Manage Bookings', icon: <Calendar size={16} />  },
    { to: '/admin/tickets',  label: 'Manage Tickets',  icon: <Wrench   size={16} />  },
    { to: '/admin/users',    label: 'Manage Users',    icon: <Clock    size={16} />  },
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-surface-border"
           style={{ background: 'linear-gradient(135deg, #172040 0%, #1a2845 100%)' }}>

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-10"
             style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(30%, -30%)' }} />

        <div className="relative z-10 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-gold-400 text-sm font-semibold tracking-wider uppercase mb-2">🎓 Welcome back</p>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-slate-400 text-sm max-w-md">
              Your Smart Campus dashboard is ready. Manage bookings, report incidents, and stay updated with campus operations.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/resources" className="btn-primary">
              <Building2 size={16} />
              Book a Resource
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link to={s.link} key={i} className="stat-card group hover:border-gold-500/30 hover:shadow-gold transition-all">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <p className="stat-value group-hover:text-gold-400 transition-colors">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className="card p-5 hover:border-gold-500/30 hover:shadow-gold transition-all duration-200 hover:-translate-y-1 group cursor-pointer"
            >
              <div className={`text-slate-400 mb-3 ${action.accent} transition-colors`}>{action.icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{action.label}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{action.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-gold-400 transition-colors">
                Go <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <span className="badge badge-yellow">Admin</span>
          </div>
          <div className="card p-6">
            <p className="text-slate-400 text-sm mb-5">You have administrative access. Manage all campus operations from here.</p>
            <div className="flex flex-wrap gap-3">
              {adminActions.map((a, i) => (
                <Link key={i} to={a.to} className="btn-secondary flex items-center gap-2">
                  {a.icon}
                  {a.label}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <CheckCircle2 size={18} className="text-emerald-400" />, title: 'Booking System',  desc: 'PENDING → APPROVED / REJECTED' },
          { icon: <Wrench       size={18} className="text-amber-400"   />, title: 'Ticket Workflow', desc: 'OPEN → IN_PROGRESS → RESOLVED' },
          { icon: <TrendingUp   size={18} className="text-blue-400"    />, title: 'Role Access',    desc: 'USER | ADMIN | TECHNICIAN'      },
        ].map((item, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              {item.icon}
              <span className="text-white text-sm font-semibold">{item.title}</span>
            </div>
            <p className="text-slate-500 text-xs font-mono">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
