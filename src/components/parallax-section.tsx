"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y3 = useTransform(scrollYProgress, [0, 1], [200, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section
      ref={containerRef}
      className="border-b-4 border-[#121212] bg-[#f5f5f5] px-4 py-16 relative overflow-hidden"
    >
      {/* Subtle grainy texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Animated background shapes */}
      <motion.div
        className="absolute -left-20 top-20 h-40 w-40 rounded-full border-8 border-[#121212] opacity-10"
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute right-10 bottom-40 h-60 w-60 border-8 border-[#121212] opacity-10"
        style={{ y: y2 }}
      />
      <motion.div
        className="absolute right-1/3 top-1/4 h-20 w-20 border-8 border-[#121212] opacity-10"
        style={{ y: y3 }}
      />

      <div className="container mx-auto relative">
        <motion.h2
          className="mb-12 font-sans text-4xl font-extrabold text-[#121212]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          WHY CHOOSE ALUMISPHERE?
        </motion.h2>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          {/* First column - slightly wider */}
          <motion.div className="md:col-span-1 md:pr-6" variants={itemVariants}>
            <div className="mb-6 ml-4">
              {/* Custom mentorship icon with animation */}
              <div className="relative h-24 w-24">
                <motion.div
                  className="absolute left-0 top-0 h-16 w-16 border-4 border-[#121212] rounded-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 h-12 w-12 border-4 border-[#121212] rounded-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
                <motion.div
                  className="absolute left-10 top-8 h-16 w-4 border-4 border-[#121212] rotate-45"
                  whileHover={{ rotate: 60 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                />
              </div>
            </div>
            <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">Find Your Mentor</h3>
            <p className="text-lg text-[#121212]">
              Our smart matching algorithm connects you with alumni mentors who share your interests, career goals, and
              values. Get personalized guidance from those who've walked your path.
            </p>
          </motion.div>

          {/* Second column - offset vertically */}
          <motion.div className="md:col-span-1 md:mt-12" variants={itemVariants}>
            <div className="mb-6 ml-8">
              {/* Custom network icon with animation */}
              <div className="relative h-24 w-24">
                <motion.div
                  className="absolute left-0 top-0 h-12 w-12 border-4 border-[#121212] rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    borderColor: ["#121212", "#c4ff0e", "#121212"],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 3,
                    delay: 0,
                  }}
                />
                <motion.div
                  className="absolute right-0 top-0 h-12 w-12 border-4 border-[#121212] rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    borderColor: ["#121212", "#0057b8", "#121212"],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 3,
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-6 h-12 w-12 border-4 border-[#121212] rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    borderColor: ["#121212", "#c4ff0e", "#121212"],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 3,
                    delay: 2,
                  }}
                />
                <motion.div
                  className="absolute left-4 top-4 h-20 w-4 border-4 border-[#121212] rotate-45"
                  animate={{ rotate: [45, 60, 45] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 4,
                  }}
                />
                <motion.div
                  className="absolute right-4 top-4 h-16 w-4 border-4 border-[#121212] rotate-[135deg]"
                  animate={{ rotate: [135, 120, 135] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 4,
                  }}
                />
              </div>
            </div>
            <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">Expand Your Network</h3>
            <p className="text-lg text-[#121212]">
              Join interest-based groups, attend virtual events, and connect with alumni across industries. Build
              relationships that last beyond graduation.
            </p>
          </motion.div>

          {/* Third column */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <div className="mb-6 ml-2">
              {/* Custom career icon with animation */}
              <div className="relative h-24 w-24">
                <motion.div
                  className="h-16 w-20 border-4 border-[#121212]"
                  whileHover={{
                    scale: 1.05,
                    borderColor: "#c4ff0e",
                  }}
                />
                <motion.div
                  className="absolute -top-2 left-6 h-4 w-8 border-4 border-[#121212]"
                  whileHover={{
                    scale: 1.1,
                    borderColor: "#c4ff0e",
                  }}
                />
              </div>
            </div>
            <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">Launch Your Career</h3>
            <p className="text-lg text-[#121212]">
              Discover job opportunities with "warm introductions" to alumni at hiring companies. Get insider advice
              through flash mentoring and AMA sessions with industry experts.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

