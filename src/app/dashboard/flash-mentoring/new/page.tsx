'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuClock, LuCalendar } from 'react-icons/lu';

interface MentorshipArea {
  id: string;
  name: string;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<MentorshipArea[]>([]);
  const [minDate, setMinDate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    areaId: '',
    duration: 30,
    preferredTime: '',
  });

  useEffect(() => {
    // Set min date on client side to avoid hydration mismatch
    setMinDate(new Date().toISOString().split('.')[0]);
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch('/api/mentorship-areas', {
          headers: {
            'X-User-Id': 'student_1',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch mentorship areas');
        const data = await res.json();
        setAreas(data.areas);
      } catch (err) {
        console.error('Error fetching areas:', err);
        setError('Failed to load mentorship areas. Please try again later.');
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/flash-mentoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'student_1', // Replace with actual user ID
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create request');
      }

      router.push('/dashboard/flash-mentoring');
    } catch (err) {
      console.error('Error creating request:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create request. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <LuArrowLeft className="w-5 h-5" />
          Back to Requests
        </button>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          New Mentoring Request
        </h1>
        <p className="mt-2 text-gray-400">
          Fill out the form below to request a flash mentoring session
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
        className="space-y-6"
      >
        <div className="space-y-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-200"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Career advice for software engineering"
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-200"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what you'd like to discuss..."
            rows={4}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="space-y-4">
          <label
            htmlFor="areaId"
            className="block text-sm font-medium text-gray-200"
          >
            Mentorship Area
          </label>
          <select
            id="areaId"
            name="areaId"
            required
            value={formData.areaId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-200"
            >
              Duration (minutes)
            </label>
            <div className="relative">
              <LuClock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="duration"
                name="duration"
                required
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="preferredTime"
              className="block text-sm font-medium text-gray-200"
            >
              Preferred Time
            </label>
            <div className="relative">
              <LuCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                id="preferredTime"
                name="preferredTime"
                required
                value={formData.preferredTime}
                onChange={handleInputChange}
                min={minDate}
                className="w-full pl-12 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className={`w-full px-6 py-3 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-400'
            }`}
          >
            {isSubmitting ? 'Creating Request...' : 'Create Request'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
