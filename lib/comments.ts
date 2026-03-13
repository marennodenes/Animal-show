import { createClient } from '@/utils/supabase/client';
/** 
 * @author haakovha
*/

export async function getComments(animal_id: string, competition_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("animal_id", animal_id)
        .eq("competition_id", competition_id)
        .order("created_at", { ascending: true });
    if (error) {
        console.error("Error in getComments:", error);
        return [];
    }
    return data || [];
}
// Adds a comment to the database for a specific animal and competition, associated with a user
export async function addComment(user_id: string, animal_id: string, competition_id: string, comment: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("comments")
        .insert([{ user_id, animal_id, competition_id, comment }]);
    if (error) throw error;
    return true;
}

//deletes a comment to the the database, if the user_id matches the comment's user_id
export async function deleteComment(user_id: string, comment_id: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment_id)
        .eq("user_id", user_id);
    if (error) throw error;
}

