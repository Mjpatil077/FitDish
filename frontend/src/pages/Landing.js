import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiAward, FiCheckCircle, FiUsers, FiClock, FiStar } from 'react-icons/fi';

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

  const indianCategories = categories.filter(c => c.type === 'Indian');
  const globalCategories = categories.filter(c => c.type === 'Global');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Hero Background with Parallax-like feel */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop"
            alt="Premium Culinary Environment"
            className="w-full h-full object-cover opacity-25 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-white/40 to-secondary-50/80"></div>
          {/* Subtle overlay to enhance text readability */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-bold uppercase tracking-widest mb-8 animate-fade-in">
              The Future of Healthy Cooking
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 mb-8 tracking-tighter leading-[0.9]">
              Elevate Your <span className="text-secondary-600 block sm:inline">Culinary</span> Skills.
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Join elite chefs in mastering the art of healthy, authentic cuisine. 
              Professional video tutorials and immersive live sessions, 100% fitness-focused.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/chefs" className="btn btn-primary text-xl px-12 py-5 rounded-[2rem] shadow-2xl shadow-primary-200/50 hover:-translate-y-2 transition-all duration-500 bg-primary-800 hover:bg-primary-900 group">
                Find Your Mentor <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 ml-2">→</span>
              </Link>
              <Link to="/videos" className="btn btn-outline text-xl px-12 py-5 rounded-[2rem] bg-white/40 backdrop-blur-xl border-primary-200 hover:border-primary-600 hover:bg-white/60 hover:-translate-y-2 transition-all duration-500">
                Explore Masterclasses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Goals Section (NEW) */}
      <section className="section-padding bg-gradient-to-br from-primary-800 to-primary-900 text-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full blur-3xl opacity-10 -ml-32 -mb-32"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">
              Eat for Your Fitness Goal
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Precision nutrition meets culinary excellence. Choose your path and discover expert-led recipes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: 'High Protein', 
                slug: 'high-protein', 
                desc: 'Build lean muscle with protein-rich meals optimized for recovery.',
                img: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'Weight Loss', 
                slug: 'weight-loss', 
                desc: 'Shred fat with low-calorie, high-satiety recipes that taste amazing.',
                img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'Muscle Gain', 
                slug: 'muscle-gain', 
                desc: 'Clean bulking made easy with calorie-dense, nutrient-packed dishes.',
                img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'Pre-Workout', 
                slug: 'pre-workout-meals', 
                desc: 'Fuel your performance with sustained energy from complex carbs.',
                img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'Post-Workout', 
                slug: 'post-workout-meals', 
                desc: 'Optimize recovery with the perfect 2:1 ratio for glycogen replenishment.',
                img: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?q=80&w=800&auto=format&fit=crop'
              },
              { 
                name: 'Quick Healthy Meals', 
                slug: 'quick-healthy-meals', 
                desc: 'No time? No problem. Gourmet fitness meals in 30 minutes or less.',
                img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop'
              }
            ].map((goal, idx) => (
              <Link
                key={idx}
                to={`/category/${goal.slug}`}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <img 
                  src={goal.img} 
                  alt={goal.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-2xl font-display font-bold mb-2 group-hover:text-primary-300 transition-colors">
                    {goal.name}
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {goal.desc}
                  </p>
                </div>
              </Link>
            ))}
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
            <div className="mb-20">
              <div className="flex items-end justify-between mb-10">
                <h3 className="text-3xl font-display font-bold text-primary-900">
                  Indian Heritage
                </h3>
                <div className="h-[2px] flex-1 bg-primary-100 mx-8 hidden md:block"></div>
                <span className="text-primary-400 font-bold uppercase tracking-widest text-xs">Regional Excellence</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {indianCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group relative w-full aspect-square overflow-hidden rounded-[2.5rem] shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50"
                  >
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                        <FiAward className="text-primary-200 text-4xl" />
                      </div>
                    )}
                    
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                      <h4 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-primary-300 transition-colors tracking-tight leading-none mb-1">
                        {category.name}
                      </h4>
                      <div className="w-8 h-1 bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full mt-2"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Global Cuisine */}
          {globalCategories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-end justify-between mb-10">
                <h3 className="text-3xl font-display font-bold text-primary-900">
                  Global Influences
                </h3>
                <div className="h-[2px] flex-1 bg-primary-100 mx-8 hidden md:block"></div>
                <span className="text-primary-400 font-bold uppercase tracking-widest text-xs">World Flavors</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {globalCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group relative w-full aspect-square overflow-hidden rounded-[2.5rem] shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50"
                  >
                      {category.imageUrl ? (
                        <img 
                          src={category.imageUrl} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                          <FiAward className="text-primary-200 text-4xl" />
                        </div>
                      )}
                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                      <h4 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-primary-300 transition-colors tracking-tight leading-none mb-1">
                        {category.name}
                      </h4>
                      <div className="w-8 h-1 bg-primary-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full mt-2"></div>
                    </div>
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
