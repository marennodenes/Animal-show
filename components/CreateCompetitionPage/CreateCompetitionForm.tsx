'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createCompetition } from '@/lib/competition';
import TextInput from '@/components/shared/TextInput';
import TextArea from '@/components/shared/TextArea';
import DateInput from '@/components/shared/DateInput';
import FormButtons from '@/components/shared/FormButtons';
import ErrorMessage from '@/components/shared/ErrorMessage';
import ImageUpload from '@/components/shared/ImageUpload';

/**
 * Create Competition Form Component
 * Form to create a new competition
 * @author marennod
 * @author mahberg
 */
export default function CreateCompetitionForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const today = new Date();
  //sett tid til 00:00
  today.setHours(0, 0, 0, 0);



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      setError('Sluttdato må være etter startdato');
      setLoading(false);
      return;
    }
    //add check so you can't select a startDate in the past.
    if (new Date(startDate)<today){
      setError("Startdato kan ikke være fortid");
      setLoading(false);
      return
    }

    try {
      
      console.log('Opprett konkurranse:', { name, description, startDate, endDate, image });
      //call to database
      createCompetition({ name, start_date: startDate, end_date: endDate });
      console.log('Konkurranse opprettet:', { name, description, startDate, endDate, image });
      // Navigate back to competitions page
      router.push('/competitions');
    } catch (err) {
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

        <FormButtons
          loading={loading}
          cancelRoute="/competitions"
        />
      </form>
    </div>
  );
}