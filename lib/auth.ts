/**
 * @author bragesbr 
 **/

import { createClient } from "@/utils/supabase/client";
import User from "@/lib/models/User";

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
 * 
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

  const user = new User(publicUser.id, publicUser.name, publicUser.created_at, publicUser.is_admin,authUser.email ?? '', publicUser.bio);
  return {success: true, user: user}
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

  if (userError) {return {success: false, error: "Fetching the user from the database wen't wrong"}} //If this fails there may exist an object in supabase.auth but not the User-wrapper

  //Return sucess with User-wrapper-data
  const user = new User(publicUser.id, publicUser.name, publicUser.created_at, publicUser.is_admin,authUser.email ?? '', publicUser.bio);
  return {success: true, user: user}
}

export async function isLoggedIn() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return user !== null;
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  
  const {data: publicUser, error: userError} = await supabase.schema('public').from('User').select('*').eq('id',user.id).single();
  if (userError) {
    console.error("Error fetching user from database:", userError);
    return null;
  }

  return new User(publicUser.id, publicUser.name, publicUser.created_at, publicUser.is_admin, user.email ?? '', publicUser.bio);
}