import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, ArrowRight, Zap, Layers,
  BrainCircuit, ImageIcon, TrendingUp, Clock, ExternalLink,
} from 'lucide-react';
import axios from 'axios';
import API_BASE, { resolveImageUrl } from '../utils/api.js';
import './Home.css';

const PRESET_TOPICS = [
  'OpenAI', 'Artificial Intelligence', 'India Startups',
  'Apple', 'SpaceX', 'Climate Change', 'Google', 'Technology',
];

const HOW_IT_WORKS = [
  { icon: <Zap size={22} />,         title: 'Fetch',     desc: 'Pull live stories from Google News, Reddit & Hacker News in real time.' },
  { icon: <Layers size={22} />,      title: 'Cluster',   desc: 'Group duplicate stories from different sources using Jaccard Similarity.' },
  { icon: <BrainCircuit size={22} />,title: 'Summarise', desc: 'AI condenses each cluster into a crisp 60-word story with context.' },
  { icon: <ImageIcon size={22} />,   title: 'Visualise', desc: 'Generate editorial images and serve everything as an immersive feed.' },
];

/* ─── Recent Story Mini-Card ─────────────────────────── */
const MiniCard = ({ story, onClick }) => {
  const img = resolveImageUrl(story.imageUrl, story.category || story.headline);

  return (
    <motion.div
      className="mini-card"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="mini-card__img-wrap">
        <img src={img} alt={story.headline} loading="lazy" />
        <div className="mini-card__overlay" />
        {story.category && (
          <span className="mini-card__pill">{story.category}</span>
        )}
      </div>
      <div className="mini-card__body">
        <h3 className="mini-card__headline">{story.headline}</h3>
        <div className="mini-card__footer">
          <span className="mini-card__meta">
            <Clock size={11} />
            {story.sources?.length || 1} source{story.sources?.length !== 1 ? 's' : ''}
          </span>
          <span className="mini-card__read">
            Read <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Home Page ──────────────────────────────────────── */
const Home = () => {
  const [query,      setQuery]      = useState('');
  const [isSearching,setIsSearching]= useState(false);
  const [stories,    setStories]    = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const navigate = useNavigate();

  /* Allow body scroll only on Home */
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'hidden'; };
  }, []);

  /* Fetch recent stories for the grid */
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/stories?limit=6`);
        if (data.success) setStories(data.data || []);
      } catch { /* silent */ }
      finally { setStoriesLoading(false); }
    };
    load();
    const iv = setInterval(load, 60_000);
    return () => clearInterval(iv);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => navigate(`/feed?q=${encodeURIComponent(query.trim())}`), 600);
  }, [query, navigate]);

  const handleChip = useCallback((topic) => {
    setIsSearching(true);
    setTimeout(() => navigate(`/feed?q=${encodeURIComponent(topic)}`), 600);
  }, [navigate]);

  const handleMiniCard = useCallback((story) => {
    // pick first keyword from headline
    const kw = story.headline?.split(' ').slice(0, 3).join(' ') || 'news';
    navigate(`/feed?q=${encodeURIComponent(kw)}`);
  }, [navigate]);

  return (
    <div className="home-page">

      {/* ── Sticky Navbar ─────────────────────────────── */}
      <nav className="home-nav">
        <div className="home-nav__inner">
          <div className="home-nav__logo">
            <Sparkles size={18} />
            <span>PulseShorts</span>
          </div>
          <span className="home-nav__tagline">Real news. Zero noise.</span>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow hero-glow--left" />
        <div className="hero-glow hero-glow--right" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <TrendingUp size={13} />
            AI-powered news, delivered as stories
          </motion.div>

          <h1 className="hero-title">
            What's happening<br />
            in the <span className="hero-gradient">world?</span>
          </h1>
          <p className="hero-subtitle">
            Turn real-time news into intelligent visual stories.<br className="hero-br" />
            One search. Infinite perspectives.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="search-form">
            <div className={`search-wrapper ${isSearching ? 'searching' : ''}`}>
              <Search className="search-icon" size={20} />
              <input
                className="search-input"
                type="text"
                placeholder="Search topics, companies, people…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={isSearching}
                autoComplete="off"
              />
              <button type="submit" className="search-btn" disabled={isSearching}>
                {isSearching
                  ? <span className="btn-spinner" />
                  : <><span>Discover</span><ArrowRight size={16} /></>
                }
              </button>
            </div>
          </form>

          {/* Trending chips */}
          <div className="chips-section">
            <span className="chips-label">Trending</span>
            <div className="chips-row">
              {PRESET_TOPICS.map((topic, i) => (
                <motion.button
                  key={topic}
                  className="chip"
                  onClick={() => handleChip(topic)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Recent Stories ────────────────────────────── */}
      <section className="stories-section">
        <div className="section-header">
          <h2 className="section-title">
            <Clock size={18} />
            Recent Stories
          </h2>
          <span className="section-live-dot">
            <span className="live-ring" />
            Live
          </span>
        </div>

        {storiesLoading ? (
          <div className="stories-skeleton">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-lines">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="stories-empty">
            <Sparkles size={32} />
            <p>No stories yet — run a search to generate your first feed!</p>
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((story, i) => (
              <motion.div
                key={story._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <MiniCard story={story} onClick={() => handleMiniCard(story)} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="how-section">
        <h2 className="section-title centered">How PulseShorts works</h2>
        <div className="how-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.title}
              className="how-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="how-card__icon">{step.icon}</div>
              <div className="how-card__step">0{i + 1}</div>
              <h3 className="how-card__title">{step.title}</h3>
              <p className="how-card__desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <Sparkles size={15} />
            PulseShorts
          </div>
          <p className="home-footer__sub">
            Your world. One story at a time.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
