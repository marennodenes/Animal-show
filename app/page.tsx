import { redirect } from 'next/navigation';

/**
 * Root page - redirects to login page
 * Login is set as the first page users see
 */
export default function Home() {
  redirect('/login');
}
