import { ArticleForm } from "@/components/admin/article/ArticleForm";
import { supabase } from "@/lib/supabase";
import { Category } from "@/types"; // atau path sesuai definisi Category-mu

export default async function NewArticlePage() {
  const supabase = createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Gagal mengambil kategori:", error.message);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tulis Artikel Baru</h1>
      <ArticleForm categories={categories || []} />
    </div>
  );
}
