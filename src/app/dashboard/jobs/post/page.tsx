'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LuBriefcase,
  LuMapPin,
  LuBuilding,
  LuDollarSign,
  LuCalendar,
  LuClock,
  LuArrowLeft,
  LuSend,
  LuCircle,
} from 'react-icons/lu';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  isRemote: boolean;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applicationDeadline: string;
}

const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  type: 'full-time',
  isRemote: false,
  experienceLevel: 'entry',
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: [''],
  responsibilities: [''],
  applicationDeadline: '',
};

export default function PostJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to post job');

      router.push('/dashboard/jobs');
    } catch (err) {
      console.error('Error posting job:', err);
      setError('Failed to post job. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addListItem = (field: 'requirements' | 'responsibilities') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeListItem = (
    field: 'requirements' | 'responsibilities',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (
    field: 'requirements' | 'responsibilities',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
          <LuBriefcase className="text-4xl text-blue-500" />
          Post a Job
        </h1>
        <p className="mt-2 text-gray-400">
          Share opportunities with the GLS University community
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

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Title
              </label>
              <div className="relative">
                <LuBriefcase className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company
              </label>
              <div className="relative">
                <LuBuilding className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g. TechCorp Inc."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <LuMapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Application Deadline
              </label>
              <div className="relative">
                <LuCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicationDeadline: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experienceLevel: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Salary Range (per year)
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <LuDollarSign className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryMin: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Min"
                  />
                </div>
                <div className="relative flex-1">
                  <LuDollarSign className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salaryMax: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Remote Work
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRemote}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isRemote: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <span className="text-gray-300">Remote work available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Job Description</h2>
          <div className="prose prose-invert max-w-none">
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full h-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-gray-300"
              placeholder="Enter a detailed job description..."
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              You can use markdown for formatting: **bold**, *italic*, -
              bullets, etc.
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Requirements</h2>
          <div className="space-y-4">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={req}
                  onChange={(e) =>
                    updateListItem('requirements', index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add a requirement"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeListItem('requirements', index)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('requirements')}
              className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              Add Requirement
            </button>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6">Responsibilities</h2>
          <div className="space-y-4">
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) =>
                    updateListItem('responsibilities', index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add a responsibility"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeListItem('responsibilities', index)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('responsibilities')}
              className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              Add Responsibility
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <motion.button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <LuSend className={isSubmitting ? 'animate-pulse' : ''} />
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
