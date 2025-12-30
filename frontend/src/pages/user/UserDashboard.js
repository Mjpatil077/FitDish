import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FiUser, FiClock, FiBookmark, FiTrendingUp } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recommendedChefs, setRecommendedChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, chefsRes] = await Promise.all([
        axios.get('/api/bookings/my-bookings'),
        axios.get('/api/chefs')
      ]);
      
      const bookings = bookingsRes.data.bookings.filter(
        booking => booking.status === 'confirmed' && 
        new Date(booking.session?.scheduledAt) > new Date()
      ).slice(0, 3);
      
      setUpcomingBookings(bookings);
      setRecommendedChefs(chefsRes.data.chefs.slice(0, 3));
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
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-primary-800 mb-2">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-lg text-gray-600">
            Continue your healthy cooking journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 mb-1">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-primary-800">{upcomingBookings.length}</p>
              </div>
              <FiClock className="text-primary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-secondary-100 to-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-700 mb-1">Saved Recipes</p>
                <p className="text-3xl font-bold text-secondary-800">-</p>
              </div>
              <FiBookmark className="text-secondary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-700 mb-1">Chefs Explored</p>
                <p className="text-3xl font-bold text-accent-800">{recommendedChefs.length}</p>
              </div>
              <FiTrendingUp className="text-accent-600 text-4xl" />
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        {upcomingBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-primary-800">
                Upcoming Sessions
              </h2>
              <Link to="/bookings" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="card">
                  <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
                    {booking.session?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    with {booking.chef?.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FiClock className="mr-2" />
                    <span>{new Date(booking.session?.scheduledAt).toLocaleString()}</span>
                  </div>
                  <Link
                    to={`/bookings/${booking._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Chefs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              Recommended Chefs
            </h2>
            <Link to="/chefs" className="text-primary-600 hover:text-primary-700 font-medium">
              Explore All →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recommendedChefs.map((chef) => (
              <Link
                key={chef._id}
                to={`/chefs/${chef._id}`}
                className="card hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiUser className="text-primary-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-primary-800">
                      {chef.name}
                    </h3>
                    {chef.rating > 0 && (
                      <p className="text-sm text-gray-600">⭐ {chef.rating.toFixed(1)}</p>
                    )}
                  </div>
                </div>
                {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chef.cuisineSpecialties.slice(0, 2).map((cuisine, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link to="/recipes" className="card hover:scale-[1.02] transition-transform text-center">
            <FiBookmark className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              Browse Free Recipes
            </h3>
            <p className="text-gray-600">Discover healthy recipes from verified chefs</p>
          </Link>
          <Link to="/chefs" className="card hover:scale-[1.02] transition-transform text-center">
            <FiUser className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              Book a Session
            </h3>
            <p className="text-gray-600">Join live cooking sessions with expert chefs</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

