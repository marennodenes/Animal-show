import { createClient } from "@/utils/supabase/client";

export interface SearchUserResult {
  id: string;
  name: string | null;
  bio: string | null;
  image_url: string | null;
  is_admin: boolean;
}

interface SearchUsersOptions {
  excludeUserId?: string;
  limit?: number;
}

export async function searchUsersByName(
  searchTerm: string,
  { excludeUserId, limit = 8 }: SearchUsersOptions = {},
) {
  const trimmedSearchTerm = searchTerm.trim();

  if (!trimmedSearchTerm) {
    return { success: true, data: [] as SearchUserResult[] };
  }

  const supabase = createClient();

  let query = supabase
    .from("User")
    .select("id, name, bio, image_url, is_admin")
    .ilike("name", `%${trimmedSearchTerm}%`)
    .order("name", { ascending: true })
    .limit(limit);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error searching users:", error);
    return { success: false, error: error.message, data: [] as SearchUserResult[] };
  }

  return { success: true, data: (data ?? []) as SearchUserResult[] };
}

export async function getUserById(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("User")
    .select("id, name, bio, image_url, is_admin")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: error.message, data: null as SearchUserResult | null };
  }

  return { success: true, data: data as SearchUserResult };
}
