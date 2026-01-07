import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiAward } from 'react-icons/fi';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const indianCategories = categories.filter(c => c.type === 'Indian');
  const culturalCategories = categories.filter(c => c.type === 'Cultural');
  const globalCategories = categories.filter(c => c.type === 'Global');

  const displayCategories = filter === 'all' 
    ? categories 
    : filter === 'indian' 
      ? indianCategories 
      : filter === 'cultural' 
        ? culturalCategories 
        : globalCategories;

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
            All Categories
          </h1>
          <p className="text-xl text-gray-600">
            Explore healthy recipes from different cuisines and cultures
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-primary-50 shadow-soft'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setFilter('indian')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'indian'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-primary-50 shadow-soft'
            }`}
          >
            Indian ({indianCategories.length})
          </button>
          <button
            onClick={() => setFilter('cultural')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'cultural'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-primary-50 shadow-soft'
            }`}
          >
            Cultural ({culturalCategories.length})
          </button>
          <button
            onClick={() => setFilter('global')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'global'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-primary-50 shadow-soft'
            }`}
          >
            Global ({globalCategories.length})
          </button>
        </div>

        {displayCategories.length === 0 ? (
          <div className="card text-center py-12">
            <FiAward className="text-primary-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayCategories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group card text-center hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      e.target.src = 'https://source.unsplash.com/featured/?food';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4">
                    <FiAward className="text-primary-600 text-4xl" />
                  </div>
                )}
                <div className="mb-2">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    {category.type}
                  </span>
                </div>
                <h3 className="font-semibold text-primary-800 text-lg">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

