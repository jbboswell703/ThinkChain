import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"
import { Brain } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ThinkChain - AI-Powered App Development",
  description:
    "Use a chain of LLMs to develop and optimize app concepts and generate build instructions for AI web builders.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center">
                  <Brain className="h-8 w-8 text-indigo-500 mr-2" />
                  <span className="text-xl font-bold text-slate-800">ThinkChain</span>
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <Link href="/" className="text-slate-600 hover:text-indigo-500">
                    Home
                  </Link>
                  <Link href="/concept" className="text-slate-600 hover:text-indigo-500">
                    Create Concept
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
