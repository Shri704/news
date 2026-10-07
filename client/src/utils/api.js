// Shared API base — single source of truth for the whole client
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_BASE;

/* ── Category → Unsplash keyword map ───────────────────── */
const CATEGORY_KEYWORDS = {
  'technology':    'technology-futuristic',
  'ai':            'artificial-intelligence',
  'business':      'business-finance',
  'politics':      'government-politics',
  'science':       'science-research',
  'health':        'healthcare-medical',
  'sports':        'sports-action',
  'entertainment': 'entertainment-movie',
  'environment':   'nature-environment',
  'space':         'space-universe',
  'finance':       'stock-market',
  'startup':       'startup-innovation',
  'india':         'india-city',
  'world':         'world-news',
};

export const getFallbackImage = (text) => {
  const key = Object.keys(CATEGORY_KEYWORDS).find(k =>
    text?.toLowerCase().includes(k)
  );
  const topic = key ? CATEGORY_KEYWORDS[key] : 'breaking-news';
  return `https://source.unsplash.com/1080x1920/?${encodeURIComponent(topic)}&auto=format&fit=crop`;
};

export const resolveImageUrl = (url, fallbackText) => {
  if (!url) return getFallbackImage(fallbackText);
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};
