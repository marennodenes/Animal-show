    /**
     * @author mahberg
     **/

import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";

export interface competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  description: string;
  species: string;
}

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
export async function createCompetition({name, start_date, end_date, description, species, image_url}: 
    { name: string; start_date: string; end_date: string; description: string; species?: string; image_url: string | null }) {

    const supabase = createClient();

    const { data, error } = await supabase.schema("public").from("Competition")
    .insert([{name, start_date, end_date, description, species, image_url}]);

    if (error) {
        return {success: false, error: error.message};
    }
    console.log('Competition created:', data);
    return {success: true, data};
}

export async function participateCompetition({userID, competitionID}: {userID: string, competitionID: string}) {
    const supabase = createClient();
    const { data, error } = await supabase.schema("public").from("CompetitionUsers").insert([{UserID: userID, CompID: competitionID}]);
    if (error) {
        return {success: false, error: error.message};
    }
    console.log('User participated in competition:', data);
    return {success: true, data};
}

export async function addAnimalToCompetition(animalID: string, competitionID: string, text?: string, species?: string) {
  const supabase = createClient();
  const insertObj: any = { animal_id: animalID, competition_id: competitionID, species: species };
  if (text) insertObj.text = text;
  const { data, error } = await supabase
    .from("animal_in_competition")
    .insert([insertObj]);
  if (error) {
    console.error("Error adding animal to competition:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

/**
 * Upload animal image to Supabase Storage (bucket: 'competition_images') and return the public URL
 */
export async function uploadCompetitionImage(userId: string, image: File): Promise<string | null> {
  const supabase = createClient();
  const fileExt = image.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('competition_images')
    .upload(fileName, image);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('competition_images')
    .getPublicUrl(fileName);
  
  return publicUrl;
}
