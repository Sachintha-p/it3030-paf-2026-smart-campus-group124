import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Bell, BellOff, CheckCheck, Ticket, Calendar, MessageSquare } from 'lucide-react';

const typeConfig = {
  BOOKING: { label: 'Booking', badge: 'badge-purple', icon: <Calendar size={14} /> },
  TICKET:  { label: 'Ticket',  badge: 'badge-orange', icon: <Ticket size={14} />   },
  COMMENT: { label: 'Comment', badge: 'badge-blue',   icon: <MessageSquare size={14} /> },
};

const getTypeConfig = (type = '') => {
  if (type.includes('BOOKING')) return typeConfig.BOOKING;
  if (type.includes('TICKET'))  return typeConfig.TICKET;
  if (type.includes('COMMENT')) return typeConfig.COMMENT;
  return { label: 'System', badge: 'badge-gray', icon: <Bell size={14} /> };
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const r = await api.get('/notifications');
      setNotifications(r.data.data || r.data);
    } catch (e) { console.error(e); }
  };

  const markAsRead = async (id, ev) => {
    if (ev) ev.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) { console.error(e); }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error(e); }
  };

  const handleClick = (notif) => {
    if (!notif.isRead) markAsRead(notif.id);
    if (notif.relatedEntityType === 'TICKET')  navigate('/tickets');
    if (notif.relatedEntityType === 'BOOKING') navigate('/bookings');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="badge badge-red text-xs">{unreadCount} New</span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated with booking & ticket changes</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn-ghost flex items-center gap-2 text-sm">
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? notifications.map(notif => {
          const cfg = getTypeConfig(notif.type);
          return (
            <div
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`card p-4 cursor-pointer transition-all duration-200 hover:border-gold-500/30 hover:shadow-gold flex items-start justify-between gap-4
                ${!notif.isRead ? 'border-gold-500/20 bg-gold-500/5' : ''}`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Unread Dot */}
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-gold-500 shadow-gold animate-pulse-slow'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge ${cfg.badge} flex items-center gap-1`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-slate-400' : 'text-white font-medium'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={ev => markAsRead(notif.id, ev)}
                  className="btn-ghost text-xs px-2 py-1 flex-shrink-0"
                >
                  <CheckCheck size={14} />
                </button>
              )}
            </div>
          );
        }) : (
          <div className="card">
            <div className="empty-state">
              <BellOff size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-300 font-medium mb-1">All caught up!</p>
              <p className="empty-state-text">You have no notifications right now.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;