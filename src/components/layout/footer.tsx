"use client"

import { GraduationCap, Github, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <GraduationCap className="size-5" />
              </span>
              <span className="font-bold">
                Code<span className="text-primary">Mastery</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Learn Computer Science & AI Engineering, the structured way. Free, open, and built for serious learners.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground cursor-pointer">Browse subjects</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Learning paths</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Leaderboard</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Achievements</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Topics</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Programming</li>
              <li>Data Structures & Algorithms</li>
              <li>Systems & Networks</li>
              <li>Machine Learning & AI</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground cursor-pointer">Documentation</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Migration guide</span></li>
              <li><span className="hover:text-foreground cursor-pointer">API reference</span></li>
              <li><span className="hover:text-foreground cursor-pointer">Self-hosting</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CodeMastery. Built for learners, by engineers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Made with <Heart className="size-3.5 text-red-500 fill-red-500" /> for CS education
            </span>
            <Github className="size-4 cursor-pointer hover:text-foreground" />
          </div>
        </div>
      </div>
    </footer>
  )
}
