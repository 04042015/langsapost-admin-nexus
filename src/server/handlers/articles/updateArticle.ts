import { supabase } from "@/lib/supabase";
import { Request, Response } from "express";
import { articleSchema } from "@/lib/validations/articleSchema";

export async function updateArticle(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body;

  const parse = articleSchema.safeParse(body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.flatten() });
  }

  const { data, error } = await supabase
    .from("articles")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ article: data });
}
