'use client';

import { Home, User, Trophy, Bell, Settings } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * Sidebar component for the homepage
 * Contains navigation buttons for Home, Profile, Competitions, and Notifications
 * Expands on hover to show labels
 * @author marennod
 * @author noravsk
 */
export default function Sidebar() {
  const router = useRouter();

  return (
  
    <aside className="group fixed left-0 top-0 w-50 hover:w-78 h-screen bg-[#7EACB5] flex flex-col items-center py-6 gap-6 transition-all duration-500 z-40">
      {/* Logo */}
      <div className="mb-4 ">
        <Image 
          src="/poteshow.png" 
          alt="Poteshow logo" 
          width={150} 
          height={150}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Home */}
      <button 
        className="w-full px-5 py-3 flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Hjem"
        onClick={() => router.push('/homepage')}
      >
        <Home className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Hjem
        </span>
      </button>

      {/* Profile */}
      <button 
        className="w-full px-5 py-3 flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Profil"
        onClick={() => router.push('/profile')}
      >
        <User className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Profil
        </span>
      </button>

      {/* Competitions */}
      <button 
        className="w-full px-5 py-3 flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Konkurranser"
        onClick={() => router.push('/competitions')}
      >
        <Trophy className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Konkurranser
        </span>
      </button>

      {/* Notifications */}
      <button 
        className="w-full px-5 py-3 flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Varslinger"
        onClick={() => router.push('/notifications')}
      >
        <Bell className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Varslinger
        </span>
      </button>

      {/* Settings */}
      <button 
        className="w-full px-5 py-3 flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Innstillinger"
        onClick={() => router.push('/settings')}
      >
        <Settings className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Innstillinger
        </span>
      </button>
    </aside>
  );
}