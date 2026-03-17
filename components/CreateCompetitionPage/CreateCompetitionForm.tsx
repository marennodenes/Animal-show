'use client';

import { useState, type SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createCompetition } from '@/lib/competition';
import TextInput from '@/components/shared/TextInput';
import TextArea from '@/components/shared/TextArea';
import DateInput from '@/components/shared/DateInput';
import FormButtons from '@/components/shared/FormButtons';
import ErrorMessage from '@/components/shared/ErrorMessage';
import ImageUpload from '@/components/shared/ImageUpload';
import { uploadCompetitionImage } from '@/lib/competition';

/**
 * Create Competition Form Component
 * Form to create a new competition
 * @author marennod
 * @author mahberg
 * @author haakovha
 */

interface CreateCompetitionFormProps {
  userID: string;
}

export default function CreateCompetitionForm({ userID }: CreateCompetitionFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  type AnimalType = 'dog' | 'cat' | 'mixed';
  const [selectedPet, setSelectedPet] = useState<AnimalType>('dog'); // Default to 'dog'

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPet(event.target.value as AnimalType | '');
  };


  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate dates - create today inside function to avoid hydration issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      setError('Sluttdato må være etter startdato');
      setLoading(false);
      return;
    }
    // Allow future start dates for upcoming competitions
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);
    if (startDateObj < today) {
      setError('Startdato kan ikke være i fortiden');
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;

        if(image){
            imageUrl = await uploadCompetitionImage(userID, image);
            if (!imageUrl) {
                setError('Kunne ikke laste opp bilde');
                setLoading(false);
                return;
            }
        }
    
      //Check if pet type is selected
      if (!selectedPet) {
        setError('Vennligst velg en konkurranse type');
        setLoading(false);
        return;
      }

    try {
      console.log('Opprett konkurranse:', { name, description, startDate, endDate, selectedPet, imageUrl });
      //call to database
      const result = await createCompetition({ 
        name, 
        start_date: startDate, 
        end_date: endDate, 
        description, 
        species: selectedPet, 
        image_url: imageUrl 
      });
      
      if (!result.success) {
        setError(result.error || 'Kunne ikke opprette konkurranse');
        setLoading(false);
        return;
      }
      
      console.log('Konkurranse opprettet:', result.data);
      // Navigate back to competitions page
      router.push('/competitions');
    } catch (err) {
      console.error('Error creating competition:', err);
      setError('Noe gikk galt. Prøv igjen.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Opprett konkurranse</h1>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <TextInput
          label="Navn på konkurranse"
          value={name}
          onChange={setName}
          placeholder="Skriv inn navn på konkurransen"
          required
        />

        <TextArea
          label="Beskrivelse"
          value={description}
          onChange={setDescription}
          placeholder="Beskriv konkurransen"
          rows={4}
          required
        />
        <div>
          <label htmlFor="pet-select" className="block text-sm font-medium text-gray-700">
          Velg konkurranse type
          </label>
          <select
            id="pet-select"
            value={selectedPet}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Velg type</option>
            <option value="dog">Hund</option>
            <option value="cat">Katt</option>
            <option value="mixed">Blandet</option>
          </select>
        </div>

        <DateInput
          label="Startdato"
          value={startDate}
          onChange={setStartDate}
          required
        />

        <DateInput
          label="Sluttdato"
          value={endDate}
          onChange={setEndDate}
          required
        />

        <ImageUpload
          id="competition-image"
          label="Bilde til konkurranse"
          image={image}
          onImageChange={setImage}
        />

        <FormButtons loading={loading} cancelRoute="/competitions" />
      </form>
    </div>
  );
}