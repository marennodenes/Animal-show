'use client';

import { useState, type FormEvent } from 'react';
import { login } from '@/lib/auth';

/**
 * Login form component
 * Handles user authentication with username and password
 * @author marennod
 */
export default function LoginForm() {
  const [username, setUsername] = useState('');
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
      const result = await login({ username, password });

      if (result.success) {
        // successful login
        console.log('Innlogget som:', result.user);
        alert(`Velkommen, ${result.user?.username}!`);
        // TODO: navigate to dashboard or homepage
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
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-zinc-50">
          Logg inn
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="username" className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2">
            Brukernavn
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="brukernavn"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-zinc-700 dark:text-zinc-300 text-sm font-bold mb-2">
            Passord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Har du ikke konto?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-700 font-bold">
            Registrer deg
          </a>
        </div>
      </form>
    </div>
  );
}
