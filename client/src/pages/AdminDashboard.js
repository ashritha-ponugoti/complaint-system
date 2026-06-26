import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';
import StatusBadge from '../components/shared/StatusBadge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      toast.error('Failed to load stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const params = userRoleFilter ? `?role=${userRoleFilter}` : '';
      const res = await api.get(`/admin/users${params}`);
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error('Failed to load complaints');
    }
  };

  const loadTabData = async (tab) => {
    setLoading(true);
    if (tab === 'stats') await fetchStats();
    if (tab === 'users') await fetchUsers();
    if (tab === 'complaints') await fetchComplaints();
    setLoading(false);
  };

  useEffect(() => {
    loadTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRoleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/status`);
      toast.success('Status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'stats' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'complaints' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            All Complaints
          </button>
        </div>

        {loading ? (
          <Loader fullScreen />
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <div className="admin-stats">
                <div className="stats-grid">
                  <div className="card stat-card">
                    <span className="stat-number">{stats.totalUsers}</span>
                    <span className="stat-label">Total Users</span>
                  </div>
                  <div className="card stat-card">
                    <span className="stat-number">{stats.totalAgents}</span>
                    <span className="stat-label">Total Agents</span>
                  </div>
                  <div className="card stat-card">
                    <span className="stat-number">{stats.totalComplaints}</span>
                    <span className="stat-label">Total Complaints</span>
                  </div>
                  <div className="card stat-card">
                    <span className="stat-number">{stats.avgRating}</span>
                    <span className="stat-label">Avg Rating</span>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="card stat-card stat-card-warning">
                    <span className="stat-number">{stats.openComplaints}</span>
                    <span className="stat-label">Open</span>
                  </div>
                  <div className="card stat-card stat-card-info">
                    <span className="stat-number">{stats.inProgressComplaints}</span>
                    <span className="stat-label">In Progress</span>
                  </div>
                  <div className="card stat-card stat-card-success">
                    <span className="stat-number">{stats.resolvedComplaints}</span>
                    <span className="stat-label">Resolved</span>
                  </div>
                </div>

                <div className="card category-breakdown">
                  <h3>Complaints by Category</h3>
                  {stats.categoryStats?.map((cat, idx) => (
                    <div key={cat._id || idx} className="category-row">
                      <span>{cat._id || 'Uncategorized'}</span>
                      <span className="category-count">{cat.count ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="admin-users">
                <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="USER">Users</option>
                  <option value="AGENT">Agents</option>
                  <option value="ADMIN">Admins</option>
                </select>

                <div className="card user-table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            >
                              <option value="USER">USER</option>
                              <option value="AGENT">AGENT</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td>
                            <span className={u.isActive ? 'badge badge-resolved' : 'badge badge-rejected'}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleToggleStatus(u._id)}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'complaints' && (
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
                      <span>By: {c.user?.name}</span>
                      <span>
                        Agent: {c.assignedAgent ? c.assignedAgent.name : 'Unassigned'}
                      </span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;