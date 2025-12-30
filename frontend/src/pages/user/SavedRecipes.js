import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBookmark, FiClock, FiUsers } from 'react-icons/fi';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const res = await axios.get('/api/users/saved-recipes');
      setRecipes(res.data.recipes || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeRecipe = async (recipeId) => {
    try {
      await axios.delete(`/api/users/saved-recipes/${recipeId}`);
      setRecipes(recipes.filter(r => r._id !== recipeId));
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading saved recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          Saved Recipes
        </h1>

        {recipes.length === 0 ? (
          <div className="card text-center py-12">
            <FiBookmark className="text-primary-600 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              No saved recipes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save your favorite healthy recipes!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="card">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-200 rounded-xl mb-4 flex items-center justify-center">
                  <FiBookmark className="text-4xl text-primary-600" />
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeRecipe(recipe._id)}
                    className="flex-1 btn btn-secondary text-sm"
                  >
                    Remove
                  </button>
                  <a
                    href={`/recipes/${recipe._id}`}
                    className="flex-1 btn btn-primary text-sm text-center"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;

