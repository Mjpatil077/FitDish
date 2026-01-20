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
          <div className="text-center py-20 bg-primary-50 rounded-[2.5rem] border-2 border-dashed border-primary-100">
            <FiClock className="mx-auto text-4xl text-primary-200 mb-4" />
            <p className="text-primary-400 font-medium">No culinary recipes found yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipes/${recipe._id}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img 
                    src={recipe.image || `https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop`} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 border border-white/20">
                    {recipe.cuisine}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-3 text-primary-800 line-clamp-2 min-h-[3.5rem] group-hover:text-primary-600 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">
                    <div className="flex items-center">
                      <FiClock className="mr-1.5" />
                      <span>{recipe.prepTime + recipe.cookTime} mins</span>
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-1.5" />
                      <span>{recipe.servings} Servings</span>
                    </div>
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

export default BrowseRecipes;

