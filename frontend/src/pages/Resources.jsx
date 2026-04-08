import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import {
  Plus, X, Search, Building2, FlaskConical, Users,
  Monitor, MapPin, Users2, Pencil, Trash2, BookOpen, Filter
} from 'lucide-react';

const typeIcons = {
  LECTURE_HALL: <Building2  size={16} />,
  LAB:          <FlaskConical size={16} />,
  MEETING_ROOM: <Users      size={16} />,
  EQUIPMENT:    <Monitor    size={16} />,
};

const Resources = () => {
  const toast = useToast();
  const [resources,     setResources]     = useState([]);
  const [showForm,      setShowForm]      = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [filters,       setFilters]       = useState({ type: '', capacity: '', location: '' });
  const [formData,      setFormData]      = useState({ name: '', type: 'LECTURE_HALL', capacity: '', location: '', status: 'ACTIVE' });
  const [showBooking,   setShowBooking]   = useState(false);
  const [selectedRes,   setSelectedRes]   = useState(null);
  const [bookingData,   setBookingData]   = useState({ date: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type)     params.append('type',     filters.type);
      if (filters.capacity) params.append('capacity', filters.capacity);
      if (filters.location) params.append('location', filters.location);
      const res = await api.get(`/resources?${params.toString()}`);
      setResources(res.data.data || res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchResources(); }, [filters]);

  const fmt = (t) => t ? t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : '';

  const addMinutesToTime = (time, minutesToAdd) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes + minutesToAdd;
    const clamped = Math.max(0, Math.min(totalMinutes, (23 * 60) + 59));
    const nextHours = String(Math.floor(clamped / 60)).padStart(2, '0');
    const nextMinutes = String(clamped % 60).padStart(2, '0');
    return `${nextHours}:${nextMinutes}`;
  };

  const openTimePicker = (event) => {
    if (typeof event?.target?.showPicker === 'function') {
      event.target.showPicker();
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: (name === 'name' || name === 'location') ? fmt(value) : value }));
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'LECTURE_HALL', capacity: '', location: '', status: 'ACTIVE' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (r) => {
    setFormData({ name: r.name, type: r.type, capacity: r.capacity.toString(), location: r.location, status: r.status });
    setEditingId(r.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, capacity: parseInt(formData.capacity, 10) };
      if (editingId) await api.put(`/resources/${editingId}`, payload);
      else           await api.post('/resources', payload);
      resetForm();
      fetchResources();
      toast.success(editingId ? 'Resource updated successfully.' : 'Resource created successfully.');
    } catch { toast.error('Failed to save resource.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this resource?')) return;
    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
      toast.success('Resource deleted successfully.');
    }
    catch { toast.error('Failed to delete resource.'); }
  };

  const openBooking = (r) => {
    setSelectedRes(r);
    setBookingData({ date: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
    setShowBooking(true);
  };

  const handleBookingInput = (e) => {
    const { name, value } = e.target;
    if (name === 'startTime') {
      setBookingData(prev => {
        const nextEnd = (!prev.endTime || prev.endTime <= value) ? addMinutesToTime(value, 60) : prev.endTime;
        return { ...prev, startTime: value, endTime: nextEnd };
      });
      return;
    }

    setBookingData(p => ({ ...p, [name]: name === 'purpose' ? fmt(value) : value }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    const fmtTime = (t) => t?.split(':').length === 2 ? t + ':00' : t || '00:00:00';
    if (bookingData.endTime <= bookingData.startTime) {
      toast.warning('End time must be later than start time.');
      return;
    }
    try {
      await api.post('/bookings', {
        resourceId: selectedRes.id,
        date: bookingData.date,
        startTime: fmtTime(bookingData.startTime),
        endTime:   fmtTime(bookingData.endTime),
        purpose:   bookingData.purpose,
        expectedAttendees: parseInt(bookingData.expectedAttendees, 10) || 1,
      });
      toast.success('Booking request submitted — pending approval!');
      setShowBooking(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Check for conflicts.');
    }
  };

  const typeLabel = (t) => ({
    LECTURE_HALL: 'Lecture Hall', LAB: 'Laboratory',
    MEETING_ROOM: 'Meeting Room', EQUIPMENT: 'Equipment',
  }[t] || t);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Resource Catalogue</h1>
          <p className="page-subtitle">Browse and manage campus facilities & equipment</p>
        </div>
        <button onClick={() => showForm ? resetForm() : setShowForm(true)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Resource</>}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6 animate-slide-up">
          <h3 className="text-white font-bold text-base mb-5">
            {editingId ? '✏️ Edit Resource' : '➕ Create New Resource'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="form-label">Name</label>
              <input name="name" required value={formData.name} onChange={handleInput} className="input" placeholder="e.g. Main Lecture Hall A" />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select name="type" value={formData.type} onChange={handleInput} className="select">
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Laboratory</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div>
              <label className="form-label">Capacity</label>
              <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleInput} className="input" placeholder="50" />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={formData.status} onChange={handleInput} className="select">
                <option value="ACTIVE">ACTIVE</option>
                <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
              </select>
            </div>
            <div className="md:col-span-3 lg:col-span-4">
              <label className="form-label">Location</label>
              <input name="location" required value={formData.location} onChange={handleInput} className="input" placeholder="e.g. Block A, Floor 2" />
            </div>
            <div className="flex items-end">
              <button type="submit" className={editingId ? 'btn-primary w-full justify-center' : 'btn-primary w-full justify-center'}>
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Filter size={16} /> Filter:
        </div>
        <select name="type" value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))} className="select w-auto min-w-36">
          <option value="">All Types</option>
          <option value="LECTURE_HALL">Lecture Hall</option>
          <option value="LAB">Laboratory</option>
          <option value="MEETING_ROOM">Meeting Room</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>
        <input type="number" placeholder="Min Capacity" value={filters.capacity} onChange={e => setFilters(p => ({ ...p, capacity: e.target.value }))} className="input w-36" />
        <div className="relative flex-1 min-w-40">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input placeholder="Search location..." value={filters.location} onChange={e => setFilters(p => ({ ...p, location: e.target.value }))} className="input pl-9" />
        </div>
        <button onClick={() => setFilters({ type: '', capacity: '', location: '' })} className="btn-ghost text-xs">Clear</button>
      </div>

      {/* Table */}
      {resources?.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th><th>Type</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(r => (
                  <tr key={r.id}>
                    <td className="font-semibold text-white">{r.name}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        {typeIcons[r.type]} {typeLabel(r.type)}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users2 size={14} />{r.capacity}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin size={14} />{r.location}
                      </span>
                    </td>
                    <td>
                      <span className={r.status === 'ACTIVE' ? 'badge-green badge' : 'badge-red badge'}>
                        {r.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openBooking(r)}
                          disabled={r.status === 'OUT_OF_SERVICE'}
                          className={r.status === 'OUT_OF_SERVICE' ? 'btn-ghost opacity-40 cursor-not-allowed text-xs px-3 py-1.5' : 'btn-primary text-xs px-3 py-1.5'}
                        >
                          <BookOpen size={14} /> Book
                        </button>
                        <button onClick={() => handleEdit(r)} className="btn-secondary text-xs px-3 py-1.5">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="btn-danger text-xs px-3 py-1.5">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
            <div className="empty-state-icon">🏛️</div>
            <p className="text-slate-300 font-medium mb-1">No resources found</p>
            <p className="empty-state-text">Try adjusting your filters or add a new resource.</p>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="text-white font-bold text-lg">Book Resource</h3>
                <p className="text-gold-400 text-sm font-semibold mt-0.5">{selectedRes?.name}</p>
              </div>
              <button onClick={() => setShowBooking(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitBooking}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="form-label">Date</label>
                  <input type="date" name="date" required value={bookingData.date} onChange={handleBookingInput} className="input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      step="900"
                      value={bookingData.startTime}
                      onChange={handleBookingInput}
                      onFocus={openTimePicker}
                      onClick={openTimePicker}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      step="900"
                      min={bookingData.startTime || undefined}
                      value={bookingData.endTime}
                      onChange={handleBookingInput}
                      onFocus={openTimePicker}
                      onClick={openTimePicker}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Expected Attendees</label>
                  <input type="number" name="expectedAttendees" required min="1" max={selectedRes?.capacity}
                    value={bookingData.expectedAttendees} onChange={handleBookingInput}
                    placeholder={`Max: ${selectedRes?.capacity}`} className="input" />
                </div>
                <div>
                  <label className="form-label">Purpose of Booking</label>
                  <textarea name="purpose" required rows="3" value={bookingData.purpose} onChange={handleBookingInput}
                    placeholder="e.g. Group Study, Club Meeting..." className="input resize-none" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowBooking(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;