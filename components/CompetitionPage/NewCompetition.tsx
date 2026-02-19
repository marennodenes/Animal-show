'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllCompetitions } from '@/lib/competition';

export default function NewCompetition() {
  const router = useRouter();

  interface Competition {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
  }

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  return (
    <div className="">
      <button
        onClick={handleClick}
        className="bg-[#BF4646] hover:bg-[#A03A3A] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
      >
        <Plus size={24} />
        Opprett konkurranse

      </button>
      <h2 className="text-3xl font-bold mb-6">Kommende konkurranser</h2>

      <div className="">
        {competitions.map((comp, i) => (
          <div key={i} className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{comp.name}</h2>
            <p className="text-black-600 mb-4">{comp.description}</p>
            <div className="text-sm text-black-500">
              {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
