import ArticleSectionPage from '@/components/articles/ArticleSectionPage'

export default function NewsPage() {
  return (
    <ArticleSectionPage
      title="News"
      description="Browse the latest public updates, developments, and stories published by the admin team."
      category="news"
      emptyMessage="No news articles have been published yet."
    />
  )
}
