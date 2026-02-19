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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email || '');
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || '');
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
            <p>Laster...</p>
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
          initialUserName={userName}
          userEmail={userEmail}
        />
      </main>
      <CopyWright />
    </div>
  );
}