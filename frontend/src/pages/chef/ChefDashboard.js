import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiDollarSign, FiCalendar, FiUsers, FiTrendingUp, FiPlus, FiPlay, FiBook, FiBarChart2 } from 'react-icons/fi';

const ChefDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, earningsRes, videosRes, coursesRes, sessionsRes] = await Promise.all([
        axios.get('/api/analytics'),
        axios.get('/api/analytics/earnings?period=month'),
        axios.get('/api/videos/chef/me'),
        axios.get('/api/courses/chef/my-courses'),
        axios.get('/api/sessions/chef/my-sessions')
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setEarnings(earningsRes.data);
      setVideos(videosRes.data.videos || []);
      setCourses(coursesRes.data.courses || []);
      
      const upcoming = (sessionsRes.data.sessions || []).filter(
        s => s.isActive && new Date(s.scheduledAt) > new Date()
      );
      setSessions(upcoming.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading dashboard...</div>
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
              Creator Studio
            </h1>
            <p className="text-lg text-gray-600">
              Manage your content, track performance, and grow your culinary business
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/chef/courses/create" className="btn btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Create Course
            </Link>
            <Link to="/chef/sessions/create" className="btn btn-outline flex items-center">
              <FiPlus className="mr-2" />
              Create Session
            </Link>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-800">
                  ₹{earnings?.totalEarnings || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">This month</p>
              </div>
              <FiDollarSign className="text-green-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 mb-1">Total Videos</p>
                <p className="text-3xl font-bold text-primary-800">
                  {analytics?.totalVideos || 0}
                </p>
                <p className="text-xs text-primary-600 mt-1">{analytics?.totalViews || 0} views</p>
              </div>
              <FiPlay className="text-primary-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-700 mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-accent-800">
                  {analytics?.totalCourses || 0}
                </p>
                <p className="text-xs text-accent-600 mt-1">{analytics?.totalEnrollments || 0} students</p>
              </div>
              <FiBook className="text-accent-600 text-4xl" />
            </div>
          </div>
          <div className="card bg-gradient-to-br from-secondary-100 to-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-700 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-secondary-800">
                  {analytics?.totalStudents || 0}
                </p>
                <p className="text-xs text-secondary-600 mt-1">Across all content</p>
              </div>
              <FiUsers className="text-secondary-600 text-4xl" />
            </div>
          </div>
        </div>

        {/* Earnings Breakdown */}
        {earnings && (
          <div className="card mb-8">
            <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">
              Earnings Breakdown
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">From Courses</p>
                <p className="text-2xl font-bold text-green-700">₹{earnings.breakdown?.course || 0}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">From Sessions</p>
                <p className="text-2xl font-bold text-blue-700">₹{earnings.breakdown?.session || 0}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">From Videos</p>
                <p className="text-2xl font-bold text-purple-700">₹{earnings.breakdown?.video || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* My Videos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              My Videos
            </h2>
            <Link to="/chef/videos" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          {videos.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600 mb-4">No videos uploaded yet</p>
              <Link to="/chef/videos/create" className="btn btn-primary">
                Upload Video
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {videos.slice(0, 6).map((video) => (
                <div key={video._id} className="card">
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
                    {video.youtubeEmbedUrl ? (
                      <iframe
                        src={video.youtubeEmbedUrl}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPlay className="text-primary-600 text-4xl" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-primary-800 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.views || 0} views</span>
                    <span>{video.isFree ? 'Free' : 'Paid'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              My Courses
            </h2>
            <Link to="/chef/courses" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          {courses.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600 mb-4">No courses created yet</p>
              <Link to="/chef/courses/create" className="btn btn-primary">
                Create Course
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <Link
                  key={course._id}
                  to={`/chef/courses/${course._id}`}
                  className="card hover:scale-[1.02] transition-transform"
                >
                  {course.thumbnail && (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/featured/?food';
                      }}
                    />
                  )}
                  <h3 className="text-lg font-display font-semibold mb-2 text-primary-800">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{course.enrolledCount || 0} students</span>
                    <span className="font-semibold text-primary-700">₹{course.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Sessions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary-800">
              Scheduled Sessions
            </h2>
            <Link to="/chef/sessions" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          {sessions.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600 mb-4">No upcoming sessions</p>
              <Link to="/chef/sessions/create" className="btn btn-primary">
                Create Session
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div key={session._id} className="card">
                  <h3 className="text-lg font-display font-semibold mb-2 text-primary-800">
                    {session.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
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
                    <span className="text-xl font-bold text-primary-700">₹{session.price}</span>
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

        {/* Analytics */}
        {analytics && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-xl font-display font-semibold mb-4 text-primary-800">
                Views by Category
              </h3>
              {analytics.viewsByCategory && Object.keys(analytics.viewsByCategory).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(analytics.viewsByCategory)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([category, views]) => (
                      <div key={category}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{category}</span>
                          <span className="font-semibold text-primary-700">{views} views</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ 
                              width: `${(views / (analytics.totalViews || 1)) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No data yet</p>
              )}
            </div>

            <div className="card">
              <h3 className="text-xl font-display font-semibold mb-4 text-primary-800">
                Most Popular Video
              </h3>
              {analytics.mostPopularVideo ? (
                <div>
                  <p className="text-lg font-semibold text-primary-800 mb-2">
                    {analytics.mostPopularVideo.title}
                  </p>
                  <p className="text-3xl font-bold text-primary-600">
                    {analytics.mostPopularVideo.views} views
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No videos yet</p>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link to="/chef/courses/create" className="card hover:scale-[1.02] transition-transform text-center">
            <FiBook className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              Create Course
            </h3>
            <p className="text-gray-600">Bundle videos into structured courses</p>
          </Link>
          <Link to="/chef/analytics" className="card hover:scale-[1.02] transition-transform text-center">
            <FiBarChart2 className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              View Analytics
            </h3>
            <p className="text-gray-600">Deep dive into your performance</p>
          </Link>
          <Link to="/chef/earnings" className="card hover:scale-[1.02] transition-transform text-center">
            <FiDollarSign className="text-primary-600 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              Earnings
            </h3>
            <p className="text-gray-600">Track your revenue streams</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
