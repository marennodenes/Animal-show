"use client"

import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import CompetitionDetail from '@/components/detailPage/CompetitionDetail';
import NewPost from '@/components/shared/NewPost';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { userInCompetition, getCompetitionById } from '@/lib/competition';
import { useEffect } from 'react';

/**
 * Create Competition Page
 * Page for viewing a spesific competition
 * @author marennod
 * @author bragesbr
 */

export default function DetailPage() {
    const searchParams = useSearchParams();
    const competitionId = searchParams.get("id") ?? "";
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [inCompetition, setInCompetition] = useState(false);
    const [competitionDone, setCompetitionDone] = useState(false);

    useEffect(() => {
      async function checkIfInCompetition() {
        const res = await getCurrentUser();
        if (!res) return;
        const result = await userInCompetition(res.id as string, competitionId);
        setInCompetition(result);
      }
      async function checkCompetitionDone() {
      if (!competitionId) return;
      const result = await getCompetitionById(competitionId as `${string}-${string}-${string}-${string}-${string}`);
      if (result.success) {
        setCompetitionDone(new Date() > new Date(result.data.end_date));
      }
      }
      checkIfInCompetition();
      checkCompetitionDone();
    }, [competitionId, refreshTrigger]);
    

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        <CompetitionDetail onAnimalsChange={() => setRefreshTrigger(prev => prev + 1)} />
        {(inCompetition && !competitionDone) ? 
          <NewPost 
            defaultCompetitionId={competitionId} 
            onPostCreated={() => setRefreshTrigger(prev => prev + 1)}
          />
          :
          null
        }
      </main>
      <CopyWright />
    </div>
  );
}