import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Plus, X, Send, Image, ChevronRight, AlertTriangle } from 'lucide-react';

const PRIORITY_BADGE = {
  CRITICAL: 'badge-red',
  HIGH: 'badge-red',
  MEDIUM: 'badge-yellow',
  LOW: 'badge-blue',
};

const STATUS_BADGE = {
  OPEN: 'badge-blue',
  IN_PROGRESS: 'badge-yellow',
  RESOLVED: 'badge-green',
  CLOSED: 'badge-gray',
  REJECTED: 'badge-red',
};

const Tickets = () => {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [resources, setResources] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketData, setTicketData] = useState({ resourceId: '', category: 'HARDWARE', priority: 'MEDIUM', description: '', preferredContactDetails: '' });
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [updateStatusData, setUpdateStatusData] = useState({ status: '', resolutionNotes: '', rejectionReason: '' });

  useEffect(() => { fetchTickets(); fetchResources(); }, []);

  const fetchTickets = async () => {
    try { const r = await api.get('/tickets'); setTickets(r.data.data || r.data); }
    catch (e) { console.error(e); }
  };
  const fetchResources = async () => {
    try { const r = await api.get('/resources'); setResources(r.data.data || r.data); }
    catch (e) { console.error(e); }
  };
  const fetchComments = async (id) => {
    try { const r = await api.get(`/tickets/${id}/comments`); setComments(r.data.data || r.data); }
    catch (e) { console.error(e); }
  };

  const handleFileChange = (e) => {
    const sel = Array.from(e.target.files);
    if (sel.length > 3) { toast.warning('Maximum 3 images allowed.'); e.target.value = ''; setFiles([]); }
    else setFiles(sel);
  };

  const submitTicket = async (e) => {
    e.preventDefault();
    if (!ticketData.resourceId) {
      toast.warning('Please select a resource.');
      return;
    }
    try {
      const payload = { ...ticketData, resourceId: parseInt(ticketData.resourceId) };
      const res = await api.post('/tickets', payload);
      const newId = res.data.data.id;
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach(f => fd.append('files', f));
        await api.post(`/tickets/${newId}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success('Ticket created successfully.');
      setShowCreateModal(false);
      setTicketData({ resourceId: '', category: 'HARDWARE', priority: 'MEDIUM', description: '', preferredContactDetails: '' });
      setFiles([]);
      fetchTickets();
    } catch { toast.error('Failed to create ticket.'); }
  };

  const openDetails = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateStatusData({ status: ticket.status, resolutionNotes: ticket.resolutionNotes || '', rejectionReason: ticket.rejectionReason || '' });
    fetchComments(ticket.id);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/tickets/${selectedTicket.id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments(selectedTicket.id);
    } catch { toast.error('Failed to add comment.'); }
  };

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/tickets/${selectedTicket.id}/status`, updateStatusData);
      fetchTickets();
      setSelectedTicket(prev => ({ ...prev, ...updateStatusData }));
      toast.success('Ticket status updated.');
    } catch { toast.error('Failed to update status.'); }
  };

  const getImageUrl = (url) => url ? `http://localhost:8080${url}` : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Incident Tickets</h1>
          <p className="page-subtitle">Report campus faults, damage & technical issues</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus size={16} /> Report Incident
        </button>
      </div>

      {/* Table */}
      {tickets.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#ID</th><th>Resource</th><th>Category</th><th>Priority</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id}>
                    <td className="text-slate-500 font-mono text-xs">#{t.id}</td>
                    <td className="font-semibold text-white">{t.resourceName}</td>
                    <td className="text-slate-400">{t.category}</td>
                    <td><span className={`badge ${PRIORITY_BADGE[t.priority] || 'badge-gray'}`}>{t.priority}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[t.status] || 'badge-gray'}`}>{t.status}</span></td>
                    <td>
                      <button onClick={() => openDetails(t)} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                        View <ChevronRight size={14} />
                      </button>
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
            <div className="empty-state-icon">🎫</div>
            <p className="text-slate-300 font-medium mb-1">No tickets found</p>
            <p className="empty-state-text">No incidents have been reported yet.</p>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="text-white font-bold text-lg">Report New Incident</h3>
                <p className="text-slate-400 text-sm mt-0.5">Fill in the details of the issue</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submitTicket}>
              <div className="modal-body space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Resource / Location *</label>
                    <select name="resourceId" required value={ticketData.resourceId} onChange={e => setTicketData(p => ({ ...p, resourceId: e.target.value }))} className="select">
                      <option value="">-- Select Resource --</option>
                      {resources.map(r => <option key={r.id} value={r.id}>{r.name} ({r.location})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Category *</label>
                    <select name="category" value={ticketData.category} onChange={e => setTicketData(p => ({ ...p, category: e.target.value }))} className="select">
                      <option value="HARDWARE">Hardware</option>
                      <option value="SOFTWARE">Software</option>
                      <option value="NETWORK">Network</option>
                      <option value="FACILITY">Facility</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Priority *</label>
                    <select name="priority" value={ticketData.priority} onChange={e => setTicketData(p => ({ ...p, priority: e.target.value }))} className="select">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Contact Phone/Email *</label>
                    <input type="text" required value={ticketData.preferredContactDetails} onChange={e => setTicketData(p => ({ ...p, preferredContactDetails: e.target.value }))} className="input" placeholder="How can we reach you?" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Description of Issue *</label>
                  <textarea rows="4" required value={ticketData.description} onChange={e => setTicketData(p => ({ ...p, description: e.target.value }))} className="input resize-none" placeholder="Describe the problem in detail..." />
                </div>
                <div>
                  <label className="form-label flex items-center gap-2"><Image size={14} /> Attach Images (Max 3)</label>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gold-500/15 file:text-gold-400 hover:file:bg-gold-500/25 cursor-pointer" />
                  <p className="text-slate-500 text-xs mt-1">Provide screenshots or photos of the issue.</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-box max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* LEFT — Ticket Info */}
            <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-surface-border overflow-y-auto">
              <div className="modal-header flex-shrink-0">
                <div>
                  <p className="text-slate-500 text-xs font-mono">Ticket #{selectedTicket.id}</p>
                  <h3 className="text-white font-bold text-lg">{selectedTicket.resourceName}</h3>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div className="flex gap-2 flex-wrap">
                  <span className={`badge ${PRIORITY_BADGE[selectedTicket.priority] || 'badge-gray'}`}>{selectedTicket.priority}</span>
                  <span className={`badge ${STATUS_BADGE[selectedTicket.status] || 'badge-gray'}`}>{selectedTicket.status}</span>
                  <span className="badge badge-blue">{selectedTicket.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="card p-3">
                    <p className="text-slate-500 text-xs mb-1">Submitted By</p>
                    <p className="text-white font-medium truncate">{selectedTicket.submittedBy}</p>
                  </div>
                  <div className="card p-3">
                    <p className="text-slate-500 text-xs mb-1">Contact</p>
                    <p className="text-white font-medium truncate">{selectedTicket.preferredContactDetails}</p>
                  </div>
                </div>

                <div className="card p-4">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Description</p>
                  <p className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* Images */}
                {(selectedTicket.imageUrl1 || selectedTicket.imageUrl2 || selectedTicket.imageUrl3) && (
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Attachments</p>
                    <div className="flex gap-2">
                      {[selectedTicket.imageUrl1, selectedTicket.imageUrl2, selectedTicket.imageUrl3].filter(Boolean).map((url, i) => (
                        <img key={i} src={getImageUrl(url)} alt={`Attachment ${i + 1}`} className="h-20 w-20 object-cover rounded-lg border border-surface-border" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="card p-4">
                  <p className="text-white font-semibold text-sm mb-3">Update Status</p>
                  <select value={updateStatusData.status} onChange={e => setUpdateStatusData(p => ({ ...p, status: e.target.value }))} className="select mb-3">
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                  {updateStatusData.status === 'RESOLVED' && (
                    <input type="text" placeholder="Resolution notes..." value={updateStatusData.resolutionNotes} onChange={e => setUpdateStatusData(p => ({ ...p, resolutionNotes: e.target.value }))} className="input mb-3" />
                  )}
                  {updateStatusData.status === 'REJECTED' && (
                    <input type="text" placeholder="Rejection reason..." value={updateStatusData.rejectionReason} onChange={e => setUpdateStatusData(p => ({ ...p, rejectionReason: e.target.value }))} className="input mb-3" />
                  )}
                  <button onClick={handleStatusUpdate} className="btn-success w-full justify-center">Apply Update</button>
                </div>
              </div>
            </div>

            {/* RIGHT — Comments */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="p-6 border-b border-surface-border flex-shrink-0">
                <h4 className="text-white font-bold">Comments</h4>
                <p className="text-slate-500 text-xs mt-0.5">{comments.length} message{comments.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {comments.length > 0 ? comments.map(c => (
                  <div key={c.id} className="card p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-gold-400 text-xs font-semibold">{c.authorName}</span>
                      <span className="text-slate-600 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{c.content}</p>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-slate-500 text-sm">No comments yet.</p>
                    <p className="text-slate-600 text-xs mt-1">Start the conversation below.</p>
                  </div>
                )}
              </div>
              <form onSubmit={submitComment} className="p-4 border-t border-surface-border flex gap-2 flex-shrink-0">
                <input type="text" required value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Type a comment..." className="input flex-1" />
                <button type="submit" className="btn-primary px-4"><Send size={16} /></button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;