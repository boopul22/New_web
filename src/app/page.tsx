import Link from 'next/link'
import { Metadata } from "next"

import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to our blog platform",
}

async function getLatestPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      categories: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  })

  return posts
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4 items-center sm:items-start">
          <h1 className="text-4xl font-bold">Welcome to Our Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your thoughts and ideas with the world.
          </p>
          <div className="flex gap-4">
            <Link
              href="/posts"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              View Posts
            </Link>
            <Link
              href="/posts/new"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Create Post
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 