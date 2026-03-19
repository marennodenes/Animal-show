'use client';

import { CalendarDays, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCompetitionByUser, getParticipantCount } from '@/lib/competition';
import Competition from '@/lib/models/Competition';

interface CompetitionUserRow {
  Competition: Competition | null;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('nb-NO', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(dateString));
}

function getSpeciesLabel(species?: string) {
  if (species === 'dog') {
    return 'Hund';
  }

  if (species === 'cat') {
    return 'Katt';
  }

  if (species === 'mixed') {
    return 'Blandet';
  }

  return 'Alle kjaledyr';
}

export default function MyCompetitions() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadCompetitions = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const storedUser = sessionStorage.getItem('user');

      if (!storedUser) {
        setLoading(false);
        return;
      }

      let userId: string | undefined;

      try {
        const parsedUser = JSON.parse(storedUser) as { id?: string };
        userId = parsedUser.id;
      } catch (error) {
        console.error('Could not read user from session storage:', error);
      }

      if (!userId) {
        setLoading(false);
        return;
      }

      const result = await getCompetitionByUser(userId, 'active');

      if (!isActive) {
        return;
      }

      if (!result.success) {
        setLoading(false);
        return;
      }

      const activeCompetitions = ((result.data ?? []) as CompetitionUserRow[])
        .map((item) => item.Competition)
        .filter((competition): competition is Competition => competition !== null);

      setCompetitions(activeCompetitions);

      const participantEntries = await Promise.all(
        activeCompetitions.map(async (competition) => {
          const participantCount = await getParticipantCount(String(competition.id));
          return [String(competition.id), participantCount] as const;
        })
      );

      if (!isActive) {
        return;
      }

      setParticipantCounts(Object.fromEntries(participantEntries));
      setLoading(false);
    };

    void loadCompetitions();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = window.setTimeout(() => {
      window.location.reload();
    }, msUntilMidnight);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-[#22333B]">Dine aktive konkurranser</h2>
        <p className="mt-2 text-sm text-[#5C6970] md:text-base">
          Trykk på en konkurranse for å åpne detaljsiden.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4">
          <div className="h-48 animate-pulse rounded-[24px] bg-white shadow-sm" />
          <div className="h-48 animate-pulse rounded-[24px] bg-white shadow-sm" />
        </div>
      )}

      {!loading && competitions.length === 0 && (
        <div className="rounded-[24px] border border-[#E3E8EA] bg-white p-6 text-center shadow-sm">
          <p className="text-base font-medium text-[#22333B]">
            Du er ikke påmeldt noen aktive konkurranser akkurat na.
          </p>
          <button
            type="button"
            onClick={() => router.push('/competitions')}
            className="mt-4 rounded-full bg-[#22333B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17242A]"
          >
            Se konkurranser
          </button>
        </div>
      )}

      {!loading && competitions.length > 0 && (
        <div className="grid gap-4">
          {competitions.map((competition) => (
            <button
              key={String(competition.id)}
              type="button"
              onClick={() => router.push(`/detailPage?id=${competition.id}`)}
              className="group relative overflow-hidden rounded-[24px] border border-[#E3E8EA] bg-white text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#CFDADF] hover:shadow-[0_14px_28px_rgba(34,51,59,0.08)] hover:bg-[#FAFBFC]"
            >
              <div className={competition.image_url ? 'grid gap-0 md:grid-cols-[1.2fr_0.8fr]' : ''}>
                <div className="p-6">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-semibold text-[#22333B] transition-colors duration-200 group-hover:text-[#1A2A31]">
                        {competition.name}
                      </h3>
                      <p className="mt-2 text-sm text-[#5C6970]">
                        {formatDate(competition.start_date)} - {formatDate(competition.end_date)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#D4EDDA] px-3 py-1 text-xs font-semibold text-[#0F5132]">
                      Aktiv
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5C6970]">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFA] px-3 py-2 transition-colors duration-200 group-hover:bg-white">
                      <Users className="h-4 w-4 text-[#7EACB5]" />
                      {participantCounts[String(competition.id)] ?? 0} deltakere
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFA] px-3 py-2 transition-colors duration-200 group-hover:bg-white">
                      <CalendarDays className="h-4 w-4 text-[#7EACB5]" />
                      {getSpeciesLabel(competition.species)}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#5C6970] md:text-base">
                    {competition.description?.trim()
                      ? competition.description
                      : 'Ingen beskrivelse er lagt til for denne konkurransen ennå.'}
                  </p>
                </div>

                {competition.image_url && (
                  <div className="h-52 md:h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={competition.image_url}
                      alt={competition.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
