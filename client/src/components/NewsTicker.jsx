import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE from '../utils/api.js';

/* Fallback headlines shown while loading or if API is empty */
const FALLBACK = [
  'AI reshapes global markets as tech giants race to deploy next-gen models',
  'India startup ecosystem sees record funding in Q3 2026',
  'SpaceX successfully lands Starship for third consecutive mission',
  'Apple unveils spatial computing platform for enterprise workflows',
  'Climate summit reaches landmark carbon reduction agreement',
  'Google DeepMind publishes breakthrough in protein structure prediction',
  'OpenAI launches real-time voice reasoning assistant',
  'Electric vehicle sales surpass 50% of new car market in Europe',
];

const NewsTicker = () => {
  const [headlines, setHeadlines] = useState(FALLBACK);
  const [paused,    setPaused]    = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/stories?limit=20`);
        if (data.success && data.data?.length) {
          setHeadlines(data.data.map(s => s.headline).filter(Boolean));
        }
      } catch {
        /* keep fallback */
      }
    };
    load();
    const interval = setInterval(load, 60_000); // refresh every 60 s
    return () => clearInterval(interval);
  }, []);

  const items = [...headlines, ...headlines]; // double for seamless loop

  return (
    <div className="ticker-bar">
      <span className="ticker-live-badge">
        <span className="ticker-dot" />
        LIVE
      </span>

      <div
        className="ticker-track-wrapper"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`ticker-track ${paused ? 'paused' : ''}`}>
          {items.map((h, i) => (
            <span key={i} className="ticker-item">
              {h}
              <span className="ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
