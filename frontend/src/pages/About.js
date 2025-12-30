import React from 'react';
import { Link } from 'react-router-dom';
import { FiAward, FiHeart, FiTarget } from 'react-icons/fi';

const About = () => {
  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
            About FitDish
          </h1>
          <p className="text-lg text-gray-600">
            Our mission to transform how people learn healthy cooking
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            FitDish sits at the intersection of food, fitness, and learning. We believe that 
            healthy eating shouldn't mean sacrificing flavor or authenticity. Our platform 
            connects health-conscious individuals with verified chefs who specialize in 
            nutritious, authentic cooking.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you're following a specific diet, training for fitness goals, or simply 
            want to eat better, FitDish provides the tools and community to make it happen.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="text-primary-600 text-3xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-primary-800">
              Health-Focused
            </h3>
            <p className="text-gray-600 text-sm">
              Every recipe and session is designed with your fitness goals in mind
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-primary-600 text-3xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-primary-800">
              Authentic
            </h3>
            <p className="text-gray-600 text-sm">
              Learn traditional cooking methods from verified, experienced chefs
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-primary-600 text-3xl" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-primary-800">
              Community
            </h3>
            <p className="text-gray-600 text-sm">
              Join a supportive community of health-conscious food lovers
            </p>
          </div>
        </div>

        <div className="card bg-primary-50 border-2 border-primary-200">
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-4">
            Join Us
          </h2>
          <p className="text-gray-700 mb-6">
            Ready to start your healthy cooking journey? Sign up today and get access to 
            free recipes, connect with verified chefs, and book live cooking sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/chefs" className="btn btn-outline">
              Explore Chefs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

