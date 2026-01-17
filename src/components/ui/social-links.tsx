"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Social {
  name: string
  image: string
}

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  socials: Social[]
}

export function SocialLinks({ socials, className, ...props }: SocialLinksProps) {
  const [hoveredSocial, setHoveredSocial] = React.useState<string | null>(null)
  const [rotation, setRotation] = React.useState(0)
  const [clicked, setClicked] = React.useState(false)

  const animation = {
    scale: clicked ? [1, 1.3, 1] : 1,
    transition: { duration: 0.3 },
  }

  React.useEffect(() => {
    const handleClick = () => {
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      }, 200)
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [clicked])

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      {socials.map((social, index) => (
        <React.Fragment key={social.name}>
          <a
            href="#"
            className="relative text-sm text-white/70 transition-colors hover:text-white"
            onMouseEnter={() => {
              setHoveredSocial(social.name)
              setRotation(Math.random() * 20 - 10)
            }}
            onMouseLeave={() => setHoveredSocial(null)}
            onClick={() => {
              setClicked(true)
            }}
          >
            {social.name}
            <AnimatePresence>
              {hoveredSocial === social.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: rotation,
                    ...animation,
                  }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-lg border border-white/20 bg-white/10 p-1 backdrop-blur-sm"
                >
                  <img
                    src={social.image}
                    alt={social.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </a>
          {index < socials.length - 1 && (
            <span className="text-white/40">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
