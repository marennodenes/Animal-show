"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import DropdownInput from "@/components/shared/DropdownInput";

/**
 * NewPost component for creating a new post
 * @author marennod
 * @author noravsk
 */
export default function NewPost() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("");
  const [postContent, setPostContent] = useState("");
  const MAX_CHARS = 500;
  
  // TODO: Fetch the user's dogs from the database
  const userDogs: string[] = []; 
  const dogOptions = userDogs.map(dog => ({ value: dog, label: dog }));
  
  // TODO: Fetch available competitions from the database
  const competitions: string[] = []; 
  const competitionOptions = competitions.map(comp => ({ value: comp, label: comp }));

  const canPublish = selectedDog !== "" && selectedCompetition !== "";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-12 bg-[#BF4646] hover:bg-[#A03A3A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        aria-label="Nytt innlegg"
      >
        <Plus size={60} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#f5f2ef] border-4 border-[#7EACB5] rounded-lg p-8 w-full max-w-2xl mx-4 relative shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Lukk"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Nytt innlegg</h2>
            
            {/* Innhold for å lage et innlegg */}
            <div className="space-y-4">
              <DropdownInput
                label="Velg konkurranse"
                value={selectedCompetition}
                onChange={setSelectedCompetition}
                options={competitionOptions}
                placeholder="Velg konkurranse"
              />
              
              <DropdownInput
                label="Legg til hund"
                value={selectedDog}
                onChange={setSelectedDog}
                options={dogOptions}
                placeholder="Velg hund"
              />
              
              <div>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  maxLength={MAX_CHARS}
                  className="w-full border border-gray-300 rounded-lg p-3 min-h-[200px] resize-none focus:ring-2 focus:ring-[#7EACB5] focus:border-transparent"
                  placeholder="Skriv ditt innlegg her..."
                />
                <div className="text-sm text-gray-500 text-right mt-1">
                  {postContent.length}/{MAX_CHARS} tegn
                </div>
              </div>
              
              <button
                onClick={() => {
                  setIsOpen(false);
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
