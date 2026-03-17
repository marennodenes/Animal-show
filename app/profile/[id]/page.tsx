'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import ProfileForm from '@/components/Profile/ProfileForm';
import { isLoggedIn } from '@/lib/auth';
import { getUserById } from '@/lib/users';
import User from '@/lib/models/User';

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userBio, setUserBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [userId, setUserId] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = sessionStorage.getItem('user');
      const profileId = params.id;

      if (!storedUser || !profileId || !await isLoggedIn()) {
        router.push('/login');
        return;
      }

      const currentUser: User = JSON.parse(storedUser);

      if (currentUser.id === profileId) {
        router.push('/profile');
        return;
      }

      const result = await getUserById(profileId);

      if (!result.success || !result.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setUserId(result.data.id);
      setUserName(result.data.name || 'User');
      setUserBio(result.data.bio || '');
      setImageUrl(result.data.image_url || '');
      setLoading(false);
    };

    fetchProfile();
  }, [params.id, router]);

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 p-8 ml-50 overflow-y-auto">
        {!loading && notFound && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-white p-8 shadow-md">
            <h1 className="text-3xl font-bold text-gray-900">Profile not found</h1>
            <p className="mt-3 text-gray-600">
              We could not find that user profile.
            </p>
          </div>
        )}

        {!loading && !notFound && (
          <ProfileForm
            userName={userName}
            userBio={userBio}
            userID={userId}
            imageUrl={imageUrl}
            isOwnProfile={false}
          />
        )}
      </main>
      <CopyWright />
    </div>
  );
}
