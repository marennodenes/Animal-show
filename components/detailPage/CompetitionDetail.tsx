
'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Pencil, Trash2 } from "lucide-react";
import { AnimalInCompetitionRow, deleteAnimalFromCompetition, deleteCompetition, getAnimalsInCompetition, getCompetitionById, participateCompetition, userInCompetition } from "@/lib/competition";
import Competition from "@/lib/models/Competition";
import AnimalCompetitionCard from "./AnimalCompetitionCard";
import { likeAnimal, unlikeAnimal, hasLiked, getLikes } from "@/lib/likes";

type CurrentUser = {
  id: string;
  is_admin?: boolean;
};

function getStoredUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const userJson = sessionStorage.getItem("user");
  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson) as CurrentUser;
  } catch (error) {
    console.error("Could not parse user from sessionStorage:", error);
    return null;
  }
}

export default function CompetitionDetail({
  onAnimalsChange,
  refreshTrigger = 0,
}: {
  onAnimalsChange?: () => void;
  refreshTrigger?: number;
}) {
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [animals, setAnimals] = useState<AnimalInCompetitionRow[]>([]);
  const [user] = useState<CurrentUser | null>(getStoredUser);
  const [deletingPostKey, setDeletingPostKey] = useState<string | null>(null);
  const [isDeletingCompetition, setIsDeletingCompetition] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCompetitionOver = competition ? new Date(competition.end_date) < today : false;

  // Collect competition ID from URL, f.eks. /detailPage?id=123
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (!id) return;
    const fetchCompetition = async () => {
      if (!/^[0-9a-fA-F\-]{36}$/.test(id)) {
        setCompetition(null);
        return;
      }
      const result = await getCompetitionById(id as `${string}-${string}-${string}-${string}-${string}`);
      if (result.success) {
        setCompetition(new Competition(
          result.data.id,
          result.data.name,
          result.data.start_date,
          result.data.end_date,
          result.data.created_at,
          result.data.description,
          result.data.species,
          result.data.image_url
        ));
      }
    };
    fetchCompetition();
  }, []);
  // Check if user is participating
  useEffect(() => {
    if (!user?.id || !competition?.id) {
      return;
    }

    userInCompetition(user.id, competition.id).then(result => {
      setIsParticipating(result);
    });
  }, [user?.id, competition?.id]);

  const handleParticipate = async (competitionID: string) => {
    if (!user || isParticipating) return;
    const result = await participateCompetition({ userID: user.id, competitionID });
    if (result.success) {
      // Sjekk status på nytt fra databasen
      const isNowParticipating = await userInCompetition(user.id, competitionID);
      setIsParticipating(isNowParticipating);
      onAnimalsChange?.();
    } else if (
      result.error &&
      result.error.toLowerCase().includes("duplicate key value")
    ) {
      setIsParticipating(true);
      onAnimalsChange?.();
    } else {
      alert(result.error);
    }
  };
  //Like-funksjon
  async function handleLike(animal_id: string, competition_id: string, liked: boolean) {
    if (!user) return;
    if (!isParticipating) return;
    if (isCompetitionOver) return;
    if (liked) {
      await unlikeAnimal(user.id, animal_id, competition_id);
    } else {
      await likeAnimal(user.id, animal_id, competition_id);
    }

  // Oppdater kun det aktuelle dyret i state:
  const likes = await getLikes(animal_id, competition_id);
  const userHasLiked = await hasLiked(user.id, animal_id, competition_id);

    setAnimals(prev =>
      prev.map(animal =>
        animal.animal_id === animal_id
          ? { ...animal, likes, liked: userHasLiked }
          : animal
    )
  );
}

  async function handleDeletePost(animal_id: string, competition_id: string) {
    if (!user) return;

    const confirmed = window.confirm("Er du sikker på at du vil slette dette innlegget?");
    if (!confirmed) return;

    const postKey = `${competition_id}:${animal_id}`;
    setDeletingPostKey(postKey);

    const result = await deleteAnimalFromCompetition(animal_id, competition_id);

    if (!result.success) {
      alert(result.error || "Kunne ikke slette innlegget.");
      setDeletingPostKey(null);
      return;
    }

    setAnimals(prev =>
      prev.filter(
        animal =>
          !(animal.animal_id === animal_id && animal.competition_id === competition_id)
      )
    );
    setDeletingPostKey(null);
  }

  async function handleDeleteCompetition() {
    if (!competition?.id || user?.is_admin !== true) {
      return;
    }

    const confirmed = window.confirm("Er du sikker på at du vil slette denne konkurransen?");
    if (!confirmed) {
      return;
    }

    setIsDeletingCompetition(true);
    const result = await deleteCompetition(competition.id);

    if (!result.success) {
      alert(result.error || "Kunne ikke slette konkurransen.");
      setIsDeletingCompetition(false);
      return;
    }

    router.push("/competitions");
  }

  //get animals with likes aswell
  useEffect(() => {
    if (competition?.id && user?.id) {
      getAnimalsInCompetition(competition.id, user.id).then((animalsInCompetition) => {
        setAnimals(animalsInCompetition);
      });
    }
  }, [competition?.id, user?.id, refreshTrigger]);

  const winner = (() => {
    if (!isCompetitionOver || animals.length === 0) {
      return [] as AnimalInCompetitionRow[];
    }

    const maxLikes = animals.reduce(
      (max, animal) => (animal.likes > max ? animal.likes : max),
      0,
    );

    return animals.filter((animal) => animal.likes === maxLikes);
  })();
  const winnerNames = winner.map((winnerAnimal) => winnerAnimal.Animal?.name ?? "Ukjent");
  const winnerLikes = winner[0]?.likes ?? 0;

  return (
    !competition ? null : (<div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">{competition.name}</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
          <Users size={18} className="text-gray-500" />
          <span>{animals.length} deltakere</span>
        </div>
        {user?.is_admin === true && (
          <>
            <button
              type="button"
              onClick={() => router.push(`/edit-competition?id=${competition.id}`)}
              className="rounded-full p-2 text-[#7EACB5] transition hover:bg-[#E6F1F3]"
              aria-label="Rediger konkurranse"
              title="Rediger konkurranse"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleDeleteCompetition}
              disabled={isDeletingCompetition}
              className="rounded-full p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Slett konkurranse"
              title="Slett konkurranse"
            >
              <Trash2 className={`h-5 w-5 ${isDeletingCompetition ? "animate-pulse" : ""}`} />
            </button>
          </>
        )}
      </div>
      <p>
        <strong>Periode:</strong>{" "}
        {new Date(competition.start_date).toLocaleDateString("nb-NO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        -{" "}
        {new Date(competition.end_date).toLocaleDateString("nb-NO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      {/* Show participation message or button */}
      {isParticipating && !isCompetitionOver ? (
        <div className="mt-6 flex items-center gap-2 bg-green-50 text-green-700 font-medium px-4 py-2 rounded shadow-sm border border-green-200">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Du er påmeldt</span>
        </div>
      ) : isCompetitionOver ? (
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-gray-100 text-gray-600 font-medium px-4 py-2 rounded shadow-sm border border-gray-300">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Denne konkurransen er ferdig</span>
          </div>
          {winner && winner.length > 0 ? (
            <div className="bg-green-100 text-green-600 font-medium px-4 py-2 rounded">
              {winner.length === 1 ? (
                <span>Vinner: {winnerNames[0]} med {winnerLikes} likes!</span>
              ) : winner.length === 2 ? (
                <span>Vinnere: {winnerNames.join(" og ")} med {winnerLikes} likes!</span>
              ) : winner.length > 2 ? (
                <span> Vinnere: {winnerNames.join(", ")} med {winnerLikes} likes!</span>
              ) : null}
            </div>
          ) : (
            <span className="text-gray-500 italic">Ingen vinner funnet.</span>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleParticipate(competition.id)}
          className="bg-[#7EACB5] hover:bg-[#6898A5] text-[#f5f2ef] text-lg font-semibold py-3 px-6 rounded-lg transition-colors mt-6"
        >
          Delta
        </button>
      )}
      {/* List animals in competition */}
      <h2 className="text-xl font-bold mt-8 mb-2">Deltakere:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {animals
          .filter(animalInCompetition => animalInCompetition.Animal)
          .sort((a, b) => b.likes - a.likes) //only the animals in database
          .map(animalInCompetition => {
          const animalData = animalInCompetition.Animal;
          if (!animalData) {
            return null;
          }

          const canDeletePost =
            user?.is_admin === true || animalData.user_id === user?.id;
          const postKey = `${animalInCompetition.competition_id}:${animalInCompetition.animal_id}`;

          return (
            <AnimalCompetitionCard
              key={animalInCompetition.animal_id}
              animal={{
                ...animalData,
                text: animalInCompetition.text ?? undefined,
                liked: animalInCompetition.liked,
                likes: animalInCompetition.likes,
              }}
              canDelete={canDeletePost}
              isDeleting={deletingPostKey === postKey}
              //onlike sends animal_id, competition_id and liked status to handleLike function
              onLike={() =>
                handleLike(
                  animalInCompetition.animal_id,
                  animalInCompetition.competition_id,
                  animalInCompetition.liked
                )
              }
              onDelete={() =>
                handleDeletePost(
                  animalInCompetition.animal_id,
                  animalInCompetition.competition_id
                )
              }
            />
          );
        })}
      </div>
    </div>
    )
  );
}
