import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

import { prisma } from "@/lib/prisma"

interface PostPageProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
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
      tags: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return post
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  return (
    <article className="container mx-auto max-w-3xl py-10">
      <div className="space-y-4">
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center space-x-4">
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
        {post.excerpt && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        <div
          className="prose prose-stone mx-auto dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.tags.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
} 