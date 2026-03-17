'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import UserSearch from '@/components/Search/UserSearch';
import { isLoggedIn } from '@/lib/auth';

export default function SearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = sessionStorage.getItem('user');

      if (user && await isLoggedIn()) {
        setLoading(false);
        return;
      }

      router.push('/login');
    };

    checkUser();
  }, [router]);

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        {!loading && (
          <UserSearch
            title="Finn andre brukere"
            description="Søk etter andre brukere ved å skrive inn brukernavn."
            placeholder="Søk etter brukernavn..."
            limit={12}
          />
        )}
      </main>
      <CopyWright />
    </div>
  );
}
