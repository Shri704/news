// Shared API base — single source of truth for the whole client
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_BASE;

/* ── Category → High-Res Unsplash URL map ────────────────
   Since source.unsplash.com is deprecated/shut down, we use
   direct, hand-picked high-quality Unsplash photo IDs.   */
const CATEGORY_IMAGES = {
  'technology':    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1080&auto=format&fit=crop',
  'ai':            'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1080&auto=format&fit=crop',
  'business':      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1080&auto=format&fit=crop',
  'politics':      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1080&auto=format&fit=crop',
  'science':       'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1080&auto=format&fit=crop',
  'health':        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1080&auto=format&fit=crop',
  'sports':        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1080&auto=format&fit=crop',
  'entertainment': 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1080&auto=format&fit=crop',
  'environment':   'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1080&auto=format&fit=crop',
  'space':         'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop',
  'finance':       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1080&auto=format&fit=crop',
  'startup':       'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1080&auto=format&fit=crop',
  'india':         'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1080&auto=format&fit=crop',
  'world':         'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1080&auto=format&fit=crop',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1080&auto=format&fit=crop';

export const getFallbackImage = (text) => {
  const key = Object.keys(CATEGORY_IMAGES).find(k =>
    text?.toLowerCase().includes(k)
  );
  return key ? CATEGORY_IMAGES[key] : DEFAULT_IMAGE;
};

export const resolveImageUrl = (url, fallbackText) => {
  if (!url) return getFallbackImage(fallbackText);
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
};
