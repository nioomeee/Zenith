'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LuBriefcase, LuGraduationCap, LuMapPin } from 'react-icons/lu';
import { MatchScore, MatchWeights, DEFAULT_WEIGHTS } from '@/types/matching';

interface MatchCardProps {
  match: {
    userId: string;
    score: number;
    profile: {
      firstName: string;
      lastName: string;
      profileImage: string | null;
      major: string;
      graduationYear: number;
      currentRole: string | null;
      company: string | null;
      location: string;
    };
    explanation: string[];
  };
}

function MatchCard({ match }: MatchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-colors"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700">
            {match.profile.profileImage ? (
              <Image
                src={match.profile.profileImage}
                alt={`${match.profile.firstName} ${match.profile.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                {match.profile.firstName[0]}
                {match.profile.lastName[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {match.profile.firstName} {match.profile.lastName}
            </h3>
            {match.profile.currentRole && match.profile.company && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LuBriefcase className="flex-shrink-0" />
                <span>
                  {match.profile.currentRole} at {match.profile.company}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LuGraduationCap className="flex-shrink-0" />
              <span>
                {match.profile.major} ({match.profile.graduationYear})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LuMapPin className="flex-shrink-0" />
              <span>{match.profile.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {Math.round(match.score * 100)}%
            </div>
            <div className="text-sm text-gray-400">Match</div>
          </div>
        </div>

        {/* Match Details */}
        <div className="mt-4 space-y-2">
          {match.explanation.map((text, i) => (
            <p key={i} className="text-sm text-gray-300">
              • {text}
            </p>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors">
            Connect
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchCardProps['match'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeights] = useState<MatchWeights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/matching/matches', {
          headers: {
            'X-User-Id': 'student_1',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Matches</h1>
        <p className="mt-2 text-gray-400">
          Connect with alumni who share your interests and career goals
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Match Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={value}
                onChange={(e) =>
                  setWeights((prev) => ({
                    ...prev,
                    [key]: parseFloat(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="text-sm text-gray-400 mt-1">{value * 100}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800/50 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No matches found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.userId} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
