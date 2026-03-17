'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth';
import EmailInput from '@/components/shared/EmailInput';
import PasswordInput from '@/components/shared/PasswordInput';
import ErrorMessage from '@/components/shared/ErrorMessage';

/**
 * Login form component
 * Handles user authentication with email and password
 * @author marennod
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    try {
      const result = await login({ email, password });

      if (result.success) {
        // successful login
        console.log('Innlogget som:', result.user?.email);
        // Navigate to homepage after successful login
        router.push('/homepage');
      } else {
        setError(result.error || 'Innlogging feilet');
      }
    } catch (err) {
      setError('Noe gikk galt. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-[var(--background)] dark:bg-zinc-900 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-zinc-50">
          Logg inn
        </h2>

        <ErrorMessage message={error} />

        <div className="mb-4">
          <EmailInput
            id="email"
            label="Email"
            value={email}
            onChange={setEmail}
            required
          />
        </div>

        <div className="mb-6">
          <PasswordInput
            id="password"
            label="Passord"
            value={password}
            onChange={setPassword}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7EACB5] hover:bg-[#6898A5] text-[#f5f2ef] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Har du ikke konto?{' '}
          <Link href="/register" className="font-bold text-[#7EACB5] hover:text-[#6898A5]">
            Registrer deg
          </Link>

        </div>
      </form>
    </div>
  );
}
