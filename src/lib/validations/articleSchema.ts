import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  content: z.any(), // tiptap JSON
  featured_image: z.string().url().nullable(),
  category_id: z.string().uuid(),
  tags: z.array(z.string().uuid()),
  status: z.enum(["draft", "scheduled", "published"]),
  publish_at: z.string().nullable(),
  breaking: z.boolean(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
    canonical: z.string(),
  }),
  gallery: z.array(z.string().url()),
  video_url: z.string().url().nullable(),
  lang: z.enum(["id", "en"]),
});
