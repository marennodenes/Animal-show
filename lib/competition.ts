/**
 * @author mahberg 
 **/

import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";

// getAllCompetitions - get all competitions from the database ordered by end date
export async function getAllCompetitions() {
  const supabase = createClient();

    const { data, error } = await supabase.from("competitions").select("*")
    .order("end_date", { ascending: true });
    if (error) {
        return {success: false, error: error.message};
    }
    return {success: true, data}; 
}

// getCompetitionById - get a competition by id from the database
export async function getCompetitionById(id: UUID) {
    const supabase = createClient();
    const { data, error } = await supabase.from("competitions").select("*").eq("id", id).single();
    if (error) {
        return {success: false, error: error.message};

    }
    return {success: true, data}; 
}

// createCompetition - insert a newly created competition in the database
export async function createCompetition({id, name, start_date, end_date}: 
    {id: UUID; name: string; start_date: string; end_date: string;}) {

    const supabase = createClient();

    const { data, error } = await supabase.from("competitions").insert([{ id, name, start_date, end_date, created_at: new Date() }])
    .select("*").single();

    if (error) {
        return {success: false, error: error.message};
    }

    return {success: true, data};
}