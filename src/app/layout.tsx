import { Inter } from "next/font/google"
import { Metadata } from "next"

import "@/styles/globals.css"
import { Providers } from "@/components/providers"
import { Nav } from "@/components/nav"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Blog Platform",
    template: "%s | Blog Platform",
  },
  description: "A modern blog platform built with Next.js and TypeScript",
  keywords: ["blog", "nextjs", "react", "typescript"],
  authors: [
    {
      name: "Your Name",
      url: "https://your-website.com",
    },
  ],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-website.com",
    title: "Blog Platform",
    description: "A modern blog platform built with Next.js and TypeScript",
    siteName: "Blog Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Platform",
    description: "A modern blog platform built with Next.js and TypeScript",
    creator: "@yourusername",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Nav />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 