'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { LuCalendarClock, LuRefreshCw } from 'react-icons/lu';
import Image from 'next/image';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  graduationYear: number;
  major: string;
  location: string | null;
  interests: Array<{ interest: { name: string } }>;
  universityGroups: Array<{ group: { name: string } }>;
}

export default function CoursePage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCourses(data.courses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const yearParam = selectedYear ? `?year=${selectedYear}` : '';
        const response = await fetch(
          `/api/courses/${encodeURIComponent(
            selectedCourse || ''
          )}/students${yearParam}`
        );
        const data = await response.json();
        setStudents(data.students);
        setYears(data.years);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedCourse, selectedYear]);

  const handleRefresh = async () => {
    if (!selectedCourse) return;

    setIsRefreshing(true);
    try {
      const yearParam = selectedYear ? `?year=${selectedYear}` : '';
      const response = await fetch(
        `/api/courses/${encodeURIComponent(
          selectedCourse
        )}/students${yearParam}`
      );
      const data = await response.json();
      setStudents(data.students);
      setYears(data.years);
    } catch (error) {
      console.error('Error refreshing students:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
          <HiOutlineAcademicCap className="text-4xl text-blue-500" />
          Course Directory
        </h1>
        <p className="mt-2 text-gray-400">
          Explore students by course and graduation year
        </p>
      </motion.div>

      {/* Course Selection */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {courses.map((course) => (
          <motion.div
            key={course}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl cursor-pointer transition-all border ${
              selectedCourse === course
                ? 'bg-gradient-to-br from-blue-500/20 to-violet-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-blue-500/30'
            }`}
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex items-center gap-3">
              <FaGraduationCap
                className={`text-2xl ${
                  selectedCourse === course ? 'text-blue-400' : 'text-gray-400'
                }`}
              />
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {course}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Year Selection and Refresh */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-gray-700 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
              <LuCalendarClock className="text-blue-500" />
              Select Year
            </h2>
            <motion.button
              onClick={handleRefresh}
              disabled={isRefreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
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
          <div className="flex gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !selectedYear
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedYear(null)}
            >
              All Years
            </motion.button>
            {years.map((year) => (
              <motion.button
                key={year}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Students Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        ) : (
          students.length > 0 && (
            <motion.div
              key="students"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-700 ring-2 ring-blue-500/20"
                        whileHover={{ scale: 1.1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        {student.profileImage ? (
                          <Image
                            src={student.profileImage}
                            alt={`${student.firstName} ${student.lastName}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                        )}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">{student.major}</p>
                      </div>
                    </div>

                    {student.interests.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3"
                      >
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Interests
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {student.interests.map(({ interest }, index) => (
                            <motion.span
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                            >
                              {interest.name}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {student.universityGroups.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Groups
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {student.universityGroups.map(({ group }, index) => (
                            <motion.span
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-xs px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30"
                            >
                              {group.name}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="mt-4 flex gap-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 bg-blue-500 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                      >
                        Connect
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#374151' }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 bg-gray-700 rounded-lg font-medium transition-all shadow-lg shadow-gray-700/20 hover:shadow-gray-700/40"
                      >
                        View Profile
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )
        )}
      </AnimatePresence>

      {!loading && students.length === 0 && selectedCourse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400"
        >
          No students found for the selected criteria
        </motion.div>
      )}
    </div>
  );
}
