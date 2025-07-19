import { supabase } from "@/lib/supabase";
import { articleSchema } from "@/lib/validations/articleSchema";
import type { ArticleFormValues } from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Handler untuk membuat artikel baru
 */
export async function createArticle(data: ArticleFormValues, userId: string) {
  // Validasi input
  const parsed = articleSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.format(),
    };
  }

  const { 
    title, slug, content, cover_image_url, category_id, 
    tags, status, is_breaking, seo, publish_at, show_in_homepage 
  } = parsed.data;

  const id = uuidv4();
  const now = new Date();

  // Mulai transaksi
  const { error: insertError } = await supabase.from("articles").insert({
    id,
    user_id: userId,
    title,
    slug,
    content,
    cover_image_url,
    category_id,
    status,
    is_breaking,
    seo_title: seo?.title || null,
    seo_description: seo?.description || null,
    seo_keywords: seo?.keywords?.join(", ") || null,
    canonical_url: seo?.canonical_url || null,
    show_in_homepage: show_in_homepage || false,
    publish_at: publish_at ? new Date(publish_at) : now,
    created_at: now,
    updated_at: now,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Simpan relasi tag
  if (tags && tags.length > 0) {
    const tagRows = tags.map((tagId) => ({
      article_id: id,
      tag_id: tagId,
    }));
    await supabase.from("article_tags").insert(tagRows);
  }

  // Simpan versi awal ke article_revisions
  await supabase.from("article_revisions").insert({
    article_id: id,
    user_id: userId,
    content,
    created_at: now,
    note: "Versi awal artikel",
  });

  return { success: true, article_id: id };
    }
