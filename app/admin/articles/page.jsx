export const dynamic = 'force-dynamic'

import { use } from 'react'
import AdminArticlesClient from '../../../components/admin/AdminArticlesClient'

export default function AdminArticlesPage({ searchParams }) {
  const params = use(searchParams)
  return <AdminArticlesClient articleId={params?.id} />
}
