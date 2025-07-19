import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(1),
  slug: z.string(),
  content: z.any(), // JSON Tiptap
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduled_at: z.string().optional(),
  featured_image_url: z.string().optional(),
  is_breaking: z.boolean(),
  category_id: z.string(),
  tag_ids: z.array(z.string()),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  canonical_url: z.string().optional(),
  show_on_homepage: z.boolean(),
  author_id: z.string(),
});
