"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
}

export function AnimeNavBar({ items, className, defaultActive = "Home" }: NavBarProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(defaultActive)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault()
    setActiveTab(item.name)
    
    // Smooth scroll to section
    const targetId = item.url.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!mounted) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        className
      )}
    >
      <div className="flex items-center gap-2 bg-background/5 border border-white/10 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name
          const isHovered = hoveredTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => handleClick(e, item)}
              onMouseEnter={() => setHoveredTab(item.name)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full transition-all duration-300",
                "text-white/70 hover:text-white",
                isActive && "text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="anime-nav-active"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/80 via-secondary/80 to-primary/80 overflow-hidden"
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.6,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 10px 2px hsla(174, 73%, 21%, 0.3)",
                        "0 0 20px 4px hsla(174, 73%, 21%, 0.2)",
                        "0 0 10px 2px hsla(174, 73%, 21%, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                  />
                </motion.div>
              )}

              <span className="hidden md:inline relative z-10">{item.name}</span>
              <span className="md:hidden relative z-10">
                <Icon size={18} strokeWidth={2.5} />
              </span>

              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-white/10 rounded-full"
                  />
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/50 rounded-full hidden md:block"
                  layoutId="anime-nav-underline"
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.6,
                  }}
                />
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
