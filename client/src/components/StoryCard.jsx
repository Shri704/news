import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Share2, Library } from 'lucide-react';
import SourceModal from './SourceModal.jsx';
import API_BASE from '../utils/api.js';
import './StoryCard.css';

/**
 * Resolves a story imageUrl to a full URL.
 * - Relative paths like /images/uuid.png  → http://localhost:5000/images/uuid.png
 * - Absolute URLs (https://...) pass through unchanged.
 */
const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};


/* ── localStorage helpers ─────────────────────────────── */
const SAVED_KEY = 'pulse_saved_stories';

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

function toggleSavedId(id) {
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next.includes(id);
}

/* ── StoryCard ────────────────────────────────────────── */
const StoryCard = ({ story, isActive }) => {
  const storyId = story._id || story.id || story.headline;

  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isSaved,     setIsSaved]       = useState(false);
  const [shareFlash,  setShareFlash]    = useState(false);
  const [toast,       setToast]         = useState(null); // { msg, icon }

  /* Sync saved state from localStorage on mount / story change */
  useEffect(() => {
    setIsSaved(getSavedIds().includes(storyId));
  }, [storyId]);

  /* ── Toast helper ────────────────────────────────────── */
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  /* ── Save handler ────────────────────────────────────── */
  const handleSave = useCallback(() => {
    const nowSaved = toggleSavedId(storyId);
    setIsSaved(nowSaved);
    showToast(nowSaved ? '🔖 Story saved!' : '🗑 Story removed');
  }, [storyId, showToast]);

  /* ── Share handler ───────────────────────────────────── */
  const handleShare = useCallback(async () => {
    const shareData = {
      title: story.headline,
      text:  story.summary || story.headline,
      url:   story.sources?.[0]?.url || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('✅ Shared!');
      } else {
        /* Clipboard fallback */
        const text = `${story.headline}\n\n${story.summary || ''}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(text);
        showToast('📋 Link copied to clipboard!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        showToast('⚠️ Could not share');
      }
    }

    setShareFlash(true);
    setTimeout(() => setShareFlash(false), 1200);
  }, [story, showToast]);

  /* ── Animation variants ──────────────────────────────── */
  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  };

  return (
    <div className={`story-card ${isActive ? '' : 'inactive'}`}>

      {/* ── Background ────────────────────────────────── */}
      <motion.div
        className="story-card__bg"
        animate={{ scale: isActive ? 1.06 : 1 }}
        transition={{ duration: 12, ease: 'easeOut' }}
      >
        <img
          src={
            resolveImageUrl(story.imageUrl) ||
            'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1080&auto=format&fit=crop'
          }
          alt={story.headline}
        />
        <div className="story-card__gradient" />
      </motion.div>

      {/* ── Accent strip ──────────────────────────────── */}
      <div className="story-card__accent" />

      {/* ── Side Action Rail ──────────────────────────── */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="story-card__rail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {/* Save */}
            <button
              className={`rail-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
              title={isSaved ? 'Unsave story' : 'Save story'}
            >
              <span className="rail-btn__icon">
                <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
              </span>
              <span className="rail-btn__label">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* Share */}
            <button
              className={`rail-btn ${shareFlash ? 'shared' : ''}`}
              onClick={handleShare}
              title="Share story"
            >
              <span className="rail-btn__icon">
                <Share2 size={20} />
              </span>
              <span className="rail-btn__label">Share</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────── */}
      <div className="story-card__content">
        <AnimatePresence>
          {isActive && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10 }}
            >
              {/* Category pill */}
              <motion.div variants={itemVariants}>
                <span className="story-card__pill">
                  {story.category || 'News'}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2 className="story-card__headline" variants={itemVariants}>
                {story.headline}
              </motion.h2>

              {/* Summary */}
              <motion.p className="story-card__summary" variants={itemVariants}>
                {story.summary}
              </motion.p>

              {/* Why it matters */}
              {story.whyItMatters && (
                <motion.div className="story-card__matters" variants={itemVariants}>
                  <h4>Why this matters</h4>
                  <p>{story.whyItMatters}</p>
                </motion.div>
              )}

              {/* Footer */}
              <motion.div className="story-card__footer" variants={itemVariants}>
                <span className="story-card__meta">
                  {new Date(story.publishedAt || Date.now()).toLocaleDateString(undefined, {
                    month: 'short',
                    day:   'numeric',
                  })}{' '}
                  &bull; {story.sources?.length || 1} source{story.sources?.length !== 1 ? 's' : ''}
                </span>

                <button
                  className="story-card__sources-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Library size={14} />
                  Sources
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Toast ─────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="story-card__toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Source Modal ──────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <SourceModal
            sources={story._sourcesData || story.sources}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryCard;
