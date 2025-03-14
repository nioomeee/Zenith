'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LuUsers,
  LuFilter,
  LuRefreshCw,
  LuMessageSquare,
  LuHeart,
  LuHeartOff,
  LuUserPlus,
  LuUserMinus,
  LuSend,
} from 'react-icons/lu';

interface InterestGroup {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  isUserMember: boolean;
  latestPost: {
    content: string;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
      profileImage: string | null;
    };
  } | null;
}

interface GroupCardProps {
  group: InterestGroup;
  onJoin: (groupId: string, action: 'join' | 'leave') => Promise<void>;
}

function GroupCard({ group, onJoin }: GroupCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await onJoin(group.id, group.isUserMember ? 'leave' : 'join');
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
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
              {group.name}
            </motion.h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LuUsers className="flex-shrink-0" />
              <span>{group.memberCount} members</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/20"
          >
            {group.category}
          </motion.div>
        </div>

        {/* Latest Post Preview */}
        {group.latestPost && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
                {group.latestPost.author.profileImage ? (
                  <Image
                    src={group.latestPost.author.profileImage}
                    alt={`${group.latestPost.author.firstName} ${group.latestPost.author.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                    {group.latestPost.author.firstName[0]}
                    {group.latestPost.author.lastName[0]}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-400">
                {group.latestPost.author.firstName}{' '}
                {group.latestPost.author.lastName}
              </span>
              <span className="text-xs text-gray-500">
                • {formatDate(group.latestPost.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-2">
              {group.latestPost.content}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              router.push(`/dashboard/interest-groups/${group.id}`)
            }
            className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-2"
          >
            <LuMessageSquare className="w-4 h-4" />
            View Discussions
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoin}
            disabled={isJoining}
            className={`px-4 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
              group.isUserMember
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-red-500/20 hover:shadow-red-500/40'
                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 shadow-green-500/20 hover:shadow-green-500/40'
            }`}
          >
            {group.isUserMember ? (
              <>
                <LuUserMinus className="w-4 h-4" />
                Leave
              </>
            ) : (
              <>
                <LuUserPlus className="w-4 h-4" />
                Join
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function InterestGroupsPage() {
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<InterestGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    memberOnly: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/interest-groups', {
        headers: {
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
      });
      if (!res.ok) throw new Error('Failed to fetch groups');
      const data = await res.json();
      setGroups(data.groups);
      setFilteredGroups(data.groups);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load interest groups. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    let filtered = [...groups];
    if (filters.category) {
      filtered = filtered.filter(
        (group) => group.category === filters.category
      );
    }
    if (filters.memberOnly) {
      filtered = filtered.filter((group) => group.isUserMember);
    }
    setFilteredGroups(filtered);
  }, [filters, groups]);

  const handleJoin = async (groupId: string, action: 'join' | 'leave') => {
    try {
      const res = await fetch(`/api/interest-groups/${groupId}/membership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error('Failed to update membership');

      // Update local state
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? { ...group, isUserMember: action === 'join' }
            : group
        )
      );
    } catch (err) {
      console.error('Error updating membership:', err);
      // Show error toast
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchGroups();
  };

  const categories = Array.from(
    new Set(groups.map((group) => group.category))
  ).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Interest Groups
        </h1>
        <p className="mt-2 text-gray-400">
          Connect with others who share your interests and passions
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Membership
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.memberOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          memberOnly: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-gray-300">
                      Show only joined groups
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Groups Grid */}
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
                className="bg-gray-800/50 rounded-xl h-64 animate-pulse"
              />
            ))}
          </motion.div>
        ) : filteredGroups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">No interest groups found.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} onJoin={handleJoin} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
