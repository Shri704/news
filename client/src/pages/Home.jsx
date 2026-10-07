import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import './Home.css';

const PRESET_TOPICS = [
  'OpenAI', 'Artificial Intelligence', 'India Startups', 'Apple', 'Google', 'SpaceX', 'Technology'
];

const Home = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate loading for animation before redirect
    setTimeout(() => {
      navigate(`/feed?q=${encodeURIComponent(query)}`);
    }, 800);
  };

  const handleChipClick = (topic) => {
    setQuery(topic);
  };

  return (
    <div className="home-container">
      <div className="background-glow"></div>
      
      <motion.div 
        className="content-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="logo"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, yoyo: Infinity }}
        >
          <Sparkles className="logo-icon" />
          <span className="logo-text">PulseShorts</span>
        </motion.div>

        <h1 className="hero-title">
          What's happening <br/> in the <span className="gradient-text">world?</span>
        </h1>
        <p className="hero-subtitle">
          Turn real-time news into intelligent visual stories.
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <div className={`search-input-wrapper ${isSearching ? 'scanning' : ''}`}>
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search topics, companies, people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSearching}
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={isSearching}>
              {isSearching ? <span className="loader"></span> : 'Discover Stories'}
            </button>
          </div>
        </form>

        <div className="topics-container">
          <p className="topics-label">Trending Topics</p>
          <div className="chips-wrapper">
            {PRESET_TOPICS.map((topic, i) => (
              <motion.button
                key={topic}
                className="topic-chip glass-panel"
                onClick={() => handleChipClick(topic)}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
