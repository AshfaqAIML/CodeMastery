import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AppProviders } from "@/components/providers/app-providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://codemastery.dev"),
  title: {
    default: "CodeMastery — Learn Computer Science & AI Engineering",
    template: "%s · CodeMastery",
  },
  description:
    "Master Computer Science from fundamentals to advanced AI engineering. Structured tutorials on C, C++, Java, Python, DSA, OS, Networks, DBMS, Machine Learning, Deep Learning, LLMs, System Design and more — with progress tracking, quizzes, streaks, and achievements.",
  keywords: [
    "Computer Science tutorials",
    "Learn programming",
    "Data Structures and Algorithms",
    "Python tutorial",
    "Java tutorial",
    "C programming",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning",
    "Deep Learning",
    "LLMs",
    "System Design",
    "DBMS",
    "SQL",
  ],
  authors: [{ name: "CodeMastery" }],
  openGraph: {
    title: "CodeMastery — Learn Computer Science & AI Engineering",
    description:
      "Structured CS tutorials from fundamentals to advanced AI, with progress tracking, quizzes, streaks and achievements.",
    siteName: "CodeMastery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMastery",
    description: "Learn Computer Science & AI Engineering, the structured way.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppProviders>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Toaster richColors position="bottom-right" />
        </AppProviders>
      </body>
    </html>
  )
}
