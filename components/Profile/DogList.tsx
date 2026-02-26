'use client';

import { useState, useEffect } from 'react';
import { getUserDogs, deleteDog, type Dog } from '@/lib/dog';
import DogCard from './DogCard';
import ErrorMessage from '@/components/shared/ErrorMessage';

/**
 * Dog List Component
 * Displays all dogs for a user
 * @author marennod
 * @author mahberg
 */

interface DogListProps {
  userId: string;
}

export default function DogList({ userId }: DogListProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dogs on component mount
  useEffect(() => {
    fetchDogs();
  }, [userId]);

  const fetchDogs = async () => {
    setLoading(true);
    const data = await getUserDogs(userId);
    setDogs(data);
    setLoading(false);
  };

  // Handle dog deletion
  const handleDelete = async (dogId: string) => {
    if (!confirm('Er du sikker på at du vil slette denne hunden?')) {
      return;
    }

    const result = await deleteDog(dogId);
    
    if (result.success) {
      // Remove dog from list
      setDogs(dogs.filter(dog => dog.id !== dogId));
    } else {
      setError('Kunne ikke slette hund');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Laster hunder...</p>
      </div>
    );
  }

  return (
    <div>
      
      <ErrorMessage message={error} />

      {dogs.length === 0 ? (
        <div className="text-center py-8 rounded-lg">
          <p className="text-gray-500">Ingen hunder registrert enda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => (
            <DogCard 
              key={dog.id} 
              dog={dog} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}