'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/auth';
import EmailInput from '@/components/shared/EmailInput';
import PasswordInput from '@/components/shared/PasswordInput';
import ErrorMessage from '@/components/shared/ErrorMessage';

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
        // TODO: redirect to login or dashboard
        
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
        className="rounded-2xl border border-black/5 bg-white/95 px-8 pb-8 pt-6 shadow-xl backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-zinc-50">
          Registrer deg
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

        <div className="mb-4">
          <PasswordInput
            id="password"
            label="Passord"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <PasswordInput
            id="passwordConfirm"
            label="Bekreft passord"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
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
