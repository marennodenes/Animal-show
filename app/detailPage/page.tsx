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
    const [isCompetitionActive, setIsCompetitionActive] = useState(false);

    useEffect(() => {
      async function checkCompetitionStatus() {
        if (!competitionId) return;
        const result = await getCompetitionById(competitionId as `${string}-${string}-${string}-${string}-${string}`);
        if (result.success) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const startDate = new Date(result.data.start_date);
          const endDate = new Date(result.data.end_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          // Competition is active if today is between start and end date
          setIsCompetitionActive(startDate <= today && endDate >= today);
        }
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
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        <CompetitionDetail onAnimalsChange={() => setRefreshTrigger(prev => prev + 1)} />
        {/* Only show NewPost button if competition is active */}
        {isCompetitionActive && (
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