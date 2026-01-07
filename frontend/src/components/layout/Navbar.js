import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiUser, FiLogOut, FiAward, FiChevronDown } from 'react-icons/fi';
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
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center text-gray-700 hover:text-primary-600 transition-colors">
                Categories
                <FiChevronDown className="ml-1" />
              </button>
              
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-soft-lg p-4 border border-gray-100">
                  <div className="space-y-4">
                    {indianCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-primary-800 mb-2">Indian Cuisine</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {indianCategories.slice(0, 6).map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-1"
                              onClick={() => setShowCategories(false)}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {culturalCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-primary-800 mb-2">Cultural Foods</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {culturalCategories.map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-1"
                              onClick={() => setShowCategories(false)}
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {globalCategories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-primary-800 mb-2">Global Cuisine</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {globalCategories.slice(0, 6).map((cat) => (
                            <Link
                              key={cat._id}
                              to={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-1"
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
              )}
            </div>

            <Link to="/chefs" className="text-gray-700 hover:text-primary-600 transition-colors">
              Chefs
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-primary-600 transition-colors">
              Courses
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'chef' ? (
                  <>
                    <Link to="/chef/dashboard" className="btn btn-outline text-sm">
                      Chef Dashboard
                    </Link>
                    <Link to="/chef/courses" className="text-gray-700 hover:text-primary-600 transition-colors text-sm">
                      My Courses
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="btn btn-outline text-sm">
                      Dashboard
                    </Link>
                    <Link to="/my-courses" className="text-gray-700 hover:text-primary-600 transition-colors text-sm">
                      My Courses
                    </Link>
                  </>
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

