/**
 * Profile Form Component
 * Form for editing user profile information
 * @author noravsk
 * @author marennod
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ErrorMessage from '@/components/shared/ErrorMessage';
import ProfilePictureUpload from '@/components/Settings/ProfilePictureUpload';
import SuccessMessage from '@/components/shared/SuccessMessage';
import AnimalList from './AnimalList';
import { UserPen } from 'lucide-react';



/**
 * Profile Form Component 
 * Displays user profile information 
 * @author noravsk
 * @author marennod
 */
interface ProfileFormProps {
  userName: string;
  userEmail: string;
  userBio?: string;
  userID: string;
  imageUrl?: string;
}

export default function ProfileForm({ userName, userEmail, userBio, userID, imageUrl }: ProfileFormProps) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);


  const handleSaveProfile = async () => {
    setSaving(true);
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />


      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 flex justify-center items-center mb-6">
        <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserPen className="w-16 h-16 text-gray-400" />
          )}
        </div>
      </div>

      {/* Name and bio */}
      <div className="text-center mb-6" >
        <h2 className="text-2xl font-bold text-gray-800">
          {userName}
        </h2>
        {userBio && (
          <p className="text-gray-600 mt-2 whitespace-pre-wrap mb-6">
            {userBio}
          </p>
        )}
      </div>

      {/* My Animals */}
      <div className="border-t border-gray-300 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-700">Mine kjæledyr</h3>
          <button
            type="button"
            onClick={() => router.push('/addAnimal')}
            className="text-[#7EACB5] hover:text-[#6a9aa3] font-medium text-sm flex items-center gap-1"
          >
            + Legg til
          </button>
        </div>
        {/* AnimalList*/}
        <AnimalList userId={userID} />
      </div>
    </div>
  );
}
