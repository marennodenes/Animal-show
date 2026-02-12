/**
 * @author bragesbr 
 **/

import { createClient } from "@/utils/supabase/client";

/**
 * Authenticates a user using email and password.
 *
 * This function attempts to sign in a user via Supabase authentication.
 * If authentication succeeds, it fetches the corresponding user record
 * from the public `User` table and returns both the auth user and the
 * public user data.
 *
 * @async
 * @function login
 * @param {{ email: string; password: string }} params - User credentials.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 *
 * @returns {Promise<
 *   | { success: true; user: { authUser: any; publicUser: any } }
 *   | { success: false; error: string }
 * >}
 **/
export async function login({ email, password }: { email: string; password: string }) {
  const supabase = createClient();
  
  const {data: data,error: error} = await supabase.auth.signInWithPassword({email,password});

  if (error) {
    return {success: false, error: error.message};
  }
  const authUser = data.user;

  const {data: publicUser, error: userError} = await supabase.schema('public').from('User').select('*').eq('id',authUser.id).single();

  if (userError) {
    return {success: false, error: "Fetching the user from the database wen't wrong"}
  }

  //We should think about creating a userModel and returning that instead
  return {success: true, user: {authUser,publicUser}}
}

/**
 * Registers a new user using email and password.
 *
 * This function:
 * 1. Creates a new user in Supabase Authentication.
 * 2. Inserts a corresponding row in the public `User` table.
 * 3. Fetches and returns both the auth user and the public user data.
 *
 * If any step fails, the function returns an error response.
 *
 * @async
 * @function register
 * @param {{ email: string; password: string }} params - User registration credentials.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 *
 * @returns {Promise<
 *   | { success: true; user: { authUser: any; publicUser: any } }
 *   | { success: false; error: string }
 * >}
 **/
export async function register({ email, password}: { email: string; password: string}) {
  //Create Client
  const supabase = createClient();

  //Create supabase.auth.user row
  const {data: data, error: error} = await supabase.auth.signUp({email,password});

  //Error checks
  if (error) {return {success: false, error: error.message};}
  if (data.user == null) {return {success: false, error: 'Registration failed'};}

  //Assign const for future reference
  const authUser = data.user;

  //Insert new User into public.User
  const {error: insertError} = await supabase.schema('public').from('User').insert({id: authUser.id})

  if (insertError) {return {success: false, error: 'Database insert failed'};} //If this fails there may exist an object in supabase.auth but not the User-wrapper

  //Fetch new User-wrapper-data
  const {data: publicUser, error: userError} = await supabase.schema('public').from('User').select('*').eq('id',authUser.id).single();

  //Return sucess with User-wrapper-data
  //We should think about creating a userModel and returning that instead
  return {success: true, user: {authUser,publicUser}}
}