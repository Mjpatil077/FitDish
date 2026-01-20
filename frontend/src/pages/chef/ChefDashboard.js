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
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
          <div className="card bg-white border border-gray-100 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-2xl">
                <FiDollarSign className="text-green-600 text-2xl" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% vs last month</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
            <p className="text-3xl font-display font-bold text-gray-800">₹{stats.totalEarnings}</p>
          </div>

          <div className="card bg-white border border-gray-100 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-50 rounded-2xl">
                <FiCalendar className="text-primary-600 text-2xl" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Upcoming Sessions</p>
            <p className="text-3xl font-display font-bold text-gray-800">{stats.upcomingSessions}</p>
          </div>

          <div className="card bg-primary-900 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-700 rounded-full blur-2xl opacity-30 -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-700 rounded-2xl">
                  <FiTrendingUp className="text-white text-2xl" />
                </div>
              </div>
              <p className="text-sm text-primary-200 mb-1">Fitness Reach</p>
              <p className="text-3xl font-display font-bold">4.2k</p>
              <p className="text-[10px] text-primary-300 mt-2 font-bold uppercase tracking-widest">Growing in High Protein Category</p>
            </div>
          </div>

          <div className="card bg-white border border-gray-100 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent-50 rounded-2xl">
                <FiUsers className="text-accent-600 text-2xl" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="text-3xl font-display font-bold text-gray-800">{stats.totalBookings}</p>
          </div>
        </div>

        {/* Fitness Content Performance (NEW Placeholder) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              Fitness Content Performance
            </h2>
            <button className="text-sm font-bold text-primary-600">Download Report</button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Muscle Gain Tutorials', views: '1.2k', conversion: '15%', color: 'bg-primary-500' },
              { label: 'Weight Loss Sessions', views: '850', conversion: '12%', color: 'bg-secondary-500' },
              { label: 'Keto Recipes', views: '2.4k', conversion: '20%', color: 'bg-accent-500' }
            ].map((perf, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">{perf.label}</h3>
                  <div className={`w-2 h-2 rounded-full ${perf.color}`}></div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{perf.views}</p>
                    <p className="text-xs text-gray-400">Total Views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{perf.conversion}</p>
                    <p className="text-xs text-gray-400">Enrollment Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Sessions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              Session Management
            </h2>
            <Link to="/chef/sessions" className="text-primary-600 hover:text-primary-700 font-medium font-bold text-sm uppercase tracking-widest">
              Manager View →
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="card text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200">
              <FiCalendar className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-600 mb-6 font-medium">Ready to share your fitness expertise?</p>
              <Link to="/chef/sessions/create" className="btn btn-primary px-8">
                Create First Fitness Session
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => (
                <div key={session._id} className="card shadow-soft hover:shadow-lg transition-all border border-gray-100 group">
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-4 block">ACTIVE SESSION</span>
                  <h3 className="text-xl font-display font-bold mb-3 text-primary-800 group-hover:text-primary-600 transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                    {session.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-6 uppercase">
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 text-primary-500" />
                      <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-1 text-primary-500" />
                      <span>{session.currentParticipants}/{session.maxParticipants} students</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-2xl font-display font-bold text-gray-800">
                      ₹{session.price}
                    </span>
                    <Link
                      to={`/chef/sessions/${session._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Analyze
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

