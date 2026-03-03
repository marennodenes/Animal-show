'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import ProfileForm from '@/components/Profile/ProfileForm';
import { createClient } from '@/utils/supabase/client';

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

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email || '');
        setUserID(user.id);
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || '');
        setLoading(false);

        const { data: userData } = await supabase
          .from('User')
          .select('name, bio')
          .eq('id', user.id)
          .single();
        
        // Use name from database, else first part of email as fallback
        setUserName(userData?.name || user.email?.split('@')[0] || '');
        setUserBio(userData?.bio || '');
        setLoading(false);

      } else {
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
        />
      </main>
      <CopyWright />
    </div>
  );
}