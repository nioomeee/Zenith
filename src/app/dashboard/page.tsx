'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LuUsers,
  LuMessageSquare,
  LuCalendar,
  LuTrendingUp,
  LuArrowRight,
} from 'react-icons/lu';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index: number;
}

function StatCard({ title, value, icon, trend, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10"
    >
      <div className="flex items-center justify-between">
        <div className="text-gray-400">{title}</div>
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {value}
          </div>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span
                className={trend.isPositive ? 'text-green-400' : 'text-red-400'}
              >
                {trend.isPositive ? '+' : '-'}
                {trend.value}%
              </span>
              <span className="ml-1 text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ActivityCardProps {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  index: number;
}

function ActivityCard({
  title,
  description,
  time,
  icon,
  index,
}: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
    >
      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-200">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="text-sm text-gray-500">{time}</div>
    </motion.div>
  );
}

interface UpcomingEventProps {
  title: string;
  date: string;
  attendees: number;
  index: number;
}

function UpcomingEvent({ title, date, attendees, index }: UpcomingEventProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-800/50 transition-colors"
    >
      <div>
        <h3 className="font-medium text-gray-200">{title}</h3>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-400">{attendees} attendees</div>
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          <LuArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Matches',
      value: 24,
      icon: <LuUsers />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Messages',
      value: 8,
      icon: <LuMessageSquare />,
      trend: { value: 8, isPositive: true },
    },
    { title: 'Events Attended', value: 3, icon: <LuCalendar /> },
    {
      title: 'Profile Views',
      value: 156,
      icon: <LuTrendingUp />,
      trend: { value: 5, isPositive: true },
    },
  ];

  const recentActivity = [
    {
      title: 'New Match Found',
      description: 'You matched with Sarah Parker from Google',
      time: '2h ago',
      icon: <LuUsers />,
    },
    {
      title: 'Message Received',
      description: 'John Doe sent you a message',
      time: '4h ago',
      icon: <LuMessageSquare />,
    },
    {
      title: 'Event Registration',
      description: 'You registered for Tech Talk 2024',
      time: '1d ago',
      icon: <LuCalendar />,
    },
  ];

  const upcomingEvents = [
    {
      title: 'Alumni Networking Mixer',
      date: 'March 15, 2024 • 6:00 PM',
      attendees: 45,
    },
    {
      title: 'Tech Industry Panel',
      date: 'March 20, 2024 • 2:00 PM',
      attendees: 120,
    },
    {
      title: 'Career Workshop',
      date: 'March 25, 2024 • 3:30 PM',
      attendees: 75,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-400">
          Welcome back! Here's what's happening with your network
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-700">
            {recentActivity.map((activity, index) => (
              <ActivityCard key={activity.title} {...activity} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
          </div>
          <div className="divide-y divide-gray-700">
            {upcomingEvents.map((event, index) => (
              <UpcomingEvent key={event.title} {...event} index={index} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Link href="/dashboard/matches">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <LuUsers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">Find Matches</h3>
                <p className="text-sm text-gray-400">Connect with alumni</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/messages">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/20 hover:border-green-500/50 transition-all shadow-lg hover:shadow-green-500/10 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                <LuMessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">Messages</h3>
                <p className="text-sm text-gray-400">
                  Check your conversations
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/events">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/10 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                <LuCalendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200">Events</h3>
                <p className="text-sm text-gray-400">Browse upcoming events</p>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
