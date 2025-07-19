import { supabase } from "@/lib/supabase";
import { Request, Response } from "express";

export async function getAllArticles(req: Request, res: Response) {
  const { status } = req.query;

  const query = supabase
    .from("articles")
    .select("id, title, slug, status, created_at, publish_at, profiles(full_name), categories(name)")
    .order("created_at", { ascending: false });

  if (status) {
    query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ articles: data });
}
