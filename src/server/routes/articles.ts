import express from 'express';
import { articleSchema } from '@/lib/validations/articleSchema';
import { supabase } from '../supabase';

const router = express.Router();

// 🔹 Create Article
router.post('/', async (req, res) => {
  const result = articleSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });

  const data = result.data;

  const { data: article, error } = await supabase
    .from('articles')
    .insert([{ ...data, created_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Insert tags
  await supabase.from('article_tags').insert(
    data.tag_ids.map((tag_id) => ({
      article_id: article.id,
      tag_id,
    }))
  );

  return res.status(200).json({ article });
});

// 🔹 Get All Articles
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*, article_tags(tag_id), categories(name), profiles(name)');

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ articles: data });
});

// 🔹 Get Article by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('articles')
    .select('*, article_tags(tag_id)')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Artikel tidak ditemukan' });

  return res.json({ article: data });
});

// 🔹 Update Article
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const result = articleSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });

  const data = result.data;

  const { error: updateError } = await supabase
    .from('articles')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  // Update tags (hapus dulu lalu insert ulang)
  await supabase.from('article_tags').delete().eq('article_id', id);
  await supabase.from('article_tags').insert(
    data.tag_ids.map((tag_id) => ({
      article_id: id,
      tag_id,
    }))
  );

  return res.status(200).json({ message: 'Artikel diperbarui' });
});

// 🔹 Delete Article
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Hapus tag relasi dulu
  await supabase.from('article_tags').delete().eq('article_id', id);

  const { error } = await supabase.from('articles').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ message: 'Artikel dihapus' });
});

export default router;
