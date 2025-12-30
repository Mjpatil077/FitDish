import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiAward, FiCheckCircle, FiUsers, FiClock, FiStar, FiPlay } from 'react-icons/fi';

const Landing = () => {
  const [categories, setCategories] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, chefsRes, videosRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/chefs'),
        axios.get('/api/videos?isFree=true')
      ]);
      
      setCategories(categoriesRes.data.categories || []);
      setChefs(chefsRes.data.chefs?.slice(0, 6) || []);
      setVideos(videosRes.data.videos?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const indianCategories = categories.filter(c => c.type === 'Indian').slice(0, 6);
  const globalCategories = categories.filter(c => c.type === 'Global').slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-100 section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              Cook Smart. Eat Fit.
              <br />
              <span className="text-primary-600">Learn from Real Chefs.</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Master healthy, authentic cooking with verified chefs. 
              Free videos and live interactive sessions for your fitness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chefs" className="btn btn-primary text-lg px-8 py-4">
                Explore Chefs
              </Link>
              <Link to="/videos" className="btn btn-outline text-lg px-8 py-4">
                Watch Free Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-primary-800 mb-4">
              Explore by Cuisine
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover healthy recipes from different cuisines and cultures
            </p>
          </div>

          {/* Indian Cuisine */}
          {indianCategories.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-display font-semibold text-primary-800 mb-6">
                Indian Cuisine
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {indianCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="card text-center hover:scale-105 transition-transform"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/featured/?food';
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                        <FiAward className="text-primary-600 text-2xl" />
                      </div>
                    )}
                    <h4 className="font-medium text-primary-800">{category.name}</h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Global Cuisine */}
          {globalCategories.length > 0 && (
            <div>
              <h3 className="text-2xl font-display font-semibold text-primary-800 mb-6">
                Global Cuisine
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {globalCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="card text-center hover:scale-105 transition-transform"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-xl mb-3"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/featured/?food';
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
                        <FiAward className="text-primary-600 text-2xl" />
                      </div>
                    )}
                    <h4 className="font-medium text-primary-800">{category.name}</h4>
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
              <h2 className="text-4xl font-display font-bold text-primary-800 mb-4">
                Featured Chefs
              </h2>
              <p className="text-lg text-gray-600">
                Learn from verified, experienced chefs
              </p>
            </div>
            <Link to="/chefs" className="text-primary-600 hover:text-primary-700 font-medium">
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
                  className="card hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {chef.avatar ? (
                        <img src={chef.avatar} alt={chef.name} className="w-20 h-20 rounded-full object-cover" />
                      ) : (
                        <FiUsers className="text-primary-600 text-3xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-display font-semibold text-primary-800">
                          {chef.name}
                        </h3>
                        {chef.isVerified && (
                          <FiCheckCircle className="text-primary-600" title="Verified Chef" />
                        )}
                      </div>
                      {chef.rating > 0 && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <FiStar className="text-accent-500 mr-1" />
                          <span>{chef.rating.toFixed(1)}</span>
                          <span className="ml-1">({chef.totalReviews} reviews)</span>
                        </div>
                      )}
                      {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {chef.cuisineSpecialties.slice(0, 2).map((cuisine, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Free Videos */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-primary-800 mb-4">
                Free Video Tutorials
              </h2>
              <p className="text-lg text-gray-600">
                Watch healthy cooking tutorials from expert chefs
              </p>
            </div>
            <Link to="/videos" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-primary-600 text-lg">Loading videos...</div>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No videos available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
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
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      <span>{video.chef?.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {video.caloriesEstimate > 0 && (
                        <span>{video.caloriesEstimate} cal</span>
                      )}
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>{video.duration} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands learning healthy, authentic cooking from verified chefs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-secondary-50 text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/chefs" className="btn border-2 border-white text-white hover:bg-primary-600 text-lg px-8 py-4">
              Browse Chefs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
