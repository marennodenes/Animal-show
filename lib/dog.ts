import { createClient } from '@/utils/supabase/client';
import Animal from '@/lib/models/Animals';
/**
 * Dog-related database functions
 * @author marennod
 */

/**
 * Fetch all dogs for a specific user
 */
export async function getUserAnimals(userId: string): Promise<Animal[]> {
  const supabase = createClient();
  
  // Get all animals where user_id matches, ordered by newest first
  const { data, error } = await supabase
    .from('Animal')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching animals:', error);
    return [];
  }

  return data || [];
}

export async function getUserDogs(userId: string): Promise<Animal[]> {
  const supabase = createClient();
  
  // Get all dogs where user_id matches, ordered by newest first
  const { data, error } = await supabase
    .from('Animal')
    .select('*')
    .eq('user_id', userId)
    .eq('species', 'dog')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dogs:', error);
    return [];
  }

  return data || [];
}

export async function getUserCats(userId: string): Promise<Animal[]> {
  const supabase = createClient();
  
  // Get all cats where user_id matches, ordered by newest first
  const { data, error } = await supabase
    .from('Animal')
    .select('*')
    .eq('user_id', userId)
    .eq('species', 'cat')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cats:', error);
    return [];
  }

  return data || [];
}

/**
 * Add a new animal to the database
 */
export async function addAnimal(animal: Omit<Animal, 'id'>) {
  const supabase = createClient();
  
  // Insert new animal and return the created record
  const { data, error } = await supabase
    .from('Animal')
    .insert([animal])
    .select()
    .single();

  if (error) {
    console.error('Error adding animal:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Delete an animal from the database
 */
export async function deleteAnimal(animalId: string) {
  const supabase = createClient();
  
  // Delete animal by id
  const { error } = await supabase
    .from('Animal')
    .delete()
    .eq('id', animalId);

  if (error) {
    console.error('Error deleting animal:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Upload animal image to Supabase Storage (bucket: 'dog_images') and return the public URL
 */
export async function uploadAnimalImage(userId: string, image: File): Promise<string | null> {
  const supabase = createClient();
  const fileExt = image.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('dog_images')
    .upload(fileName, image);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('dog_images')
    .getPublicUrl(fileName);
  
  return publicUrl;
}

/**
 * Upload profile picture to Supabase Storage (bucket: 'profile_picture') and return the public URL
 */
export async function uploadProfilePicture(userId: string, image: File): Promise<string | null> {
  const supabase = createClient();
  const fileExt = image.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('profile_picture')
    .upload(fileName, image);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('profile_picture')
    .getPublicUrl(fileName);
  
  return publicUrl;
}
/**
 * Stores the profile picture URL in the User table for the given user
 */
export async function updateProfilePicture(userId: string, imageUrl: string | null) {
  const supabase = createClient();
  const {data, error} = await supabase.schema("public").from('User').update({ image_url: imageUrl }).eq('id', userId);

  if (error) {
    console.error('Error updating profile picture:', error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}