'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import flash_mentoring from '@/../public/flash-mentoring-request.jpeg';
import matching_mentors from '@/../public/matching-mentors.jpeg';
import job_board from '@/../public/job-board.jpeg';
import interest_based_groups from '@/../public/Interest-based-groups.jpeg';
import session from '@/../public/Scheduling-session.jpg';
const features = [
  {
    title: 'Smart Matching Algorithm',
    description:
      'Connect with alumni and students based on shared interests, career paths, and mentorship preferences with our multi-faceted matching system.',
    image: matching_mentors.src,
  },
  {
    title: 'Flash Mentoring Requests',
    description:
      'Request short, focused interactions with alumni for specific advice, making mentorship accessible even for the busiest professionals.',
    image: flash_mentoring.src,
  },
  {
    title: 'Enhanced Job Board',
    description:
      "Discover opportunities with 'Warm Introductions' highlighting alumni connections at companies posting jobs.",
    image: job_board.src,
  },
  {
    title: 'Interest-Based Groups',
    description:
      'Join online communities based on shared interests to foster organic networking and build meaningful connections.',
    image: interest_based_groups.src,
  },
  {
    title: 'AMA Session Scheduling',
    description:
      'Participate in structured Q&A sessions with alumni experts in specific fields to gain valuable insights.',
    image: session.src,
  },
];

export default function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <button
          onClick={goToPrevious}
          className="absolute -left-4 z-10 flex h-12 w-12 items-center justify-center border-4 border-[#121212] bg-[#f5f5f5] text-[#121212] hover:bg-[#e5e5e5] md:-left-6"
          aria-label="Previous feature"
        >
          <Minus className="h-8 w-8" />
        </button>

        <div className="w-full max-w-4xl overflow-hidden">
          <div className="transition-opacity duration-300" key={currentIndex}>
            <div className="border-8 border-[#121212] bg-[#f5f5f5]">
              <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8">
                  <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">
                    {features[currentIndex].title}
                  </h3>
                  <p className="text-lg text-[#121212]">
                    {features[currentIndex].description}
                  </p>
                </div>
                <div className="relative overflow-hidden">
                  {/* Apply duotone effect with CSS */}
                  <div className="relative">
                    <Image
                      src={features[currentIndex].image || '/placeholder.svg'}
                      alt={features[currentIndex].title}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={goToNext}
          className="absolute -right-4 z-10 flex h-12 w-12 items-center justify-center border-4 border-[#121212] bg-[#f5f5f5] text-[#121212] hover:bg-[#e5e5e5] md:-right-6"
          aria-label="Next feature"
        >
          <Plus className="h-8 w-8" />
        </button>
      </div>

      {/* Feature counter */}
      <div className="mt-4 text-center font-sans font-bold text-[#121212]">
        {currentIndex + 1} / {features.length}
      </div>
    </div>
  );
}
