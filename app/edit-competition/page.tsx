'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CopyWright from '@/components/shared/CopyRight';
import Sidebar from '@/components/shared/Sidebar';
import EditCompetitionForm from '@/components/CompetitionPage/EditCompetitionForm';
import { isLoggedIn } from '@/lib/auth';

export default function EditCompetitionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const competitionId = searchParams.get('id') ?? '';
  const [isAllowed, setIsAllowed] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function checkAccess() {
      const userJson = sessionStorage.getItem('user');

      if (!userJson || !(await isLoggedIn())) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userJson);
      if (user?.is_admin !== true || !competitionId) {
        router.push('/competitions');
        return;
      }

      setUserId(user.id || '');
      setIsAllowed(true);
    }

    checkAccess();
  }, [competitionId, router]);

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        {isAllowed ? <EditCompetitionForm competitionId={competitionId} userID={userId} /> : null}
      </main>
      <CopyWright />
    </div>
  );
}
