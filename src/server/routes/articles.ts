import express from 'express';
import { z } from 'zod';
import { supabase } from '../supabase';

const router = express.Router();

const articleSchema = z.object({
  title: z.string().min(1),
  slug: z.string(),
  content: z.any(), // Tiptap JSON
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

router.post('/', async (req, res) => {
  const result = articleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const data = result.data;

  const { data: article, error } = await supabase
    .from('articles')
    .insert([
      {
        ...data,
        created_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Insert tags into article_tags
  await supabase.from('article_tags').insert(
    data.tag_ids.map((tag_id) => ({
      article_id: article.id,
      tag_id,
    }))
  );

  return res.status(200).json({ article });
});

export default router;
