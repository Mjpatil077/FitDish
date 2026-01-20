import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiBookmark, FiTrendingUp, FiCheckCircle, FiAward, FiStar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recommendedChefs, setRecommendedChefs] = useState([]);
  const [recommendedCategories, setRecommendedCategories] = useState([]);
  const [fitnessVideos, setFitnessVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [bookingsRes, chefsRes, categoriesRes, videosRes] = await Promise.all([
        axios.get('/api/bookings/my-bookings'),
        axios.get('/api/chefs'),
        axios.get('/api/categories'),
        axios.get('/api/videos?category=fitness-foods')
      ]);
      
      const bookings = (bookingsRes.data.bookings || []).filter(
        booking => booking.status === 'confirmed' && 
        new Date(booking.session?.scheduledAt) > new Date()
      ).slice(0, 3);
      
      setUpcomingBookings(bookings);
      setRecommendedChefs(chefsRes.data.chefs?.slice(0, 3) || []);

      // Personalization logic based on user goals
      if (user?.fitnessGoals?.length > 0) {
        const goalSlugs = user.fitnessGoals.map(g => g.toLowerCase().replace(/\s+/g, '-'));
        const matchedCats = categoriesRes.data.categories?.filter(c => 
          goalSlugs.some(gs => c.slug.includes(gs)) || c.type === 'Fitness'
        ) || [];
        setRecommendedCategories(matchedCats.slice(0, 4));
      } else {
        setRecommendedCategories(categoriesRes.data.categories?.filter(c => c.type === 'Fitness').slice(0, 4) || []);
      }

      setFitnessVideos(videosRes.data.videos?.slice(0, 3) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg py-20 font-display">Loading your fitness journey...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-3">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-lg text-gray-600">
              {user?.fitnessGoals?.length > 0 
                ? `Focusing on: ${user.fitnessGoals.join(' • ')}` 
                : 'Ready to start your fitness journey?'}
            </p>
          </div>
          <Link to="/profile" className="btn btn-outline btn-sm shadow-soft">Update Fitness Profile</Link>
        </div>

        {/* Goal-Based Recommendations */}
        <section className="mb-12">
          <div className="bg-primary-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700 rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center">
                  <FiTrendingUp className="mr-4 text-secondary-400" />
                  Tailored for Your Goals
                </h2>
                <span className="hidden md:block text-xs font-bold text-primary-300 uppercase tracking-widest border border-primary-700 px-3 py-1 rounded-full">AI Recommendations</span>
              </div>

              {recommendedCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedCategories.map((cat) => (
                    <Link 
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-all group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-4 shadow-lg">
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-secondary-300 transition-colors">{cat.name}</h3>
                      <p className="text-xs text-primary-200 line-clamp-2 leading-relaxed opacity-80">{cat.description}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-primary-200">
                  Explore all categories to personalize your feed!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Post-Workout / Quick Meals */}
        {fitnessVideos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-primary-800">
                Fitness Fuel Tutorials
              </h2>
              <Link to="/category/fitness-foods" className="text-primary-600 hover:text-primary-700 font-bold text-sm uppercase tracking-widest">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {fitnessVideos.map((video) => (
                <Link key={video._id} to={`/videos/${video._id}`} className="group card-hover">
                  <div className="aspect-video bg-gray-200 rounded-2xl mb-5 overflow-hidden relative shadow-lg">
                    <img src={video.thumbnail || 'https://source.unsplash.com/featured/?cooking'} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-bold flex items-center">
                        <FiClock className="mr-1" /> {video.duration || 15} MIN
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-primary-800 text-lg line-clamp-1 mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{video.title}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-[10px] font-black uppercase tracking-widest">{video.caloriesEstimate || 350} CAL</span>
                    <span className="text-xs text-gray-400 font-medium">Verified Nutrition</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex items-center space-x-6">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
              <FiClock className="text-primary-600 text-2xl" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-gray-800">{upcomingBookings.length}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Upcoming Sessions</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex items-center space-x-6">
            <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center">
              <FiBookmark className="text-secondary-600 text-2xl" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-gray-800">14</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Saved Recipes</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex items-center space-x-6">
            <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center">
              <FiAward className="text-accent-600 text-2xl" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-gray-800">{recommendedChefs.length}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Experts Followed</p>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        {upcomingBookings.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-primary-800">
                Next Live Training
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingBookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 hover:shadow-lg transition-all border-l-4 border-l-primary-500">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-display font-bold text-primary-800 mb-1">{booking.session?.title}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase">with Chef {booking.chef?.name || 'Expert'}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shadow-inner">
                      <img src={booking.chef?.avatar || 'https://source.unsplash.com/featured/?chef'} className="w-full h-full object-cover" alt={booking.chef?.name || 'Chef'} />
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="mr-3 text-primary-500" />
                      <span className="font-medium">{new Date(booking.session?.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center text-xs text-primary-600 font-bold">
                      <FiCheckCircle className="mr-3" />
                      Booking Confirmed
                    </div>
                  </div>
                  <Link to={`/bookings/${booking._id}`} className="btn btn-primary btn-sm w-full block text-center rounded-xl">
                    Prepare My Kitchen
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fitness Expert Chefs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-primary-800">
              Elite Fitness Chefs
            </h2>
            <Link to="/chefs" className="text-primary-600 hover:text-primary-700 font-bold text-sm uppercase tracking-widest">
              Explore All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendedChefs.map((chef) => (
              <Link
                key={chef._id}
                to={`/chefs/${chef._id}`}
                className="group text-center"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-5 rounded-full overflow-hidden border-4 border-white shadow-soft group-hover:border-primary-500 transition-all duration-300">
                  <img src={chef.avatar || 'https://source.unsplash.com/featured/?chef,face'} alt={chef.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h3 className="font-display font-bold text-gray-800 group-hover:text-primary-600 transition-colors text-lg">
                  {chef.name}
                </h3>
                <div className="flex items-center justify-center mt-2 mb-4">
                  <FiStar className="text-yellow-400 fill-current text-[10px] mr-1" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{chef.rating?.toFixed(1) || '4.9'} MASTER CHEF</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  {chef.cuisineSpecialties?.slice(0, 2).map((specialty, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[9px] font-black uppercase border border-primary-100">
                      {specialty}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
