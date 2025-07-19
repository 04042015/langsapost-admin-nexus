"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema } from "@/lib/validations/articleSchema";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ArticleEditor } from "@/components/admin/form/ArticleEditor";
import { CategorySelect } from "@/components/admin/form/CategorySelect";
import { TagMultiSelect } from "@/components/admin/form/TagMultiSelect";
import { ArticleStatusSelect } from "@/components/admin/form/ArticleStatusSelect";
import { FeaturedImageUpload } from "@/components/admin/form/FeaturedImageUpload";
import { BreakingToggle } from "@/components/admin/form/BreakingToggle";
import { SeoMetaFields } from "@/components/admin/form/SeoMetaFields";
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
      featured_image: null,
      category_id: "",
      tags: [],
      status: "draft",
      publish_at: null,
      breaking: false,
      seo: {
        title: "",
        description: "",
        keywords: "",
        canonical: "",
      },
      gallery: [],
      video_url: null,
      lang: "id",
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const articleData = {
          ...values,
          lang,
        };

        const res = await createArticle(articleData);

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
    validationSchema: zodResolver(articleSchema as any),
  });

  // Auto generate slug
  useEffect(() => {
    if (formik.values.title && !formik.values.slug) {
      const generatedSlug = formik.values.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      formik.setFieldValue("slug", generatedSlug);
    }
  }, [formik.values.title]);

  // Auto-save setiap 15 detik
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
          <div>
            <Label>Judul Artikel</Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
          </div>

          <div>
            <Label>Slug (URL)</Label>
            <Input
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
            />
          </div>

          <div>
            <ArticleEditor
              value={formik.values.content}
              onChange={(v) => formik.setFieldValue("content", v)}
            />
          </div>

          <div>
            <FeaturedImageUpload
              value={formik.values.featured_image}
              onChange={(url) => formik.setFieldValue("featured_image", url)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategorySelect
              value={formik.values.category_id}
              onChange={(v) => formik.setFieldValue("category_id", v)}
            />
            <TagMultiSelect
              value={formik.values.tags}
              onChange={(v) => formik.setFieldValue("tags", v)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArticleStatusSelect
              value={formik.values.status}
              publishAt={formik.values.publish_at}
              onChangeStatus={(s) => formik.setFieldValue("status", s)}
              onChangeDate={(d) => formik.setFieldValue("publish_at", d)}
            />
            <BreakingToggle
              value={formik.values.breaking}
              onChange={(v) => formik.setFieldValue("breaking", v)}
            />
          </div>

          <SeoMetaFields
            value={formik.values.seo}
            onChange={(v) => formik.setFieldValue("seo", v)}
          />

          <GalleryImageUpload
            value={formik.values.gallery}
            onChange={(g) => formik.setFieldValue("gallery", g)}
          />

          <VideoUpload
            value={formik.values.video_url}
            onChange={(v) => formik.setFieldValue("video_url", v)}
          />

          <div className="flex justify-between items-center">
            <AutoSaveIndicator saving={saving} />
            <PreviewButton onClick={() => toast.info("Preview coming soon")} />
          </div>

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
