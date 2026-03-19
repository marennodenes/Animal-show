'use client';

import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import CreateCompetitionForm from '@/components/CompetitionPage/CreateCompetitionForm';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

/**
 * Create Competition Page
 * Page for creating a new competition
 * @author marennod
 * @author mahberg
 */
export default function CreateCompetition() {
  const router = useRouter();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = sessionStorage.getItem("user");

      if (user && await isLoggedIn() === true) {
        setUserId(JSON.parse(user).id || '');
      } else {
        // Not logged in, redirect to login
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="fixed inset-0 flex bg-[var(--background)]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        <CreateCompetitionForm userID={userId} />
      </main>
      <CopyWright />
    </div>
  );
}
