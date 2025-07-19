"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { ArticleEditor } from "@/components/admin/form/ArticleEditor";
import { CategorySelect } from "@/components/admin/form/CategorySelect";
import { TagMultiSelect } from "@/components/admin/form/TagMultiSelect";
import { ArticleStatusSelect } from "@/components/admin/form/ArticleStatusSelect";
import { FeaturedImageUpload } from "@/components/admin/form/FeaturedImageUpload";
import { BreakingToggle } from "@/components/admin/form/BreakingToggle";
import { GalleryImageUpload } from "@/components/admin/form/GalleryImageUpload";
import { VideoUpload } from "@/components/admin/form/VideoUpload";
import { AutoSaveIndicator } from "@/components/admin/form/AutoSaveIndicator";
import { MultiLangTabs } from "@/components/admin/form/MultiLangTabs";
import { PreviewButton } from "@/components/admin/form/PreviewButton";

import { toast } from "sonner";
import { createArticle } from "@/actions/article";

export function ArticleForm() {
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      content: null,
      featured_image_url: null,
      category_id: "",
      tag_ids: [],
      status: "draft",
      scheduled_at: null,
      is_breaking: false,
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      canonical_url: "",
      show_on_homepage: false,
      gallery: [],
      video_url: null,
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          lang,
          author_id: "admin-123", // Ganti dengan Supabase session user ID nanti
        };

        const res = await createArticle(payload);

        if (res?.error) {
          toast.error("Gagal menyimpan artikel");
          return;
        }

        toast.success("Artikel berhasil disimpan!");
        router.push("/dashboard/articles");
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan saat menyimpan");
      }
    },
  });

  // Slug otomatis
  useEffect(() => {
    if (formik.values.title && !formik.values.slug) {
      const slug = formik.values.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      formik.setFieldValue("slug", slug);
    }
  }, [formik.values.title]);

  // Auto-save ke localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      setSaving(true);
      localStorage.setItem("draft-article", JSON.stringify(formik.values));
      setSaving(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <MultiLangTabs lang={lang} onLangChange={setLang}>
        <div className="space-y-4">
          {/* Judul */}
          <div>
            <Label>Judul Artikel</Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </div>

          {/* Slug */}
          <div>
            <Label>Slug (URL)</Label>
            <Input
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
            />
          </div>

          {/* Editor */}
          <div>
            <ArticleEditor
              value={formik.values.content}
              onChange={(v) => formik.setFieldValue("content", v)}
            />
          </div>

          {/* Gambar Unggulan */}
          <div>
            <FeaturedImageUpload
              value={formik.values.featured_image_url}
              onChange={(url) => formik.setFieldValue("featured_image_url", url)}
            />
          </div>

          {/* Kategori dan Tag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategorySelect
              value={formik.values.category_id}
              onChange={(v) => formik.setFieldValue("category_id", v)}
            />
            <TagMultiSelect
              value={formik.values.tag_ids}
              onChange={(v) => formik.setFieldValue("tag_ids", v)}
            />
          </div>

          {/* Status & Breaking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArticleStatusSelect
              value={formik.values.status}
              publishAt={formik.values.scheduled_at}
              onChangeStatus={(s) => formik.setFieldValue("status", s)}
              onChangeDate={(d) => formik.setFieldValue("scheduled_at", d)}
            />
            <BreakingToggle
              value={formik.values.is_breaking}
              onChange={(v) => formik.setFieldValue("is_breaking", v)}
            />
          </div>

          {/* SEO */}
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input
              name="seo_title"
              value={formik.values.seo_title}
              onChange={formik.handleChange}
            />

            <Label>SEO Description</Label>
            <Input
              name="seo_description"
              value={formik.values.seo_description}
              onChange={formik.handleChange}
            />

            <Label>SEO Keywords</Label>
            <Input
              name="seo_keywords"
              value={formik.values.seo_keywords}
              onChange={formik.handleChange}
            />

            <Label>Canonical URL</Label>
            <Input
              name="canonical_url"
              value={formik.values.canonical_url}
              onChange={formik.handleChange}
            />
          </div>

          {/* Galeri & Video */}
          <GalleryImageUpload
            value={formik.values.gallery}
            onChange={(g) => formik.setFieldValue("gallery", g)}
          />

          <VideoUpload
            value={formik.values.video_url}
            onChange={(v) => formik.setFieldValue("video_url", v)}
          />

          {/* Tampilkan di Homepage */}
          <div className="flex items-center gap-2">
            <Label>Tampilkan di Beranda</Label>
            <Switch
              checked={formik.values.show_on_homepage}
              onCheckedChange={(v) => formik.setFieldValue("show_on_homepage", v)}
            />
          </div>

          {/* Preview & Autosave */}
          <div className="flex justify-between items-center">
            <AutoSaveIndicator saving={saving} />
            <PreviewButton onClick={() => toast.info("Preview coming soon")} />
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-between gap-2">
            <Button type="submit" className="w-full">
              Simpan Artikel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                formik.setFieldValue("status", "draft");
                formik.handleSubmit();
              }}
            >
              Simpan sebagai Draft
            </Button>
          </div>
        </div>
      </MultiLangTabs>
    </form>
  );
    }
