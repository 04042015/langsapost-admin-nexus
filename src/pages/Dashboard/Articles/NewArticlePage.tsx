import { useEffect, useState } from "react";
import { ArticleForm } from "@/components/admin/article/ArticleForm";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types";

export default function NewArticlePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Gagal mengambil kategori:", error.message);
      } else {
        setCategories(data ?? []);
      }
      setLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tulis Artikel Baru</h1>
      <ArticleForm categories={categories} loading={loading} />
    </div>
  );
    }
