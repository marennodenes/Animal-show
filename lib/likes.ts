import { createClient } from '@/utils/supabase/client';
/**
 * likes-related database functions
 * @author marennod
 */

// collect likes for a animal in a competition
export async function getLikes(animal_id: string, competition_id: string) {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("animal_id", animal_id)
      .eq("competition_id", competition_id);
      
    console.log("getLikes params:", animal_id, competition_id);

    if (error) {
      console.error("Error in getLikes:", error);
      return 0;
    }
    return count || 0;
  } catch (error) {
    console.error("Exception in getLikes:", error);
    return 0;
  }
}

// check if user has liked an animal in one competition 
export async function hasLiked(user_id: string, animal_id: string, competition_id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("likes")
    .select("user_id")
    .eq("user_id", user_id)
    .eq("animal_id", animal_id)
    .eq("competition_id", competition_id)
    .single();

    console.log("hasLiked params:", user_id, animal_id, competition_id);

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found
  return !!data;
}

// like
export async function likeAnimal(user_id: string, animal_id: string, competition_id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("likes")
    .insert([{ user_id, animal_id, competition_id }]);
  if (error) throw error;
  return true;
}

// dislike
export async function unlikeAnimal(user_id: string, animal_id: string, competition_id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", user_id)
    .eq("animal_id", animal_id)
    .eq("competition_id", competition_id);
  if (error) throw error;
  return true;
}