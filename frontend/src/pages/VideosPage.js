import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiStar } from 'react-icons/fi';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const chefId = searchParams.get('chefId');

  useEffect(() => {
    fetchVideos();
  }, [category, chefId]);

  const fetchVideos = async () => {
    try {
      let url = '/api/videos?isFree=true';
      if (category) url += `&category=${category}`;
      if (chefId) url += `&chefId=${chefId}`;

      const res = await axios.get(url);
      setVideos(res.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading videos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-800 mb-4">
            Free Video Tutorials
          </h1>
          <p className="text-lg text-gray-600">
            Learn healthy cooking from verified chefs
          </p>
        </div>

        {videos.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No videos available yet</p>
          </div>
        ) : (
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
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiUsers className="mr-1" />
                    <span>{video.chef?.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {video.caloriesEstimate > 0 && (
                      <span>{video.caloriesEstimate} cal</span>
                    )}
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{video.duration} min</span>
                    </div>
                  </div>
                </div>
                {video.category && (
                  <div className="mt-3">
                    <Link
                      to={`/category/${video.category.slug || video.category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-200"
                    >
                      {video.category.name}
                    </Link>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;

