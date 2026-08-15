import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AppProviders } from "@/components/providers/app-providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://codemastery.dev"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CodeMastery — Learn Computer Science & AI Engineering",
    template: "%s · CodeMastery",
  },
  description:
    "Master Computer Science from fundamentals to advanced AI engineering. 135+ structured tutorials on C, C++, Java, Python, DSA, OS, Networks, DBMS, Machine Learning, Deep Learning, LLMs, System Design and more — with progress tracking, quizzes, streaks, and achievements.",
  keywords: [
    "Computer Science tutorials",
    "Learn programming",
    "Data Structures and Algorithms",
    "Python tutorial",
    "Java tutorial",
    "C programming",
    "C++ tutorial",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning",
    "Deep Learning",
    "LLMs",
    "System Design",
    "DBMS",
    "SQL",
    "TypeScript",
    "Software Engineering",
    "Mathematics for CS",
  ],
  authors: [{ name: "CodeMastery" }],
  creator: "CodeMastery",
  publisher: "CodeMastery",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "CodeMastery — Learn Computer Science & AI Engineering",
    description:
      "135+ structured CS tutorials from fundamentals to advanced AI, with progress tracking, quizzes, streaks and achievements.",
    url: baseUrl,
    siteName: "CodeMastery",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMastery",
    description: "Learn Computer Science & AI Engineering, the structured way.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f0d" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// Structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "CodeMastery",
  description: "Learn Computer Science & AI Engineering with structured tutorials, quizzes, and progress tracking.",
  url: baseUrl,
  educationalLevel: ["Beginner", "Intermediate", "Advanced"],
  knowsAbout: [
    "Computer Science", "Programming", "Data Structures", "Algorithms",
    "Machine Learning", "Deep Learning", "LLMs", "System Design",
    "Operating Systems", "Computer Networks", "Databases", "Software Engineering",
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
