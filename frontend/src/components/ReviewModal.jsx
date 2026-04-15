import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, gameService } from '../api';
import './ReviewModal.css';

const ReviewModal = ({ game, onClose, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('review-modal-overlay')) {
      onClose();
    }
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter a comment.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await gameService.submitReview(game._id, { rating, comment });
      
      // Clear form
      setRating(0);
      setComment('');
      
      // Notify parent to refresh data
      if (onReviewAdded) onReviewAdded();
      
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      setLoading(true);
      setError(null);
      await gameService.deleteReview(game._id);
      
      // Notify parent to refresh data
      if (onReviewAdded) onReviewAdded();
      
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const hasAlreadyReviewed = isAuthenticated && game.reviews?.find(
    (r) => String(r.user) === String(currentUser?._id)
  );

  return (
    <AnimatePresence>
      <motion.div
        className="review-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <motion.div
          className="review-modal-content"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="review-modal-header">
            <h2>{game.title} - Reviews</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>

          <div className="review-modal-body">
            {/* Add Review Section */}
            {isAuthenticated ? (
              hasAlreadyReviewed ? (
                <div className="must-login-msg">
                  You have already reviewed this game.
                </div>
              ) : (
                <div className="add-review-section">
                  <h3>Write a Review</h3>
                  {error && <div className="must-login-msg">{error}</div>}
                  
                  <div className="rating-input">
                    <span>Rating: </span>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= (hoverRating || rating) ? 'active' : ''}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <textarea
                    className="review-textarea"
                    placeholder="What did you think about this game?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button
                    className="submit-review-btn"
                    onClick={handleReviewSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )
            ) : (
              <div className="must-login-msg">
                Please log in to leave a review.
              </div>
            )}

            {/* List Reviews */}
            <div className="reviews-list">
              <h3>User Reviews ({game.numReviews || 0})</h3>
              {game.reviews && game.reviews.length > 0 ? (
                game.reviews.map((review, idx) => (
                  <div key={idx} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{review.name}</span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="review-date">
                          {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        {isAuthenticated && String(review.user) === String(currentUser?._id) && (
                          <button 
                            onClick={handleDeleteReview}
                            disabled={loading}
                            style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', fontSize: '0.8rem', padding: 0, textDecoration: 'underline' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="review-stars">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  No reviews yet. Be the first to review!
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
