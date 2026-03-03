'use client';

import Sidebar from '@/components/shared/Sidebar';
import NewPost from '@/components/HomePage/NewPost';
import CopyWright from '@/components/shared/CopyRight';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchUser = async () => {
        const user = sessionStorage.getItem("user");

        if (user && await isLoggedIn() === true) {
          setUserEmail(JSON.parse(user).email || '');
          setUserName(JSON.parse(user).user_metadata?.name || JSON.parse(user).email?.split('@')[0] || '');
          setLoading(false);
        } else {
          // Not logged in, redirect to login
          router.push('/login');
        }
      };

      fetchUser();
    }, [router]);

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto">
        <NewPost />
      </main>
      <CopyWright />
    </div>
    
  );
}
