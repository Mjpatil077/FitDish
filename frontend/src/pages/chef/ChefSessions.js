import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiCalendar, FiUsers, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const ChefSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/api/sessions/chef/my-sessions');
      setSessions(res.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      fetchSessions();
    } catch (error) {
      alert('Error deleting session');
    }
  };

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <div className="text-primary-600 text-lg">Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding bg-secondary-50 min-h-screen">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold text-primary-800">
            My Sessions
          </h1>
          <Link to="/chef/sessions/create" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Create Session
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No sessions created yet</p>
            <Link to="/chef/sessions/create" className="btn btn-primary">
              Create Your First Session
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sessions.map((session) => (
              <div key={session._id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-2xl font-display font-semibold text-primary-800 mb-2">
                      {session.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{session.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        <span>{new Date(session.scheduledAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUsers className="mr-2" />
                        <span>{session.currentParticipants}/{session.maxParticipants}</span>
                      </div>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {session.sessionType === 'one-on-one' ? '1-on-1' : 'Group'}
                      </span>
                      <span className="text-lg font-bold text-primary-700">
                        ₹{session.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="btn btn-secondary flex items-center"
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefSessions;

