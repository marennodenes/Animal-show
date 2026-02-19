    /**
     * @author mahberg
     **/

import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";

// getAllCompetitions - get all competitions from the database ordered by end date
export async function getAllCompetitions() {
const supabase = createClient();

    const { data, error } = await supabase.schema("public").from("Competition").select("*")
    .order("end_date", { ascending: true });
    if (error) {
        return {success: false, error: error.message};
    }
    return {success: true, data}; 
}

// getCompetitionById - get a competition by id from the database
export async function getCompetitionById(id: UUID) {
    const supabase = createClient();
    const { data, error } = await supabase.schema("public").from("Competition").select("*").eq("id", id).single();
    if (error) {
        return {success: false, error: error.message};

    }
    return {success: true, data}; 
}

// createCompetition - insert a newly created competition in the database
export async function createCompetition({name, start_date, end_date}: 
    { name: string; start_date: string; end_date: string;}) {

    const supabase = createClient();

    const { data, error } = await supabase.schema("public").from("Competition").insert([{name, start_date, end_date}]);

    if (error) {
        return {success: false, error: error.message};
    }
    console.log('Competition created:', data);
    return {success: true, data};
}