import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: ['source']
  }
});

export const fetchGoogleNews = async (keywords) => {
  try {
    const query = encodeURIComponent(keywords.join(' '));
    // Use Google News RSS feed format
    const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    
    const feed = await parser.parseURL(url);
    
    // Normalize the results
    const results = feed.items.map(item => {
      // Basic normalization
      return {
        sourceName: item.source || 'Google News',
        sourceType: 'News',
        headline: item.title,
        url: item.link,
        publishedAt: new Date(item.pubDate),
        author: item.creator || '',
        imageUrl: '', // Google News RSS usually doesn't have clean images in standard tags
        content: item.content || '',
        snippet: item.contentSnippet || ''
      };
    });

    return results;
  } catch (error) {
    console.error('Error fetching Google News:', error.message);
    // Return empty array on failure so pipeline doesn't break
    return [];
  }
};
