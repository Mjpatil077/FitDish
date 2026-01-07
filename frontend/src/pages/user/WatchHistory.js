import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiCheckCircle } from 'react-icons/fi';

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const fetchWatchHistory = async () => {
    try {
      const res = await axios.get('/api/watch-history');
      setWatchHistory(res.data.watchHistory || []);
    } catch (error) {
      console.error('Error fetching watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding bg-secondary-50 min-h-screen">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading watch history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold text-primary-800 mb-8">
          Watch History
        </h1>

        {watchHistory.length === 0 ? (
          <div className="card text-center py-12">
            <FiClock className="text-primary-600 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold mb-2 text-primary-800">
              No watch history yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start watching videos to build your history!
            </p>
            <Link to="/videos" className="btn btn-primary">
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {watchHistory.map((watch) => (
              <Link
                key={watch._id}
                to={`/videos/${watch.video?._id}`}
                className="card hover:scale-[1.01] transition-transform flex items-center space-x-6"
              >
                <div className="w-48 h-32 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
                  {watch.video?.youtubeEmbedUrl ? (
                    <iframe
                      src={watch.video.youtubeEmbedUrl}
                      title={watch.video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiClock className="text-primary-600 text-3xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-display font-semibold text-primary-800 line-clamp-2">
                      {watch.video?.title}
                    </h3>
                    {watch.completed && (
                      <FiCheckCircle className="text-green-600 text-xl flex-shrink-0 ml-2" title="Completed" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <FiUsers className="mr-1" />
                    <span>{watch.video?.chef?.name}</span>
                    <span className="mx-2">•</span>
                    <FiClock className="mr-1" />
                    <span>{watch.video?.duration} min</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{watch.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${watch.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Watched {new Date(watch.watchedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;

