'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

import './editor-style.css'; // Custom styling (jika perlu)

interface ArticleEditorProps {
  content: string;
  onChange: (json: any) => void;
}

export function ArticleEditor({ content, onChange }: ArticleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Tulis isi artikel di sini...',
      }),
    ],
    content: content || '',
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="border rounded-md min-h-[300px]">
      <EditorContent editor={editor} />
    </div>
  );
               }
