'use client';

import { useRouter } from 'next/navigation';
import CompetitionForm, {
  type CompetitionFormValues,
} from '@/components/CompetitionPage/CompetitionForm';
import { createCompetition, uploadCompetitionImage } from '@/lib/competition';

interface CreateCompetitionFormProps {
  userID: string;
}

export default function CreateCompetitionForm({ userID }: CreateCompetitionFormProps) {
  const router = useRouter();

  const handleSubmit = async (values: CompetitionFormValues) => {
    let imageUrl: string | null = null;

    if (values.image) {
      if (!userID) {
        return 'Kunne ikke finne bruker for bildeopplasting.';
      }

      imageUrl = await uploadCompetitionImage(userID, values.image);
      if (!imageUrl) {
        return 'Kunne ikke laste opp bilde';
      }
    }

    const result = await createCompetition({
      name: values.name,
      start_date: values.startDate,
      end_date: values.endDate,
      description: values.description,
      species: values.selectedPet,
      image_url: imageUrl,
    });

    if (!result.success) {
      return result.error || 'Noe gikk galt. Prøv igjen.';
    }

    router.push('/competitions');
    return null;
  };

  return (
    <CompetitionForm
      title="Opprett konkurranse"
      submitText="Opprett konkurranse"
      loadingText="Oppretter..."
      cancelRoute="/competitions"
      validateFutureStartDate
      initialValues={{
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        selectedPet: 'dog',
        image: null,
        currentImageUrl: null,
      }}
      onSubmit={handleSubmit}
    />
  );
}
