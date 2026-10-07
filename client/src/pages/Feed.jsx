import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import ShortsFeed from '../components/ShortsFeed.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import API_BASE from '../utils/api.js';
import './Feed.css';

const Feed = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location  = useLocation();
  const navigate  = useNavigate();
  const query     = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (!query) { navigate('/'); return; }

    const fetchStories = async () => {
      try {
        setLoading(true);
        const keywords = query.split(',').map(k => k.trim()).filter(Boolean);
        const { data } = await axios.post(`${API_BASE}/api/news/search`, { keywords });
        if (data.success) setStories(data.data);
        else setError(data.error?.message || 'Failed to fetch stories');
      } catch (err) {
        setError(err.message || 'An error occurred while fetching news.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [query, navigate]);

  if (loading) return <LoadingScreen />;

  if (error) return (
    <div className="feed-state">
      <h2>Something went wrong</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/')}>Go Back</button>
    </div>
  );

  if (stories.length === 0) return (
    <div className="feed-state">
      <h2>No Stories Found</h2>
      <p>Could not find enough news for "{query}" right now.</p>
      <button onClick={() => navigate('/')}>Try Another Search</button>
    </div>
  );

  return (
    <div className="feed-page">
      {/* Back button — lives inside feed, overlays the card */}
      <button className="feed-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
      </button>

      <ShortsFeed stories={stories} />
    </div>
  );
};

export default Feed;
