import { supabase } from "@/lib/supabase";
import { Request, Response } from "express";

export async function deleteArticle(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
