import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';
import StatusBadge from '../components/shared/StatusBadge';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed', 'Rejected'];

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFeedback, setHasFeedback] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [assigning, setAssigning] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchComplaint = async () => {
    try {
      const res = await api.get(`/complaints/${id}`);
      setComplaint(res.data.complaint);

      try {
        await api.get(`/feedback/${id}`);
        setHasFeedback(true);
      } catch (err) {
        setHasFeedback(false);
      }
    } catch (err) {
      toast.error('Failed to load complaint');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('/admin/users?role=AGENT');
      setAgents(res.data.users);
    } catch (err) {
      // Non-critical: only needed for admin assign dropdown
    }
  };

  useEffect(() => {
    fetchComplaint();
    if (user?.role === 'ADMIN') {
      fetchAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [complaint?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const res = await api.post(`/complaints/${id}/messages`, { message: newMessage });
      setComplaint({ ...complaint, messages: res.data.messages });
      setNewMessage('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/complaints/${id}/status`, { status: newStatus });
      setComplaint(res.data.complaint);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignAgent = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setAssigning(true);
    try {
      const res = await api.put(`/complaints/${id}/assign`, { agentId: selectedAgent });
      setComplaint(res.data.complaint);
      toast.success('Agent assigned successfully');
    } catch (err) {
      toast.error('Failed to assign agent');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen />
      </>
    );
  }

  if (!complaint) return null;

  const canManage = user?.role === 'ADMIN' || user?.role === 'AGENT';
  const canGiveFeedback = user?.role === 'USER' && complaint.status === 'Resolved';
  const showFeedbackSection = canGiveFeedback;

  return (
    <>
      <Navbar />
      <div className="container">
        <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="card complaint-detail-header">
          <div className="complaint-detail-title">
            <h1>{complaint.title}</h1>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="complaint-detail-desc">{complaint.description}</p>
          <div className="complaint-detail-meta">
            <span><strong>Category:</strong> {complaint.category}</span>
            <span><strong>Priority:</strong> {complaint.priority}</span>
            <span><strong>Submitted by:</strong> {complaint.user?.name}</span>
            {complaint.assignedAgent && (
              <span><strong>Agent:</strong> {complaint.assignedAgent.name}</span>
            )}
            <span><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {canManage && (
          <div className="card management-panel">
            <h3>Manage Complaint</h3>

            <div className="form-group">
              <label htmlFor="status">Update Status</label>
              <select
                id="status"
                value={complaint.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {user?.role === 'ADMIN' && (
              <form onSubmit={handleAssignAgent} className="assign-agent-form">
                <div className="form-group">
                  <label htmlFor="agent">Assign Agent</label>
                  <select
                    id="agent"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="">Select an agent...</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({a.email})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={assigning || !selectedAgent}>
                  {assigning ? 'Assigning...' : 'Assign'}
                </button>
              </form>
            )}
          </div>
        )}

        {showFeedbackSection && (
          <div className="card feedback-prompt">
            {hasFeedback ? (
              <>
                <p>You've already shared feedback on this resolution.</p>
                <Link to={`/complaints/${id}/feedback`} className="btn btn-secondary">
                  View Feedback
                </Link>
              </>
            ) : (
              <>
                <p>This complaint has been resolved. How was your experience?</p>
                <Link to={`/complaints/${id}/feedback`} className="btn btn-primary">
                  Leave Feedback
                </Link>
              </>
            )}
          </div>
        )}

        <div className="card chat-section">
          <h3>Conversation</h3>
          <div className="chat-messages">
            {complaint.messages && complaint.messages.length > 0 ? (
              complaint.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    msg.senderRole === 'USER' ? 'chat-message-user' : 'chat-message-agent'
                  }`}
                >
                  <div className="chat-message-header">
                    <strong>{msg.senderName}</strong>
                    <span className="chat-message-role">{msg.senderRole}</span>
                  </div>
                  <p>{msg.message}</p>
                  <span className="chat-message-time">
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="chat-empty">No messages yet. Start the conversation below.</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sendingMessage}
            />
            <button type="submit" className="btn btn-primary" disabled={sendingMessage || !newMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ComplaintDetails;