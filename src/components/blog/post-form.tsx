import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { slugify } from "@/lib/utils"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  tagIds: z.array(z.string()),
})

type PostFormValues = z.infer<typeof postSchema>

interface PostFormProps {
  categories: { id: string; name: string }[]
  tags: { id: string; name: string }[]
  userId: string
}

export function PostForm({ categories, tags, userId }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      featuredImage: "",
      categoryIds: [],
      tagIds: [],
    },
  })

  async function onSubmit(data: PostFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          slug: slugify(data.title),
          content: data.content,
          excerpt: data.excerpt,
          featuredImage: data.featuredImage,
          categoryIds: data.categoryIds,
          tagIds: data.tagIds,
          authorId: userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Something went wrong")
      }

      const post = await response.json()
      router.push(`/posts/${post.slug}`)
      toast({
        title: "Success",
        description: "Your post has been published.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            id="title"
            placeholder="Post title"
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Textarea
            id="content"
            placeholder="Write your post content here..."
            {...form.register("content")}
            disabled={isLoading}
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            id="excerpt"
            placeholder="Short excerpt (optional)"
            {...form.register("excerpt")}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Input
            id="featuredImage"
            placeholder="Featured image URL (optional)"
            {...form.register("featuredImage")}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <select
            multiple
            {...form.register("categoryIds")}
            className="w-full rounded-md border p-2"
            disabled={isLoading}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {form.formState.errors.categoryIds && (
            <p className="text-sm text-destructive">
              {form.formState.errors.categoryIds.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <select
            multiple
            {...form.register("tagIds")}
            className="w-full rounded-md border p-2"
            disabled={isLoading}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Publishing..." : "Publish Post"}
      </Button>
    </form>
  )
} 