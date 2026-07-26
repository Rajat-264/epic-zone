"use client"

import dynamic from 'next/dynamic'

const AdminEditorInner = dynamic(() => import('./AdminEditorInner'), { ssr: false })

export default function AdminEditor(props) {
  return <AdminEditorInner {...props} />
}
