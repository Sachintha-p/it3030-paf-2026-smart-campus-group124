import React, { useState, useEffect } from 'react';
import { bookingService } from '../api/bookingService';
import Spinner from '../components/Spinner';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

const STATUS_BADGE = {
  APPROVED:  'badge-green',
  PENDING:   'badge-yellow',
  REJECTED:  'badge-red',
  CANCELLED: 'badge-gray',
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resp = await bookingService.getAll();
        setBookings(resp.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Track all your resource reservation requests</p>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Attendees</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-500" />
                        <span className="font-semibold text-white">{b.resourceName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={14} />{b.date}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} />{b.startTime} – {b.endTime}
                      </div>
                    </td>
                    <td className="max-w-xs truncate text-slate-400">{b.purpose || '—'}</td>
                    <td className="text-slate-400">{b.expectedAttendees || '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[b.status] || 'badge-gray'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p className="text-slate-300 font-medium mb-1">No bookings yet</p>
            <p className="empty-state-text">Head over to Resources to book a facility.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
