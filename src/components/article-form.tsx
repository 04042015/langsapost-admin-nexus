'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase-client';
import { z } from 'zod';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import { ArticleEditor } from './article-editor'; // Tiptap
import { CategorySelect } from './category-select';
import { TagMultiSelect } from './tag-multi-select';
import { FeaturedImageUpload } from './featured-image-upload';
import { ArticleStatusSelect } from './article-status-select';
import { BreakingToggle } from './breaking-toggle';

const articleSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  content: z.string().min(10), // JSON string from Tiptap
  category_id: z.string(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
  status: z.enum(['draft', 'scheduled', 'published']),
  scheduled_at: z.string().optional(), // ISO date string
  is_breaking: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  canonical_url: z.string().optional(),
  show_on_homepage: z.boolean(),
  featured_image_url: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

export function ArticleForm() {
  const router = useRouter();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);

  const formik = useFormik<ArticleFormValues>({
    initialValues: {
      title: '',
      slug: '',
      content: '',
      category_id: '',
      tags: [],
      status: 'draft',
      scheduled_at: '',
      is_breaking: false,
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      canonical_url: '',
      show_on_homepage: false,
      featured_image_url: '',
    },
    validate: (values) => {
      try {
        articleSchema.parse(values);
      } catch (err: any) {
        return err.formErrors?.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const { data: user } = await supabase.auth.getUser();
        const author_id = user?.user?.id;

        const { data, error } = await supabase.from('articles').insert({
          id: uuidv4(),
          title: values.title,
          slug: values.slug,
          content: values.content,
          category_id: values.category_id,
          status: values.status,
          scheduled_at: values.status === 'scheduled' ? values.scheduled_at : null,
          is_breaking: values.is_breaking,
          meta_title: values.meta_title,
          meta_description: values.meta_description,
          meta_keywords: values.meta_keywords,
          canonical_url: values.canonical_url,
          show_on_homepage: values.show_on_homepage,
          featured_image_url: values.featured_image_url,
          author_id,
        }).select().single();

        if (error) throw error;

        // Simpan tags ke table `article_tags`
        await supabase.from('article_tags').insert(
          values.tags.map((tag) => ({
            article_id: data.id,
            tag_id: tag.id,
          }))
        );

        toast.success('Artikel berhasil disimpan!');
        router.push('/dashboard/articles');
      } catch (err: any) {
        toast.error(err.message || 'Gagal menyimpan artikel');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label>Judul Artikel</label>
        <input
          type="text"
          name="title"
          onChange={(e) => {
            formik.setFieldValue('title', e.target.value);
            formik.setFieldValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
          }}
          value={formik.values.title}
          className="input"
        />
      </div>

      <div>
        <label>Slug (URL)</label>
        <input
          type="text"
          name="slug"
          value={formik.values.slug}
          onChange={formik.handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Isi Artikel</label>
        <ArticleEditor
          value={formik.values.content}
          onChange={(json) => formik.setFieldValue('content', json)}
        />
      </div>

      <CategorySelect
        value={formik.values.category_id}
        onChange={(val) => formik.setFieldValue('category_id', val)}
      />

      <TagMultiSelect
  selected={Array.isArray(formik.values.tags) ? formik.values.tags.map(tag => tag.id) : []}
  onChange={(val) => {
    const newTags = val.map((id) => ({ id, name: '' }));
    formik.setFieldValue('tags', newTags);
  }}
/>

      <ArticleStatusSelect
        status={formik.values.status}
        onChange={(val) => formik.setFieldValue('status', val)}
        scheduledAt={formik.values.scheduled_at}
        onScheduleChange={(val) => formik.setFieldValue('scheduled_at', val)}
      />

      <FeaturedImageUpload
        value={formik.values.featured_image_url}
        onChange={(url) => formik.setFieldValue('featured_image_url', url)}
      />

      <BreakingToggle
        value={formik.values.is_breaking}
        onChange={(val) => formik.setFieldValue('is_breaking', val)}
      />

      <div>
        <label>Meta Title</label>
        <input
          type="text"
          name="meta_title"
          value={formik.values.meta_title}
          onChange={formik.handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Meta Description</label>
        <textarea
          name="meta_description"
          value={formik.values.meta_description}
          onChange={formik.handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Meta Keywords</label>
        <input
          type="text"
          name="meta_keywords"
          value={formik.values.meta_keywords}
          onChange={formik.handleChange}
          className="input"
        />
      </div>

      <div>
        <label>Canonical URL</label>
        <input
          type="url"
          name="canonical_url"
          value={formik.values.canonical_url}
          onChange={formik.handleChange}
          className="input"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="show_on_homepage"
          checked={formik.values.show_on_homepage}
          onChange={(e) => formik.setFieldValue('show_on_homepage', e.target.checked)}
        />
        <label>Tampilkan di Homepage</label>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Menyimpan...' : 'Simpan Artikel'}
        </button>
      </div>
    </form>
  );
}
