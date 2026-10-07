import React, { useRef, useState, useEffect } from 'react';
import StoryCard from './StoryCard.jsx';
import './ShortsFeed.css';

const ShortsFeed = ({ stories }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight } = containerRef.current;
      // Calculate which card is most in view
      const index = Math.round(scrollTop / clientHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      const clientHeight = containerRef.current.clientHeight;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        containerRef.current.scrollBy({ top: clientHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        containerRef.current.scrollBy({ top: -clientHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="shorts-feed-wrapper">
      <div 
        className="shorts-container" 
        ref={containerRef}
        onScroll={handleScroll}
      >
        {stories.map((story, index) => (
          <div className="story-snap-point" key={story._id || index}>
            <StoryCard 
              story={story} 
              isActive={index === activeIndex} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortsFeed;
