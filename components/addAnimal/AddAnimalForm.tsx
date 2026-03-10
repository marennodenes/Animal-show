/**
 * Add Animal Form Component
 * Form for adding a new animal to the user's profile
 * @author mahberg
 * @author marennod
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addAnimal, uploadAnimalImage } from '@/lib/dog';
import ErrorMessage from '@/components/shared/ErrorMessage';
import SuccessMessage from '@/components/shared/SuccessMessage';
import { Dog as DogIcon} from 'lucide-react'

/**
 * Props for AddAnimalForm component
 */
interface AddAnimalFormProps {
  userId: string;
}

/**
 * Form component for adding a new animal to the user's profile
 */
export default function addAnimalForm({ userId }: AddAnimalFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  /**
   * Handles image selection and creates a preview
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      //make preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  type AnimalType = 'dog' | 'cat' | '---';
  const [selectedPet, setSelectedPet] = useState<AnimalType | ''>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPet(event.target.value as AnimalType);
  };


  /**
   * Handles form submission
   * Uploads image if selected, then adds animal to database
   */
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    const today = new Date();
    const birth = new Date(birthDate);

    if (!name.trim()) {
      setError('Dyrets navn er påkrevd');
      return;
    }

    if (!birthDate) {
      setError('Fødselsdato er påkrevd');
      return;
    }

    if(birth > today){
      setError('Fødselsdato kan ikke være i fremtiden');
      return;
    }


    if(!selectedPet || selectedPet === '---'){
      setError('Type kan ikke være ---');
      return
    }

    setSaving(true);

    try{
        let imageUrl = null;

        if(image){
            imageUrl = await uploadAnimalImage(userId, image);
            if (!imageUrl) {
                setError('Kunne ikke laste opp bilde');
                setSaving(false);
                return;
            }
        }

    const result = await addAnimal({
      user_id: userId,
      name: name.trim(),
      breed: breed.trim() || '',
      birth_date: birthDate,
      image_url: imageUrl,
      species: selectedPet,
    });

    if (result.success) {
      setSuccess('Dyret ble lagt til!');
      setTimeout(() => router.push('/profile'), 1000);
    } else {
      setError(result.error || 'Kunne ikke legge til dyret');
      setSaving(false);
    }
  } catch (err) {
    setError('Noe gikk galt. Prøv igjen.');
    setSaving(false);
  }
}

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Legg til kjæledyr</h1>

      <ErrorMessage message={error} />

      <SuccessMessage message={success} />
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">        
        <div className="flex flex-col items-center">
          <label className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#7EACB5] transition">
              {imagePreview ? (
                <img 
                src={imagePreview} 
                alt="Forhåndsvisning" 
                className="w-full h-full object-cover"
                />
              ) : (
                <DogIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              />
          </label>
          <p className="text-sm text-gray-500 mt-2">Klikk for å laste opp bilde</p>
        </div>

              {/* Bildeopplasting */}

        <div>
          <label htmlFor="pet-select" className="block text-sm font-medium text-gray-700">
          Velg type
          </label>
          <select
            id="pet-select"
            value={selectedPet}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">----</option>
            <option value="dog">Hund</option>
            <option value="cat">Katt</option>
          </select>
        </div>
        
        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Navn *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kjæledyrets navn"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
          />
        </div>

        {/* Breed field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rase
          </label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="F.eks. Golden Retriever"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
          />
        </div>
        
        {/* Birth date field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fødselsdato *
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#7EACB5] text-white py-2 px-4 rounded-md hover:bg-[#6a9aa3] transition disabled:opacity-50"
          >
            {saving ? 'Lagrer...' : 'Legg til'}
          </button>
        </div>
      </form>
    </div>
  );
}
