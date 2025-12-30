import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiCheckCircle, FiXCircle, FiUser } from 'react-icons/fi';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings/my-bookings');
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { color: 'bg-green-100 text-green-700', icon: FiCheckCircle, text: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: FiClock, text: 'Pending' },
      completed: { color: 'bg-blue-100 text-blue-700', icon: FiCheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: FiXCircle, text: 'Cancelled' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
        <Icon className="mr-1" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="card text-center py-12">
            <FiUser className="text-primary-600 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              No bookings yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring chefs and book your first cooking session!
            </p>
            <Link to="/chefs" className="btn btn-primary">
              Explore Chefs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {booking.chef?.avatar ? (
                          <img src={booking.chef.avatar} alt={booking.chef.name} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                          <FiUser className="text-primary-600 text-2xl" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-semibold text-primary-800 mb-1">
                          {booking.session?.title || 'Session'}
                        </h3>
                        <p className="text-gray-600 mb-2">with {booking.chef?.name}</p>
                        {booking.session?.scheduledAt && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-2" />
                            <span>{new Date(booking.session.scheduledAt).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(booking.status)}
                      <span className="text-lg font-semibold text-primary-700">
                        ₹{booking.amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="btn btn-outline text-sm"
                    >
                      View Details
                    </Link>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to cancel this booking?')) {
                            try {
                              await axios.put(`/api/bookings/${booking._id}/cancel`);
                              fetchBookings();
                            } catch (error) {
                              alert('Error cancelling booking');
                            }
                          }
                        }}
                        className="btn btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;

