"use client"

import { motion } from "framer-motion"

interface FancyLoaderProps {
  size?: "sm" | "md" | "lg"
}

export default function FancyLoader({ size = "md" }: FancyLoaderProps) {
  const sizes = {
    sm: {
      container: "h-8 w-8",
      circle: 2.5,
      animationDuration: 1.2,
    },
    md: {
      container: "h-12 w-12",
      circle: 3,
      animationDuration: 1.5,
    },
    lg: {
      container: "h-16 w-16",
      circle: 3.5,
      animationDuration: 1.8,
    },
  }

  const { container, circle, animationDuration } = sizes[size]

  const circleVariants = {
    initial: {
      opacity: 0.3,
      scale: 0.8,
    },
    animate: (i: number) => ({
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: animationDuration,
        repeat: Number.POSITIVE_INFINITY,
        delay: i * 0.15,
        ease: "easeInOut",
      },
    }),
  }

  return (
    <div className={`${container} relative flex items-center justify-center`}>
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            width: `${circle}px`,
            height: `${circle}px`,
            transform: `rotate(${i * 72}deg) translateY(-${circle * 3}px)`,
          }}
          variants={circleVariants}
          initial="initial"
          animate="animate"
          custom={i}
        />
      ))}
    </div>
  )
}
