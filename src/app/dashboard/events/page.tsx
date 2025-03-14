'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LuCalendar,
  LuMapPin,
  LuUsers,
  LuFilter,
  LuRefreshCw,
  LuClock,
  LuGlobe,
  LuBuilding,
  LuCheck,
  LuX,
  LuHeadset,
} from 'react-icons/lu';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isVirtual: boolean;
  virtualLink: string | null;
  maxAttendees: number | null;
  image: string | null;
  category: string;
  status: string;
  organizer: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
  };
  attendeeCount: number;
  userRsvp: string | null;
}

interface EventCardProps {
  event: Event;
  onRsvp: (eventId: string, status: string) => Promise<void>;
}

function EventCard({ event, onRsvp }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isRsvping, setIsRsvping] = useState(false);
  const router = useRouter();

  const handleRsvp = async (status: string) => {
    setIsRsvping(true);
    try {
      await onRsvp(event.id, status);
    } finally {
      setIsRsvping(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
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
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
            <LuCalendar className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20"
          >
            {event.category}
          </motion.div>
        </div>
      </div>

      <div className="p-6">
        {/* Title and Organizer */}
        <div className="mb-4">
          <motion.h3
            className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
            animate={{ color: isHovered ? '#3b82f6' : '#ffffff' }}
          >
            {event.title}
          </motion.h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
              {event.organizer.profileImage ? (
                <Image
                  src={event.organizer.profileImage}
                  alt={`${event.organizer.firstName} ${event.organizer.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                  {event.organizer.firstName[0]}
                  {event.organizer.lastName[0]}
                </div>
              )}
            </div>
            <span>
              Organized by {event.organizer.firstName}{' '}
              {event.organizer.lastName}
            </span>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <LuCalendar className="flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            {event.isVirtual ? (
              <>
                <LuGlobe className="flex-shrink-0 text-green-400" />
                <span className="text-green-400">Virtual Event</span>
              </>
            ) : (
              <>
                <LuMapPin className="flex-shrink-0" />
                <span>{event.location}</span>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <LuUsers className="flex-shrink-0" />
            <span>
              {event.attendeeCount} attending
              {event.maxAttendees &&
                ` (${event.maxAttendees - event.attendeeCount} spots left)`}
            </span>
          </motion.div>
        </div>

        {/* Description Preview */}
        {!showDetails && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-300 mb-6 line-clamp-2"
          >
            {event.description}
          </motion.p>
        )}

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <p className="text-sm text-gray-300 mb-4">{event.description}</p>

              {event.isVirtual && event.virtualLink && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Virtual Event Link
                  </h4>
                  <a
                    href={event.virtualLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {event.virtualLink}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRsvp('attending')}
              disabled={isRsvping}
              className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                event.userRsvp === 'attending'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              <LuCheck className="w-4 h-4" />
              Yes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRsvp('maybe')}
              disabled={isRsvping}
              className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                event.userRsvp === 'maybe'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              <LuHeadset className="w-4 h-4" />
              Maybe
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRsvp('not_attending')}
              disabled={isRsvping}
              className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                event.userRsvp === 'not_attending'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
              }`}
            >
              <LuX className="w-4 h-4" />
              No
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-gray-700 rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors"
          >
            {showDetails ? 'Show Less' : 'More Info'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: 'upcoming',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.status) queryParams.append('status', filters.status);

      const res = await fetch(`/api/events?${queryParams}`, {
        headers: {
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
      });
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data.events);
      setFilteredEvents(data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleRsvp = async (eventId: string, status: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update RSVP');

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, userRsvp: status } : event
        )
      );
    } catch (err) {
      console.error('Error updating RSVP:', err);
      // Show error toast
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEvents();
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
          Events
        </h1>
        <p className="mt-2 text-gray-400">
          Connect with alumni and fellow students at upcoming events
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

      {/* Filters */}
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
          >
            <motion.span
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <LuRefreshCw className="w-5 h-5" />
            </motion.span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="networking">Networking</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="panel">Panel Discussion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Events Grid */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800/50 rounded-xl h-96 animate-pulse"
              />
            ))}
          </motion.div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">No events found.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
