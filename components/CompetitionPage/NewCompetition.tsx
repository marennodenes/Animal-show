
'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllCompetitions, participateCompetition } from '@/lib/competition';
import Competition from '@/lib/models/Competition'; 

export default function NewCompetition() {

  const router = useRouter();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const userJson = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    async function loadCompetitions() {
      const result = await getAllCompetitions();
      if (result.success) {
        setCompetitions(result.data || []);
      }
    }
    loadCompetitions();
  }, []);

  const handleClick = () => {
    router.push('/create-competition');
  };

  // Filter competitions based on end date
  const filteredCompetitions = competitions.filter(comp =>
    filter === 'upcoming'
      ? new Date(comp.end_date) >= new Date()
      : new Date(comp.end_date) < new Date()
  );


return (
  <div>
    {/* Show create button only for admins */}
    {isAdmin && (
      <button
        onClick={handleClick}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-8 mb-8 shadow-lg flex flex-col w-full max-w-3xl transition-transform hover:scale-[1.02] hover:shadow-2xl"
      >
        <Plus size={30} className="drop-shadow" />
        <span className="tracking-wide text-lg">Opprett konkurranse</span>
      </button>
    )}

    {/* Page title */}
    <h2 className="text-3xl font-bold mb-6">Konkurranser</h2>

    {/* Filter buttons */}
    <div className="flex gap-4 mb-8">
      <button
        onClick={() => setFilter('upcoming')}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          filter === 'upcoming'
            ? 'bg-[#7EACB5] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Kommende
      </button>
      <button
        onClick={() => setFilter('past')}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          filter === 'past'
            ? 'bg-[#BF4646] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Tidligere
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
      {filteredCompetitions.map((comp, i) => (
        <div
          key={i}
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
              {/* Status badge */}
              <span
                className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold 
                  ${filter === 'upcoming'
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"}`}
              >
                {filter === 'upcoming' ? "Kommende" : "Ferdig"}
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
