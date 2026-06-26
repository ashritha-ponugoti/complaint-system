import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';
import StatusBadge from '../components/shared/StatusBadge';

const AgentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/complaints${params}`);
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'Open').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Agent Dashboard</h1>

        <div className="stats-grid">
          <div className="card stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Assigned to Me</span>
          </div>
          <div className="card stat-card">
            <span className="stat-number">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="card stat-card">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="card stat-card">
            <span className="stat-number">{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
        </div>

        <div className="dashboard-header">
          <h2>My Assigned Complaints</h2>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <Loader fullScreen />
        ) : complaints.length === 0 ? (
          <div className="card empty-state">
            <p>No complaints assigned to you yet.</p>
          </div>
        ) : (
          <div className="complaint-list">
            {complaints.map((c) => (
              <Link to={`/complaints/${c._id}`} key={c._id} className="card complaint-item">
                <div className="complaint-item-header">
                  <h3>{c.title}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p className="complaint-item-desc">{c.description}</p>
                <div className="complaint-item-meta">
                  <span>{c.category}</span>
                  <span>{c.priority} priority</span>
                  <span>By: {c.user?.name}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AgentDashboard;