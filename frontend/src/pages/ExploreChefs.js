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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chefs.map((chef) => (
              <Link
                key={chef._id}
                to={`/chefs/${chef._id}`}
                className="card hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {chef.avatar ? (
                      <img src={chef.avatar} alt={chef.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <FiUser className="text-primary-600 text-2xl" />
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
                      <div className="flex items-center text-sm text-gray-600">
                        <FiStar className="text-accent-500 mr-1" />
                        <span>{chef.rating.toFixed(1)}</span>
                        <span className="ml-1">({chef.totalReviews} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
                {chef.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {chef.bio}
                  </p>
                )}
                {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreChefs;

