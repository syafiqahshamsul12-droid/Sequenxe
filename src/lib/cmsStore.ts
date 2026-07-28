import { useState, useEffect } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';

const STORAGE_KEY = 'sequenxe_cms_articles_v1';
const LEGACY_STORAGE_KEY = 'sequence_cms_articles_v1';

export function getCmsBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return BLOG_POSTS;
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saved = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BLOG_POSTS));
      return BLOG_POSTS;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load CMS blog posts from storage', e);
  }
  return BLOG_POSTS;
}

export function getPublishedBlogPosts(): BlogPost[] {
  const posts = getCmsBlogPosts();
  return posts.filter(p => p.status !== 'draft');
}

export function getCmsBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getCmsBlogPosts();
  return posts.find(p => p.slug === slug);
}

export function saveCmsBlogPost(post: BlogPost): void {
  const posts = getCmsBlogPosts();
  const index = posts.findIndex(p => p.id === post.id || p.slug === post.slug);
  let updated: BlogPost[];
  if (index >= 0) {
    updated = [...posts];
    updated[index] = post;
  } else {
    updated = [post, ...posts];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('cms-posts-updated'));
}

export function deleteCmsBlogPost(id: string): void {
  const posts = getCmsBlogPosts();
  const updated = posts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('cms-posts-updated'));
}

export function resetCmsPostsToDefault(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(BLOG_POSTS));
  window.dispatchEvent(new CustomEvent('cms-posts-updated'));
}

export function exportCmsPostsToJson(): string {
  const posts = getCmsBlogPosts();
  return JSON.stringify(posts, null, 2);
}

export function importCmsPostsFromJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent('cms-posts-updated'));
      return true;
    }
  } catch (e) {
    console.error('Failed to import CMS posts JSON', e);
  }
  return false;
}

export function useCmsBlogPosts(includeDrafts = false): BlogPost[] {
  const [posts, setPosts] = useState<BlogPost[]>(() => 
    includeDrafts ? getCmsBlogPosts() : getPublishedBlogPosts()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setPosts(includeDrafts ? getCmsBlogPosts() : getPublishedBlogPosts());
    };

    window.addEventListener('cms-posts-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cms-posts-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [includeDrafts]);

  return posts;
}
