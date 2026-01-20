import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiStar, FiCheckCircle, FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';

const CategoryPage = () => {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
    // eslint-disable-next-line
  }, [slug]);

  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Fetch category details (name, image, description)
      const categoryRes = await axios.get(`/api/categories/${slug}`);

      if (!categoryRes.data.success || !categoryRes.data.category) {
        setError('Category not found');
        setLoading(false);
        return;
      }

      setCategory(categoryRes.data.category);

      // 2️⃣ Fetch videos for THIS category
      const videosRes = await axios.get(`/api/videos?category=${slug}`);
      setVideos(videosRes.data.videos || []);

      // 3️⃣ Fetch chefs specializing in this category
      const chefsRes = await axios.get(`/api/chefs?specialty=${slug}`);
      setChefs(chefsRes.data.chefs || []);


    } catch (err) {
      console.error(err);
      setError('Failed to load category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading category...</div>
        </div>
      </div>
    );
  }

  /* =======================
     ERROR STATE
  ======================= */
  if (error || !category) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="card max-w-md mx-auto">
            <p className="text-gray-600 text-lg mb-4">
              {error || 'Category not found'}
            </p>
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =======================
     HELPER DATA (FITNESS METADATA)
  ======================= */
  const getFitnessMetadata = (slug) => {
    const data = {
      'high-protein': {
        idealFor: ['Gym-goers', 'Athletes', 'Bodybuilders', 'Active Professionals'],
        nutritionFocus: 'Muscle repair and growth via high amino acid density.',
        headline: 'Power Your Muscles with Protein'
      },
      'weight-loss': {
        idealFor: ['Beginners', 'Busy Professionals', 'Health Enthusiasts', 'Those on a calorie deficit'],
        nutritionFocus: 'Low calorie density with high fiber for satiety.',
        headline: 'Delicious Meals for Sustainable Weight Loss'
      },
      'muscle-gain': {
        idealFor: ['Bulking Athletes', 'Hardgainers', 'Strength Trainers', 'Bodybuilders'],
        nutritionFocus: 'Calorie-dense whole foods to support mass accumulation.',
        headline: 'Massive Gains with Nutritional Precision'
      },
      'low-carb-keto': {
        idealFor: ['Keto Practitioners', 'Diabetics', 'Low-Carb Enthusiasts', 'Fat-burning focused individuals'],
        nutritionFocus: 'High healthy fats, moderate protein, minimal carbohydrates.',
        headline: 'Fat Fuel: The Ketogenic Approach'
      },
      'pre-workout-meals': {
        idealFor: ['Morning Trainees', 'Endurance Athletes', 'HIIT Enthusiasts', 'Powerlifters'],
        nutritionFocus: 'Quick and sustained energy from complex carbohydrates.',
        headline: 'Fuel Your Peak Performance'
      },
      'post-workout-meals': {
        idealFor: ['Weightlifters', 'Crossfitters', 'Swimmers', 'Anyone after a hard session'],
        nutritionFocus: 'Optimal 2:1 ratio for glycogen replenishment and muscle repair.',
        headline: 'Recover Faster, Train Harder'
      },
      'quick-healthy-meals': {
        idealFor: ['Busy Parents', 'Students', 'C-suite Executives', 'Beginners in the kitchen'],
        nutritionFocus: 'Balanced nutrition prepared in under 30 minutes.',
        headline: 'Gourmet Fitness in Minutes'
      },
      'meal-prep-recipes': {
        idealFor: ['Planners', 'Busy Employees', 'Budget-conscious fitness fans', 'Consistency seekers'],
        nutritionFocus: 'Batch-friendliness and nutrient preservation.',
        headline: 'Consistency is Key: Master Your Meal Prep'
      }
    };
    return data[slug] || { 
      idealFor: ['Gym-goers', 'Health-conscious individuals', 'Busy professionals'],
      nutritionFocus: 'Balanced nutrition for a healthy lifestyle.',
      headline: 'Fuel Your Fitness Journey'
    };
  };

  const fitnessMeta = category?.type === 'Fitness' ? getFitnessMetadata(slug) : null;

  /* =======================
     MAIN UI
  ======================= */
  return (
    <div className="bg-secondary-50 min-h-screen">

      {/* HERO SECTION */}
      <section className={`relative transition-colors duration-700 overflow-hidden ${
        category.type === 'Fitness' 
          ? 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white' 
          : 'bg-gradient-to-br from-primary-50 via-white to-secondary-50 text-gray-900'
      }`}>
        {/* Decorative elements */}
        {category.type === 'Fitness' ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary-500 rounded-full blur-[100px] opacity-10"></div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary-200 rounded-full blur-[100px] opacity-20"></div>
          </div>
        )}

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-16 md:py-24">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center space-x-2 mb-8">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm ${
                  category.type === 'Fitness'
                    ? 'bg-primary-500/20 text-primary-100 border border-primary-400/20'
                    : 'bg-primary-800 text-white'
                }`}>
                  {category.type} Excellence
                </span>
                <span className="w-8 h-[1px] bg-primary-300"></span>
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  category.type === 'Fitness' ? 'text-primary-400' : 'text-primary-600'
                }`}>
                  Verified Category
                </span>
              </div>

              <h1 className={`text-6xl md:text-8xl font-display font-black mb-8 leading-[0.9] tracking-tighter ${
                category.type === 'Fitness' ? 'text-white' : 'text-primary-900'
              }`}>
                {fitnessMeta?.headline || category.name}
              </h1>

              {category.description && (
                <p className={`text-xl md:text-2xl max-w-xl leading-relaxed font-medium mb-10 ${
                  category.type === 'Fitness' ? 'text-primary-100/90' : 'text-gray-700'
                }`}>
                  {category.description}
                </p>
              )}

              {category.type === 'Fitness' && (
                <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                    <FiCheckCircle className="text-secondary-400 text-xl" />
                    <span className="text-sm font-bold uppercase tracking-wider">Certified Nutrition</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
                    <FiAward className="text-secondary-400 text-xl" />
                    <span className="text-sm font-bold uppercase tracking-wider">Master Chef Led</span>
                  </div>
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative group">
                {/* Image shadow/backdrop */}
                <div className={`absolute inset-0 translate-x-6 translate-y-6 rounded-[3rem] blur-2xl transition-all duration-700 group-hover:translate-x-8 group-hover:translate-y-8 ${
                  category.type === 'Fitness' ? 'bg-primary-950/60' : 'bg-primary-200/50'
                }`}></div>
                
                <div className="relative z-10 aspect-[4/5] md:aspect-square overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  {/* Subtle glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IDEAL FOR & NUTRITION SECTION (Fitness Only) */}
      {category.type === 'Fitness' && fitnessMeta && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-secondary-50 p-8 rounded-3xl">
                <h2 className="text-2xl font-display font-bold text-primary-800 mb-6 flex items-center">
                  <FiUsers className="mr-3 text-secondary-500" />
                  Ideal For
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fitnessMeta.idealFor.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <FiCheckCircle className="text-primary-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary-50 p-8 rounded-3xl">
                <h2 className="text-2xl font-display font-bold text-primary-800 mb-6 flex items-center">
                  <FiTrendingUp className="mr-3 text-primary-600" />
                  Nutrition Focus
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{fitnessMeta.nutritionFocus}"
                </p>
                {category.foods && category.foods.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-primary-700 uppercase tracking-widest mb-4">Recommended Dishes</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.foods.map((food, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-primary-800 shadow-sm">
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <div className="section-padding">
        <div className="container-custom">

          {/* ================= VIDEOS ================= */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-primary-800">
                {category.type === 'Fitness' ? 'Goal-Oriented Cooking Tutorials' : 'Free Video Tutorials'}
              </h2>
              {category.type === 'Fitness' && (
                <span className="text-sm font-medium text-gray-500 flex items-center">
                  <FiStar className="mr-1 text-accent-500" />
                  Locked behind login
                </span>
              )}
            </div>

            {videos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map(video => (
                  <div
                    key={video._id}
                    className="group card overflow-hidden hover:shadow-soft-lg transform hover:-translate-y-1 transition-all"
                  >
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <iframe
                        src={video.youtubeEmbedUrl}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-display font-bold mb-3 text-primary-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {video.title}
                      </h3>

                      {video.description && (
                        <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                          {video.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                            <FiUser className="text-primary-600 text-xs" />
                          </div>
                          <span className="text-sm font-bold text-gray-700">{video.chef?.name || 'Top Chef'}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase">
                          <span className="flex items-center">
                            <FiClock className="mr-1 text-primary-500" />
                            {video.duration || 0} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-16 bg-white shadow-soft">
                <FiAward className="text-primary-300 text-6xl mx-auto mb-6" />
                <h3 className="text-2xl font-display font-bold mb-3 text-primary-800">
                  New Content Arriving Daily
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Our chefs are currently recording specialized tutorials for {category.name}. Check back in 24 hours!
                </p>
                <Link to="/videos" className="btn btn-primary px-8">
                  Explore available videos
                </Link>
              </div>
            )}
          </div>

          {/* ================= CHEFS ================= */}
          {chefs.length > 0 && (
            <section className="mt-20">
              <h2 className="text-3xl font-display font-bold text-primary-800 mb-8 text-center">
                Verified Chefs Specializing in {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {chefs.map((chef) => (
                  <Link 
                    key={chef._id} 
                    to={`/chefs/${chef._id}`}
                    className="text-center group"
                  >
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full bg-primary-100 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-soft group-hover:border-primary-500 transition-all z-10">
                        <img 
                          src={chef.avatar || 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=400&auto=format&fit=crop'} 
                          alt={chef.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {chef.isVerified && (
                        <div className="absolute bottom-2 right-2 bg-primary-600 text-white p-1.5 rounded-full z-20 shadow-lg" title="Verified Chef">
                          <FiCheckCircle className="text-sm" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-gray-800 text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                      {chef.name}
                    </h4>
                    <div className="flex items-center justify-center space-x-1 text-accent-600 mb-1">
                      <FiStar className="fill-current" />
                      <span className="text-sm font-bold">{chef.rating || '4.8'}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                       {chef.experience}+ Years Exp.
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
