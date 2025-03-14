'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  LuBriefcase,
  LuMapPin,
  LuFilter,
  LuRefreshCw,
  LuBuilding,
  LuUsers,
  LuPlus,
  LuClock,
  LuDollarSign,
  LuGlobe,
} from 'react-icons/lu';
import { useUser } from '@clerk/nextjs';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  type: string;
  isRemote: boolean;
  salaryRange: string | null;
  experienceLevel: string;
  postedBy: {
    name: string;
    image: string | null;
  };
  alumni: Array<{
    id: string;
    name: string;
    role: string;
    image: string | null;
  }>;
  createdAt: string;
}

interface Filters {
  industries: string[];
  types: string[];
  experienceLevels: string[];
}

function JobCard({ job, index }: { job: Job; index: number }) {
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
        {/* Company Info */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700 ring-2 ring-blue-500/20"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.company}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                <LuBuilding />
              </div>
            )}
          </motion.div>
          <div className="flex-1">
            <motion.h3
              className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              animate={{ color: isHovered ? '#3b82f6' : '#ffffff' }}
            >
              {job.title}
            </motion.h3>
            <motion.div
              className="text-base text-gray-400"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {job.company}
            </motion.div>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <motion.div
            className="flex items-center gap-2 text-sm text-gray-400"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <LuMapPin className="flex-shrink-0" />
            <span>
              {job.location}
              {job.isRemote && (
                <span className="ml-2 text-blue-400">• Remote Available</span>
              )}
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-sm text-gray-400"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <LuBriefcase className="flex-shrink-0" />
            <span>
              {job.type.charAt(0).toUpperCase() + job.type.slice(1)} •{' '}
              {job.experienceLevel.charAt(0).toUpperCase() +
                job.experienceLevel.slice(1)}
            </span>
          </motion.div>

          {job.salaryRange && (
            <motion.div
              className="flex items-center gap-2 text-sm font-medium text-green-400"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <LuDollarSign className="flex-shrink-0" />
              <span>{job.salaryRange} per year</span>
            </motion.div>
          )}
        </div>

        {/* Alumni Connections */}
        {job.alumni.length > 0 && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <LuUsers className="text-blue-400" />
              Alumni Connections
            </h4>
            <div className="flex -space-x-2 items-center">
              {job.alumni.map((alumnus, i) => (
                <motion.div
                  key={alumnus.id}
                  className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-800"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {alumnus.image ? (
                    <Image
                      src={alumnus.image}
                      alt={alumnus.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-500/20 flex items-center justify-center text-sm font-medium text-blue-300">
                      {alumnus.name[0]}
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 ring-2 ring-gray-700 text-xs text-gray-400"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 + job.alumni.length * 0.1 }}
              >
                {job.alumni.length}+
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="flex gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            Apply Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#374151' }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-2 bg-gray-700 rounded-lg font-medium transition-all shadow-lg shadow-gray-700/20 hover:shadow-gray-700/40"
          >
            View Details
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>({
    industries: [],
    types: [],
    experienceLevels: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    industry: '',
    type: '',
    experienceLevel: '',
    hasAlumni: false,
    minSalary: '',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    try {
      setError(null);
      const params = new URLSearchParams();
      if (selectedFilters.industry)
        params.append('industry', selectedFilters.industry);
      if (selectedFilters.type) params.append('type', selectedFilters.type);
      if (selectedFilters.experienceLevel)
        params.append('experienceLevel', selectedFilters.experienceLevel);
      if (selectedFilters.hasAlumni) params.append('hasAlumni', 'true');
      if (selectedFilters.minSalary)
        params.append('minSalary', selectedFilters.minSalary);
      if (selectedFilters.search)
        params.append('search', selectedFilters.search);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();
      setJobs(data.jobs || []);
      setFilters(data.filters);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedFilters]);

  const handleRefresh = () => fetchJobs(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
          <LuBriefcase className="text-4xl text-blue-500" />
          Job Board
        </h1>
        <p className="mt-2 text-gray-400">
          Discover opportunities with alumni connections
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search jobs..."
              value={selectedFilters.search}
              onChange={(e) =>
                setSelectedFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center gap-2 hover:border-blue-500/50 transition-colors"
          >
            <LuFilter className="text-blue-500" />
            <span>Filters</span>
          </motion.button>

          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-3 bg-blue-500 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <motion.span
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <LuRefreshCw />
            </motion.span>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>

          {/* Post Job (Alumni Only) */}
          {user?.publicMetadata?.role === 'alumni' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg flex items-center gap-2 hover:from-blue-600 hover:to-violet-600 transition-colors"
            >
              <LuPlus />
              <span>Post Job</span>
            </motion.button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Industry
                  </label>
                  <select
                    value={selectedFilters.industry}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        industry: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Industries</option>
                    {filters.industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Job Type
                  </label>
                  <select
                    value={selectedFilters.type}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {filters.types.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={selectedFilters.experienceLevel}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        experienceLevel: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    {filters.experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Alumni Connection Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Alumni Connections
                  </label>
                  <button
                    onClick={() =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        hasAlumni: !prev.hasAlumni,
                      }))
                    }
                    className={`w-full px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      selectedFilters.hasAlumni
                        ? 'bg-blue-500 border-blue-600 text-white'
                        : 'bg-gray-800 border-gray-700 hover:border-blue-500/50'
                    }`}
                  >
                    <LuUsers />
                    {selectedFilters.hasAlumni ? 'With Alumni' : 'Any'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Jobs Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
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
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">
              No jobs found matching your criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
