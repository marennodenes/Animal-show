'use client';

/** 
 * @author bragesbr
*/

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllCompetitions } from '@/lib/competition';

export default function CompetitionGraph() {
    const [data, setData] = useState<{ date: string; amount: number }[]>([]);

    useEffect(() => {
        getAllCompetitions().then((result) => {
        if (result.success) {
            const grouped = result.data?.reduce((acc, comp) => {
            const month = comp.end_date.slice(0, 7); // "YYYY-MM"
            acc[month] = (acc[month] ?? 0) + 1;
            return acc;
            }, {} as Record<string, number>);
            setData(
                Object.entries(grouped ?? {}).map(([date, amount]) => ({ date, amount: amount as number }))
            );
        }
        });
    }, []);

    return (
        <div className='text-left'>
            <h2 className='text-xl font-bold text-gray-800'>Konkurranser over tid</h2>
            <h3 className='text-sm text-gray-400 mb-4'>(Målt i sluttdato)</h3>
            <ResponsiveContainer width="60%" height={300}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                            const [year, month] = value.split("-");
                            return new Date(+year, +month - 1).toLocaleString("default", {
                            month: "short",
                            year: "numeric",
                            });
                        }}
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