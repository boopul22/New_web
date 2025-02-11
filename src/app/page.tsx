import Link from "next/link"
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

export default async function HomePage() {
  const posts = await getLatestPosts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Latest Posts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {post.featuredImage && (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="mb-4 h-48 w-full rounded-md object-cover"
              />
            )}
            <h2 className="mb-2 text-2xl font-semibold">
              <Link
                href={`/posts/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            {post.excerpt && (
              <p className="mb-4 text-muted-foreground">{post.excerpt}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-muted-foreground">
                  {post.author.name}
                </span>
              </div>
              <div className="flex space-x-2">
                {post.categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
} 