
'use client'
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { getAnimalsInCompetition, getCompetitionById, participateCompetition, userInCompetition } from "@/lib/competition";
import Competition from "@/lib/models/Competition";
import AnimalCompetitionCard from "./AnimalCompetitionCard";
import { likeAnimal, unlikeAnimal, hasLiked, getLikes } from "@/lib/likes";
export default function CompetitionDetail({ onAnimalsChange }: { onAnimalsChange?: () => void }) {
  const router = useRouter();
  const [competition, setCompetition] = useState<any>(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [winner, setWinner] = useState<any>(null);
  const isCompetitionOver = competition && new Date() > new Date(competition.end_date);
  // Initialize user from sessionStorage once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userJson = sessionStorage.getItem("user");
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    }
  }, []);
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
  useEffect(() => {
    console.log("Fetched competition:", competition);
  }, [competition]);
  // Check if user is participating
  useEffect(() => {
    if (user && competition && competition.id) {
      userInCompetition(user.id, competition.id).then(result => {
        setIsParticipating(result);
      });
    }
  }, [user, competition?.id]);
  // Crown winner when competition is over
  useEffect(() => {
    if (!competition || !user?.id) return;
    if (isCompetitionOver) {
      crownWinner(competition.id, user.id);
    }
  }, [competition?.id, user?.id]);
  //function for checking who the winner is
  const crownWinner = async (competitionID: string, userID: string) => {
    try {
      const animalsWithLikes = await getAnimalsInCompetition(competitionID, userID);
      const maxLikes = animalsWithLikes.reduce((max, a) => a.likes > max ? a.likes : max, 0);
      const winners = animalsWithLikes.filter((a: any) => a.likes === maxLikes);
      setWinner(winners);
    } catch (error) {
    }
  };
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
  // Get animals with likes aswell
  useEffect(() => {
  if (competition && competition.id && user && user.id) {
    getAnimalsInCompetition(competition.id, user.id).then((animals) => {
      setAnimals(animals);
    });
  }
}, [competition?.id, user?.id, onAnimalsChange]);

// Check competition status
const today = new Date();
today.setHours(0, 0, 0, 0);
const isCompetitionOver = competition && new Date(competition.end_date) < today;
const isCompetitionActive = competition && new Date(competition.start_date) <= today && new Date(competition.end_date) >= today;

  return (
    !competition ? null : (<div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">{competition.name}</h1>
        {/* Participant count badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
          <Users size={18} className="text-gray-500" />
          <span>{animals.length} deltakere</span>
        </div>
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
                <span>Vinner: {winner[0].Animal.name} med {winner[0].likes} likes!</span>
              ) : winner.length === 2 ? (
                <span>Vinnere: {winner.map((w: any) => w.Animal.name).join(" og ")} med {winner[0].likes} likes!</span>
              ) : winner.length > 2 ? (
                <span> Vinnere: {winner.map((w: any) => w.Animal.name).join(", ")} med {winner[0].likes} likes!</span>
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
          .map(animalInCompetition => (
            <AnimalCompetitionCard
              key={animalInCompetition.animal_id}
              animal={{
                ...animalInCompetition.Animal,
                text: animalInCompetition.text,
                liked: animalInCompetition.liked,
                likes: animalInCompetition.likes,
              }}
              //onlike sends animal_id, competition_id and liked status to handleLike function
              onLike={() =>
                handleLike(
                  animalInCompetition.animal_id,
                  animalInCompetition.competition_id,
                  animalInCompetition.liked
                )
              }
            />
          ))}
      </div>
    </div>
    )
  );
}
