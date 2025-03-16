'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  LuBriefcase,
  LuGraduationCap,
  LuMapPin,
  LuRefreshCw,
} from 'react-icons/lu';
import { MatchWeights, DEFAULT_WEIGHTS } from '@/types/matching';

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
  index: number;
}

function MatchCard({ match, index }: MatchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <motion.div
            className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 ring-2 ring-blue-500/20"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {match.profile.profileImage ? (
              <Image
                src={match.profile.profileImage}
                alt={`${match.profile.firstName} ${match.profile.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                {match.profile.firstName[0]}
                {match.profile.lastName[0]}
              </div>
            )}
          </motion.div>
          <div className="flex-1">
            <motion.h3
              className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              animate={{ color: isHovered ? '#3b82f6' : '#ffffff' }}
            >
              {match.profile.firstName} {match.profile.lastName}
            </motion.h3>
            {match.profile.currentRole && match.profile.company && (
              <motion.div
                className="flex items-center gap-2 text-sm text-gray-400"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <LuBriefcase className="flex-shrink-0" />
                <span>
                  {match.profile.currentRole} at {match.profile.company}
                </span>
              </motion.div>
            )}
            <motion.div
              className="flex items-center gap-2 text-sm text-gray-400"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LuGraduationCap className="flex-shrink-0" />
              <span>
                {match.profile.major} ({match.profile.graduationYear})
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm text-gray-400"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <LuMapPin className="flex-shrink-0" />
              <span>{match.profile.location}</span>
            </motion.div>
          </div>
          <motion.div
            className="text-right"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {Math.round(match.score * 100)}%
            </div>
            <div className="text-sm text-gray-400">Match</div>
          </motion.div>
        </div>

        {/* Match Details */}
        <AnimatePresence>
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {match.explanation.map((text, i) => (
              <motion.p
                key={i}
                className="text-sm text-gray-300"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                • {text}
              </motion.p>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <motion.div
          className="mt-6 flex gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Connect
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#374151' }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg font-medium transition-all shadow-lg shadow-gray-700/20 hover:shadow-gray-700/40"
          >
            View Profile
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchCardProps['match'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeights] = useState<MatchWeights>(DEFAULT_WEIGHTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchMatches();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Your Matches
        </h1>
        <p className="mt-2 text-gray-400">
          Connect with alumni who share your interests and career goals
        </p>
      </motion.div>

      {error && (
        <motion.div
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Filters and Refresh */}
      {/* <motion.div
        className="mb-8 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Match Preferences
          </h2>
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
          >
            <motion.span
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <LuRefreshCw className="w-5 h-5" />
            </motion.span>
            {isRefreshing ? 'Refreshing...' : 'Refresh Matches'}
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(weights)
            .filter(([key]) => key !== 'location') // Remove location slider
            .map(([key, value]) => (
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
                  className="w-full accent-blue-500"
                />
                <div className="text-sm text-gray-400 mt-1">{value * 100}%</div>
              </div>
            ))}
        </div>
      </motion.div> */}

      {/* Matches Grid */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800/50 rounded-xl h-64 animate-pulse"
              />
            ))}
          </motion.div>
        ) : matches.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-gray-400">No matches found.</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {matches.map((match, index) => (
              <MatchCard key={match.userId} match={match} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
