'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchUsersByName, type SearchUserResult } from '@/lib/users';

interface UserSearchProps {
  title?: string;
  description?: string;
  placeholder?: string;
  limit?: number;
  compact?: boolean;
  headingLevel?: 'h1' | 'h2';
  className?: string;
}

export default function UserSearch({
  title = 'Finn andre brukere',
  description = 'Finn andre brukere ved å søke etter brukernavn.',
  placeholder = 'Søk etter brukernavn...',
  limit = 8,
  compact = false,
  headingLevel = 'h1',
  className = '',
}: UserSearchProps) {
  const HeadingTag = headingLevel;
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchUserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const storedUser = sessionStorage.getItem('user');

    if (!storedUser) {
      return undefined;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.id;
    } catch (parseError) {
      console.error('Could not read user from session storage:', parseError);
      return undefined;
    }
  });

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      setSearching(true);
      setError('');

      const result = await searchUsersByName(trimmedQuery, {
        excludeUserId: currentUserId,
        limit,
      });

      if (!isActive) {
        return;
      }

      if (!result.success) {
        setResults([]);
        setError('Could not load users right now.');
        setSearching(false);
        return;
      }

      setResults(result.data);
      setSearching(false);
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [query, currentUserId, limit]);

  return (
    <section
      className={`w-full ${compact ? 'max-w-3xl mx-auto' : 'max-w-4xl mx-auto'} ${className}`}
    >
      <div className={`rounded-[28px] border border-[#D9E3E6] bg-white shadow-sm ${compact ? 'p-5 md:p-6' : 'p-6 md:p-8'}`}>
        <div className="mb-5">
          <HeadingTag className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
            {title}
          </HeadingTag>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            {description}
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7EACB5]" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);

              if (!nextQuery.trim()) {
                setResults([]);
                setError('');
                setSearching(false);
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-[#D9E3E6] bg-[#F7FAFB] py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-[#7EACB5] focus:bg-white"
          />
        </div>

        <div className="mt-5 space-y-3">
          {searching && (
            <div className="rounded-2xl border border-[#E6ECEE] bg-[#F9FBFB] px-4 py-5 text-sm text-gray-500">
              Søker etter brukere..
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-[#F2C7C7] bg-[#FFF5F5] px-4 py-5 text-sm text-[#A03A3A]">
              {error}
            </div>
          )}

          {results.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => router.push(`/profile/${user.id}`)}
              className="flex w-full items-start gap-4 rounded-2xl border border-[#E6ECEE] bg-[#F9FBFB] p-4 text-left transition hover:border-[#C9D8DC] hover:bg-white"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D8E8EB] text-lg font-semibold text-[#38606A]">
                {user.image_url ? (
                  // User images come from storage URLs, so a regular img keeps this simple.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image_url}
                    alt={user.name ?? 'User profile picture'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{(user.name ?? 'U').charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-gray-900">
                    {user.name || 'User without username'}
                  </p>
                  {user.is_admin && (
                    <span className="rounded-full bg-[#FDECEC] px-2.5 py-1 text-xs font-medium text-[#BF4646]">
                      Admin
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-600">
                  {user.bio || 'Ingen bio lagt til.'}
                </p>
                <p className="mt-2 text-sm font-medium text-[#7EACB5]">
                  Vis profil
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
