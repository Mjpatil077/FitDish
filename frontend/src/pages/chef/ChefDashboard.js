import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiDollarSign, FiCalendar, FiUsers, FiTrendingUp, FiPlus } from 'react-icons/fi';

const ChefDashboard = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    upcomingSessions: 0,
    totalBookings: 0,
    averageRating: 0
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, bookingsRes] = await Promise.all([
        axios.get('/api/sessions/chef/my-sessions'),
        axios.get('/api/bookings/my-bookings')
      ]);

      const sessions = sessionsRes.data.sessions;
      const bookings = bookingsRes.data.bookings || [];

      const upcoming = sessions.filter(
        s => s.isActive && new Date(s.scheduledAt) > new Date()
      );

      const totalEarnings = bookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + b.amount, 0);

      setStats({
        totalEarnings,
        upcomingSessions: upcoming.length,
        totalBookings: bookings.length,
        averageRating: 0 // Would calculate from reviews
      });

      setUpcomingSessions(upcoming.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-primary-800 mb-2">
              Chef Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage your sessions and track your performance
            </p>
          </div>
          <Link to="/chef/sessions/create" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Create Session
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm text-primary-700 mb-1">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-primary-800">{stats.upcomingSessions}</p>
              </div>
              <FiCalendar className="text-primary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-700 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-accent-800">{stats.totalBookings}</p>
              </div>
              <FiUsers className="text-accent-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-secondary-100 to-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-700 mb-1">Avg Rating</p>
                <p className="text-3xl font-bold text-secondary-800">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
                </p>
              </div>
              <FiTrendingUp className="text-secondary-600 text-4xl" />
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              Upcoming Sessions
            </h2>
            <Link to="/chef/sessions" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No upcoming sessions</p>
              <Link to="/chef/sessions/create" className="btn btn-primary">
                Create Your First Session
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <div key={session._id} className="card">
                  <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {session.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" />
                      <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      <span>{session.currentParticipants}/{session.maxParticipants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-700">
                      ₹{session.price}
                    </span>
                    <Link
                      to={`/chef/sessions/${session._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/chef/sessions/create" className="card hover:scale-[1.02] transition-transform text-center">
            <FiPlus className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              Create New Session
            </h3>
            <p className="text-gray-600">Schedule a new cooking session</p>
          </Link>
          <Link to="/chef/profile" className="card hover:scale-[1.02] transition-transform text-center">
            <FiUsers className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              Manage Profile
            </h3>
            <p className="text-gray-600">Update your chef profile and specialties</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;

