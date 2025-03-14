'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useScrollDirection from '@/hooks/use-scroll-direction';

export default function ScrollingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !textRef1.current || !textRef2.current) return;

    // Set initial position
    gsap.set(textRef1.current, { xPercent: 0 });
    gsap.set(textRef2.current, { xPercent: -100 });

    // Create animations
    const tl1 = gsap.to(textRef1.current, {
      xPercent: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    const tl2 = gsap.to(textRef2.current, {
      xPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Update animation direction based on scroll direction
    const updateDirection = () => {
      if (scrollDirection === 'up') {
        tl1.reversed(true);
        tl2.reversed(true);
      } else {
        tl1.reversed(false);
        tl2.reversed(false);
      }
    };

    // Watch for scroll direction changes
    const observer = new MutationObserver(updateDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-scroll-direction'],
    });

    return () => {
      tl1.kill();
      tl2.kill();
      observer.disconnect();
    };
  }, [scrollDirection]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden border-b-4 border-[#121212] bg-[#c4ff0e] py-2 h-28"
    >
      <div className="flex whitespace-nowrap">
        <div
          ref={textRef1}
          className="flex min-w-full justify-around gap-4 px-4"
        >
          {Array(10)
            .fill('CONNECT • MENTOR • GROW • NETWORK • THRIVE • ')
            .map((text, i) => (
              <span key={i} className="text-4xl font-extrabold text-[#121212]">
                {text}
              </span>
            ))}
        </div>
        <div
          ref={textRef2}
          className="flex mt-16 min-w-full justify-around gap-4 px-4 absolute left-full top-0"
        >
          {Array(10)
            .fill('CONNECT • MENTOR • GROW • NETWORK • THRIVE • ')
            .map((text, i) => (
              <span key={i} className="text-4xl font-extrabold text-[#121212]">
                {text}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
