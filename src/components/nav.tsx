import Link from "next/link"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Nav() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">Blog Platform</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden items-center md:flex">
              <Link
                href="/posts"
                className={cn(
                  "mx-4 text-sm font-medium transition-colors hover:text-primary"
                )}
              >
                Posts
              </Link>
              <Link
                href="/categories"
                className={cn(
                  "mx-4 text-sm font-medium transition-colors hover:text-primary"
                )}
              >
                Categories
              </Link>
              {session?.user ? (
                <>
                  <Link
                    href="/profile"
                    className={cn(
                      "mx-4 text-sm font-medium transition-colors hover:text-primary"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User avatar"}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                      )}
                      <span className="text-sm font-medium">
                        {session.user.name || "User"}
                      </span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "mx-4 text-sm font-medium transition-colors hover:text-primary"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className={cn(
                      "text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                    )}
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className={cn(
                    "mx-4 text-sm font-medium transition-colors hover:text-primary"
                  )}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 