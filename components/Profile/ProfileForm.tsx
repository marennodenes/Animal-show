/**
 * Profile Form Component
 * Form for editing user profile information
 * @author noravsk
 * @author marennod
 */

'use client';

import { useRouter } from 'next/navigation';
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
  userBio?: string;
  userID: string;
  imageUrl?: string;
  isOwnProfile?: boolean;
}

export default function ProfileForm({
  userName,
  userBio,
  userID,
  imageUrl,
  isOwnProfile = true,
}: ProfileFormProps) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4 flex justify-center items-center mb-6">
        <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            // Profile pictures use storage URLs, so a regular img keeps this simple.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`${userName} profile picture`}
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
          <h3 className="text-xl font-medium text-gray-700">
            {isOwnProfile ? 'Mine kjæledyr' : 'Kjæledyr'}
          </h3>
          {isOwnProfile && (
            <button
              type="button"
              onClick={() => router.push('/addAnimal')}
              className="text-[#7EACB5] hover:text-[#6a9aa3] font-medium text-sm flex items-center gap-1"
            >
              + Legg til
            </button>
          )}
        </div>
        {/* AnimalList*/}
        <AnimalList userId={userID} allowDelete={isOwnProfile} />
      </div>
    </div>
  );
}
