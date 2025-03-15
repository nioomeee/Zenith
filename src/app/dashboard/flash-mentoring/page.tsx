'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  LuCalendar,
  LuClock,
  LuPlus,
  LuTarget,
  LuCheckCheck,
  LuCircleCheck,
  LuHourglass,
  LuVideo,
  LuMessageCircle,
  LuCross,
} from 'react-icons/lu';

interface MentorshipRequest {
  id: string;
  title: string;
  description: string;
  duration: number;
  preferredTime: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  area: {
    id: string;
    name: string;
  };
  mentor?: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
    currentRole: string | null;
    company: string | null;
  };
  student?: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
    major: string;
    graduationYear: number;
  };
  scheduledFor?: string;
  meetingLink?: string;
}

function RequestCard({ request }: { request: MentorshipRequest }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const getStatusColor = (status: MentorshipRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'accepted':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'cancelled':
        return 'text-red-500';
    }
  };

  const getStatusIcon = (status: MentorshipRequest['status']) => {
    switch (status) {
      case 'pending':
        return <LuHourglass className="w-5 h-5" />;
      case 'accepted':
        return <LuCheckCheck className="w-5 h-5" />;
      case 'completed':
        return <LuCircleCheck className="w-5 h-5" />;
      case 'cancelled':
        return <LuCross className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {request.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
              <LuTarget className="w-4 h-4" />
              <span>{request.area.name}</span>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 ${getStatusColor(
              request.status
            )}`}
          >
            {getStatusIcon(request.status)}
            <span className="capitalize">{request.status}</span>
          </div>
        </div>

        <p className="text-gray-300 mb-4">{request.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <LuClock className="w-4 h-4" />
            <span>{request.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <LuCalendar className="w-4 h-4" />
            <span>{request.preferredTime}</span>
          </div>
        </div>

        {request.mentor && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
                {request.mentor.profileImage ? (
                  <Image
                    src={request.mentor.profileImage}
                    alt={`${request.mentor.firstName} ${request.mentor.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                    {request.mentor.firstName[0]}
                    {request.mentor.lastName[0]}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-200">
                  {request.mentor.firstName} {request.mentor.lastName}
                </h4>
                {request.mentor.currentRole && request.mentor.company && (
                  <p className="text-sm text-gray-400">
                    {request.mentor.currentRole} at {request.mentor.company}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {request.student && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
                {request.student.profileImage ? (
                  <Image
                    src={request.student.profileImage}
                    alt={`${request.student.firstName} ${request.student.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                    {request.student.firstName[0]}
                    {request.student.lastName[0]}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-200">
                  {request.student.firstName} {request.student.lastName}
                </h4>
                <p className="text-sm text-gray-400">
                  {request.student.major} ({request.student.graduationYear})
                </p>
              </div>
            </div>
          </div>
        )}

        {request.status === 'accepted' && request.scheduledFor && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400">
                <LuCalendar className="w-5 h-5" />
                <span>
                  {new Date(request.scheduledFor).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {request.meetingLink && (
                <a
                  href={request.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <LuVideo className="w-5 h-5" />
                  <span>Join Meeting</span>
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {request.status === 'pending' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                onClick={() => {
                  // Handle accept/schedule
                }}
              >
                {request.student ? 'Accept & Schedule' : 'Cancel Request'}
              </motion.button>
              {request.student && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-700 rounded-lg font-medium transition-all shadow-lg shadow-gray-700/20 hover:shadow-gray-700/40"
                  onClick={() => {
                    // Handle message student
                  }}
                >
                  <LuMessageCircle className="w-5 h-5" />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FlashMentoringPage() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/flash-mentoring', {
        headers: {
          'X-User-Id': 'student_1',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data.requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load mentoring requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Flash Mentoring
            </h1>
            <p className="mt-2 text-gray-400">
              Get quick, focused guidance from alumni in your field of interest
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard/flash-mentoring/new')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            <LuPlus className="w-5 h-5" />
            Request Mentoring
          </motion.button>
        </div>
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

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-800/50 rounded-xl animate-pulse"
              />
            ))}
          </motion.div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">No mentoring requests found.</p>
            <button
              onClick={() => router.push('/dashboard/flash-mentoring/new')}
              className="mt-4 px-6 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              Create Your First Request
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
