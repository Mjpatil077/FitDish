import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FiUser, FiSave } from 'react-icons/fi';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    dietType: '',
    fitnessGoals: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        dietType: user.dietType || '',
        fitnessGoals: user.fitnessGoals || []
      });
    }
  }, [user]);

  const dietTypes = [
    'none',
    'vegetarian',
    'vegan',
    'non-vegetarian',
    'flexitarian',
    'keto',
    'paleo'
  ];

  const fitnessGoals = [
    'Weight Loss',
    'Muscle Gain',
    'General Health',
    'Athletic Performance',
    'Heart Health',
    'Digestive Health'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoalToggle = (goal) => {
    const goals = formData.fitnessGoals.includes(goal)
      ? formData.fitnessGoals.filter(g => g !== goal)
      : [...formData.fitnessGoals, goal];
    setFormData({ ...formData, fitnessGoals: goals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/users/profile', formData);
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
          Profile & Preferences
        </h1>

        <div className="card">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser className="text-primary-600 text-3xl" />
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
              <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 mb-2">
                Diet Type
              </label>
              <select
                id="dietType"
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                className="input"
              >
                {dietTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Fitness Goals
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {fitnessGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      formData.fitnessGoals.includes(goal)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <FiSave className="mr-2" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

