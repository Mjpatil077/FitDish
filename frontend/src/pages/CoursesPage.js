import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiStar, FiBook } from 'react-icons/fi';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      const url = filter !== 'all' 
        ? `/api/courses?difficulty=${filter}`
        : '/api/courses';
      const res = await axios.get(url);
      setCourses(res.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
            Courses
          </h1>
          <p className="text-lg text-gray-600">
            Structured learning paths from expert chefs
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-primary-50'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter('beginner')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'beginner'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-primary-50'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setFilter('intermediate')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'intermediate'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-primary-50'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filter === 'advanced'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-primary-50'
            }`}
          >
            Advanced
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <FiBook className="text-primary-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No courses available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="card hover:scale-[1.02] transition-transform"
              >
                {course.thumbnail && (
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
                    {course.difficulty}
                  </span>
                  {course.rating > 0 && (
                    <div className="flex items-center text-sm">
                      <FiStar className="text-accent-500 mr-1" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FiUsers className="mr-1" />
                    <span>{course.chef?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{course.duration} min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary-700">
                    ₹{course.price}
                  </span>
                  <span className="text-sm text-gray-600">
                    {course.videos?.length || 0} dishes
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

