/**
 * Form Buttons Component
 * Submit and cancel buttons for forms
 */

import { useRouter } from 'next/navigation';

interface FormButtonsProps {
  loading: boolean;
  submitText?: string;
  loadingText?: string;
  cancelRoute: string;
}

export default function FormButtons({ 
  loading, 
  submitText = 'Opprett konkurranse',
  loadingText = 'Oppretter...',
  cancelRoute 
}: FormButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex gap-4 pt-4">
      <button
        type="submit"
        disabled={loading}
        className="flex-1 bg-[#BF4646] hover:bg-[#A03A3A] text-white py-3 px-6 rounded-md transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? loadingText : submitText}
      </button>
      
      <button
        type="button"
        onClick={() => router.push(cancelRoute)}
        className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-md hover:bg-gray-50 transition font-medium"
      >
        Avbryt
      </button>
    </div>
  );
}
