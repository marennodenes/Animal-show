'use client';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCompetitionByUser, getParticipantCount } from '@/lib/competition';
import Competition from '@/lib/models/Competition';
export default function MyCompetitions() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [participantCounts, setParticipantCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  const userJson = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = userJson ? JSON.parse(userJson) : null;

  /**
   * Loads only upcoming competitions for the user, and only competitions that they are assigned to.
   */
  useEffect(() => {
    async function loadCompetitions() {
      const result = await getCompetitionByUser(user.id);
      if (result.success) {
        const comps = (result.data || []).map((item: any) => item.Competition);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const active = comps.filter((comp) => {
          const startDate = new Date(comp.start_date);
          const endDate = new Date(comp.end_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return startDate <= today && endDate >= today;
        });
        setCompetitions(active);
        
        // Load participant counts
        const counts: { [key: string]: number } = {};
        await Promise.all(
          active.map(async (comp) => {
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

  // Reload competitions at midnight when date changes
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

  return(
    <div className="flex flex-col items-center w-full px-4 py-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">Dine aktive konkurranser</h1>
        {/* Hvis ingen competitions */}
        {!loading && competitions.length === 0 && (
          <div className="text-center text-gray-400 my-8">
            Du er ikke påmeldt noen aktive konkurranser.
          </div>
        )}
        {/* Display competition cards  */}
        {competitions.map((comp, i) => (
          <div
            key={i}
            onClick={() => router.push(`/detailPage?id=${comp.id}`)}
            className="bg-white border border-[#E5E7EB] rounded-2xl mb-8 shadow-lg flex flex-col w-full max-w-3xl transition-transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer overflow-hidden"
          >
            {/* Competition content */}
            <div className="p-8">
              {/* Competition header with name and badge */}
              <div className="flex items-end gap-3 mb-4">
                <h2 className="text-2xl font-bold text-[#BF4646]">{comp.name}</h2>
                {/* Competition dates */}
                <div className="px-3 py-1 rounded text-sm font-medium text-gray-600">
                  {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}
                </div>
                {/* Participant count */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                  <Users size={16} className="text-gray-500" />
                  <span>{participantCounts[comp.id] || 0} deltakere</span>
                </div>
                {/* Status badge */}
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  Aktiv
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
  
