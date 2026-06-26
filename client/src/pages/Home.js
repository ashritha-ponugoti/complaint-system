import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';

const Home = () => {
  const { user } = useAuth();

  const dashboardLink =
    user?.role === 'ADMIN' ? '/admin' : user?.role === 'AGENT' ? '/agent' : '/dashboard';

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="home-hero">
          <h1>Online Complaint Registration & Management</h1>
          <p>
            A centralized platform to submit, track, and resolve complaints quickly and
            transparently. Get real-time updates and connect directly with the agent
            handling your case.
          </p>

          {user ? (
            <Link to={dashboardLink} className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <div className="home-cta">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="home-features">
          <div className="card">
            <h3>Submit Complaints</h3>
            <p>Register your issue in seconds with category and priority tagging.</p>
          </div>
          <div className="card">
            <h3>Track Progress</h3>
            <p>Follow your complaint's status in real time, from Open to Resolved.</p>
          </div>
          <div className="card">
            <h3>Direct Communication</h3>
            <p>Chat directly with the agent assigned to your complaint.</p>
          </div>
          <div className="card">
            <h3>Share Feedback</h3>
            <p>Rate your resolution experience to help us improve.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;