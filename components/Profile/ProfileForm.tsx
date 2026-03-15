/**
 * Profile Form Component
 * Form for editing user profile information
 * @author noravsk
 * @author marennod
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/shared/ErrorMessage';
import SuccessMessage from '@/components/shared/SuccessMessage';
import AnimalList from './AnimalList';
import { User } from 'lucide-react';



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
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {/* Clean profile header - no box */}
      <div className="flex flex-col items-center text-center mb-6 mt-2">
        {/* Profile picture */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#7EACB5] to-[#6898A5] flex items-center justify-center overflow-hidden mb-4 shadow-md">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-20 h-20 text-white" strokeWidth={1.5} />
          )}
        </div>

        {/* Name */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userName}
        </h1>
        
        {/* Bio */}
        {userBio && (
          <p className="text-gray-600 text-base max-w-2xl whitespace-pre-wrap leading-relaxed">
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
