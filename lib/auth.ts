/**
 * @author bragesbr 
 **/

import { createClient } from "@/utils/supabase/client";


export async function login({ email, password }: { email: string; password: string }) {
  const supabase = createClient();
  
  const {data,error} = await supabase.auth.signInWithPassword({email,password});

  if (error) {
    return {success: false, error: error.message};
  }

  return {success: true, user: data.user}
}

export async function register({ email, password}: { email: string; password: string}) {
  const supabase = createClient();

  const {data, error} = await supabase.auth.signUp({email,password});

  if (error) {
    return {success: false, error: error.message};
  }

  return {success: true, user: data.user}
}