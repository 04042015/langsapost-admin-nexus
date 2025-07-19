import { supabase } from "@/lib/supabase";
import { Request, Response } from "express";

export async function publishArticle(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase
    .from("articles")
    .update({
      status: "PUBLISHED",
      publish_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
