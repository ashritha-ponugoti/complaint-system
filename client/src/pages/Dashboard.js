import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';
import StatusBadge from '../components/shared/StatusBadge';

const CATEGORIES = ['Technical', 'Billing', 'Service', 'Product', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    priority: 'Medium',
  });

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/complaints', formData);
      toast.success('Complaint submitted successfully');
      setFormData({ title: '', description: '', category: 'Technical', priority: 'Medium' });
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit complaint';
      toast.error(message);
    } finally {
      setSubmitting(false);
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

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard-header">
          <h1>My Complaints</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Complaint'}
          </button>
        </div>

        {showForm && (
          <div className="card new-complaint-form">
            <h3>Submit a New Complaint</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  placeholder="Brief summary of the issue"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  maxLength={2000}
                  placeholder="Describe your issue in detail"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="card empty-state">
            <p>You haven't submitted any complaints yet.</p>
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

export default Dashboard;