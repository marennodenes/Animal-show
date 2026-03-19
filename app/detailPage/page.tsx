"use client"

import { Suspense, useEffect, useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import CompetitionDetail from '@/components/detailPage/CompetitionDetail';
import NewPost from '@/components/shared/NewPost';
import { useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { userInCompetition, getCompetitionById } from '@/lib/competition';

/**
 * Create Competition Page
 * Page for viewing a spesific competition
 * @author marennod
 * @author bragesbr
 */

function DetailPageContent() {
    const searchParams = useSearchParams();
    const competitionId = searchParams.get("id") ?? "";
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isCompetitionActive, setIsCompetitionActive] = useState(false);
    const [isUserParticipating, setIsUserParticipating] = useState(false);

    useEffect(() => {
      async function checkCompetitionStatus() {
        if (!competitionId) return;
        const currentUser = await getCurrentUser();
        const result = await getCompetitionById(competitionId as `${string}-${string}-${string}-${string}-${string}`);

        if (!result.success) {
          setIsCompetitionActive(false);
          setIsUserParticipating(false);
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(result.data.start_date);
        const endDate = new Date(result.data.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        // Competition is active if today is between start and end date
        setIsCompetitionActive(startDate <= today && endDate >= today);

        if (!currentUser) {
          setIsUserParticipating(false);
          return;
        }

        const participating = await userInCompetition(currentUser.id, competitionId);
        setIsUserParticipating(participating);
      }
      checkCompetitionStatus();
    }, [competitionId, refreshTrigger]);
    
    // Reload page at midnight when date changes
    useEffect(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const timer = setTimeout(() => {
        // Reload page at midnight to refresh competition status
        window.location.reload();
      }, msUntilMidnight);
      
      return () => clearTimeout(timer);
    }, []);
    

  return (
    <div className="fixed inset-0 flex bg-[var(--background)]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        <CompetitionDetail
          refreshTrigger={refreshTrigger}
          onAnimalsChange={() => setRefreshTrigger(prev => prev + 1)}
        />
        {/* Only show NewPost button if the user is participating in an active competition */}
        {isCompetitionActive && isUserParticipating && (
          <NewPost 
            defaultCompetitionId={competitionId} 
            onPostCreated={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}
      </main>
      <CopyWright />
    </div>
  );
}

export default function DetailPage() {
  return (
    <Suspense fallback={null}>
      <DetailPageContent />
    </Suspense>
  );
}
