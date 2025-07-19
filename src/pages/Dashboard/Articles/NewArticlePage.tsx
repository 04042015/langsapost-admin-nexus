import { ArticleForm } from "@/components/admin/article/ArticleForm"

export default function NewArticlePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tulis Artikel Baru</h1>
      <ArticleForm />
    </div>
  );
}
