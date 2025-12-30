import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiStar, FiCheckCircle, FiAward } from 'react-icons/fi';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch category with related data
      const categoryRes = await axios.get(`/api/categories/${slug}`);
      
      if (categoryRes.data.success && categoryRes.data.category) {
        setCategory(categoryRes.data.category);
        setVideos(categoryRes.data.relatedVideos || []);
        setChefs(categoryRes.data.relatedChefs || []);
      } else {
        setError('Category not found');
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      if (error.response?.status === 404) {
        setError('Category not found');
      } else {
        setError('Failed to load category. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading category...</div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="card max-w-md mx-auto">
            <p className="text-gray-600 text-lg mb-4">{error || 'Category not found'}</p>
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-100">
        <div className="container-custom">
          {category.imageUrl && (
            <div className="pt-8 pb-8">
              <div className="rounded-2xl overflow-hidden shadow-soft-lg">
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-80 md:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://source.unsplash.com/featured/?food';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="pb-12 text-center md:text-left">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {category.type} Cuisine
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="section-padding">
        <div className="container-custom">
          {/* Popular Dishes Section */}
          {category.foods && category.foods.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-display font-bold text-primary-800 mb-6">
                Popular Dishes
              </h2>
              <div className="flex flex-wrap gap-3">
                {category.foods.map((food, idx) => (
                  <span
                    key={idx}
                    className="px-6 py-3 bg-white rounded-full shadow-soft text-primary-700 font-medium hover:bg-primary-50 transition-colors"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chefs Section */}
          {chefs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-display font-bold text-primary-800 mb-6">
                Chefs for This Category
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chefs.map((chef) => (
                  <Link
                    key={chef._id}
                    to={`/chefs/${chef._id}`}
                    className="card hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {chef.avatar ? (
                          <img 
                            src={chef.avatar} 
                            alt={chef.name} 
                            className="w-20 h-20 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://source.unsplash.com/featured/?chef,portrait';
                            }}
                          />
                        ) : (
                          <FiUsers className="text-primary-600 text-3xl" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-display font-semibold text-primary-800 truncate">
                            {chef.name}
                          </h3>
                          {chef.isVerified && (
                            <FiCheckCircle className="text-primary-600 flex-shrink-0" title="Verified Chef" />
                          )}
                        </div>
                        {chef.rating > 0 && (
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <FiStar className="text-accent-500 mr-1 flex-shrink-0" />
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
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-display font-bold text-primary-800 mb-6">
                Free Video Tutorials
              </h2>
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
                    {video.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUsers className="mr-1" />
                        <span className="truncate">{video.chef?.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
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
            </div>
          )}

          {/* Empty State */}
          {videos.length === 0 && chefs.length === 0 && (!category.foods || category.foods.length === 0) && (
            <div className="card text-center py-12">
              <FiAward className="text-primary-600 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
                Content Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're adding more content for this category. Check back soon!
              </p>
              <Link to="/videos" className="btn btn-primary">
                Browse All Videos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
