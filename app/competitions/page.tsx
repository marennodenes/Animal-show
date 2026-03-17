'use client';

import Sidebar from "@/components/shared/Sidebar";
import CopyWright from "@/components/shared/CopyRight";
import CompetitionList from "@/components/CompetitionPage/CompetitionList";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from '@/lib/auth';


export default function CompetitionsPage() {
  const router = useRouter();

  useEffect(() => {
      const fetchUser = async () => {
        const user = sessionStorage.getItem("user");

        if (user && await isLoggedIn() === true) {
          return;
        } else {
          // Not logged in, redirect to login
          router.push('/login');
        }
      };

    fetchUser();
  }, [router]);

    return (
        <div className="fixed inset-0 flex bg-[var(--background)]">
          <Sidebar />
          <main className="flex-1 ml-50 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              <CompetitionList />
            </div>
          </main>
          <CopyWright />
        </div>
    );
}
