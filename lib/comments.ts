import { createClient } from '@/utils/supabase/client';

type CommentUserRelation =
    | { name?: string | null }
    | Array<{ name?: string | null }>
    | null;

interface CommentRow {
    id: string;
    comment: string;
    user_id: string;
    User?: CommentUserRelation;
}

export interface CommentWithUserName extends CommentRow {
    user_name: string | null;
}

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
    return ((data || []) as CommentRow[]).map((comment) => {
        const relation = comment.User;
        const user_name = Array.isArray(relation)
            ? relation[0]?.name ?? null
            : relation?.name ?? null;

        return {
            ...comment,
            user_name,
        };
    });
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

export async function getCommentCount(animal_id: string, competition_id: string) {
    const supabase = createClient();
    const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("animal_id", animal_id)
        .eq("competition_id", competition_id);
    if (error) throw new Error(error.message);
    return count || 0;
}
