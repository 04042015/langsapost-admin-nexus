import { z } from 'zod';
import { articleSchema } from '@/lib/validations/articleSchema';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Skema final = schema + id tambahan
const fullSchema = articleSchema.extend({
  author_id: z.string().uuid(), // dari sesi user
});

export async function createArticle(input: z.infer<typeof fullSchema>) {
  const parse = fullSchema.safeParse(input);
  if (!parse.success) {
    return { success: false, error: parse.error.flatten() };
  }

  const data = parse.data;
  const articleId = uuidv4();

  const { error: insertError } = await supabase.from('articles').insert({
    id: articleId,
    author_id: data.author_id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    featured_image: data.featured_image ?? null,
    category_id: data.category_id,
    status: data.status,
    scheduled_at: data.scheduled_at ?? null,
    is_breaking: data.is_breaking ?? false,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
    seo_keywords: data.seo_keywords,
    canonical_url: data.canonical_url,
    show_on_homepage: data.show_on_homepage,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (insertError) {
    return { success: false, error: insertError };
  }

  // Simpan tags (many-to-many)
  if (data.tags && data.tags.length > 0) {
    const tagRows = data.tags.map((tagId) => ({
      article_id: articleId,
      tag_id: tagId,
    }));
    await supabase.from('article_tags').insert(tagRows);
  }

  // Simpan versi pertama
  await supabase.from('article_revisions').insert({
    article_id: articleId,
    title: data.title,
    content: data.content,
    created_at: new Date().toISOString(),
    updated_by: data.author_id,
  });

  return { success: true, articleId };
}
