import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import { FiClock, FiUsers, FiStar, FiCheckCircle, FiLock } from 'react-icons/fi';

const VideoDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchVideoData();
  }, [id]);

  // Track watch progress
  useEffect(() => {
    if (video && user) {
      const trackProgress = () => {
        const interval = setInterval(() => {
          axios.post('/api/watch-history', {
            videoId: video._id,
            progress: 50
          }).catch(err => console.error('Error tracking progress:', err));
        }, 30000);

        return () => clearInterval(interval);
      };

      const cleanup = trackProgress();
      return cleanup;
    }
  }, [video, user]);

  const fetchVideoData = async () => {
    try {
      const videoRes = await axios.get(`/api/videos/${id}`);
      setVideo(videoRes.data.video);
      
      // If not logged in, show login modal
      if (!user) {
        setShowLoginModal(true);
      }

      // Fetch related videos
      if (videoRes.data.video.category && videoRes.data.video.category.slug) {
        const relatedRes = await axios.get(
          `/api/videos/category/${videoRes.data.video.category.slug}`
        );
        setRelatedVideos(
          relatedRes.data.videos.filter(v => v._id !== id).slice(0, 3)
        );
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setShowLoginModal(true);
      }
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading video...</div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <p className="text-gray-600 text-lg">Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <div className="container-custom max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="aspect-video bg-gray-900 rounded-xl mb-6 overflow-hidden relative">
                {user ? (
                  <iframe
                    src={video.youtubeEmbedUrl}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                    <FiLock className="text-6xl mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold mb-2">Login to Watch</h3>
                    <p className="text-gray-300 text-center mb-6 max-w-md">
                      Login to watch this video and personalize your FitDish journey
                    </p>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 font-semibold"
                    >
                      Login to Watch
                    </button>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-display font-bold text-primary-800 mb-4">
                {video.title}
              </h1>
              
              {video.description && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {video.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>{video.duration} minutes</span>
                </div>
                {video.caloriesEstimate > 0 && (
                  <div>
                    <span className="font-semibold">{video.caloriesEstimate}</span> calories
                  </div>
                )}
                {video.views > 0 && (
                  <div>
                    <span>{video.views}</span> views
                  </div>
                )}
                {video.category && (
                  <Link
                    to={`/category/${video.category.slug || video.category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-200"
                  >
                    {video.category.name}
                  </Link>
                )}
              </div>
            </div>

            {/* Chef Info */}
            {video.chef && (
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {video.chef.avatar ? (
                      <img src={video.chef.avatar} alt={video.chef.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <FiUsers className="text-primary-600 text-3xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-display font-semibold text-primary-800">
                        {video.chef.name}
                      </h3>
                      {video.chef.isVerified && (
                        <FiCheckCircle className="text-primary-600" title="Verified Chef" />
                      )}
                    </div>
                    {video.chef.rating > 0 && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <FiStar className="text-accent-500 mr-1" />
                        <span>{video.chef.rating.toFixed(1)}</span>
                        <span className="ml-1">({video.chef.totalReviews} reviews)</span>
                      </div>
                    )}
                    {video.chef.bio && (
                      <p className="text-gray-600 text-sm">{video.chef.bio}</p>
                    )}
                    <Link
                      to={`/chefs/${video.chef._id}`}
                      className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Chef Profile →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Related Videos */}
          <div>
            <h2 className="text-xl font-display font-bold text-primary-800 mb-6">
              Related Videos
            </h2>
            {relatedVideos.length === 0 ? (
              <p className="text-gray-600 text-sm">No related videos</p>
            ) : (
              <div className="space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <div
                    key={relatedVideo._id}
                    onClick={handleVideoClick}
                    className="card hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <div className="aspect-video bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
                      {user ? (
                        <iframe
                          src={relatedVideo.youtubeEmbedUrl}
                          title={relatedVideo.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <FiLock className="text-white text-2xl opacity-50" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-primary-800 line-clamp-2 mb-2">
                      {relatedVideo.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{relatedVideo.chef?.name}</span>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        <span>{relatedVideo.duration} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
