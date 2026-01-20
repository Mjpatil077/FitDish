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
          <div className="text-center py-20 bg-primary-50 rounded-[2.5rem] border-2 border-dashed border-primary-100">
            <p className="text-primary-400 font-medium">No video tutorials available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Link
                key={video._id}
                to={`/videos/${video._id}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50"
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img 
                    src={video.thumbnail || `https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop`} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-primary-600 border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    {video.duration} min
                  </div>
                </div>

                <div className="p-6">
                  {video.category && (
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary-100">
                        {video.category.name}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-display font-bold mb-3 text-primary-800 line-clamp-2 min-h-[3.5rem] group-hover:text-primary-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">
                    <div className="flex items-center">
                      <FiUsers className="mr-1.5" />
                      <span className="truncate max-w-[100px]">{video.chef?.name || 'Top Chef'}</span>
                    </div>
                    {video.caloriesEstimate > 0 && (
                      <span className="text-accent-600">{video.caloriesEstimate} cals</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;

