import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import ShortsFeed from '../components/ShortsFeed.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';

const Feed = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q');

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    const fetchStories = async () => {
      try {
        setLoading(true);
        // Clean and prepare keywords
        const keywords = query.split(',').map(k => k.trim()).filter(k => k);
        
        // In a real app we'd point to process.env.VITE_API_URL
        const response = await axios.post('http://localhost:5000/api/news/search', {
          keywords
        });

        if (response.data.success) {
          setStories(response.data.data);
        } else {
          setError(response.data.error?.message || 'Failed to fetch stories');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching news.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [query, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} style={{ padding: '1rem', marginTop: '1rem', background: '#333', color: 'white', borderRadius: '8px' }}>
          Go Back
        </button>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>
        <h2>No Stories Found</h2>
        <p>Could not find enough news for "{query}" right now.</p>
        <button onClick={() => navigate('/')} style={{ padding: '1rem', marginTop: '1rem', background: '#333', color: 'white', borderRadius: '8px' }}>
          Try Another Search
        </button>
      </div>
    );
  }

  return (
    <div className="feed-page" style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: '#000' }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        <ArrowLeft size={20} />
      </button>
      <ShortsFeed stories={stories} />
    </div>
  );
};

export default Feed;
