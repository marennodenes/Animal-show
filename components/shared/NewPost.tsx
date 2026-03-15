"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import DropdownInput from "@/components/shared/DropdownInput";
import { getUserAnimals } from "@/lib/dog";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { getCompetitionByUser, addAnimalToCompetition } from "@/lib/competition";

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
  const [userAnimals, setUserAnimals] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const MAX_CHARS = 500;

  // if selected competition changes from outside, update the state
  // happens when used in competitionDetailPage
  useEffect(() => {
    if (defaultCompetitionId && isOpen) {
      setSelectedCompetition(defaultCompetitionId);
    }
  }, [defaultCompetitionId, isOpen]);

  //Fetch user´s dogs from backend
  useEffect(() => {
    const fetchAnimals = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const animals = await getUserAnimals(user.id);
      setUserAnimals(animals);
    };

    fetchAnimals();
  }, []);

  // Fetch all competitions from backend
  useEffect(() => {
    const fetchAnimals = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const animals = await getUserAnimals(user.id);
    setUserAnimals(animals);
  };

  const fetchCompetitions = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const result = await getCompetitionByUser(user.id, 'active');
    if (result.success) {
      // extract competitions and filter out null
      const comps = (result.data || [])
        .map((item: any) => item.Competition)
        .filter((comp: any) => comp !== null);
      setCompetitions(comps);
    }
  };

  fetchAnimals();
  fetchCompetitions();
}, []);
  
  const animalOptions = userAnimals.map(animal => ({
  value: animal.id,   
  label: animal.name,
}));

const competitionOptions = competitions.map(comp => ({
  value: comp.id,
  label: comp.name,
}));
// Find the selected competition object for display
const selectedCompetitionObj = competitions.find(
    (comp) => comp.id === selectedCompetition
  );

  const canPublish = selectedAnimal !== "" && selectedCompetition !== "";

return (
    <>
      {/* Floating red button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-12 bg-[#BF4646] hover:bg-[#A03A3A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="New post"
      >
        <Plus size={60} />
      </button>

      {/* Modal for creating a new post */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-[#7EACB5] rounded-lg p-8 w-full max-w-2xl mx-4 relative shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">New Post</h2>
            <div className="space-y-4">
              {/* If defaultCompetitionId is set, show competition as text, else show dropdown */}
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
                  placeholder="Velg konkurranse"
                />
              )}

              {/* Dropdown for selecting dog */}
              <DropdownInput
                label="Legg til kjæledyr"
                value={selectedAnimal}
                onChange={setSelectedAnimal}
                options={animalOptions}
                placeholder="Velg kjæledyr"
              />

              {/* Textarea for post content */}
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

              {/* Publish button */}
              <button
                onClick={async () => {
                  // Log animal in competition 
                  const selectedAnimalObj = userAnimals.find(animal => animal.id === selectedAnimal);

                  await addAnimalToCompetition(
                    selectedAnimal,
                    selectedCompetition,
                    selectedAnimalObj?.species, // <-- species må med!
                    postContent
                  );
                  setIsOpen(false);
                  
                  // Call callback to notify parent that a new post was created
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