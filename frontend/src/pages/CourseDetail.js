import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { FiClock, FiUsers, FiStar, FiCheckCircle, FiLock, FiPlay } from 'react-icons/fi';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data.course);
      setEnrollment(res.data.enrollment);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      await axios.post(`/api/courses/${id}/enroll`);
      await fetchCourseData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error enrolling in course');
    } finally {
      setEnrolling(false);
    }
  };

  const markVideoComplete = async (videoId) => {
    if (!enrollment) return;

    try {
      // Update enrollment progress
      const updatedCompleted = [...(enrollment.completedVideos || []), videoId];
      const totalVideos = course.videos.length;
      const progress = Math.round((updatedCompleted.length / totalVideos) * 100);

      await axios.put(`/api/enrollments/${enrollment._id}`, {
        completedVideos: updatedCompleted,
        progress
      });

      await fetchCourseData();
    } catch (error) {
      console.error('Error marking video complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <p className="text-gray-600 text-lg">Course not found</p>
        </div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const completedVideos = enrollment?.completedVideos || [];
  const progress = enrollment?.progress || 0;

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom max-w-6xl">
        {/* Course Header */}
        <div className="card mb-8">
          {course.thumbnail && (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
              onError={(e) => {
                e.target.src = 'https://source.unsplash.com/featured/?food';
              }}
            />
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {course.difficulty}
                </span>
                {course.rating > 0 && (
                  <div className="flex items-center text-sm">
                    <FiStar className="text-accent-500 mr-1" />
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-600">({course.totalReviews} reviews)</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-display font-bold text-primary-800 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {course.description}
              </p>
            </div>
          </div>

          {/* Chef Info */}
          {course.chef && (
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                {course.chef.avatar ? (
                  <img src={course.chef.avatar} alt={course.chef.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <FiUsers className="text-primary-600 text-3xl" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-display font-semibold text-primary-800">
                    {course.chef.name}
                  </h3>
                  {course.chef.isVerified && (
                    <FiCheckCircle className="text-primary-600" title="Verified Chef" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{course.chef.bio}</p>
              </div>
            </div>
          )}

          {/* Course Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center text-gray-700">
              <FiClock className="mr-3 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{course.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FiUsers className="mr-3 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="font-semibold">{course.enrolledCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <FiPlay className="mr-3 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Dishes</p>
                <p className="font-semibold">{course.videos?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Enrollment Section */}
          {isEnrolled ? (
            <div className="bg-primary-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary-800 mb-1">Your Progress</h3>
                  <p className="text-sm text-gray-600">
                    {completedVideos.length} of {course.videos?.length || 0} dishes completed
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-primary-50 rounded-xl p-6">
              <div>
                <h3 className="text-2xl font-bold text-primary-800 mb-1">
                  ₹{course.price}
                </h3>
                <p className="text-sm text-gray-600">One-time payment</p>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn btn-primary text-lg px-8"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          )}
        </div>

        {/* Course Videos */}
        <div>
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">
            Course Content
          </h2>
          {!course.videos || course.videos.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No videos in this course yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {course.videos.map((video, index) => {
                const isCompleted = completedVideos.includes(video._id);
                const canAccess = isEnrolled || video.isFree;

                return (
                  <div
                    key={video._id}
                    className={`card ${!canAccess ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {isCompleted ? (
                          <FiCheckCircle className="text-green-600 text-2xl" />
                        ) : (
                          <span className="text-primary-700 font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-display font-semibold text-primary-800">
                            {video.title}
                          </h3>
                          {!canAccess && (
                            <FiLock className="text-gray-400 text-xl" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <FiClock className="mr-1" />
                          <span>{video.duration} min</span>
                          {video.caloriesEstimate > 0 && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{video.caloriesEstimate} cal</span>
                            </>
                          )}
                        </div>
                        {canAccess ? (
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/videos/${video._id}`}
                              className="btn btn-primary text-sm"
                            >
                              Watch Now
                            </Link>
                            {isEnrolled && !isCompleted && (
                              <button
                                onClick={() => markVideoComplete(video._id)}
                                className="btn btn-secondary text-sm"
                              >
                                Mark Complete
                              </button>
                            )}
                            {isCompleted && (
                              <span className="text-green-600 text-sm font-medium flex items-center">
                                <FiCheckCircle className="mr-1" />
                                Completed
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Enroll in course to access this video
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

