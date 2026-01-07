import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiCheckCircle, FiPlay } from 'react-icons/fi';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get('/api/courses/user/my-courses');
      setEnrollments(res.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading your courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          My Courses
        </h1>

        {enrollments.length === 0 ? (
          <div className="card text-center py-12">
            <FiPlay className="text-primary-600 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              No courses enrolled yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start learning by enrolling in a course from expert chefs!
            </p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {course?.difficulty}
                    </span>
                    {enrollment.isCompleted && (
                      <FiCheckCircle className="text-green-600 text-xl" title="Completed" />
                    )}
                  </div>
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
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      <span>{course?.chef?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{course?.duration} min</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;

