import HomeLanding from '@/components/home/HomeLanding'
import { getMediumPosts } from '@/lib/medium'

export default async function Home() {
  let mediumPreview = []
  let mediumProfileUrl = 'https://medium.com/@praagati'
  let topicGroups = []

  const data = await getMediumPosts(30)
  mediumProfileUrl = data.profileUrl
  topicGroups = data.topicGroups
  mediumPreview = data.posts.slice(0, 3)

  return (
    <HomeLanding
      mediumPreview={mediumPreview}
      mediumProfileUrl={mediumProfileUrl}
      topicGroups={topicGroups}
    />
  )
}
