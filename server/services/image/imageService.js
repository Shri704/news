import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

/**
 * Generates or extracts a background image for a story.
 *
 * Priority:
 *   1. Bing Image Search  → Scrapes Bing for real, topic-relevant images (no key, fast)
 *   2. Pollinations AI    → AI-generated fallback (no key, free)
 */
export const generateImage = async (prompt, keywords = [], articleUrl = null) => {
  // Build the best search query from the prompt + keywords
  const searchQuery = buildSearchQuery(prompt, keywords);

  // 1. Try Bing Image Search (reliable, no key, returns real photos)
  try {
    const bingImg = await getBingImage(searchQuery);
    if (bingImg) {
      console.log(`🖼️  Bing image: ${bingImg.substring(0, 70)}`);
      return bingImg;
    }
  } catch (e) {
    console.warn(`⚠️  Bing image search failed: ${e.message}`);
  }

  // 2. Fallback: Pollinations AI (generates an image matching the prompt)
  return getPollinationsImage(searchQuery);
};

// ── Bing Image Search (no API key required) ───────────────────────────────────
const getBingImage = async (query) => {
  const res = await axios.get('https://www.bing.com/images/search', {
    params: {
      q: query,
      form: 'HDRSC2',
      first: 1,
      count: 5,
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
    timeout: 6000,
  });

  // Bing encodes image URLs inside murl&quot;:&quot;... patterns
  const matches = [...res.data.matchAll(/murl&quot;:&quot;(https?:[^&"]+)&quot;/g)];
  if (matches.length > 0) {
    // Pick a random one from the top 5 so different stories get different images
    const pick = matches[Math.floor(Math.random() * Math.min(matches.length, 5))];
    return decodeURIComponent(pick[1]);
  }

  // Alternate format (sometimes Bing changes the encoding)
  const altMatch = res.data.match(/"murl":"(https?:[^"]+)"/);
  if (altMatch) return decodeURIComponent(altMatch[1]);

  return null;
};

// ── Search query builder ──────────────────────────────────────────────────────
const buildSearchQuery = (prompt, keywords) => {
  // Combine the imagePrompt (concise description) with top keywords
  const parts = [];
  if (prompt) parts.push(prompt.replace(/\. (Photorealistic|Cinematic|Photo).*$/i, '').substring(0, 100));
  if (keywords?.length) parts.push(keywords.slice(0, 2).join(' '));
  return parts.join(' ').trim() || 'breaking news today';
};

// ── Pollinations AI fallback ──────────────────────────────────────────────────
const getPollinationsImage = (query) => {
  const q = encodeURIComponent(`${query}, photorealistic, high quality`);
  return `https://image.pollinations.ai/prompt/${q}?width=1080&height=1920&nologo=true`;
};
