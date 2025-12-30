import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white mt-auto">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FiAward className="text-2xl" />
              <span className="text-xl font-display font-bold">FitDish</span>
            </div>
            <p className="text-primary-200 text-sm">
              Cook Smart. Eat Fit. Learn from Real Chefs.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/recipes" className="hover:text-white transition-colors">Free Recipes</Link></li>
              <li><Link to="/chefs" className="hover:text-white transition-colors">Chefs</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">For Users</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">For Chefs</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/signup" className="hover:text-white transition-colors">Become a Chef</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-12 pt-8 text-center text-sm text-primary-300">
          <p>&copy; {new Date().getFullYear()} FitDish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

