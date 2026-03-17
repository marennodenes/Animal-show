import { Heart, Trash2, MessageCircle } from "lucide-react";

interface AnimalCompetitionCardProps {
  animal: {
    name: string;
    breed?: string;
    age?: number;
    image_url?: string | null;
    likes?: number;
    liked?: boolean;
    text?: string;
    comments?: string;
  };
  onLike?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  isDeleting?: boolean;
}

export default function AnimalCompetitionCard({
  animal,
  onLike,
  onDelete,
  canDelete = false,
  isDeleting = false,
}: AnimalCompetitionCardProps) {
  return (
    <div className="relative flex flex-col items-center py-4">
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
        <div className="mt-1 flex items-center gap-2">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
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
          {canDelete && (
            <button
              className="rounded-full p-1.5 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onDelete}
              type="button"
              disabled={isDeleting}
              aria-label="Slett innlegg"
              title="Slett innlegg"
            >
              <Trash2 className={`h-4 w-4 ${isDeleting ? "animate-pulse" : ""}`} />
            </button>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3">
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
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
          <button
            className="flex items-center gap-1 text-gray-400 hover:text-gray-500 transition"
            onClick={onComment}
            type="button">
            <MessageCircle/>
            <span className="text-sm">{animal.comments || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
