import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiUser, FiCheckCircle } from 'react-icons/fi';

const BookSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const res = await axios.get(`/api/sessions/${sessionId}`);
      setSession(res.data.session);
    } catch (error) {
      console.error('Error fetching session:', error);
      setError('Session not found');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!window.confirm(`Confirm booking for ₹${session.price}?`)) {
      return;
    }

    setBooking(true);
    setError('');

    try {
      await axios.post('/api/bookings', { sessionId: session._id });
      navigate('/bookings');
    } catch (error) {
      setError(error.response?.data?.message || 'Error booking session');
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading session details...</div>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom max-w-3xl">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          Book Session
        </h1>

        <div className="card mb-6">
          <h2 className="text-3xl font-display font-bold text-primary-800 mb-4">
            {session.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {session.description}
          </p>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FiUser className="mr-2" />
              <span>{session.chef?.name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiClock className="mr-2" />
              <span>{new Date(session.scheduledAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiUsers className="mr-2" />
              <span>{session.currentParticipants}/{session.maxParticipants}</span>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-display font-semibold mb-4 text-primary-800">
              Session Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Cuisine:</strong> {session.cuisine}</p>
              <p><strong>Type:</strong> {session.sessionType === 'one-on-one' ? '1-on-1' : 'Group'}</p>
              <p><strong>Duration:</strong> {session.duration} minutes</p>
            </div>
          </div>

          {session.ingredients && session.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-display font-semibold mb-4 text-primary-800">
                Ingredients You'll Need
              </h3>
              <ul className="space-y-2">
                {session.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FiCheckCircle className="text-primary-600 mr-2" />
                    <span>{ing.name} - {ing.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-4xl font-bold text-primary-700">₹{session.price}</p>
            </div>
            <button
              onClick={handleBooking}
              disabled={booking || session.currentParticipants >= session.maxParticipants}
              className="btn btn-primary text-lg px-8"
            >
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>

          {session.currentParticipants >= session.maxParticipants && (
            <p className="mt-4 text-red-600 text-center">
              This session is full
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSession;

