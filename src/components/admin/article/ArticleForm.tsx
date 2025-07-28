import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";

import type { TagOption } from "@/components/admin/form/TagMultiSelect";

export function ArticleForm() {
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      content: null,
      featured_image_url: null,
      category_id: "",
      tag_ids: [] as TagOption[],
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
      translations: {
        id: { content: null },
        en: { content: null },
      },
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          tag_ids: values.tag_ids.map(tag => tag.id),
          lang,
          author_id: "admin-123", // Ganti dengan ID user login
        };

        const res = await createArticle(payload);

        if (res?.error) {
          toast.error("Gagal menyimpan artikel");
          return;
        }

        toast.success("Artikel berhasil disimpan!");
        navigate("/dashboard/articles");
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan saat menyimpan");
      }
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true);

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted = data.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));

        setCategories(formatted);

        // 🔐 Hindari race condition: delay setting nilai
        if (!formik.values.category_id) {
          setTimeout(() => {
            formik.setFieldValue("category_id", formatted[0].id);
          }, 0);
        }
      } else {
        console.error("Gagal ambil kategori:", error);
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (formik.values.title && !formik.values.slug) {
      const slug = formik.values.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      formik.setFieldValue("slug", slug);
    }
  }, [formik.values.title]);

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
              value={formik.values.featured_image_url}
              onChange={(file) =>
                formik.setFieldValue("featured_image_url", file)
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategorySelect
              categories={categories}
              value={formik.values.category_id}
              onChange={(v) => formik.setFieldValue("category_id", v)}
            />
            <TagMultiSelect
              selected={formik.values.tag_ids}
              onChange={(newTags) =>
                formik.setFieldValue("tag_ids", newTags)
              }
            />
          </div>

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

          <GalleryImageUpload
            value={formik.values.gallery}
            onChange={(g) => formik.setFieldValue("gallery", g)}
          />

          <VideoUpload
            value={formik.values.video_url}
            onChange={(v) => formik.setFieldValue("video_url", v)}
          />

          <div className="flex items-center gap-2">
            <Label>Tampilkan di Beranda</Label>
            <Switch
              checked={formik.values.show_on_homepage}
              onCheckedChange={(v) =>
                formik.setFieldValue("show_on_homepage", v)
              }
            />
          </div>

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

          {/* DEBUG */}
          {!loadingCategories && (
            <div className="bg-yellow-50 p-4 rounded text-sm text-gray-800 border border-yellow-300">
              <h2 className="font-semibold mb-2">DEBUG KATEGORI:</h2>
              <pre>{JSON.stringify(categories, null, 2)}</pre>
              <hr className="my-2" />
              <h2 className="font-semibold mb-2">DEBUG FORM VALUES:</h2>
              <pre>{JSON.stringify(formik.values, null, 2)}</pre>
            </div>
          )}
        </div>
      </MultiLangTabs>
    </form>
  );
    }
