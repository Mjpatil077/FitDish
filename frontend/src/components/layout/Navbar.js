import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiLogOut, FiAward, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const indianCategories = categories.filter(c => c.type === 'Indian');
  const culturalCategories = categories.filter(c => c.type === 'Cultural');
  const globalCategories = categories.filter(c => c.type === 'Global');

  // Fitness subcategories for the dropdown
  const fitnessGoalSubcategories = categories.filter(c => 
    c.type === 'Fitness' && 
    c.parentCategory && 
    ['high-protein', 'weight-loss', 'muscle-gain', 'pre-workout-meals', 'post-workout-meals'].includes(c.slug)
  );

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FiAward className="text-primary-600 text-2xl" />
            <span className="text-xl font-display font-bold text-primary-700">FitDish</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button 
                className={`flex items-center transition-colors font-medium py-4 ${showCategories ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowCategories(!showCategories);
                }}
              >
                Categories
                <FiChevronDown className={`ml-1 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategories && (
                <div className="absolute top-[80%] left-0 pt-4 w-[480px] z-50">
                  <div className="bg-white rounded-xl shadow-soft-lg p-6 border border-gray-100 grid grid-cols-2 gap-8 h-auto">
                    <div className="space-y-6">
                    {/* Fitness Foods - Highlighted */}
                    <div>
                      <h4 className="text-sm font-bold text-primary-600 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                        Fitness Foods ⭐
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {fitnessGoalSubcategories.map((cat) => (
                          <Link
                            key={cat._id}
                            to={`/category/${cat.slug}`}
                            className="text-sm text-gray-700 hover:text-primary-600 hover:translate-x-1 transition-all py-1 font-medium"
                            onClick={() => setShowCategories(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                        <Link
                          to="/category/fitness-foods"
                          className="text-xs text-primary-500 hover:text-primary-700 mt-2 font-semibold"
                          onClick={() => setShowCategories(false)}
                        >
                          View All Fitness Goals →
                        </Link>
                      </div>
                    </div>

                    {/* Cultural Foods */}
                    {culturalCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Cultural Foods</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {culturalCategories.map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat.slug}`}
                              className="text-sm text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all py-1"
                              onClick={() => setShowCategories(false)}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 border-l border-gray-100 pl-8">
                    {/* Indian Cuisine */}
                    {indianCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Indian Cuisine</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {indianCategories.slice(0, 5).map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat.slug}`}
                              className="text-sm text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all py-1"
                              onClick={() => setShowCategories(false)}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Global Cuisine */}
                    {globalCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 mb-3">Global Cuisine</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {globalCategories.slice(0, 5).map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat.slug}`}
                              className="text-sm text-gray-600 hover:text-primary-600 hover:translate-x-1 transition-all py-1"
                              onClick={() => setShowCategories(false)}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/chefs" className="text-gray-700 hover:text-primary-600 transition-colors">
              Chefs
            </Link>
            <Link to="/videos" className="text-gray-700 hover:text-primary-600 transition-colors">
              Videos
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'chef' ? (
                  <Link to="/chef/dashboard" className="btn btn-outline text-sm">
                    Chef Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-outline text-sm">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="text-xl" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

