'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DateInput from '@/components/shared/DateInput';
import ErrorMessage from '@/components/shared/ErrorMessage';
import FormButtons from '@/components/shared/FormButtons';
import ImageUpload from '@/components/shared/ImageUpload';
import TextArea from '@/components/shared/TextArea';
import TextInput from '@/components/shared/TextInput';
import { getCompetitionById, updateCompetition, uploadCompetitionImage } from '@/lib/competition';

type CompetitionType = 'dog' | 'cat' | 'mixed';

interface EditCompetitionFormProps {
  competitionId: string;
}

function getStoredUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const userJson = sessionStorage.getItem('user');
  if (!userJson) {
    return '';
  }

  try {
    const user = JSON.parse(userJson);
    return user.id || '';
  } catch {
    return '';
  }
}

export default function EditCompetitionForm({ competitionId }: EditCompetitionFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPet, setSelectedPet] = useState<CompetitionType>('dog');
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [userId] = useState(getStoredUserId);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoadingCompetition, setIsLoadingCompetition] = useState(true);

  useEffect(() => {
    async function loadCompetition() {
      setIsLoadingCompetition(true);
      const result = await getCompetitionById(
        competitionId as `${string}-${string}-${string}-${string}-${string}`
      );

      if (!result.success) {
        setError(result.error || 'Kunne ikke hente konkurransen.');
        setIsLoadingCompetition(false);
        return;
      }

      setName(result.data.name || '');
      setDescription(result.data.description || '');
      setStartDate(result.data.start_date || '');
      setEndDate(result.data.end_date || '');
      setSelectedPet((result.data.species as CompetitionType) || 'dog');
      setCurrentImageUrl(result.data.image_url || null);
      setIsLoadingCompetition(false);
    }

    loadCompetition();
  }, [competitionId]);
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPet(event.target.value as CompetitionType);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (new Date(startDate) > new Date(endDate)) {
      setError('Sluttdato må være etter startdato');
      setLoading(false);
      return;
    }

    let imageUrl: string | null | undefined = undefined;

    if (image) {
      if (!userId) {
        setError('Kunne ikke finne bruker for bildeopplasting.');
        setLoading(false);
        return;
      }

      imageUrl = await uploadCompetitionImage(userId, image);
      if (!imageUrl) {
        setError('Kunne ikke laste opp bilde.');
        setLoading(false);
        return;
      }
    }

    const result = await updateCompetition({
      id: competitionId,
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      species: selectedPet,
      image_url: imageUrl,
    });

    if (!result.success) {
      setError(result.error || 'Kunne ikke oppdatere konkurransen.');
      setLoading(false);
      return;
    }

    router.push(`/detailPage?id=${competitionId}`);
  };

  if (isLoadingCompetition) {
    return <div className="max-w-4xl mx-auto text-gray-500">Laster konkurranse...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rediger konkurranse</h1>

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
          <label htmlFor="edit-pet-select" className="block text-sm font-medium text-gray-700">
            Velg konkurranse type
          </label>
          <select
            id="edit-pet-select"
            value={selectedPet}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
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

        <div className="space-y-3">
          {currentImageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nåværende bilde
              </label>
              <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={currentImageUrl}
                  alt={name || 'Konkurransebilde'}
                  className="h-48 w-full object-cover"
                />
              </div>
            </div>
          )}

          <ImageUpload
            id="edit-competition-image"
            label="Bytt bilde"
            image={image}
            onImageChange={setImage}
            buttonText="Velg nytt bilde"
          />
        </div>

        <FormButtons
          loading={loading}
          submitText="Lagre endringer"
          loadingText="Lagrer..."
          cancelRoute={`/detailPage?id=${competitionId}`}
        />
      </form>
    </div>
  );
}
