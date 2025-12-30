import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FiSave, FiUser } from 'react-icons/fi';

const ChefProfileManage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bio: '',
    cuisineSpecialties: [],
    experience: 0,
    avatar: ''
  });
  const [newCuisine, setNewCuisine] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        cuisineSpecialties: user.cuisineSpecialties || [],
        experience: user.experience || 0,
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addCuisine = () => {
    if (newCuisine.trim() && !formData.cuisineSpecialties.includes(newCuisine.trim())) {
      setFormData({
        ...formData,
        cuisineSpecialties: [...formData.cuisineSpecialties, newCuisine.trim()]
      });
      setNewCuisine('');
    }
  };

  const removeCuisine = (cuisine) => {
    setFormData({
      ...formData,
      cuisineSpecialties: formData.cuisineSpecialties.filter(c => c !== cuisine)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/chefs/profile', formData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom max-w-2xl">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          Manage Chef Profile
        </h1>

        <div className="card">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
              ) : (
                <FiUser className="text-primary-600 text-3xl" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-display font-semibold text-primary-800">
                {user?.name}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl ${
              message.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input"
                rows="5"
                placeholder="Tell us about your culinary background and expertise..."
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cuisine Specialties
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCuisine}
                  onChange={(e) => setNewCuisine(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                  className="input flex-1"
                  placeholder="e.g., Indian, Italian, Healthy"
                />
                <button
                  type="button"
                  onClick={addCuisine}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cuisineSpecialties.map((cuisine, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium flex items-center"
                  >
                    {cuisine}
                    <button
                      type="button"
                      onClick={() => removeCuisine(cuisine)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <FiSave className="mr-2" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChefProfileManage;

