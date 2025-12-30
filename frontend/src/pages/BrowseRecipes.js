import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiUser } from 'react-icons/fi';

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes');
      setRecipes(res.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
            Free Healthy Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover authentic, nutritious recipes from verified chefs
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No recipes available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="card hover:scale-[1.02] transition-transform">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-200 rounded-xl mb-4 flex items-center justify-center">
                  <FiUser className="text-4xl text-primary-600" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-1" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
                <Link
                  to={`/recipes/${recipe._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Recipe →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRecipes;

