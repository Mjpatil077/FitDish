import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiUsers, FiStar, FiCheckCircle } from 'react-icons/fi';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoData();
  }, [id]);

  const fetchVideoData = async () => {
    try {
      const videoRes = await axios.get(`/api/videos/${id}`);
      setVideo(videoRes.data.video);

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
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading video...</div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <p className="text-gray-600 text-lg">Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen">
      {/* Cinema Style Player Section */}
      <section className="bg-primary-900 pt-28 pb-12 shadow-2xl">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/5 relative group">
              <iframe
                src={video.youtubeEmbedUrl}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {/* Subtle overlay for the "cinema" feel */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom max-w-7xl py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {video.category && (
                  <Link
                    to={`/category/${video.category.slug || video.category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary-200 transition-colors"
                  >
                    {video.category.name}
                  </Link>
                )}
                <div className="flex items-center px-4 py-1.5 bg-accent-50 text-accent-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <FiClock className="mr-2" />
                  <span>{video.duration} Minutes</span>
                </div>
                {video.caloriesEstimate > 0 && (
                  <div className="flex items-center px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <span>{video.caloriesEstimate} Kcal Content</span>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6 leading-tight">
                {video.title}
              </h1>

              <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-8">
                <div className="flex items-center space-x-12 text-sm text-gray-400 font-bold uppercase tracking-widest">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-[10px] mb-1">Views</span>
                    <span className="text-primary-800">{(video.views || 0).toLocaleString()} Views</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-[10px] mb-1">Uploaded</span>
                    <span className="text-primary-800">Verified FitDish Content</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-3 rounded-full bg-white shadow-soft text-primary-600 hover:bg-primary-600 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </button>
                  <button className="p-3 rounded-full bg-white shadow-soft text-primary-600 hover:bg-primary-600 hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  </button>
                </div>
              </div>
              
              <div className="prose prose-primary max-w-none">
                <p className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-primary-200 pl-6 py-2">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Chef Info Card */}
            {video.chef && (
              <div className="group relative bg-white rounded-[2.5rem] p-1 shadow-soft hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100/50">
                <div className="bg-primary-50 p-8 rounded-[2.2rem] flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <Link to={`/chefs/${video.chef._id}`} className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {video.chef.avatar ? (
                        <img src={video.chef.avatar} alt={video.chef.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                          <FiUsers className="text-primary-600 text-3xl" />
                        </div>
                      )}
                    </div>
                    {video.chef.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1 rounded-full border-2 border-white shadow-md">
                        <FiCheckCircle className="text-[10px]" />
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                      <h3 className="text-2xl font-display font-bold text-primary-900">
                        Instructed by {video.chef.name}
                      </h3>
                      {video.chef.rating > 0 && (
                        <div className="flex items-center justify-center md:justify-start text-sm font-bold text-accent-600 bg-white px-3 py-1 rounded-full shadow-sm border border-accent-100">
                          <FiStar className="mr-1.5 fill-current" />
                          <span>{video.chef.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {video.chef.bio}
                    </p>
                    <Link
                      to={`/chefs/${video.chef._id}`}
                      className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                    >
                      Explore More from Chef <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Precision Curation */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-black text-primary-900 uppercase tracking-tighter">
                  Up Next
                </h2>
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">Recommended</span>
              </div>
              
              {relatedVideos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">No related culinary gems found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {relatedVideos.map((relatedVideo) => (
                    <Link
                      key={relatedVideo._id}
                      to={`/videos/${relatedVideo._id}`}
                      className="group flex space-x-4 p-2 rounded-2xl hover:bg-white hover:shadow-premium transition-all duration-300 border border-transparent hover:border-gray-100"
                    >
                      <div className="w-32 h-20 bg-gray-200 rounded-xl overflow-hidden shadow-inner shrink-0 relative">
                        <img 
                          src={relatedVideo.thumbnail || `https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=200&auto=format&fit=crop`} 
                          alt={relatedVideo.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-transparent"></div>
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="text-sm font-bold text-primary-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors mb-1">
                          {relatedVideo.title}
                        </h4>
                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest space-x-3">
                          <span className="truncate">{relatedVideo.chef?.name}</span>
                          <span className="h-1 w-1 bg-gray-200 rounded-full"></span>
                          <span className="shrink-0">{relatedVideo.duration}m</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Promo Card in Sidebar */}
              <div className="mt-12 p-8 bg-gradient-to-br from-primary-800 to-primary-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <FiUsers className="text-8xl text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3 relative z-10">
                  Join the Live Kitchen
                </h3>
                <p className="text-primary-300 text-xs leading-relaxed mb-6 relative z-10">
                  Watch, learn, and interact in real-time with your favorite chefs.
                </p>
                <Link to="/explore-chefs" className="inline-block w-full py-4 bg-accent-500 hover:bg-accent-600 text-white text-center rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-accent-900/20 transition-all relative z-10">
                  Explore Sessions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;

