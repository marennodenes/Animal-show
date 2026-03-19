"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import DropdownInput from "@/components/shared/DropdownInput";
import { getUserAnimals } from "@/lib/dog";
import Animal from "@/lib/models/Animals";
import Competition from "@/lib/models/Competition";
import { createClient } from "@/utils/supabase/client";
import { getCompetitionByUser, addAnimalToCompetition } from "@/lib/competition";

interface CompetitionUserRow {
  Competition: Competition | null;
}

/**
 * NewPost component for creating a new post
 * @author marennod
 * @author noravsk
 */
export default function NewPost({ 
  defaultCompetitionId,
  onPostCreated 
}: { 
  defaultCompetitionId?: string;
  onPostCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [postContent, setPostContent] = useState("");
  const [userAnimals, setUserAnimals] = useState<Animal[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [hasLoadedOptions, setHasLoadedOptions] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const MAX_CHARS = 500;

  useEffect(() => {
    if (!isOpen || hasLoadedOptions) {
      return;
    }

    let isActive = true;

    const loadOptions = async () => {
      setIsLoadingOptions(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return;
        }

        const [animals, competitionResult] = await Promise.all([
          getUserAnimals(user.id),
          getCompetitionByUser(user.id, "active"),
        ]);

        if (!isActive) {
          return;
        }

        const activeCompetitions = competitionResult.success
          ? ((competitionResult.data ?? []) as CompetitionUserRow[])
              .map((item) => item.Competition)
              .filter((competition): competition is Competition => competition !== null)
          : [];

        setUserAnimals(animals);
        setCompetitions(activeCompetitions);
        setHasLoadedOptions(true);
      } finally {
        if (isActive) {
          setIsLoadingOptions(false);
        }
      }
    };

    loadOptions();

    return () => {
      isActive = false;
    };
  }, [hasLoadedOptions, isOpen]);

  // Find the selected competition object for display
  const selectedCompetitionObj = competitions.find(
    (comp) => comp.id === selectedCompetition
  );

  const animalOptions = userAnimals
    .filter(animal => {
      if (!selectedCompetitionObj?.species) return true;
      if (selectedCompetitionObj.species === 'mixed') return true;
      return animal.species === selectedCompetitionObj.species;
    })
    .map(animal => ({
      value: animal.id,
      label: animal.name,
    }));

  const competitionOptions = competitions.map(comp => ({
    value: comp.id,
    label: comp.name,
  }));

  const canPublish =
    !isLoadingOptions && selectedAnimal !== "" && selectedCompetition !== "";

  const openModal = () => {
    setSelectedCompetition(defaultCompetitionId ?? "");
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-16 right-12 bg-[#BF4646] hover:bg-[#A03A3A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="New post"
      >
        <Plus size={60} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-[#7EACB5] rounded-lg p-8 w-full max-w-2xl mx-4 relative shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">New Post</h2>
            <div className="space-y-4">
              {defaultCompetitionId ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konkurranse
                  </label>
                  <span className="text-base">
                    {selectedCompetitionObj?.name || "Laster..."}
                  </span>
                </div>
              ) : (
                <DropdownInput
                  label="Velg konkurranse"
                  value={selectedCompetition}
                  onChange={setSelectedCompetition}
                  options={competitionOptions}
                  placeholder={isLoadingOptions ? "Laster konkurranser..." : "Velg konkurranse"}
                />
              )}

              {/* Dropdown for selecting animal */}
              <DropdownInput
                label="Legg til kjæledyr"
                value={selectedAnimal}
                onChange={setSelectedAnimal}
                options={animalOptions}
                placeholder={isLoadingOptions ? "Laster kjæledyr..." : "Velg kjæledyr"}
              />

              <div>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  maxLength={MAX_CHARS}
                  className="w-full border border-gray-300 rounded-lg p-3 min-h-200px resize-none focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
                  placeholder="Skriv ditt innlegg her..."
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {postContent.length}/{MAX_CHARS} tegn
                </div>
              </div>

              <button
                onClick={async () => {
                  const selectedAnimalObj = userAnimals.find(
                    (animal) => animal.id === selectedAnimal
                  );

                  if (!selectedAnimalObj) {
                    return;
                  }

                  await addAnimalToCompetition(
                    selectedAnimal,
                    selectedCompetition,
                    selectedAnimalObj.species,
                    postContent
                  );
                  setIsOpen(false);
                  
                  if (onPostCreated) {
                    onPostCreated();
                  }
                }}
                disabled={!canPublish}
                className={`w-full py-2 px-6 rounded-lg transition-colors ${
                  canPublish
                    ? 'bg-[#BF4646] hover:bg-[#A03A3A] text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                Publiser
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
