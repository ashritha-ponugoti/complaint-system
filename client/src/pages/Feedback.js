import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/shared/Navbar';
import Loader from '../components/shared/Loader';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const complaintRes = await api.get(`/complaints/${id}`);
        setComplaint(complaintRes.data.complaint);

        try {
          const feedbackRes = await api.get(`/feedback/${id}`);
          setExistingFeedback(feedbackRes.data.feedback);
        } catch (err) {
          // No feedback yet, which is expected for most cases
        }
      } catch (err) {
        toast.error('Failed to load complaint');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/feedback', { complaintId: id, rating, comment });
      toast.success('Thank you for your feedback!');
      navigate(`/complaints/${id}`);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit feedback';
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

  if (existingFeedback) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="card feedback-page">
            <h2>Feedback Already Submitted</h2>
            <p>You rated this complaint resolution {existingFeedback.rating} out of 5 stars.</p>
            <p className="feedback-existing-comment">"{existingFeedback.comment}"</p>
            <button className="btn btn-secondary" onClick={() => navigate(`/complaints/${id}`)}>
              Back to Complaint
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card feedback-page">
          <h2>Rate Your Experience</h2>
          <p className="feedback-complaint-title">{complaint?.title}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>How satisfied were you with the resolution?</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star ${
                      star <= (hoverRating || rating) ? 'star-filled' : ''
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comments (optional)</label>
              <textarea
                id="comment"
                rows={4}
                maxLength={500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience..."
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Feedback;