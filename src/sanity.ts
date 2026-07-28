import { createClient } from '@sanity/client';
import { BlogPost } from './data/blogPosts';

const envs = typeof import.meta !== 'undefined' ? (import.meta as any).env : {};

export const SANITY_PROJECT_ID = 
  envs?.VITE_SANITY_PROJECT_ID ||
  (typeof process !== 'undefined' && process.env && process.env.SANITY_PROJECT_ID) ||
  'sequenxe-cms';

export const SANITY_DATASET = 
  envs?.VITE_SANITY_DATASET ||
  (typeof process !== 'undefined' && process.env && process.env.SANITY_DATASET) ||
  'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-03-01',
  useCdn: true,
  token: envs?.VITE_SANITY_TOKEN,
});

export const ARTICLES_GROQ_QUERY = `*[_type == "article"] | order(publishDate desc) {
  _id,
  "id": _id,
  title,
  "slug": slug.current,
  category,
  readTime,
  publishDate,
  author,
  excerpt,
  keyTakeaways,
  content,
  relatedCalculatorIds,
  relatedArticleSlugs,
  officialSources,
  faqs,
  status,
  seoTitle,
  seoDescription,
  keywords,
  coverImage
}`;

/**
 * Fetch articles from Sanity CMS with fallback to local state
 */
export async function fetchSanityArticles(): Promise<BlogPost[] | null> {
  try {
    if (!SANITY_PROJECT_ID || SANITY_PROJECT_ID === 'sequenxe-cms' || SANITY_PROJECT_ID === 'sequence-cms' || SANITY_PROJECT_ID === 'ringgitmind-cms') {
      console.info('Sanity Project ID using default fallback placeholder. Operating in local-first mode.');
      return null;
    }
    const articles = await sanityClient.fetch(ARTICLES_GROQ_QUERY);
    if (Array.isArray(articles) && articles.length > 0) {
      return articles as BlogPost[];
    }
  } catch (error) {
    console.warn('Unable to query Sanity CMS client, falling back to local storage engine:', error);
  }
  return null;
}

/**
 * Save / Mutate article in Sanity CMS
 */
export async function saveSanityArticle(post: BlogPost): Promise<boolean> {
  try {
    const doc = {
      _type: 'article',
      _id: post.id.startsWith('post-') ? post.id : `article-${post.id}`,
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      category: post.category,
      readTime: post.readTime,
      publishDate: post.publishDate,
      author: post.author,
      excerpt: post.excerpt,
      keyTakeaways: post.keyTakeaways || [],
      content: post.content,
      relatedCalculatorIds: post.relatedCalculatorIds || [],
      relatedArticleSlugs: post.relatedArticleSlugs || [],
      officialSources: post.officialSources || [],
      faqs: post.faqs || [],
      status: post.status || 'published',
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.excerpt,
      keywords: post.keywords || [],
      coverImage: post.coverImage || '',
    };
    await sanityClient.createOrReplace(doc);
    return true;
  } catch (error) {
    console.warn('Sanity API createOrReplace notice:', error);
    return false;
  }
}
