'use client';

import Sidebar from '@/components/shared/Sidebar';
import NewPost from '@/components/shared/NewPost';
import CopyWright from '@/components/shared/CopyRight';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import MyCompetitions from '@/components/HomePage/MyCompetitions';
import UserSearch from '@/components/Search/UserSearch';
import { getUserAnimals } from '@/lib/dog';
import { getCompetitionByUser } from '@/lib/competition';
import { ArrowRight, CalendarDays, PawPrint, Trophy } from 'lucide-react';

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

  const summaryCards = summary
    ? [
        {
          title: 'Aktive konkurranser',
          value: String(summary.activeCompetitionCount),
          icon: Trophy,
        },
        {
          title: 'Kjæledyr',
          value: String(summary.animalCount),
          icon: PawPrint,
        },
        {
          title: 'Kommer snart',
          value: String(summary.upcomingCompetitionCount),
          icon: CalendarDays,
        },
      ]
    : [];

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
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5C6970] md:text-base">
                  Her er en enkel oversikt over det viktigste akkurat nå, med søk og aktive
                  konkurranser rett under.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/competitions')}
                    className="inline-flex items-center gap-2 rounded-full bg-[#22333B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17242A]"
                  >
                    Se konkurranser
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/profile')}
                    className="rounded-full border border-[#D7E1E4] bg-white px-5 py-3 text-sm font-semibold text-[#22333B] transition hover:border-[#7EACB5]"
                  >
                    Gå til profil
                  </button>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <article
                        key={card.title}
                        className="rounded-2xl bg-[#F8FAFA] px-4 py-4 text-[#22333B]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-white p-2 text-[#7EACB5] shadow-sm">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-medium text-[#5C6970]">{card.title}</p>
                        </div>
                        <p className="mt-3 text-2xl font-semibold">{card.value}</p>
                      </article>
                    );
                  })}
                </div>
              </section>

              <UserSearch
                title="Finn andre brukere"
                description="Søk etter andre brukere direkte fra hjemmesiden."
                placeholder="Søk etter brukernavn..."
                limit={5}
                compact
                headingLevel="h2"
                className="max-w-none mx-0"
              />

              <MyCompetitions />
            </>
          )}

          <NewPost />
        </div>
      </main>

      <CopyWright />
    </div>
  );
}
