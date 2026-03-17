'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompetitionForm, {
  type CompetitionFormValues,
  type CompetitionType,
} from '@/components/CompetitionPage/CompetitionForm';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { getCompetitionById, updateCompetition, uploadCompetitionImage } from '@/lib/competition';

interface EditCompetitionFormProps {
  competitionId: string;
  userID: string;
}

export default function EditCompetitionForm({ competitionId, userID }: EditCompetitionFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [initialValues, setInitialValues] = useState<CompetitionFormValues | null>(null);

  useEffect(() => {
    async function loadCompetition() {
      const result = await getCompetitionById(
        competitionId as `${string}-${string}-${string}-${string}-${string}`
      );

      if (!result.success) {
        setError(result.error || 'Kunne ikke hente konkurransen.');
        return;
      }

      setInitialValues({
        name: result.data.name || '',
        description: result.data.description || '',
        startDate: result.data.start_date || '',
        endDate: result.data.end_date || '',
        selectedPet: (result.data.species as CompetitionType) || 'dog',
        image: null,
        currentImageUrl: result.data.image_url || null,
      });
    }

    loadCompetition();
  }, [competitionId]);

  const handleSubmit = async (values: CompetitionFormValues) => {
    let imageUrl: string | null | undefined = undefined;

    if (values.image) {
      if (!userID) {
        return 'Kunne ikke finne bruker for bildeopplasting.';
      }

      imageUrl = await uploadCompetitionImage(userID, values.image);
      if (!imageUrl) {
        return 'Kunne ikke laste opp bilde.';
      }
    }

    const result = await updateCompetition({
      id: competitionId,
      name: values.name,
      description: values.description,
      start_date: values.startDate,
      end_date: values.endDate,
      species: values.selectedPet,
      image_url: imageUrl,
    });

    if (!result.success) {
      return result.error || 'Kunne ikke oppdatere konkurransen.';
    }

    router.push(`/detailPage?id=${competitionId}`);
    return null;
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!initialValues) {
    return <div className="max-w-4xl mx-auto text-gray-500">Laster konkurranse...</div>;
  }

  return (
    <CompetitionForm
      title="Rediger konkurranse"
      submitText="Lagre endringer"
      loadingText="Lagrer..."
      cancelRoute={`/detailPage?id=${competitionId}`}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  );
}
