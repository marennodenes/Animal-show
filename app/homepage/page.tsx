
'use client';
import Sidebar from '@/components/shared/Sidebar';
import NewPost from '@/components/shared/NewPost';
import CopyWright from '@/components/shared/CopyRight';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import MyCompetitions from '@/components/HomePage/MyCompetitions';
import UserSearch from '@/components/Search/UserSearch';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = sessionStorage.getItem('user');

      if (user && await isLoggedIn()) {
        setLoading(false);
        return;
      }

      router.push('/login');
    };

    fetchUser();
  }, [router]);

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto">
        {!loading && (
          <div className="px-4 pt-8">
            <UserSearch
              title="Finn andre brukere"
              description="Søk etter andre brukere direkte fra hjemmesiden."
              placeholder="Søk etter brukernavn..."
              limit={5}
              compact
            />
          </div>
        )}
        <MyCompetitions />
        <NewPost />
      </main>
      <CopyWright />
    </div>
  );
}
