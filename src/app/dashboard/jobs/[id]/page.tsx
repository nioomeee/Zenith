'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  LuBriefcase,
  LuMapPin,
  LuBuilding,
  LuUsers,
  LuDollarSign,
  LuCalendar,
  LuArrowLeft,
  LuGlobe,
  LuClock,
  LuSend,
} from 'react-icons/lu';

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  isRemote: boolean;
  type: string;
  experienceLevel: string;
  salaryRange?: string;
  createdAt: string;
  alumni: { id: string; name: string; role: string; image?: string }[];
}

interface JobDetails extends Job {
  description: string;
  requirements: string[];
  responsibilities: string[];
  applicationDeadline: string;
  applicationCount: number;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null as File | null,
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!params?.id) throw new Error('Job ID is missing');
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [params?.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      const response = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to submit application');

      setShowApplyForm(false);
      setApplicationData({ coverLetter: '', resume: null });
    } catch (err) {
      console.error('Error submitting application:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800/50 rounded w-1/4"></div>
          <div className="h-32 bg-gray-800/50 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800/50 rounded w-2/3"></div>
            <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
        >
          {error || 'Job not found'}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <LuArrowLeft />
        <span>Back to Jobs</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 mb-8 border border-gray-700"
      >
        <div className="flex items-start gap-6">
          <motion.div
            className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-700 ring-2 ring-blue-500/20"
            whileHover={{ scale: 1.05 }}
          >
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={job.company}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400 bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                <LuBuilding />
              </div>
            )}
          </motion.div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <LuBuilding className="flex-shrink-0" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <LuMapPin className="flex-shrink-0" />
                <span>
                  {job.location}
                  {job.isRemote && (
                    <span className="ml-2 text-blue-400">
                      • Remote Available
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuBriefcase className="flex-shrink-0" />
                <span>
                  {job.type.charAt(0).toUpperCase() + job.type.slice(1)} •{' '}
                  {job.experienceLevel.charAt(0).toUpperCase() +
                    job.experienceLevel.slice(1)}
                </span>
              </div>
              {job.salaryRange && (
                <div className="flex items-center gap-2 text-green-400">
                  <LuDollarSign className="flex-shrink-0" />
                  <span>{job.salaryRange} per year</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Posted</div>
            <div className="font-semibold flex items-center justify-center gap-2">
              <LuCalendar className="text-blue-400" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Applications</div>
            <div className="font-semibold flex items-center justify-center gap-2">
              <LuUsers className="text-violet-400" />
              {job.applicationCount}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Deadline</div>
            <div className="font-semibold flex items-center justify-center gap-2">
              <LuClock className="text-red-400" />
              {new Date(job.applicationDeadline).toLocaleDateString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Alumni</div>
            <div className="font-semibold flex items-center justify-center gap-2">
              <LuUsers className="text-green-400" />
              {job.alumni.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className="text-blue-400 mt-1">•</span>
                  {req}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-2 text-gray-300"
                >
                  <span className="text-blue-400 mt-1">•</span>
                  {resp}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Actions */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowApplyForm(true)}
              className="w-full px-4 py-3 bg-blue-500 rounded-lg font-medium mb-4 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <LuSend />
              Apply Now
            </motion.button>
            <button className="w-full px-4 py-3 bg-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors">
              <LuGlobe />
              Visit Company Website
            </button>
          </div>

          {/* Alumni Connections */}
          {job.alumni.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LuUsers className="text-blue-400" />
                Alumni at Company
              </h3>
              <div className="space-y-4">
                {job.alumni.map((alumnus) => (
                  <motion.div
                    key={alumnus.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 ring-2 ring-gray-600">
                      {alumnus.image ? (
                        <Image
                          src={alumnus.image}
                          alt={alumnus.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400">
                          {alumnus.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{alumnus.name}</div>
                      <div className="text-sm text-gray-400">
                        {alumnus.role}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Apply Form Modal */}
      {showApplyForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowApplyForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              Apply for {job.title}
            </h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData((prev) => ({
                      ...prev,
                      coverLetter: e.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Why are you a good fit for this position?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Resume
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setApplicationData((prev) => ({
                      ...prev,
                      resume: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
