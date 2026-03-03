import Animal from '@/lib/models/Animals';
import { Dog as DogIcon } from 'lucide-react';

/**
 * Animal Card Component
 * Displays a single animal with image, name, breed, and age
 * @author marennod
 * @author mahberg
 */

interface AnimalCardProps {
  animal: Animal;
  onDelete?: (animalId: string) => void;
}

export default function AnimalCard({ animal, onDelete }: AnimalCardProps) {
  
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

  const age = calculateAge(animal.birth_date);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Animal Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
        {animal.image_url ? (
          <img 
            src={animal.image_url} 
            alt={animal.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <DogIcon className="w-16 h-16 text-gray-400" />
        )}
      </div>

      {/* Animal Info */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-800">{animal.name}</h3>
        <p className="text-gray-600">{animal.breed}</p>
        <p className="text-gray-500 text-sm">{age} år</p>
      </div>

      {/* Delete Button */}
      {onDelete && (
        <button
          onClick={() => onDelete(animal.id)}
          className="mt-3 w-full px-4 py-2 bg-[#BF4646] text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Slett
        </button>
      )}
    </div>
  );
}