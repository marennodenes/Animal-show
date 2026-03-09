'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import ProfileForm from '@/components/Profile/ProfileForm';
import { createClient } from '@/utils/supabase/client';
import { isLoggedIn } from '@/lib/auth';
import User from '@/lib/models/User';

/**
 * Profile page component
 * Page for displaying and editing user profile
 * @author noravsk
 * @author marennod
 */
export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBio, setUserBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState('');
  const[imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
    const user: User = JSON.parse(sessionStorage.getItem("user") || '{}');
    const supabase = createClient();

    if (user && await isLoggedIn() === true) {
      setUserEmail(user.email || '');
      setUserName(user.name || user.email?.split('@')[0] || '');
      setUserID(user.id);
      setLoading(false);
      setImageUrl(user.image_url || '');

      const { data: imageData } = await supabase
      .from('User')
      .select('image_url')
      .eq('id', user.id)
      .single();
    
    setImageUrl(imageData?.image_url || '');

      //Could be better to move this to lib, but for now it's fine to fetch it here since we need it for the profile page
      const { data: bioData } = await supabase
        .from('User')
        .select('bio')
        .eq('id', user.id)
        .single();

      
      // Use name from database, else first part of email as fallback
      setUserBio(bioData?.bio || '');
      }
      else {
        // Not logged in, redirect to login
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex bg-[#f5f2ef]">
        <Sidebar />
        <main className="flex-1 p-8 ml-50 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
          </div>
        </main>
        <CopyWright />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 p-8 ml-50 overflow-y-auto">
        <ProfileForm 
          userName={userName}
          userEmail={userEmail}
          userBio={userBio}
          userID={userID}
          imageUrl={imageUrl}
        />
      </main>
      <CopyWright />
    </div>
  );
}