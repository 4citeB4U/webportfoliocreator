import NewsAPI from 'newsapi';

const newsapi = new NewsAPI(import.meta.env.VITE_NEWS_API_KEY);

export async function getLatestNews(topic) {
  try {
    const response = await newsapi.v2.topHeadlines({
      language: 'en',
      q: topic,
      pageSize: 5
    });

    return {
      articles: response.articles.map(article => ({
        title: article.title,
        description: article.description,
        source: article.source.name,
        url: article.url
      })),
      totalResults: response.totalResults
    };
  } catch (error) {
    console.error('News API Error:', error);
    throw new Error('Failed to get news');
  }
}
