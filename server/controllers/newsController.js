import { collectAndNormalizeNews } from '../services/news/newsNormalizer.js';
import { clusterStories } from '../services/news/clusterService.js';
import { generateStoryFromCluster } from '../services/ai/aiService.js';
import { generateImage } from '../services/image/imageService.js';
import { Story } from '../models/Story.js';
import { Source } from '../models/Source.js';
import { SearchHistory } from '../models/SearchHistory.js';

export const processNewsSearch = async (req, res, next) => {
  try {
    const { keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ success: false, error: { message: 'Keywords are required' } });
    }

    // Save search history (fire and forget)
    SearchHistory.create({ query: keywords.join(', ') }).catch(e => console.error('SearchHistory error:', e));

    // 1. Collect & Normalize from real sources
    const rawNews = await collectAndNormalizeNews(keywords);

    if (rawNews.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // 2. Cluster similar stories
    const clusters = clusterStories(rawNews);
    const topClusters = clusters.slice(0, 5);

    // 3. Process ALL clusters in parallel — no sequential waiting
    const finalStories = await Promise.all(
      topClusters.map(async (cluster) => {
        try {
          // Generate AI summary + image simultaneously in parallel
          const [aiData, imageUrl] = await Promise.all([
            generateStoryFromCluster(cluster, keywords),
            generateImage(cluster.items?.[0]?.headline, keywords),
          ]);

          // Save sources + story to DB
          const savedSources = await Promise.all(
            cluster.items.map(item => Source.create(item))
          );

          const savedStory = await Story.create({
            clusterId: cluster.id,
            headline: aiData.headline,
            summary: aiData.summary,
            whyItMatters: aiData.whyItMatters,
            imageUrl,
            imagePrompt: aiData.imagePrompt,
            category: keywords[0] || 'General',
            keywords,
            sources: savedSources.map(s => s._id),
          });

          return await Story.findById(savedStory._id).populate('sources');
        } catch (err) {
          console.error(`Failed to process cluster: ${err.message}`);
          return null;
        }
      })
    );

    // Filter out any failed clusters
    const successfulStories = finalStories.filter(Boolean);
    res.json({ success: true, data: successfulStories });

  } catch (error) {
    next(error);
  }
};
