import { PrismaClient } from "@prisma/client"
import { slugify } from "../src/lib/utils"

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = [
    { name: "Technology", description: "Posts about technology and software development" },
    { name: "Design", description: "Posts about UI/UX and design principles" },
    { name: "Business", description: "Posts about business and entrepreneurship" },
    { name: "Lifestyle", description: "Posts about lifestyle and personal development" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        slug: slugify(category.name),
        description: category.description,
      },
    })
  }

  // Create tags
  const tags = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "CSS",
    "UI",
    "UX",
    "Web Development",
    "Frontend",
    "Backend",
    "Full Stack",
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: {
        name: tag,
        slug: slugify(tag),
      },
    })
  }

  console.log("Database has been seeded. 🌱")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 