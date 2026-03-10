import { Heart } from "lucide-react";

interface AnimalCompetitionCardProps {
  animal: {
    name: string;
    breed?: string;
    age?: number;
    image_url?: string;
    likes?: number;
    liked?: boolean;
    text?: string;
  };
  onLike?: () => void;
}

export default function AnimalCompetitionCard({ animal, onLike }: AnimalCompetitionCardProps) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="w-full h-65 bg-gray-100 flex items-center justify-center overflow-hidden mb-3">
        {animal.image_url ? (
          <img src={animal.image_url} alt={animal.name} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-300 text-6xl">{animal.name[0]}</span>
        )}
      </div>
      <div className="w-full px-2 flex flex-col items-start">
        <div className="text-lg font-bold">{animal.name}</div>
        <div className="text-gray-500 text-sm mb-1">
          {animal.breed}
          {animal.breed && animal.age !== undefined ? " · " : ""}
          {animal.age !== undefined ? `${animal.age} år` : ""}
        </div>
        {animal.text && (
          <div className="text-gray-700 text-xs italic mb-2">{animal.text}</div>
        )}
        <button
          className="mt-1 flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
          aria-label="Lik dette dyret"
          onClick={onLike}
          type="button"
        >
          <Heart
            fill={animal.liked ? "#ef4444" : "none"}
            color={animal.liked ? "#ef4444" : "currentColor"}
            className="w-5 h-5"
          />
          <span className="text-sm">{animal.likes || 0}</span>
        </button>
      </div>
    </div>
  );
}