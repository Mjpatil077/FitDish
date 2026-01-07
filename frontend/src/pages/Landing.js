import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiAward, FiCheckCircle, FiUsers, FiStar, FiTarget, FiShield, FiBook, FiVideo } from 'react-icons/fi';

const Landing = () => {
  const [categories, setCategories] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, chefsRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/chefs')
      ]);
      
      setCategories(categoriesRes.data.categories || []);
      setChefs(chefsRes.data.chefs?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const indianCategories = categories.filter(c => c.type === 'Indian').slice(0, 7);
  const culturalCategories = categories.filter(c => c.type === 'Cultural');
  const globalCategories = categories.filter(c => c.type === 'Global').slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 section-padding py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-800 mb-6 leading-tight">
              Cook Smart. Eat Fit.
              <br />
              <span className="text-primary-600">Learn from Real Chefs.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
              Master healthy, authentic cooking with verified chefs. 
              Structured courses, live sessions, and personalized guidance for your fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories" className="btn btn-primary text-lg px-10 py-4 text-white font-semibold">
                Explore Categories
              </Link>
              <Link to="/signup" className="btn btn-outline text-lg px-10 py-4 border-2 border-primary-600 text-primary-700 hover:bg-primary-50">
                Join FitDish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Discovery */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
              Explore by Cuisine
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover healthy recipes from different cuisines and cultures around the world
            </p>
          </div>

          {/* Indian Cuisine */}
          {indianCategories.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-display font-bold text-primary-800">
                  Indian Cuisine
                </h3>
                <Link to="/categories" className="text-primary-600 hover:text-primary-700 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {indianCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group card text-center hover:scale-105 transition-all duration-300"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/featured/?food';
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4">
                        <FiAward className="text-primary-600 text-3xl" />
                      </div>
                    )}
                    <h4 className="font-semibold text-primary-800 text-sm md:text-base">{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Cultural Foods */}
          {culturalCategories.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-display font-bold text-primary-800">
                  Cultural Foods
                </h3>
                <Link to="/categories" className="text-primary-600 hover:text-primary-700 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {culturalCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group card text-center hover:scale-105 transition-all duration-300"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/featured/?food';
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4">
                        <FiAward className="text-primary-600 text-3xl" />
                      </div>
                    )}
                    <h4 className="font-semibold text-primary-800">{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Global Cuisine */}
          {globalCategories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-display font-bold text-primary-800">
                  Global Cuisine
                </h3>
                <Link to="/categories" className="text-primary-600 hover:text-primary-700 font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {globalCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group card text-center hover:scale-105 transition-all duration-300"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-40 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/featured/?food';
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4">
                        <FiAward className="text-primary-600 text-3xl" />
                      </div>
                    )}
                    <h4 className="font-semibold text-primary-800 text-sm md:text-base">{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Chefs */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
                Featured Chefs
              </h2>
              <p className="text-xl text-gray-600">
                Learn from verified, experienced chefs who specialize in healthy cooking
              </p>
            </div>
            <Link to="/chefs" className="text-primary-600 hover:text-primary-700 font-medium text-lg">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-primary-600 text-lg">Loading chefs...</div>
            </div>
          ) : chefs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No chefs available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefs.map((chef) => (
                <Link
                  key={chef._id}
                  to={`/chefs/${chef._id}`}
                  className="card hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {chef.avatar ? (
                        <img src={chef.avatar} alt={chef.name} className="w-24 h-24 rounded-full object-cover" />
                      ) : (
                        <FiUsers className="text-primary-600 text-4xl" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-display font-bold text-primary-800 truncate">
                          {chef.name}
                        </h3>
                        {chef.isVerified && (
                          <FiCheckCircle className="text-primary-600 flex-shrink-0" title="Verified Chef" />
                        )}
                      </div>
                      {chef.rating > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <FiStar className="text-accent-500 mr-1 fill-current" />
                          <span className="font-semibold">{chef.rating.toFixed(1)}</span>
                          <span className="ml-1">({chef.totalReviews} reviews)</span>
                        </div>
                      )}
                      {chef.experience > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          {chef.experience} years of experience
                        </p>
                      )}
                      {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {chef.cuisineSpecialties.slice(0, 3).map((cuisine, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-primary-600 font-medium text-sm">View Profile →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why FitDish */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
              Why FitDish?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to master healthy cooking and achieve your fitness goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-2">
                Verified Chefs
              </h3>
              <p className="text-gray-600">
                Learn from experienced, verified chefs who specialize in healthy cooking
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTarget className="text-accent-600 text-3xl" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-2">
                Fitness-First
              </h3>
              <p className="text-gray-600">
                Every recipe is designed with your health and fitness goals in mind
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="text-secondary-700 text-3xl" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-2">
                Structured Learning
              </h3>
              <p className="text-gray-600">
                Follow structured courses and track your progress as you learn
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiVideo className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-2">
                Live Sessions
              </h3>
              <p className="text-gray-600">
                Join interactive live cooking sessions with expert chefs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="section-padding bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Start Your FitDish Journey Today
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands learning healthy, authentic cooking from verified chefs. 
            Get personalized recommendations, track your progress, and achieve your fitness goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-secondary-50 text-lg px-10 py-4 font-semibold">
              Get Started Free
            </Link>
            <Link to="/login" className="btn border-2 border-white text-white hover:bg-primary-600 text-lg px-10 py-4 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
