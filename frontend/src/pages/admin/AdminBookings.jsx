import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CheckCircle2, XCircle, Calendar, Clock, MapPin, User } from 'lucide-react';

const STATUS_BADGE = {
  APPROVED:  'badge-green',
  PENDING:   'badge-yellow',
  REJECTED:  'badge-red',
  CANCELLED: 'badge-gray',
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const r = await api.get('/bookings');
      setBookings(r.data.data || r.data);
    } catch (e) { console.error(e); }
  };

  const handleApprove = async (id) => {
    try { await api.put(`/bookings/${id}/approve`); fetchBookings(); }
    catch { alert('Failed to approve.'); }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter reason for rejection:');
    if (reason === null) return;
    try {
      await api.put(`/bookings/${id}/reject`, { reason: reason || 'No reason provided.' });
      fetchBookings();
    } catch { alert('Failed to reject.'); }
  };

  const pending   = bookings.filter(b => b.status === 'PENDING');
  const actioned  = bookings.filter(b => b.status !== 'PENDING');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Bookings</h1>
          <p className="page-subtitle">Review and action all campus resource booking requests</p>
        </div>
        <div className="flex gap-3">
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-amber-400">{pending.length}</p>
            <p className="text-slate-500 text-xs">Pending</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-2xl font-bold text-white">{bookings.length}</p>
            <p className="text-slate-500 text-xs">Total</p>
          </div>
        </div>
      </div>

      {/* Pending Bookings */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow" /> Awaiting Action ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(b => (
              <div key={b.id} className="card p-5 border-l-4 border-amber-500/50 hover:border-amber-500 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-yellow">PENDING</span>
                      <p className="text-white font-bold">{b.resourceName}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5"><User size={13} />{b.userName || 'Unknown'}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={13} />{b.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} />{b.startTime} — {b.endTime}</span>
                    </div>
                    {b.purpose && <p className="text-slate-500 text-xs italic">Purpose: {b.purpose}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(b.id)} className="btn-success flex items-center gap-2">
                      <CheckCircle2 size={15} /> Approve
                    </button>
                    <button onClick={() => handleReject(b.id)} className="btn-danger flex items-center gap-2">
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Bookings Table */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">All Bookings</h2>
        {bookings.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Resource</th><th>User</th><th>Date</th><th>Time</th><th>Status</th><th>Note</th></tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="font-semibold text-white">{b.resourceName}</td>
                      <td className="text-slate-400">{b.userName || 'Unknown'}</td>
                      <td className="text-slate-400">{b.date}</td>
                      <td className="text-slate-400 font-mono text-xs">{b.startTime} — {b.endTime}</td>
                      <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-gray'}`}>{b.status}</span></td>
                      <td className="text-slate-500 text-xs italic max-w-xs truncate">
                        {b.status === 'REJECTED' ? `Reason: ${b.rejectionReason}` : b.purpose || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="empty-state"><div className="empty-state-icon">📋</div><p className="empty-state-text">No bookings found.</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;