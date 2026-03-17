import { createClient } from '@/utils/supabase/client';
import { getMostLikedUserID } from './likes';
import User from './models/User';

/** 
 * @author bragesbr
*/

export async function getUserCreationData(): Promise<{ date: string; amount: number }[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('User')
        .select('created_at');

    if (error) throw error;

    // Aggregate by date
    const counts = data.reduce<Record<string, number>>((acc, user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0]; // "YYYY-MM-DD"
        acc[date] = (acc[date] ?? 0) + 1;
        return acc;
    }, {});

    return Object.entries(counts)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getMostPopularUser() {
    const supabase = createClient();

    const userID = await getMostLikedUserID();

    const { data, error } = await supabase
        .schema('public')
        .from('User')
        .select('*')
        .eq('id', userID)
        .single<User>();

    if (error) {throw error};

    return data as User;
}