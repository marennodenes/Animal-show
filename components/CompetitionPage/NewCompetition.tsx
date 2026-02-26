
'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllCompetitions, getCompetitionById, participateCompetition } from '@/lib/competition';
import Competition from '@/lib/models/Competition'; 

export default function NewCompetition() {
 // adjust path as needed

  const router = useRouter();
  
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
  const handleParticipate = async (competitionID: string) => 
  {
    const result = await participateCompetition({ userID: '00ff5c18-0713-4e03-b7b4-1d9ecb60763e', competitionID});
    
    if (result.success) {
        alert('Du er nå påmeldt konkurransen: ');
    } else {
        alert(result.error);
    }
  }

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
          <div key={i} className="bg-white border rounded-lg p-6 flex flex-col items-start">
            <h2 className="text-2xl font-bold mb-2">{comp.name}</h2>
            <div className="text-base text-gray-500 mb-4">
              {new Date(comp.start_date).toLocaleDateString()} - {new Date(comp.end_date).toLocaleDateString()}
            </div>
            <div className='mt-auto'>
              <button
                onClick={() => handleParticipate(comp.id)}
                className="bg-[#7EACB5] hover:bg-[#6898A5] text-[#f5f2ef] text-lg  font-semibold py-3 px-6 rounded-lg transition-colors">
                  Delta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
