'use client'

/** 
 * @author bragesbr
*/

import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import UserGraph from '@/components/graph/userGraph';
import CompetitionGraph from '@/components/graph/competitionGraph';
import { useState, useEffect } from 'react';
import { getMostPopularUser } from '@/lib/user';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    const [mostPopularUser, setMostPopularUser] = useState<User | null>(null);
    const [popularUserLoading, setPopularUserLoading] = useState(true);
    
    useEffect(() => {
        getCurrentUser().then((user) => {
        if (!user?.is_admin) {
            router.push("/homepage");
        }
        });
    }, [router]);

    useEffect(() => {
        getMostPopularUser()
            .then(setMostPopularUser)
            .catch((error) => {
                console.error('Could not load most popular user:', error);
                setMostPopularUser(null);
            })
            .finally(() => {
                setPopularUserLoading(false);
            });
    }, []);

    const mostPopularUserName = mostPopularUser?.name?.trim() || 'Bruker uten navn';
    const mostPopularUserInitial = mostPopularUserName.charAt(0).toUpperCase();

    return (
        <div className='fixed inset-0 flex bg-[#f5f2ef]'>
            <Sidebar/>
            <main className='flex-1 ml-50 overflow-y-auto px-8 py-10'>
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Page</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <UserGraph/>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <CompetitionGraph/>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold mb-1 text-gray-800">Mest populære bruker</h2>
                    <p className="text-sm text-gray-400 mb-4">(Denne brukeren har flest likes totalt)</p>
                    {mostPopularUser ? (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#7EACB5] flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {mostPopularUserInitial}
                            </div>
                            <p className="text-gray-700 font-medium text-lg">{mostPopularUserName}</p>
                        </div>
                    ) : !popularUserLoading ? (
                        <p className="text-sm text-gray-500">Fant ingen populær bruker å vise akkurat nå.</p>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            <p className="text-sm">Laster mest populære bruker...</p>
                        </div>
                    )}
                </div>
            </main>
            <CopyWright/>
        </div>
    );
}
