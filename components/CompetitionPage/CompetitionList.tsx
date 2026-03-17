
'use client';
import { Plus, Users, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { getAllCompetitions, getParticipantCount } from '@/lib/competition';
import Competition from '@/lib/models/Competition';

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

  return 'Alle kjæledyr';
}

function getDaysUntilStart(startDateString: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(startDateString);
  startDate.setHours(0, 0, 0, 0);

  const diffInMs = startDate.getTime() - today.getTime();
  const diffInDays = Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 0);

  if (diffInDays === 0) {
    return 'Åpner i dag';
  }

  if (diffInDays === 1) {
    return 'Åpner i morgen';
  }

  return `Åpner om ${diffInDays} dager`;
}

function subscribeToSessionStorage() {
  return () => {};
}

function getAdminSnapshot() {
  if (typeof window === 'undefined') {
    return false;
  }

  const storedUser = window.sessionStorage.getItem('user');

  if (!storedUser) {
    return false;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as { is_admin?: boolean };
    return parsedUser.is_admin === true;
  } catch (error) {
    console.error('Could not parse user from sessionStorage:', error);
    return false;
  }
}

export default function CompetitionList() {

  const router = useRouter();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [participantCounts, setParticipantCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'active' | 'past'>('active');
  const isAdmin = useSyncExternalStore(subscribeToSessionStorage, getAdminSnapshot, () => false);

  useEffect(() => {
    async function loadCompetitions() {
      const result = await getAllCompetitions();
      if (result.success) {
        const comps = result.data || [];
        setCompetitions(comps);

        const counts: { [key: string]: number } = {};
        await Promise.all(
          comps.map(async (comp) => {
            const count = await getParticipantCount(comp.id);
            counts[comp.id] = count;
          })
        );
        setParticipantCounts(counts);
      }
      setLoading(false);
    }
    loadCompetitions();
  }, []);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      window.location.reload();
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    router.push('/create-competition');
  };

  // Filter competitions based on start and end dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredCompetitions = competitions.filter((comp) => {
    const startDate = new Date(comp.start_date);
    const endDate = new Date(comp.end_date);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (filter === 'upcoming') {
      return startDate > today;
    }

    if (filter === 'active') {
      return startDate <= today && endDate >= today;
    }

    return endDate < today;
  });

  const statusBadgeStyles = {
    active: 'bg-[#D4EDDA] text-[#0F5132]',
    upcoming: 'bg-[#E6F1F3] text-[#38606A]',
    past: 'bg-[#FFF0EA] text-[#BF4646]',
  } as const;

  const filterButtonBase =
    'rounded-lg px-4 py-2 font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7EACB5]/35';

  const filterButtonStyles = {
    active: 'border border-[#B8DEC7] bg-[#D4EDDA] text-[#0F5132] shadow-sm',
    upcoming: 'border border-[#C8DCE2] bg-[#E6F1F3] text-[#38606A] shadow-sm',
    past: 'border border-[#F1D2C8] bg-[#FFF0EA] text-[#BF4646] shadow-sm',
    idle: 'border border-[#D7E1E4] bg-white text-[#536168] shadow-sm hover:border-[#C7D7DC] hover:bg-[#F8FBFB]',
  } as const;


return (
  <div>
    {/* Show create button only for admins */}
    {isAdmin && (
      <button
        onClick={handleClick}
        className="group relative mb-8 flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-3xl border border-[#D4E3E6] bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C7D7DC] hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7EACB5] text-white shadow-sm transition-transform group-hover:scale-105">
            <Plus size={28} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#E6F1F3] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4E7E87]">
                Admin
              </span>
            </div>
            <div className="text-xl font-bold text-[#1F2933]">Opprett konkurranse</div>
            <p className="text-sm text-gray-600">
              Lag en ny konkurranse med datoer, type og bilde.
            </p>
          </div>
        </div>
      </button>
    )}

    {/* Page title */}
    <h2 className="text-3xl font-bold mb-6">Konkurranser</h2>

    {/* Filter buttons */}
    <div className="flex gap-4 mb-8">
      <button
        onClick={() => setFilter('active')}
        className={`${filterButtonBase} ${
          filter === 'active'
            ? filterButtonStyles.active
            : filterButtonStyles.idle
        }`}
      >
        Aktive
      </button>
      <button
        onClick={() => setFilter('upcoming')}
        className={`${filterButtonBase} ${
          filter === 'upcoming'
            ? filterButtonStyles.upcoming
            : filterButtonStyles.idle
        }`}
      >
        Kommende
      </button>
      <button
        onClick={() => setFilter('past')}
        className={`${filterButtonBase} ${
          filter === 'past'
            ? filterButtonStyles.past
            : filterButtonStyles.idle
        }`}
      >
        Ferdige
      </button>
    </div>

    <div className="flex flex-col gap-4">
      {/* Show message if no competitions */}
      {!loading && filteredCompetitions.length === 0 && (
        <div className="text-center text-gray-400 my-8">
          Ingen konkurranser funnet for denne kategorien.
        </div>
      )}

      {/* Competition cards */}
      {filteredCompetitions.map((comp) => (
        <button
          key={comp.id}
          type="button"
          onClick={() => router.push(`/detailPage?id=${comp.id}`)}
          className="group relative overflow-hidden rounded-[24px] border border-[#E3E8EA] bg-white text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#CFDADF] hover:shadow-[0_14px_28px_rgba(34,51,59,0.08)] hover:bg-[#FAFBFC]"
        >
          <div className={comp.image_url ? 'grid gap-0 md:grid-cols-[1.2fr_0.8fr]' : ''}>
            <div className="p-6">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-[#22333B] transition-colors duration-200 group-hover:text-[#1A2A31]">
                    {comp.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#5C6970]">
                    {new Date(comp.start_date).toLocaleDateString('nb-NO')} - {new Date(comp.end_date).toLocaleDateString('nb-NO')}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold 
                  ${filter === 'upcoming'
                    ? statusBadgeStyles.upcoming
                    : filter === 'active'
                    ? statusBadgeStyles.active
                    : statusBadgeStyles.past}`}
                >
                  {filter === 'upcoming' ? "Kommende" : filter === 'active' ? "Aktiv" : "Ferdig"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5C6970]">
                {filter === 'upcoming' && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E6F1F3] px-3 py-2 font-medium text-[#38606A] transition-colors duration-200 group-hover:bg-[#DDECEF]">
                    <CalendarDays className="h-4 w-4 text-[#7EACB5]" />
                    {getDaysUntilStart(comp.start_date)}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFA] px-3 py-2 transition-colors duration-200 group-hover:bg-white">
                  <Users className="h-4 w-4 text-[#7EACB5]" />
                  {participantCounts[comp.id] || 0} deltakere
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFA] px-3 py-2 transition-colors duration-200 group-hover:bg-white">
                  <CalendarDays className="h-4 w-4 text-[#7EACB5]" />
                  {getSpeciesLabel(comp.species)}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-[#5C6970] md:text-base">
                {comp.description?.trim()
                  ? comp.description
                  : 'Ingen beskrivelse er lagt til for denne konkurransen ennå.'}
              </p>
            </div>

            {comp.image_url && (
              <div className="h-52 md:h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comp.image_url}
                  alt={comp.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  </div>
);
}
