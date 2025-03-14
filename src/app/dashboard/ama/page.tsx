'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LuCalendar,
  LuUsers,
  LuPlus,
  LuFilter,
  LuRefreshCw,
} from 'react-icons/lu';

interface AMASession {
  id: string;
  title: string;
  description: string;
  date: string;
  maxAttendees: number;
  isRegistered: boolean;
  rsvpStatus: string | null;
  organizer: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
    currentRole: string | null;
    company: string | null;
  };
}

interface SessionCardProps {
  session: AMASession;
  onRegister: (sessionId: string) => Promise<void>;
}

function SessionCard({ session, onRegister }: SessionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await onRegister(session.id);
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h3
              className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
              animate={{ color: isHovered ? '#3b82f6' : '#ffffff' }}
            >
              {session.title}
            </motion.h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <LuCalendar className="flex-shrink-0" />
                <span>{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <LuUsers className="flex-shrink-0" />
                <span>{session.maxAttendees} max attendees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Host Info */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
              {session.organizer.profileImage ? (
                <Image
                  src={session.organizer.profileImage}
                  alt={`${session.organizer.firstName} ${session.organizer.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                  {session.organizer.firstName[0]}
                  {session.organizer.lastName[0]}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-200">
                {session.organizer.firstName} {session.organizer.lastName}
              </h4>
              {session.organizer.currentRole && session.organizer.company && (
                <p className="text-sm text-gray-400">
                  {session.organizer.currentRole} at {session.organizer.company}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-6 line-clamp-3">
          {session.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/dashboard/ama/${session.id}`)}
            className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
          >
            View Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRegister}
            disabled={isRegistering || session.isRegistered}
            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
              session.isRegistered
                ? 'bg-green-500/10 text-green-400 cursor-not-allowed'
                : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            {session.isRegistered ? 'Registered' : 'Register'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AMAPage() {
  const [sessions, setSessions] = useState<AMASession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<AMASession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    registered: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/ama', {
        headers: {
          'X-User-Id': 'student_1',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch AMA sessions');
      const data = await res.json();
      setSessions(data.sessions);
      setFilteredSessions(data.sessions);
    } catch (err) {
      console.error('Error fetching AMA sessions:', err);
      setError('Failed to load AMA sessions. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let filtered = [...sessions];
    if (filters.registered) {
      filtered = filtered.filter((session) => session.isRegistered);
    }
    setFilteredSessions(filtered);
  }, [filters, sessions]);

  const handleRegister = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/ama/${sessionId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1',
        },
        body: JSON.stringify({ status: 'attending' }),
      });

      if (!res.ok) throw new Error('Failed to register for session');

      // Update local state
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === sessionId
            ? { ...session, isRegistered: true, rsvpStatus: 'attending' }
            : session
        )
      );
    } catch (err) {
      console.error('Error registering for session:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSessions();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          AMA Sessions
        </h1>
        <p className="mt-2 text-gray-400">
          Join live Q&A sessions with alumni and industry professionals
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <LuFilter
              className={`transform transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
            Filters
          </motion.button>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/ama/new')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <LuPlus className="w-5 h-5" />
              Host AMA
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg font-medium transition-all shadow-lg disabled:opacity-50"
            >
              <motion.span
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{
                  duration: 1,
                  repeat: isRefreshing ? Infinity : 0,
                }}
              >
                <LuRefreshCw className="w-5 h-5" />
              </motion.span>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.registered}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        registered: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-gray-300">
                    Show only registered sessions
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sessions Grid */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
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
        ) : filteredSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">No AMA sessions found.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onRegister={handleRegister}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
