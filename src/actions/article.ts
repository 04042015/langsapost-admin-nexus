import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { articleSchema } from '@/lib/validations/articleSchema'
import { v4 as uuidv4 } from 'uuid'

export async function createArticle(rawData: unknown) {
  const parsed = articleSchema.safeParse(rawData)

  if (!parsed.success) {
    return { success: false, error: parsed.error.format() }
  }

  const data = parsed.data
  const id = uuidv4()
  const now = new Date().toISOString()

  // Simpan ke tabel `articles`
  const { error: articleError } = await supabase.from('articles').insert({
    id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    category_id: data.category,
    status: data.status,
    scheduled_at: data.scheduledAt || null,
    featured_image_url: data.featuredImage || null,
    breaking_news: data.breaking || false,
    seo_title: data.seo?.title || null,
    seo_description: data.seo?.description || null,
    seo_keywords: data.seo?.keywords?.join(', ') || null,
    canonical_url: data.seo?.canonical || null,
    show_on_homepage: data.showOnHomepage || false,
    created_at: now,
    updated_at: now,
    created_by: data.createdBy,
  })

  if (articleError) {
    return { success: false, error: articleError.message }
  }

  // Simpan versi pertama ke article_revisions
  const { error: revisionError } = await supabase.from('article_revisions').insert({
    id: uuidv4(),
    article_id: id,
    content: data.content,
    created_at: now,
    created_by: data.createdBy,
    comment: 'Initial version',
  })

  if (revisionError) {
    return { success: false, error: revisionError.message }
  }

  // Simpan relasi tag ke article_tags
  if (data.tags && data.tags.length > 0) {
    const tagRows = data.tags.map((tagId) => ({
      article_id: id,
      tag_id: tagId,
    }))
    const { error: tagError } = await supabase.from('article_tags').insert(tagRows)
    if (tagError) {
      return { success: false, error: tagError.message }
    }
  }

  return { success: true, articleId: id }
}
