"use client"

import React, { useEffect, useState, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

export default function AdminEditorInner({ value, onChange }) {
  const isEditorReady = useRef(false)
  
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML())
    },
    onCreate: () => {
      isEditorReady.current = true
    },
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
  })

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFile = (file) => {
    if (!file) return

    // validation
    if (!file.type.startsWith('image/')) {
      window.alert('Only image files are allowed')
      return
    }

    const maxBytes = 3 * 1024 * 1024 // 3MB
    if (file.size > maxBytes) {
      window.alert('Image is too large (max 3MB)')
      return
    }

    const form = new FormData()
    form.append('file', file)
    form.append('filename', file.name)

    setUploading(true)
    setUploadProgress(0)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100)
        setUploadProgress(pct)
      }
    }

    xhr.onload = () => {
      setUploading(false)
      setUploadProgress(0)
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          editor?.chain().focus().setImage({ src: data.url }).run()
        } else {
          window.alert(data.error || 'Upload failed')
        }
      } catch (err) {
        window.alert('Upload failed')
      }
    }

    xhr.onerror = () => {
      setUploading(false)
      setUploadProgress(0)
      window.alert('Network error during upload')
    }

    xhr.send(form)
  }

  useEffect(() => {
    if (!editor || !isEditorReady.current) return
    // Only update content if it's different from current editor content
    const currentContent = editor.getHTML()
    if (value !== undefined && currentContent !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div>
      <div className="editor-toolbar">
        <button
          type="button"
          title="Bold"
          aria-label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={"editor-button " + (editor?.isActive('bold') ? 'active' : '')}
        >
          B
        </button>

        <button
          type="button"
          title="Italic"
          aria-label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={"editor-button " + (editor?.isActive('italic') ? 'active' : '')}
        >
          I
        </button>

        <button
          type="button"
          title="Underline"
          aria-label="Underline"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={"editor-button " + (editor?.isActive('underline') ? 'active' : '')}
        >
          U
        </button>

        <button
          type="button"
          title="Undo"
          aria-label="Undo"
          onClick={() => editor?.chain().focus().undo().run()}
          className="editor-button"
        >
          ↺
        </button>

        <button
          type="button"
          title="Redo"
          aria-label="Redo"
          onClick={() => editor?.chain().focus().redo().run()}
          className="editor-button"
        >
          ↻
        </button>

        <div className="divider" />

        <button
          type="button"
          title="Bullet List"
          aria-label="Bullet List"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={"editor-button " + (editor?.isActive('bulletList') ? 'active' : '')}
        >
          •
        </button>

        <button
          type="button"
          title="Ordered List"
          aria-label="Ordered List"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={"editor-button " + (editor?.isActive('orderedList') ? 'active' : '')}
        >
          1.
        </button>

        <div className="divider" />

        <button
          type="button"
          title="Insert Image from URL"
          aria-label="Insert Image from URL"
          onClick={() => {
            const url = window.prompt('Image URL')
            if (url) editor?.chain().focus().setImage({ src: url }).run()
          }}
          className="editor-button"
        >
          Img
        </button>

        <input id="tiptap-image-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
        <button type="button" title="Upload Image" aria-label="Upload Image" onClick={() => document.getElementById('tiptap-image-input')?.click()} className="editor-button">Upload</button>

        {uploading && (
          <div style={{ marginLeft: 8, fontSize: 12, color: '#503c3c' }}>
            Uploading… {uploadProgress}%
          </div>
        )}
      </div>

      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
