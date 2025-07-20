'use client'

import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'

type Props = {
  content: string
  onChange: (json: string) => void
}

export const ArticleEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Tulis isi artikel di sini...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none dark:prose-invert outline-none min-h-[300px] p-4 bg-white dark:bg-neutral-900 rounded-md border border-gray-300 dark:border-neutral-700',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
  })

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
                              }
