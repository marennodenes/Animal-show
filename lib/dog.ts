import { createClient } from '@/utils/supabase/client';

/**
 * Dog-related database functions
 * @author marennod
 */

// Interface for Dog data structure
export interface Dog {
  id: string;
  name: string;
  breed: string;
  birth_date: string;
  image_url: string | null;
  user_id: string;
}

/**
 * Fetch all dogs for a specific user
 */
export async function getUserDogs(userId: string): Promise<Dog[]> {
  const supabase = createClient();
  
  // Get all dogs where user_id matches, ordered by newest first
  const { data, error } = await supabase
    .from('Dog')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dogs:', error);
    return [];
  }

  return data || [];
}

/**
 * Add a new dog to the database
 */
export async function addDog(dog: Omit<Dog, 'id'>) {
  const supabase = createClient();
  
  // Insert new dog and return the created record
  const { data, error } = await supabase
    .from('Dog')
    .insert([dog])
    .select()
    .single();

  if (error) {
    console.error('Error adding dog:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Delete a dog from the database
 */
export async function deleteDog(dogId: string) {
  const supabase = createClient();
  
  // Delete dog by id
  const { error } = await supabase
    .from('Dog')
    .delete()
    .eq('id', dogId);

  if (error) {
    console.error('Error deleting dog:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Upload dog image to Supabase Storage (bucket: 'dog_images') and return the public URL
 */
export async function uploadDogImage(userId: string, image: File): Promise<string | null> {
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