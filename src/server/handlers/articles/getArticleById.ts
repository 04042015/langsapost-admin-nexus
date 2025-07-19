import { supabase } from "@/lib/supabase";
import { Request, Response } from "express";

export async function getArticleById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories(*),
      article_tags(tag_id),
      article_revisions(*),
      profiles(full_name)
    `)
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ article: data });
}
