'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/auth';

/**
 * Register form component
 * Handles user registration with email, password and password confirmation
 * @author haakovha
 */
export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission
   * @param e - Form event
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== passwordConfirm) {
      setError('Passordene er ulike');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Passord er for kort');
      setLoading(false);
      return;
    }

    try {
      const result = await register({ email, password });

      if (result.success) {
        // Navigate to homepage after successful registration
        router.push('/homepage');
      } else {
        setError(result.error || 'Registrering feilet');
      }
    } catch {
      setError('Noe gikk galt. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f5f2ef] dark:bg-zinc-900 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-zinc-50">
          Registrer deg
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 dark:text-zinc-100 bg-[#f5f2ef] dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
            placeholder="email@mail.com"
            required
            minLength={3}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2"
          >
            Passord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 dark:text-zinc-100 bg-[#f5f2ef] dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="passwordConfirm"
            className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2"
          >
            Bekreft passord
          </label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 dark:text-zinc-100 bg-[#f5f2ef] dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7EACB5] hover:bg-[#6898A5] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrerer...' : 'Registrer deg'}
          </button>

          <p className="text-center text-zinc-600 dark:text-zinc-400 text-sm">
            Har du allerede konto?{' '}
            <Link href="/login" className="text-[#7EACB5] hover:text-[#6898A5] font-bold">
              Logg inn
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}