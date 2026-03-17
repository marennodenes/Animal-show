
'use client';
import { Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllCompetitions, getParticipantCount } from '@/lib/competition';
import Competition from '@/lib/models/Competition'; 

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
        className="group relative mb-8 flex w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-3xl border border-[#D4E3E6] bg-gradient-to-r from-[#F9FCFC] via-white to-[#F7ECE9] p-6 text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
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

    <div className="">
      {/* Show message if no competitions */}
      {!loading && filteredCompetitions.length === 0 && (
        <div className="text-center text-gray-400 my-8">
          Ingen konkurranser funnet for denne kategorien.
        </div>
      )}

      {/* Competition cards */}
      {filteredCompetitions.map((comp) => (
        <div
          key={comp.id}
          onClick={() => router.push(`/detailPage?id=${comp.id}`)}
          className="bg-white border border-[#E5E7EB] rounded-2xl mb-8 shadow-lg flex flex-col w-full max-w-3xl transition-transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer overflow-hidden"
        >
          {/* Competition content */}
          <div className="p-8">
            {/* Competition header with name, date and badge */}
            <div className="flex items-end gap-3 mb-4">
              <h2 className="text-2xl font-bold text-[#BF4646]">{comp.name}</h2>
              {/* Competition dates */}
              <div className="px-3 py-1 rounded text-sm font-medium text-gray-600">
                {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                <Users size={16} className="text-gray-500" />
                <span>{participantCounts[comp.id] || 0} deltakere</span>
              </div>
              {/* Status badge */}
              <span
                className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold 
                  ${filter === 'upcoming'
                    ? "bg-sky-100 text-sky-700"
                    : filter === 'active'
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"}`}
              >
                {filter === 'upcoming' ? "Kommende" : filter === 'active' ? "Aktiv" : "Ferdig"}
              </span>
            </div>
            
            {/* Competition description */}
            {comp.description && (
              <div className="text-gray-700 mb-4">{comp.description}</div>
            )}
          </div>
          
          {/* Competition Image */}
          {comp.image_url && (
            <div className="w-full h-64 bg-gray-200 overflow-hidden">
              {/* Competition images come from storage URLs, so a regular img keeps this simple. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={comp.image_url} 
                alt={comp.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
}
