import { Request, Response } from 'express';
import { articleSchema } from '../../lib/validations/articleSchema';
import { supabase } from '../supabase';

export async function createArticle(req: Request, res: Response) {
  const result = articleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }

  const data = result.data;

  // Simpan artikel
  const { data: article, error } = await supabase
    .from('articles')
    .insert([
      {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        scheduled_at: data.status === 'scheduled' ? data.scheduled_at : null,
        featured_image_url: data.featured_image_url || null,
        is_breaking: data.is_breaking,
        category_id: data.category_id,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        seo_keywords: data.seo_keywords || null,
        canonical_url: data.canonical_url || null,
        show_on_homepage: data.show_on_homepage,
        author_id: data.author_id,
        created_at: new Date().toISOString(),
      }
    ])
    .select()
    .single();

  if (error || !article) {
    return res.status(500).json({ error: error?.message || 'Gagal menyimpan artikel' });
  }

  // Simpan tag
  const tagInsert = await supabase.from('article_tags').insert(
    data.tag_ids.map((tag_id) => ({
      article_id: article.id,
      tag_id,
    }))
  );

  if (tagInsert.error) {
    return res.status(500).json({ error: tagInsert.error.message });
  }

  return res.status(201).json({ article });
}
