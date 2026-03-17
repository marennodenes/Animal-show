
'use client';
import { Plus, Users, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export default function CompetitionList() {

  const router = useRouter();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [participantCounts, setParticipantCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<'upcoming' | 'active' | 'past'>('active');
  const userJson = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.is_admin === true;

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


return (
  <div>
    {/* Show create button only for admins */}
    {isAdmin && (
      <button
        onClick={handleClick}
        className="group relative mb-8 flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-3xl border border-[#D4E3E6] bg-white-to-r from-[#F9FCFC] via-white to-[#F7ECE9] p-6 text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"

      >
        <div className="absolute inset-y-0 right-0 hidden w-32 bg-[radial-gradient(circle_at_center,_rgba(191,70,70,0.12),_transparent_70%)] sm:block" />
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
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          filter === 'active'
            ? 'bg-emerald-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Aktive
      </button>
      <button
        onClick={() => setFilter('upcoming')}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          filter === 'upcoming'
            ? 'bg-sky-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Kommende
      </button>
      <button
        onClick={() => setFilter('past')}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          filter === 'past'
            ? 'bg-rose-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          className="overflow-hidden rounded-[24px] border border-[#E3E8EA] bg-white text-left shadow-sm transition duration-200 hover:border-[#CFDADF] hover:shadow-md hover:bg-[#FAFBFC]"
        >
          <div className={comp.image_url ? 'grid gap-0 md:grid-cols-[1.2fr_0.8fr]' : ''}>
            <div className="p-6">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-[#22333B]">
                    {comp.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#5C6970]">
                    {new Date(comp.start_date).toLocaleDateString('nb-NO')} - {new Date(comp.end_date).toLocaleDateString('nb-NO')}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold 
                  ${filter === 'upcoming'
                    ? "bg-sky-100 text-sky-700"
                    : filter === 'active'
                    ? "bg-[#D4EDDA] text-[#0F5132]"
                    : "bg-rose-100 text-rose-700"}`}
                >
                  {filter === 'upcoming' ? "Kommende" : filter === 'active' ? "Aktiv" : "Ferdig"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#5C6970]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFA] px-3 py-2">
                  <Users className="h-4 w-4 text-[#7EACB5]" />
                  {participantCounts[comp.id] || 0} deltakere
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F8FAFA] px-3 py-2">
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
                  className="h-full w-full object-cover"
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
