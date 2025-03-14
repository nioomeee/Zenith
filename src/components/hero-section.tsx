'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, ArrowRight } from 'lucide-react';
import hero_img from '@/../public/Hero-1.jpeg';
import useScrollDirection from '@/hooks/use-scroll-direction';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();
  const [activeTab, setActiveTab] = useState(0);
  const [animatedPositions, setAnimatedPositions] = useState<
    Array<{ x: number; y: number }>
  >([]);
  const [isMounted, setIsMounted] = useState(false);

  // Generate random positions on client-side only
  useEffect(() => {
    const positions = Array.from({ length: 5 }).map(() => ({
      x: Math.random() * 600,
      y: Math.random() * 500,
    }));
    setAnimatedPositions(positions);
    setIsMounted(true);
  }, []);

  // Framer Motion parallax effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // GSAP animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    // Image animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 70%',
            toggleActions: 'play',
          },
        }
      );
    }

    // Horizontal scrolling text
    if (scrollTextRef.current) {
      const textElements =
        scrollTextRef.current.querySelectorAll('.scroll-text');

      textElements.forEach((text, i) => {
        const direction = i % 2 === 0 ? -1 : 1;

        gsap.to(text, {
          xPercent: direction * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: scrollTextRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
              // Reverse direction when scrolling up
              if (scrollDirection === 'up') {
                gsap.to(text, {
                  xPercent: -direction * 50 * self.progress,
                  overwrite: true,
                  duration: 0.5,
                });
              }
            },
          },
        });
      });
    }

    // Tab switching animation
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 5000);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      clearInterval(interval);
    };
  }, [scrollDirection]);

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

  // Stats data
  const [stats] = useState([
    { value: 5000, label: 'Alumni' },
    { value: 1200, label: 'Mentors' },
    { value: 350, label: 'Companies' },
    { value: 98, label: 'Success Rate' },
  ]);

  // Feature tabs data
  const featureTabs = [
    {
      title: 'Smart Matching',
      description:
        'Our intelligent algorithm connects you with the perfect mentors based on your career goals, interests, and background.',
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: 'Flash Mentoring',
      description:
        'Quick, focused interactions with industry experts for specific advice when you need it most.',
      icon: <BookOpen className="h-8 w-8" />,
    },
    {
      title: 'Warm Introductions',
      description:
        'Leverage alumni connections at companies for job opportunities with personal introductions.',
      icon: <Award className="h-8 w-8" />,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative border-b-4 border-[#121212] bg-[#f5f5f5] px-4 pt-32 pb-0 md:pt-40 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23121212' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        ></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="grid gap-8 md:grid-cols-2"
          style={{ opacity, scale }}
        >
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block rounded-lg bg-[#c4ff0e] px-4 py-2 font-sans font-bold text-[#121212]"
            >
              GLS UNIVERSITY ALUMNI NETWORK
            </motion.div>

            <h1
              ref={headlineRef}
              className="mb-6 font-sans text-5xl font-extrabold leading-tight text-[#121212] md:text-7xl"
            >
              CONNECT. MENTOR. THRIVE.
            </h1>

            <p ref={subheadlineRef} className="mb-8 text-xl text-[#121212]">
              Join GLS Zenith — where students and alumni connect for
              mentorship, career growth, and community building through
              intelligent matching and meaningful micro-interactions.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
              >
                <Link href="/dashboard">
                  <Button className="relative overflow-hidden border-4 border-[#121212] bg-[#c4ff0e] px-8 py-6 font-sans text-xl font-bold text-[#121212] transition-all duration-300 hover:bg-[#a6d800] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_4px_#121212]">
                    JOIN NOW
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
              >
                <Button
                  variant="outline"
                  className="border-4 border-[#121212] bg-[#f5f5f5] px-8 py-6 font-sans text-xl font-bold text-[#121212] hover:bg-[#e5e5e5]"
                >
                  LEARN MORE
                </Button>
              </motion.div>
            </div>
          </div>

          <div ref={imageRef} className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full border-4 border-[#121212] bg-[#0057b8]"></div>
            <motion.div
              className="relative border-4 border-[#121212] bg-[#f5f5f5] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Image
                src={hero_img}
                alt="GLS Zenith Platform"
                width={600}
                height={500}
                className="h-full w-full object-cover"
              />

              {/* Interactive overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#c4ff0e]/30 to-[#0057b8]/30 mix-blend-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              />

              {/* Animated elements - only render after client-side mount */}
              {isMounted &&
                animatedPositions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-8 w-8 border-2 border-[#121212] bg-[#c4ff0e]"
                    initial={{
                      x: pos.x,
                      y: pos.y,
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      opacity: 0.8,
                      scale: 1,
                      x: Math.random() * 600,
                      y: Math.random() * 500,
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'reverse',
                      duration: 10 + i * 2,
                      delay: i * 0.5,
                    }}
                  />
                ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats section */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="border-4 border-[#121212] bg-[#f5f5f5] p-4 text-center"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="block font-sans text-4xl font-extrabold text-[#121212]"
              >
                <Counter
                  from={0}
                  to={stat.value}
                  duration={2}
                  delay={0.5 + index * 0.1}
                  triggerOnce={true}
                />
              </motion.div>
              <span className="mt-2 block font-sans text-lg text-[#121212]">
                {stat.label}
                {stat.label === 'Success Rate' ? '%' : '+'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Scrolling text section */}
        <div
          ref={scrollTextRef}
          className="relative mt-16 overflow-hidden py-8"
        >
          <div className="scroll-text whitespace-nowrap font-bebas text-6xl font-bold text-[#a5d710]">
            CONNECT • MENTOR • NETWORK • GROW • THRIVE • CONNECT • MENTOR •
            NETWORK • GROW • THRIVE • CONNECT • MENTOR • NETWORK • GROW • THRIVE
            • CONNECT • MENTOR • NETWORK • GROW • THRIVE •
          </div>
          <div className="scroll-text whitespace-nowrap font-bebas text-6xl font-bold text-[#a5d710] mt-4">
            ALUMNI • STUDENTS • CAREERS • OPPORTUNITIES • FUTURE • ALUMNI •
            STUDENTS • CAREERS • OPPORTUNITIES • FUTURE • ALUMNI • STUDENTS •
            CAREERS • OPPORTUNITIES • FUTURE •
          </div>
        </div>

        {/* Feature tabs section */}
        <div className="mt-16 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            className="mb-8 text-center font-sans text-3xl font-extrabold text-[#121212] md:text-4xl"
          >
            DISCOVER KEY FEATURES
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {featureTabs.map((tab, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className={`border-4 border-[#121212] p-6 transition-all duration-100 ${
                  activeTab === index ? 'bg-[#c4ff0e]' : 'bg-[#f5f5f5]'
                }`}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center border-4 border-[#121212] bg-[#f5f5f5]">
                  {tab.icon}
                </div>
                <h3 className="mb-2 font-sans text-xl font-bold text-[#121212]">
                  {tab.title}
                </h3>
                <p className="text-[#121212]">{tab.description}</p>
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center font-sans font-bold text-[#121212] hover:underline"
                >
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          className="relative mb-16 overflow-hidden border-4 border-[#121212] bg-[#0057b8] p-8 md:p-12"
        >
          <div className="absolute -right-20 -top-20 h-40 w-40 rotate-12 border-8 border-[#121212] bg-[#c4ff0e]"></div>
          <div className="relative z-10 grid gap-6 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="font-sans text-2xl font-extrabold text-[#f5f5f5] md:text-3xl">
                READY TO TRANSFORM YOUR CAREER JOURNEY?
              </h3>
              <p className="mt-4 text-lg text-[#f5f5f5]">
                Join thousands of GLS alumni and students already benefiting
                from our platform.
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <Button className="border-4 border-[#121212] bg-[#c4ff0e] px-8 py-4 font-sans text-lg font-bold text-[#121212] hover:bg-[#f5f5f5]">
                GET STARTED TODAY
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      >
        <div className="h-12 w-6 border-2 border-[#121212] rounded-full flex justify-center">
          <motion.div
            className="h-2 w-2 bg-[#121212] rounded-full mt-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
}

function Counter({
  from,
  to,
  duration,
  delay,
  triggerOnce,
}: {
  from: number;
  to: number;
  duration: number;
  delay: number;
  triggerOnce?: boolean;
}) {
  const [count, setCount] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: triggerOnce, amount: 0.3 });

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(updateCount);
        return;
      }

      if (now >= endTime) {
        setCount(to);
        setHasAnimated(true);
        return;
      }

      const progress = (now - startTime) / (duration * 1000);
      const currentCount = Math.floor(from + (to - from) * progress);
      setCount(currentCount);
      requestAnimationFrame(updateCount);
    };

    requestAnimationFrame(updateCount);
  }, [from, to, duration, delay, isInView, hasAnimated]);

  return <span ref={elementRef}>{count}</span>;
}
