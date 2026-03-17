'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import DateInput from '@/components/shared/DateInput';
import ErrorMessage from '@/components/shared/ErrorMessage';
import FormButtons from '@/components/shared/FormButtons';
import ImageUpload from '@/components/shared/ImageUpload';
import TextArea from '@/components/shared/TextArea';
import TextInput from '@/components/shared/TextInput';

export type CompetitionType = 'dog' | 'cat' | 'mixed';

export interface CompetitionFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  selectedPet: CompetitionType;
  image: File | null;
  currentImageUrl: string | null;
}

interface CompetitionFormProps {
  title: string;
  submitText: string;
  loadingText: string;
  cancelRoute: string;
  initialValues: CompetitionFormValues;
  onSubmit: (values: CompetitionFormValues) => Promise<string | null>;
  validateFutureStartDate?: boolean;
}

export default function CompetitionForm({
  title,
  submitText,
  loadingText,
  cancelRoute,
  initialValues,
  onSubmit,
  validateFutureStartDate = false,
}: CompetitionFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(initialValues.description);
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [selectedPet, setSelectedPet] = useState<CompetitionType>(initialValues.selectedPet);
  const [image, setImage] = useState<File | null>(initialValues.image);
  const [currentImageUrl] = useState<string | null>(initialValues.currentImageUrl);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (validateFutureStartDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (new Date(startDate) < today) {
        setError('Startdato kan ikke være fortid');
        setLoading(false);
        return;
      }
    }

    const submitError = await onSubmit({
      name,
      description,
      startDate,
      endDate,
      selectedPet,
      image,
      currentImageUrl,
    });

    if (submitError) {
      setError(submitError);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

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
          <label htmlFor="competition-pet-select" className="block text-sm font-medium text-gray-700">
            Velg konkurranse type
          </label>
          <select
            id="competition-pet-select"
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
            id="competition-image"
            label={currentImageUrl ? 'Bytt bilde' : 'Bilde til konkurranse'}
            image={image}
            onImageChange={setImage}
            buttonText={currentImageUrl ? 'Velg nytt bilde' : 'Velg bilde'}
          />
        </div>

        <FormButtons
          loading={loading}
          submitText={submitText}
          loadingText={loadingText}
          cancelRoute={cancelRoute}
        />
      </form>
    </div>
  );
}
