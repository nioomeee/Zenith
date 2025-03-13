'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import {
  LuHouse,
  LuUsers,
  LuMessageSquare,
  LuCalendar,
  LuSettings,
  LuMenu,
  LuX,
} from 'react-icons/lu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Overview', href: '/dashboard', icon: LuHouse },
  { name: 'Matches', href: '/dashboard/matches', icon: LuUsers },
  { name: 'Messages', href: '/dashboard/messages', icon: LuMessageSquare },
  { name: 'Events', href: '/dashboard/events', icon: LuCalendar },
  { name: 'Settings', href: '/dashboard/settings', icon: LuSettings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <LuX size={24} /> : <LuMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-40 transform transition-transform lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Zenith
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    pathname === item.href
                      ? 'bg-gray-800/50 text-blue-400'
                      : 'hover:bg-gray-800/30'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Your Profile</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 lg:pl-64',
          isSidebarOpen ? 'pl-64' : 'pl-0'
        )}
      >
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
