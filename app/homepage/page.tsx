'use client';

import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import MyCompetitions from '@/components/HomePage/MyCompetitions';
import UserSearch from '@/components/Search/UserSearch';
import { getUserAnimals } from '@/lib/dog';
import { getCompetitionByUser } from '@/lib/competition';

interface HomeSummary {
  userName: string;
  animalCount: number;
  activeCompetitionCount: number;
  upcomingCompetitionCount: number;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 11) {
    return 'God morgen';
  }

  if (hour < 17) {
    return 'God dag';
  }

  return 'God kveld';
}

function getTodayLabel() {
  return new Intl.DateTimeFormat('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<HomeSummary | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadHomepage = async () => {
      const user = await getCurrentUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const [animals, activeCompetitionsResult, plannedCompetitionsResult] = await Promise.all([
        getUserAnimals(String(user.id)),
        getCompetitionByUser(String(user.id), 'active'),
        getCompetitionByUser(String(user.id), 'not-ended'),
      ]);

      if (!isActive) {
        return;
      }

      const activeCompetitionCount = activeCompetitionsResult.success
        ? activeCompetitionsResult.data?.length ?? 0
        : 0;
      const plannedCompetitionCount = plannedCompetitionsResult.success
        ? plannedCompetitionsResult.data?.length ?? 0
        : 0;

      setSummary({
        userName: user.name?.trim() || 'venn',
        animalCount: animals.length,
        activeCompetitionCount,
        upcomingCompetitionCount: Math.max(plannedCompetitionCount - activeCompetitionCount, 0),
      });
      setLoading(false);
    };

    void loadHomepage();

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[var(--background)]">
      <Sidebar />

      <main className="relative ml-50 h-full overflow-y-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-32 pt-8 md:px-8">
          {loading && (
            <>
              <div className="h-56 animate-pulse rounded-[28px] bg-white shadow-sm" />
              <div className="h-64 animate-pulse rounded-[28px] bg-white shadow-sm" />
            </>
          )}

          {!loading && summary && (
            <>
              <section className="rounded-[28px] border border-[#E3E8EA] bg-white p-6 shadow-sm md:p-8">
                <p className="text-sm font-medium text-[#7EACB5]">{getTodayLabel()}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#22333B] md:text-4xl">
                  {getGreeting()}, {summary.userName}
                </h1>

                <div className="mt-2 border-t border-[#E3E8EA] pt-8">
                  <UserSearch
                    title="Finn andre brukere"
                    description=""
                    placeholder="Søk etter brukernavn..."
                    limit={5}
                    compact
                    headingLevel="h2"
                    noWrapper
                  />
                </div>
              </section>

              <MyCompetitions />
            </>
          )}
        </div>
      </main>

      <CopyWright />
    </div>
  );
}
