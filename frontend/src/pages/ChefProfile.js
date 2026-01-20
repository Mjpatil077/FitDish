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
    <div className="bg-secondary-50 min-h-screen">
      {/* Immersive Chef Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-800 to-secondary-50"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          {/* Abstract blobs for visual interest */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-accent-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-10">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-accent-500 to-primary-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white rounded-full p-2 shadow-2xl overflow-hidden border-4 border-white/20">
                  {chef.avatar ? (
                    <img 
                      src={chef.avatar} 
                      alt={chef.name} 
                      className="w-full h-full rounded-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-50 flex items-center justify-center rounded-full">
                      <FiUser className="text-primary-600 text-6xl" />
                    </div>
                  )}
                </div>
                {chef.isVerified && (
                  <div className="absolute bottom-2 right-6 bg-primary-600 text-white p-3 rounded-full border-4 border-white shadow-xl">
                    <FiCheckCircle className="text-xl" title="Verified Chef" />
                  </div>
                )}
              </div>

              {/* Chef Info */}
              <div className="text-center md:text-left flex-1 pb-4">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
                  <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
                    {chef.name}
                  </h1>
                  
                  {chef.rating > 0 && (
                    <div className="flex items-center justify-center md:justify-start">
                      <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <FiStar className="text-accent-400 mr-2 fill-accent-400" />
                        <span className="font-bold text-white text-lg">{chef.rating.toFixed(1)}</span>
                        <span className="ml-2 text-white/60 text-sm">({chef.totalReviews} reviews)</span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-primary-100 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                  {chef.bio}
                </p>

                {chef.cuisineSpecialties && chef.cuisineSpecialties.length > 0 && (
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {chef.cuisineSpecialties.map((cuisine, idx) => (
                      <span
                        key={idx}
                        className="px-5 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full text-sm font-semibold tracking-wide"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom -mt-10 relative z-20 pb-20">
        <div className="bg-white rounded-[3rem] shadow-premium p-8 md:p-12">

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
                  Masterclasses & Recipes
                </h2>
                <div className="h-1 flex-1 bg-primary-50 mx-8 rounded-full hidden md:block"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <Link
                    key={video._id}
                    to={`/videos/${video._id}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500 border border-gray-100"
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
                      <h3 className="text-xl font-display font-bold mb-3 text-primary-800 line-clamp-2 min-h-[3.5rem] group-hover:text-primary-600 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-4">
                        <div className="flex items-center">
                          <FiClock className="mr-1.5" />
                          <span>Quick Guide</span>
                        </div>
                        {video.caloriesEstimate > 0 && (
                          <span className="text-accent-600">{video.caloriesEstimate} cals</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Sessions */}
          <section className="relative">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
                Live Interactive Sessions
              </h2>
              <div className="h-1 flex-1 bg-primary-50 mx-8 rounded-full hidden md:block"></div>
            </div>
            
            {sessions.length === 0 ? (
              <div className="text-center py-20 bg-primary-50/50 rounded-[2.5rem] border-2 border-dashed border-primary-100">
                <FiUsers className="mx-auto text-4xl text-primary-200 mb-4" />
                <p className="text-primary-400 font-medium">No live sessions scheduled at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {sessions.map((session) => (
                  <div key={session._id} className="group bg-white rounded-[2.5rem] p-8 shadow-soft border border-gray-100 hover:border-primary-200 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div>
                        <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                          {session.sessionType === 'one-on-one' ? 'Private 1-on-1' : 'Interactive Group'}
                        </span>
                        <h3 className="text-2xl font-display font-bold text-primary-800 mb-2">
                          {session.title}
                        </h3>
                      </div>
                      <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold shadow-inner">
                        <FiClock />
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 relative z-10 italic">
                      "{session.description}"
                    </p>
                    
                    <div className="flex items-center justify-between p-4 bg-primary-50/50 rounded-2xl mb-8 relative z-10 border border-primary-50">
                      <div className="flex items-center text-primary-700 font-bold text-xs uppercase tracking-tighter">
                        <FiClock className="mr-2" />
                        <span>{new Date(session.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-primary-700 font-bold text-xs uppercase tracking-tighter">
                        <FiUsers className="mr-2" />
                        <span>{session.currentParticipants}/{session.maxParticipants} Spots</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</span>
                        <span className="text-3xl font-display font-black text-primary-600">
                          ₹{session.price}
                        </span>
                      </div>
                      <Link
                        to={`/book-session/${session._id}`}
                        className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                      >
                        Reserve Spot
                      </Link>
                    </div>
                    
                    {/* Decorative background number */}
                    <div className="absolute top-[-20px] right-[-20px] text-[120px] font-display font-black text-primary-50/50 -z-0">
                      {session.sessionType === 'one-on-one' ? '01' : 'G'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;

