'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/../public/logo.svg';
import { Button } from '@/components/ui/button';
import FeatureCarousel from '@/components/feature-carousel';
import HeroSection from '@/components/hero-section';
import ScrollingText from '@/components/scrolling-text';
import ParallaxSection from '@/components/parallax-section';
import { SignUpButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

// Animation variants for buttons
const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b-4 border-[#121212] bg-[#f5f5f5] px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Image src={logo.src} alt="Zenith Logo" width={50} height={50} />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-500 to-slate-800 bg-clip-text text-transparent">
                enith
              </h1>
            </div>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex gap-8">
              {['Features', 'Mentorship', 'Jobs', 'Events', 'About'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="font-sans text-lg font-medium text-[#121212] hover:underline hover:decoration-4 hover:underline-offset-4"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
          <div className="border-2 border-[#121212] bg-[#c4ff0e] font-sans font-bold text-[#121212] hover:bg-[#a6d800] p-2 px-4">
            <SignedOut>
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Scrolling Text Banner */}
      <ScrollingText />

      {/* Value Proposition Section with Parallax */}
      <ParallaxSection />

      {/* Features Showcase */}
      <section className="border-b-4 border-[#121212] bg-[#f5f5f5] px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 font-sans text-4xl font-extrabold text-[#121212]">
            PLATFORM FEATURES
          </h2>
          <FeatureCarousel />
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-b-4 border-[#121212] bg-[#0057b8] px-4 py-16">
        <div className="container mx-auto text-center">
          <div className="relative mx-auto max-w-3xl">
            <span className="absolute -left-8 -top-16 font-sans text-9xl font-bold text-[#c4ff0e]">
              "
            </span>
            <p className="font-bebas text-3xl leading-tight text-[#f5f5f5] md:text-5xl">
              GLS ZENITH CONNECTED ME WITH A MENTOR WHO HELPED ME LAND MY DREAM
              JOB. THE PLATFORM'S MATCHING ALGORITHM IS INCREDIBLY ACCURATE!
            </p>
            <span className="absolute -bottom-16 -right-8 font-sans text-9xl font-bold text-[#c4ff0e]">
              "
            </span>
            <p className="mt-8 font-sans text-xl text-[#f5f5f5]">
              - MALIKA SHARMA, CLASS OF 2023
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-b-4 border-[#121212] bg-[#f5f5f5] px-4 py-16">
        <div className="container mx-auto relative">
          <div className="absolute -left-4 -top-8 h-32 w-3/4 -rotate-6 bg-[#c4ff0e]"></div>
          <div className="relative z-10 text-center">
            <h2 className="mb-6 font-sans text-4xl font-extrabold text-[#121212] md:text-5xl">
              READY TO JOIN THE NETWORK?
            </h2>
            <p className="mb-8 mx-auto max-w-2xl text-xl text-[#121212]">
              Connect with mentors, discover opportunities, and become part of
              the thriving GLS alumni community.
            </p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
            >
              <Button className="relative overflow-hidden border-4 border-[#121212] bg-[#c4ff0e] px-8 py-6 font-sans text-xl font-bold text-[#121212] transition-all duration-300 hover:bg-[#a6d800] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_4px_#121212]">
                JOIN NOW
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] px-4 py-8 text-[#f5f5f5]">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-sans text-xl font-bold">
                GLS ALUMISPHERE
              </h3>
              <p className="text-sm">
                A platform connecting GLS University students and alumni for
                mentorship, career development, and community building.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-sans text-lg font-bold">LINKS</h3>
              <ul className="space-y-2">
                {['Home', 'Features', 'Mentorship', 'Jobs', 'Events'].map(
                  (item) => (
                    <li key={item}>
                      <Link href="#" className="text-sm hover:underline">
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-sans text-lg font-bold">LEGAL</h3>
              <ul className="space-y-2">
                {[
                  'Privacy Policy',
                  'Terms of Service',
                  'Cookie Policy',
                  'Accessibility',
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-sans text-lg font-bold">CONNECT</h3>
              <p className="mb-4 text-sm">
                Stay updated with the latest news and events.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full border-2 border-[#f5f5f5] bg-[#121212] p-2 text-sm"
                />
                <Button className="border-2 border-[#f5f5f5] bg-[#c4ff0e] font-sans font-bold text-[#121212]">
                  GO
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#333] pt-4 text-center text-sm">
            &copy; {new Date().getFullYear()} GLS Zenith. All rights reserved.
            Made by{' '}
            <Link
              href="https://www.vinayth.tech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="underline">Vinay</span>
            </Link>{' '}
            &{' '}
            <Link
              href="https://www.github.com/nioomeee"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="underline">Niomi</span>
            </Link>{' '}
            with ❤️
          </div>
        </div>
      </footer>
    </div>
  );
}
