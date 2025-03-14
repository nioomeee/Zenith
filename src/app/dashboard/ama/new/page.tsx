'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LuCalendar,
  LuClock,
  LuUsers,
  LuArrowLeft,
  LuSend,
} from 'react-icons/lu';

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  maxAttendees: string;
  targetAudience: string;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  date: '',
  time: '',
  duration: '60',
  maxAttendees: '50',
  targetAudience: '',
};

export default function NewAMAPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const response = await fetch('/api/ama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'alumni_1', // Replace with actual user ID
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: dateTime.toISOString(),
          duration: parseInt(formData.duration),
          maxAttendees: parseInt(formData.maxAttendees),
          targetAudience: formData.targetAudience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create AMA session');
      }

      router.push('/dashboard/ama');
    } catch (error) {
      console.error('Error creating AMA session:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Host an AMA Session
        </h1>
        <p className="mt-2 text-gray-400">
          Share your experience and insights with students in a live Q&A session
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Session Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full bg-gray-900 border ${
                  errors.title ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Career Transition from Academia to Industry"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={8}
                className={`w-full bg-gray-900 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Describe what you'll discuss in this AMA session..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Tip: Include your background, topics you'll cover, and what
                attendees can expect to learn.
              </p>
            </div>

            <div>
              <label
                htmlFor="targetAudience"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Target Audience
              </label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className={`w-full bg-gray-900 border ${
                  errors.targetAudience ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., Computer Science students interested in ML/AI"
              />
              {errors.targetAudience && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.targetAudience}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full bg-gray-900 border ${
                    errors.date ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <LuCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full bg-gray-900 border ${
                    errors.time ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <LuClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Duration (minutes)
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="maxAttendees"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Maximum Attendees
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  min="1"
                  max="200"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <LuUsers className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <LuSend className="w-5 h-5" />
            {isSubmitting ? 'Creating Session...' : 'Create Session'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
