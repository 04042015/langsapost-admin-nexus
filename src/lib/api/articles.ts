import { ArticleInput } from '@/lib/validations/articleSchema';

export async function createArticle(payload: ArticleInput) {
  const res = await fetch('http://localhost:3001/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create article');
  }

  return res.json();
}

// Tambahkan juga fungsi get/update/delete di sini nanti jika dibutuhkan.
