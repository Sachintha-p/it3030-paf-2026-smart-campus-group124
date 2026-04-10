import React, { useState, useEffect } from 'react';
import { bookingService } from '../api/bookingService';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, MapPin, Pencil, Trash2, X } from 'lucide-react';

const STATUS_BADGE = {
  APPROVED:  'badge-green',
  PENDING:   'badge-yellow',
  REJECTED:  'badge-red',
  CANCELLED: 'badge-gray',
};

const Bookings = () => {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editData, setEditData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  const fmtTimeForInput = (time) => {
    if (!time) return '';
    const parts = String(time).split(':');
    return `${parts[0] || '00'}:${parts[1] || '00'}`;
  };

  const fmtTimeForApi = (time) => (time && time.split(':').length === 2 ? `${time}:00` : time);

  const fetchBookings = async () => {
    try {
      const resp = await bookingService.getMine();
      setBookings(resp.data || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setEditData({
      date: booking.date || '',
      startTime: fmtTimeForInput(booking.startTime),
      endTime: fmtTimeForInput(booking.endTime),
      purpose: booking.purpose || '',
      expectedAttendees: booking.expectedAttendees ? String(booking.expectedAttendees) : '',
    });
  };

  const closeEditModal = () => {
    setEditingBooking(null);
    setEditData({ date: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editData.endTime <= editData.startTime) {
      toast.warning('End time must be later than start time.');
      return;
    }

    try {
      await bookingService.update(editingBooking.id, {
        resourceId: editingBooking.resourceId,
        date: editData.date,
        startTime: fmtTimeForApi(editData.startTime),
        endTime: fmtTimeForApi(editData.endTime),
        purpose: editData.purpose,
        expectedAttendees: parseInt(editData.expectedAttendees, 10) || 1,
      });
      toast.success('Booking updated successfully.');
      closeEditModal();
      setLoading(true);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking.');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Delete this booking request? This action cannot be undone.')) return;
    try {
      await bookingService.delete(bookingId);
      toast.success('Booking deleted successfully.');
      setLoading(true);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete booking.');
    }
  };

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
                  <th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Attendees</th><th>Status</th><th>Actions</th>
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
                    <td>
                      {b.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(b)}
                            className="btn-secondary px-2.5 py-1.5 text-xs"
                            title="Edit booking"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="btn-danger px-2.5 py-1.5 text-xs"
                            title="Delete booking"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">Locked</span>
                      )}
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

      {editingBooking && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="text-white font-bold text-lg">Edit Booking</h3>
                <p className="text-slate-400 text-sm mt-0.5">Update your pending booking request</p>
              </div>
              <button onClick={closeEditModal} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="form-label">Resource</label>
                  <input value={editingBooking.resourceName} className="input" disabled />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      required
                      value={editData.date}
                      onChange={(e) => setEditData((prev) => ({ ...prev, date: e.target.value }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      required
                      value={editData.startTime}
                      onChange={(e) => setEditData((prev) => ({ ...prev, startTime: e.target.value }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      required
                      value={editData.endTime}
                      onChange={(e) => setEditData((prev) => ({ ...prev, endTime: e.target.value }))}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Purpose</label>
                  <input
                    required
                    value={editData.purpose}
                    onChange={(e) => setEditData((prev) => ({ ...prev, purpose: e.target.value }))}
                    className="input"
                    placeholder="Purpose of this booking"
                  />
                </div>

                <div>
                  <label className="form-label">Expected Attendees</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editData.expectedAttendees}
                    onChange={(e) => setEditData((prev) => ({ ...prev, expectedAttendees: e.target.value }))}
                    className="input"
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeEditModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
