import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDollarSign, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const ChefEarnings = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedBookings: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get('/api/bookings/my-bookings');
      const allBookings = res.data.bookings || [];
      
      const completed = allBookings.filter(b => b.paymentStatus === 'completed');
      const pending = allBookings.filter(b => b.paymentStatus === 'pending');
      
      const totalEarnings = completed.reduce((sum, b) => sum + b.amount, 0);
      const pendingPayments = pending.reduce((sum, b) => sum + b.amount, 0);

      setStats({
        totalEarnings,
        completedBookings: completed.length,
        pendingPayments
      });

      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading earnings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          Earnings Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-800">₹{stats.totalEarnings}</p>
              </div>
              <FiDollarSign className="text-green-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 mb-1">Completed Bookings</p>
                <p className="text-3xl font-bold text-primary-800">{stats.completedBookings}</p>
              </div>
              <FiCheckCircle className="text-primary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-700 mb-1">Pending Payments</p>
                <p className="text-3xl font-bold text-accent-800">₹{stats.pendingPayments}</p>
              </div>
              <FiCalendar className="text-accent-600 text-4xl" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div>
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">
            Booking History
          </h2>
          {bookings.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-display font-semibold text-primary-800 mb-1">
                        {booking.session?.title || 'Session'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-700">
                        ₹{booking.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefEarnings;

