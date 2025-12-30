import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiUser, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';

const ChefProfile = () => {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefData();
  }, [id]);

  const fetchChefData = async () => {
    try {
      const [chefRes, sessionsRes, videosRes] = await Promise.all([
        axios.get(`/api/chefs/${id}`),
        axios.get(`/api/chefs/${id}/sessions`),
        axios.get(`/api/videos/chef/${id}`)
      ]);
      setChef(chefRes.data.chef);
      setSessions(sessionsRes.data.sessions);
      setVideos(videosRes.data.videos || []);
    } catch (error) {
      console.error('Error fetching chef data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading chef profile...</div>
        </div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <p className="text-gray-600 text-lg">Chef not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        {/* Chef Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              {chef.avatar ? (
                <img src={chef.avatar} alt={chef.name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <FiUser className="text-primary-600 text-4xl" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-display font-bold text-primary-800">
                  {chef.name}
                </h1>
                {chef.isVerified && (
                  <FiCheckCircle className="text-primary-600 text-2xl" title="Verified Chef" />
                )}
              </div>
              {chef.rating > 0 && (
                <div className="flex items-center mb-3">
                  <FiStar className="text-accent-500 mr-1" />
                  <span className="font-semibold text-lg">{chef.rating.toFixed(1)}</span>
                  <span className="ml-2 text-gray-600">({chef.totalReviews} reviews)</span>
                </div>
              )}
              {chef.bio && (
                <p className="text-gray-700 leading-relaxed mb-4">{chef.bio}</p>
              )}
              {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {chef.cuisineSpecialties.map((cuisine, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">
              Video Tutorials
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Link
                  key={video._id}
                  to={`/videos/${video._id}`}
                  className="card hover:scale-[1.02] transition-transform"
                >
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 relative overflow-hidden">
                    <iframe
                      src={video.youtubeEmbedUrl}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 text-primary-800 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{video.duration} min</span>
                    </div>
                    {video.caloriesEstimate > 0 && (
                      <span>{video.caloriesEstimate} cal</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-primary-800 mb-6">
            Upcoming Sessions
          </h2>
          {sessions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No upcoming sessions available</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <div key={session._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-display font-semibold text-primary-800">
                      {session.title}
                    </h3>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {session.sessionType === 'one-on-one' ? '1-on-1' : 'Group'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {session.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      <span>{session.currentParticipants}/{session.maxParticipants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-700">
                      ₹{session.price}
                    </span>
                    <Link
                      to={`/book-session/${session._id}`}
                      className="btn btn-primary text-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;

