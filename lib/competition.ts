import { createClient } from "@/utils/supabase/client";
import { UUID } from "crypto";
import { getLikes, hasLiked } from "./likes";
import Animal from "./models/Animals";

/**
 * @author mahberg
 **/

export interface competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  description: string;
  species: string;
}

export interface AnimalInCompetitionRow {
  animal_id: string;
  competition_id: string;
  species: string;
  text?: string | null;
  likes: number;
  liked: boolean;
  Animal: Animal | null;
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

//getCompetitionByUser - Get all Competitions for user
export async function getCompetitionByUser(userID: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .schema("public")
    .from("CompetitionUsers")
    .select(`*,Competition (*)`)
    .eq("UserID", userID);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
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

export async function addAnimalToCompetition(animalID: string, competitionID: string, species: string, text?: string) {
  const supabase = createClient();
  const insertObj: {
    animal_id: string;
    competition_id: string;
    species: string;
    text?: string;
  } = { animal_id: animalID, competition_id: competitionID, species };
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

export async function deleteAnimalFromCompetition(animalID: string, competitionID: string) {
  const supabase = createClient();

  const { error: likesError } = await supabase
    .from("likes")
    .delete()
    .eq("animal_id", animalID)
    .eq("competition_id", competitionID);

  if (likesError) {
    console.error("Error deleting likes for animal in competition:", likesError);
    return { success: false, error: likesError.message };
  }

  const { error } = await supabase
    .from("animal_in_competition")
    .delete()
    .eq("animal_id", animalID)
    .eq("competition_id", competitionID);

  if (error) {
    console.error("Error deleting animal from competition:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function userInCompetition(userID: string, competitionID: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .schema("public")
    .from("CompetitionUsers")
    .select("*")
    .eq("UserID", userID)
    .eq("CompID", competitionID)
    .maybeSingle();

  if (error) {
    return false;
  }
  return !!data;
}

export async function getAnimalsInCompetition(competitionID: string, userID: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("animal_in_competition")
    .select("*, Animal(*)")
    .eq("competition_id", competitionID);

  console.log("animal_in_competition data", data, error)

  if (error) {
    console.error("Error fetching animals in competition:", error);
    return [];
  }

  // For hver deltaker, hent likes og liked-status
  const animalsWithLikes: AnimalInCompetitionRow[] = await Promise.all(
    ((data || []) as Omit<AnimalInCompetitionRow, "likes" | "liked">[]).map(async (animal) => {
      try {
        const likes = await getLikes(animal.animal_id, animal.competition_id);
        const liked = await hasLiked(userID, animal.animal_id, animal.competition_id);
        return { ...animal, likes, liked };
      } catch (error) {
        console.error("Error fetching likes for animal:", animal.animal_id, error);
        return { ...animal, likes: 0, liked: false };
      }
    })
  );

  return animalsWithLikes;
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

/**
 * Get all active competitions that the user is participating in and the competition has not ended.
 */
export async function getUserActiveCompetitions(userID: string) {
  const supabase = createClient();
  
  // Get all competitions where the user is registered
  const { data: userCompetitions, error: userCompError } = await supabase
    .from("CompetitionUsers")
    .select("CompID")
    .eq("UserID", userID);
    
  if (userCompError) {
    console.error("Error fetching user competitions:", userCompError);
    return [];
  }
  
  if (!userCompetitions || userCompetitions.length === 0) {
    return [];
  }
  
  const competitionIds = userCompetitions.map(uc => uc.CompID);
  
  // Get competition details, filtering out ended competitions
  const { data: competitions, error: compError } = await supabase
    .from("Competition")
    .select("*")
    .in("id", competitionIds)
    .gte("end_date", new Date().toISOString())
    .order("end_date", { ascending: true });
    
  if (compError) {
    console.error("Error fetching competitions:", compError);
    return [];
  }
  
  return competitions || [];
}
