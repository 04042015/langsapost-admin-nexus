import { supabase } from "@/lib/supabase";
import { Request, Response } from "express";

export async function submitForReview(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase
    .from("articles")
    .update({
      status: "REVIEW",
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
