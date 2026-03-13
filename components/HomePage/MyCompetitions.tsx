'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCompetitionByUser } from '@/lib/competition';
import Competition from '@/lib/models/Competition';
export default function MyCompetitions() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
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
        const upcoming = comps.filter(
          (comp) => new Date(comp.end_date) >= new Date()
        );
        setCompetitions(upcoming);
      }
      setLoading(false);
    }
    loadCompetitions();
  }, []);

  return(
    <div className="flex flex-col items-center w-full px-4 py-8">
      <div className="w-full max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Dine kommende konkurranser</h1>
        {/* Hvis ingen competitions */}
        {!loading && competitions.length === 0 && (
        <div className="text-center text-gray-400 my-8">
            Du er ikke påmeldt noen kommende konkurranser.
          </div>
        )}
        {/* Display competition cards  */}
        {competitions.map((comp, i) => (
          <div
            key={i}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-8 mb-8 shadow-lg flex flex-col w-full max-w-3xl transition-transform hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-[#BF4646]">{comp.name}</h2>
              <span className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Kommende
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 rounded text-sm font-medium">
                {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}
              </div>
            </div>
            {comp.description && (
              <div className="mb-4 text-gray-700">{comp.description}</div>
            )}
            <div className="mt-auto flex justify-end w-full">
              <button
                onClick={() => router.push(`/detailPage?id=${comp.id}`)}
                className="bg-[#7EACB5] hover:bg-[#6898A5] text-white text-lg font-semibold py-3 px-8 rounded-xl shadow transition-all duration-200 border-2 border-[#7EACB5] hover:scale-105"
              >
                Se konkurranse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  
