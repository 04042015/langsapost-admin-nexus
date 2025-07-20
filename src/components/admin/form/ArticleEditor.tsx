import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import { JSONContent } from "@tiptap/core";

import "@/styles/tiptap.css";

interface ArticleEditorProps {
  value: JSONContent | null;
  onChange: (value: JSONContent) => void;
}

export function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Tulis isi artikel di sini...",
      }),
      Image,
      Youtube.configure({
        width: 640,
        height: 360,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
  });

  return <EditorContent editor={editor} className="prose max-w-full" />;
      }
