'use client'

/** 
 * @author bragesbr
*/

import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import UserGraph from '@/components/graph/userGraph';
import { useState, useEffect } from 'react';
import { getMostPopularUser } from '@/lib/user';
import User from '@/lib/models/User';

export default function AdminPage() {
    const [mostPopularUser, setMostPopularUser] = useState<User | null>(null);

    useEffect(() => {
        getMostPopularUser().then(setMostPopularUser);
    }, []);

    return (
        <div className='fixed inset-0 flex bg-[#f5f2ef]'>
            <Sidebar/>
            <main className='flex-1 ml-50 overflow-y-auto text-center'>
                <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
                <UserGraph/>
                <div>
                    <h2 className='text-left'>Mest populære bruker</h2>
                    {mostPopularUser ? (
                        <div className='text-left'>
                            <p><strong>Brukernavn:</strong> {mostPopularUser.name}</p>
                        </div>
                    ) : (
                        <p>Laster mest populære bruker...</p>
                    )}
                </div>
            </main>
            <CopyWright/>
        </div>
    );
}