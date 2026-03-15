'use client';

/** 
 * @author bragesbr
*/

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getUserCreationData } from '@/lib/user';

export default function UserGraph() {
    const [data, setData] = useState<{ date: string; amount: number }[]>([]);

    useEffect(() => {
        getUserCreationData().then(setData);
        
    }, []);

    return (
        <div className='text-left'>
            <h2 className='text-xl font-bold mb-4 text-gray-800'>Brukere lagd over tid</h2>
            <ResponsiveContainer width="60%" height={300}>
                <LineChart data={data}>
                    <XAxis 
                        dataKey="date"
                    />
                    <YAxis/>
                    <Tooltip/>
                    <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#7EACB5"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}