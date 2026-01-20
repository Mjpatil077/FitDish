import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiUser, FiCheckCircle } from 'react-icons/fi';

const ExploreChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const res = await axios.get('/api/chefs');
      setChefs(res.data.chefs);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading chefs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
            Explore Verified Chefs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn from experienced chefs specializing in healthy, authentic cooking
          </p>
        </div>

        {chefs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No chefs available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map((chef) => (
              <Link
                key={chef._id}
                to={`/chefs/${chef._id}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50"
              >
                {/* Card Background / Cover */}
                <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400 relative">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                <div className="px-6 pb-8 text-center -mt-16 relative z-10">
                  {/* Avatar */}
                  <div className="relative w-32 h-32 mx-auto mb-4 p-1 bg-white rounded-full shadow-lg">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-50">
                      {chef.avatar ? (
                        <img src={chef.avatar} alt={chef.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                          <FiUser className="text-primary-600 text-4xl" />
                        </div>
                      )}
                    </div>
                    {chef.isVerified && (
                      <div className="absolute bottom-2 right-2 bg-primary-600 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                        <FiCheckCircle className="text-sm" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-2xl font-display font-bold text-primary-800 mb-1 group-hover:text-primary-600 transition-colors">
                    {chef.name}
                  </h3>
                  
                  {chef.rating > 0 && (
                    <div className="flex items-center justify-center text-sm font-bold text-accent-600 mb-4 bg-accent-50 w-fit mx-auto px-3 py-1 rounded-full">
                      <FiStar className="mr-1 fill-current" />
                      <span>{chef.rating.toFixed(1)}</span>
                      <span className="text-accent-400 ml-1 font-medium">({chef.totalReviews} reviews)</span>
                    </div>
                  )}

                  {chef.bio && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed italic">
                      "{chef.bio}"
                    </p>
                  )}

                  {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {chef.cuisineSpecialties.slice(0, 3).map((cuisine, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary-100"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>{chef.experience || '10+'}+ Yrs Exp</span>
                    <span className="text-primary-600">View Profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreChefs;

