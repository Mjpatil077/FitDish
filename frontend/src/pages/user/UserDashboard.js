import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FiClock, FiBookmark, FiPlay, FiCheckCircle, FiTarget } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentWatches, setRecentWatches] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, watchesRes, enrollmentsRes, historyRes, videosRes] = await Promise.all([
        axios.get('/api/bookings/my-bookings'),
        axios.get('/api/watch-history/recent'),
        axios.get('/api/courses/user/my-courses'),
        axios.get('/api/watch-history'),
        axios.get('/api/videos?isFree=true')
      ]);
      
      const bookings = bookingsRes.data.bookings.filter(
        booking => booking.status === 'confirmed' && 
        new Date(booking.session?.scheduledAt) > new Date()
      ).slice(0, 3);
      
      setUpcomingBookings(bookings);
      setRecentWatches(watchesRes.data.recentWatches || []);
      setEnrollments(enrollmentsRes.data.enrollments || []);
      setWatchHistory(historyRes.data.watchHistory || []);
      
      // Simple recommendation: videos from watched categories
      const watchedCategories = new Set(
        watchesRes.data.recentWatches
          .map(w => w.video?.category?.slug)
          .filter(Boolean)
      );
      
      const recommended = videosRes.data.videos
        .filter(v => watchedCategories.has(v.category?.slug))
        .slice(0, 6);
      
      setRecommendedVideos(recommended);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        {/* Greeting + Goals */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {user?.fitnessGoals && user.fitnessGoals.length > 0 && (
              <div className="flex items-center space-x-2">
                <FiTarget className="text-primary-600" />
                <span className="text-gray-700">
                  {user.fitnessGoals.join(', ')}
                </span>
              </div>
            )}
            {user?.dietType && user.dietType !== 'none' && (
              <div className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {user.dietType.charAt(0).toUpperCase() + user.dietType.slice(1)}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 mb-1">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-primary-800">{upcomingBookings.length}</p>
              </div>
              <FiClock className="text-primary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-700 mb-1">My Courses</p>
                <p className="text-3xl font-bold text-accent-800">{enrollments.length}</p>
              </div>
              <FiBookmark className="text-accent-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-secondary-100 to-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-700 mb-1">Videos Watched</p>
                <p className="text-3xl font-bold text-secondary-800">{watchHistory.length}</p>
              </div>
              <FiPlay className="text-secondary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-800">
                  {watchHistory.filter(w => w.completed).length}
                </p>
              </div>
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>
          </div>
        </div>

        {/* Continue Watching */}
        {recentWatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-primary-800">
                Continue Watching
              </h2>
              <Link to="/watch-history" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWatches.map((watch) => (
                <Link
                  key={watch._id}
                  to={`/videos/${watch.video?._id}`}
                  className="card hover:scale-[1.02] transition-transform"
                >
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 relative overflow-hidden">
                    {watch.video?.youtubeEmbedUrl ? (
                      <iframe
                        src={watch.video.youtubeEmbedUrl}
                        title={watch.video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPlay className="text-primary-600 text-4xl" />
                      </div>
                    )}
                    {watch.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600" style={{ width: `${watch.progress}%` }} />
                    )}
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-primary-800 line-clamp-2">
                    {watch.video?.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{watch.video?.chef?.name}</span>
                    <span>{watch.progress}% watched</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My Courses */}
        {enrollments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-primary-800">
                My Courses
              </h2>
              <Link to="/my-courses" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const totalVideos = course?.videos?.length || 0;
                const completedCount = enrollment.completedVideos?.length || 0;
                const progress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

                return (
                  <Link
                    key={enrollment._id}
                    to={`/courses/${course?._id}`}
                    className="card hover:scale-[1.02] transition-transform"
                  >
                    {course?.thumbnail && (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/featured/?food';
                        }}
                      />
                    )}
                    <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
                      {course?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course?.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{completedCount}/{totalVideos} dishes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{course?.chef?.name}</span>
                      <span className="text-primary-700 font-semibold">{progress}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        {upcomingBookings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-primary-800">
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

        {/* Recommended For You */}
        {recommendedVideos.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-primary-800">
                Recommended For You
              </h2>
              <Link to="/videos" className="text-primary-600 hover:text-primary-700 font-medium">
                Browse All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedVideos.map((video) => (
                <Link
                  key={video._id}
                  to={`/videos/${video._id}`}
                  className="card hover:scale-[1.02] transition-transform"
                >
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 relative overflow-hidden">
                    <iframe
                      src={video.youtubeEmbedUrl}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-primary-800 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.chef?.name}</span>
                    <span>{video.duration} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Onboarding for New Users */}
        {enrollments.length === 0 && recentWatches.length === 0 && (
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
            <div className="text-center py-12">
              <FiTarget className="text-primary-600 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-primary-800 mb-4">
                Start Your Culinary Journey
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Explore courses, watch videos, and book sessions with expert chefs to achieve your fitness goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/courses" className="btn btn-primary">
                  Browse Courses
                </Link>
                <Link to="/videos" className="btn btn-outline">
                  Watch Videos
                </Link>
                <Link to="/chefs" className="btn btn-outline">
                  Find Chefs
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
