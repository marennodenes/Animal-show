import { createClient } from '@/utils/supabase/client';

//fetches comments for a specific post, and the user who made the comment.
export async function getComments(animal_id: string, competition_id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("comments")
        .select("*, User(name)")
        .eq("animal_id", animal_id)
        .eq("competition_id", competition_id)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
}

// Adds a comment to the database for a specific animal and competition, associated with a user.
export async function addComment(user_id: string, animal_id: string, competition_id: string, comment: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("comments")
        .insert([{ user_id, animal_id, competition_id, comment }]);
    if (error) throw new Error(error.message);
    return true;
}

// Deletes a comment if the comment was made by the same user deleting it.
export async function deleteComment(user_id: string, comment_id: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment_id)
        .eq("user_id", user_id);
    if (error) throw new Error(error.message);
}