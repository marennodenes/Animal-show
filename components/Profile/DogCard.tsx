import { Dog as DogIcon } from 'lucide-react';
import type { Dog } from '@/lib/dog';

/**
 * Dog Card Component
 * Displays a single dog with image, name, breed, and age
 * @author marennod
 * @author mahberg
 */

interface DogCardProps {
  dog: Dog;
  onDelete?: (dogId: string) => void;
}

export default function DogCard({ dog, onDelete }: DogCardProps) {
  
  // Calculate age from birth_date
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Adjust if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge(dog.birth_date);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Dog Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        {dog.image_url ? (
          <img 
            src={dog.image_url} 
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <DogIcon className="w-16 h-16 text-gray-400" />
        )}
      </div>

      {/* Dog Info */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-800">{dog.name}</h3>
        <p className="text-gray-600">{dog.breed}</p>
        <p className="text-gray-500 text-sm">{age} år</p>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(dog.id)}
          className="mt-3 w-full px-4 py-2 bg-[#BF4646] text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Slett
        </button>
      )}
    </div>
  );
}