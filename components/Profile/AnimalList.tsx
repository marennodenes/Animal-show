'use client';

import { useState, useEffect } from 'react';
import { deleteAnimal, getUserAnimals } from '@/lib/dog';
import AnimalCard from './AnimalCard';
import ErrorMessage from '@/components/shared/ErrorMessage';
import Animal from '@/lib/models/Animals';

/**
 * Animal List Component
 * Displays all animals for a user
 * @author marennod
 * @author mahberg
 */

interface AnimalListProps {
  userId: string;
}

export default function AnimalList({ userId }: AnimalListProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch animals on component mount
  useEffect(() => {
    fetchAnimals();
  }, [userId]);

  const fetchAnimals = async () => {
    setLoading(true);
    const data = await getUserAnimals(userId);
    setAnimals(data);
    setLoading(false);
  };

  // Handle animal deletion
  const handleDelete = async (animalId: string) => {
    if (!confirm('Er du sikker på at du vil slette dette dyret?')) {
      return;
    }

    const result = await deleteAnimal(animalId);
    
    if (result.success) {
      // Remove animal from list
      setAnimals(animals.filter(animal => animal.id !== animalId));
    } else {
      setError('Kunne ikke slette dyr');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Laster dyr...</p>
      </div>
    );
  }

  return (
    <div>
      
      <ErrorMessage message={error} />

      {animals.length === 0 ? (
        <div className="text-center py-8 rounded-lg">
          <p className="text-gray-500">Ingen kjæledyr registrert enda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map((animal) => (
            <AnimalCard 
              key={animal.id} 
              animal={animal} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}