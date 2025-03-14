'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuCalendar,
  LuClock,
  LuUsers,
  LuArrowLeft,
  LuSend,
  LuMessageCircle,
  LuHeart,
  LuHeartOff,
  LuPin,
} from 'react-icons/lu';
import Image from 'next/image';

interface Question {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
  };
  replies: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string | null;
    };
  }>;
}

interface AMASessionDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: number;
  maxAttendees: number;
  currentAttendees: number;
  targetAudience: string;
  status: 'upcoming' | 'live' | 'ended';
  isRegistered: boolean;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    currentRole: string | null;
    company: string | null;
  };
  questions: Question[];
}

function QuestionCard({
  question,
  onLike,
  onPin,
  isOrganizer,
}: {
  question: Question;
  onLike: (id: string) => void;
  onPin: (id: string) => void;
  isOrganizer: boolean;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/ama/questions/${question.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1',
        },
        body: JSON.stringify({ content: newReply }),
      });

      if (!res.ok) throw new Error('Failed to post reply');

      setNewReply('');
      setShowReplies(true);
    } catch (err) {
      console.error('Error posting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${
        question.isPinned
          ? 'from-blue-900/30 to-blue-800/30 border-blue-500/50'
          : 'from-gray-800/30 to-gray-900/30 border-gray-700'
      } rounded-xl p-6 border transition-colors`}
    >
      <div className="flex items-start gap-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600 flex-shrink-0">
          {question.user.profileImage ? (
            <Image
              src={question.user.profileImage}
              alt={`${question.user.firstName} ${question.user.lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-medium">
              {question.user.firstName[0]}
              {question.user.lastName[0]}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-200">
              {question.user.firstName} {question.user.lastName}
            </h4>
            <div className="flex items-center gap-2">
              {isOrganizer && (
                <button
                  onClick={() => onPin(question.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    question.isPinned
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <LuPin className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onLike(question.id)}
                className={`p-2 rounded-lg transition-colors ${
                  question.isLiked
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {question.isLiked ? (
                  <LuHeart className="w-4 h-4" />
                ) : (
                  <LuHeartOff className="w-4 h-4" />
                )}
              </button>
              <span className="text-sm text-gray-400">{question.likes}</span>
            </div>
          </div>
          <p className="mt-2 text-gray-300">{question.content}</p>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LuMessageCircle className="w-4 h-4" />
              {question.replies.length} replies
            </button>
            <span className="text-sm text-gray-500">
              {new Date(question.createdAt).toLocaleTimeString()}
            </span>
          </div>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                {question.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex items-start gap-3 pl-6 border-l-2 border-gray-700"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600 flex-shrink-0">
                      {reply.user.profileImage ? (
                        <Image
                          src={reply.user.profileImage}
                          alt={`${reply.user.firstName} ${reply.user.lastName}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-medium">
                          {reply.user.firstName[0]}
                          {reply.user.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-gray-200">
                          {reply.user.firstName} {reply.user.lastName}
                        </h5>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-300">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}

                <form onSubmit={handleSubmitReply} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting || !newReply.trim()}
                      className="px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reply
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function AMASessionPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<AMASessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/ama/${params.id}`, {
        headers: {
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
      });
      if (!res.ok) throw new Error('Failed to fetch session details');
      const data = await res.json();
      setSession(data.session);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load session details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [params.id]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/ama/${params.id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
        body: JSON.stringify({ content: newQuestion }),
      });

      if (!res.ok) throw new Error('Failed to post question');

      setNewQuestion('');
      await fetchSession(); // Refresh the questions list
    } catch (err) {
      console.error('Error posting question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeQuestion = async (questionId: string) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/ama/questions/${questionId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
      });

      if (!res.ok) throw new Error('Failed to like question');

      // Update local state
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  isLiked: !q.isLiked,
                  likes: q.isLiked ? q.likes - 1 : q.likes + 1,
                }
              : q
          ),
        };
      });
    } catch (err) {
      console.error('Error liking question:', err);
    }
  };

  const handlePinQuestion = async (questionId: string) => {
    if (!session) return;

    try {
      const res = await fetch(`/api/ama/questions/${questionId}/pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': session.organizer.id, // Only the organizer can pin
        },
      });

      if (!res.ok) throw new Error('Failed to pin question');

      // Update local state
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.id === questionId ? { ...q, isPinned: !q.isPinned } : q
          ),
        };
      });
    } catch (err) {
      console.error('Error pinning question:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-800 rounded w-3/4"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-400">{error || 'Session not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isLive = session.status === 'live';
  const hasEnded = session.status === 'ended';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <LuArrowLeft className="w-5 h-5" />
          Back to AMA Sessions
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {session.title}
            </h1>
            <div className="mt-4 flex items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <LuCalendar className="w-5 h-5" />
                <span>
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuClock className="w-5 h-5" />
                <span>
                  {new Date(session.date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                  {' - '}
                  {session.duration} minutes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuUsers className="w-5 h-5" />
                <span>
                  {session.currentAttendees}/{session.maxAttendees} attendees
                </span>
              </div>
            </div>
          </div>
          {!hasEnded && !session.isRegistered && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                try {
                  const res = await fetch(`/api/ama/${session.id}/register`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-User-Id': 'student_1', // Replace with actual user ID
                    },
                  });

                  if (!res.ok) throw new Error('Failed to register');

                  await fetchSession(); // Refresh session data
                } catch (err) {
                  console.error('Error registering:', err);
                }
              }}
              className="px-6 py-3 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Register Now
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Host Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
            {session.organizer.profileImage ? (
              <Image
                src={session.organizer.profileImage}
                alt={`${session.organizer.firstName} ${session.organizer.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-medium">
                {session.organizer.firstName[0]}
                {session.organizer.lastName[0]}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {session.organizer.firstName} {session.organizer.lastName}
            </h2>
            {session.organizer.currentRole && session.organizer.company && (
              <p className="text-gray-400">
                {session.organizer.currentRole} at {session.organizer.company}
              </p>
            )}
          </div>
        </div>
        <div
          className="mt-6 text-gray-300 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: session.description }}
        />
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Target Audience</h3>
          <p className="text-gray-300">{session.targetAudience}</p>
        </div>
      </motion.div>

      {/* Q&A Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Q&A</h2>
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500 font-medium">Live Now</span>
            </div>
          )}
        </div>

        {(isLive || hasEnded) && (
          <form onSubmit={handleSubmitQuestion} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting || !newQuestion.trim()}
                className="px-6 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuSend className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        )}

        <AnimatePresence mode="popLayout">
          {session.questions
            ?.sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return b.likes - a.likes;
            })
            ?.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onLike={handleLikeQuestion}
                onPin={handlePinQuestion}
                isOrganizer={session.organizer.id === 'alumni_1'}
              />
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
