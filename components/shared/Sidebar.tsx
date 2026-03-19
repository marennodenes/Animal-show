'use client';

import { getCurrentUser } from '@/lib/auth';
import { Home, User as UserIcon, Trophy, Search, Settings, UserStar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import User from '@/lib/models/User';
/**
 * Sidebar component for the homepage
 * Contains navigation buttons for Home, Profile, Competitions, and search
 * Expands on hover to show labels
 * @author marennod
 * @author noravsk
 * @author bragesbr
 */
export default function Sidebar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  return (
  
    <aside className="group fixed left-0 top-0 w-50 hover:w-78 h-screen bg-[#7EACB5] flex flex-col items-center py-[2vh] gap-[2vh] transition-all duration-500 z-40">
      {/* Logo */}
      <div className="mb-4 ">
        <Image 
          src="/images/Logo1.svg" 
          alt="Poteshow logo" 
          width={150} 
          height={150}
          className="opacity-90"


        />
      </div>
      
      {/* Home */}
      <button 
        className="w-full px-5 py-[1.5vh] flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
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
        className="w-full px-5 py-[1.5vh] flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Profil"
        onClick={() => router.push('/profile')}
      >
        <UserIcon className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Profil
        </span>
      </button>

      {/* Competitions */}
      <button 
        className="w-full px-5 py-[1.5vh] flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Konkurranser"
        onClick={() => router.push('/competitions')}
      >
        <Trophy className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Konkurranser
        </span>
      </button>

      {/* Search */}
      <button 
        className="w-full px-5 py-[1.5vh] flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Søk"
        onClick={() => router.push('/search')}
      >
        <Search className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Søk
        </span>
      </button>

      {/* Settings */}
      <button 
        className="w-full px-5 py-[1.5vh] flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Innstillinger"
        onClick={() => router.push('/settings')}
      >
        <Settings className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Innstillinger
        </span>
      </button>

      {/* Admin */}
      {currentUser?.is_admin && (
      <button 
        className="w-full px-5 py-[1.5vh] flex items-center justify-center group-hover:justify-start gap-4 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Admin"
        onClick={() => router.push('/admin')}
      >
        <UserStar className="w-10 h-10 text-white flex-shrink-0" />
        <span className="text-white text-lg font-medium hidden group-hover:block transition-opacity duration-200 whitespace-nowrap">
          Admin
        </span>
      </button>
      )}
    </aside>
  );
}