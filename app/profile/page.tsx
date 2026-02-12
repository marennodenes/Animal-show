'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import { UserPen, Camera } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

/**
 * Profile component for displaying and editing user profile information
 * @author noravsk
 * @author marennod
 */
export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserEmail(user.email || '');
        //Use data from database
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || '');
      } else {
        // Not logged in, redirect to login
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleSaveChanges = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const supabase = createClient();

      // Update password if provided
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          setError('Passordene er ikke like');
          setSaving(false);
          return;
        }

        if (newPassword.length < 6) {
          setError('Passordet må være minst 6 tegn');
          setSaving(false);
          return;
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (passwordError) {
          setError(passwordError.message);
          setSaving(false);
          return;
        }
      }

      // Update user metadata (name)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: userName }
      });

      if (metadataError) {
        setError(metadataError.message);
        setSaving(false);
        return;
      }

      setSuccess('Endringer lagret!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Noe gikk galt. Prøv igjen.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profil</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {/* Profile picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <UserPen className="w-16 h-16 text-gray-400" />
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-[#BF4646] text-white p-2 rounded-full cursor-pointer hover:bg-[#a03939] transition">
                  <Camera className="w-5 h-5" />
                  <input 
                    type="file" 
                    id="profile-image" 
                    accept="image/*" 
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Klikk for å laste opp profilbilde</p>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navn
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Epost
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email kan ikke endres</p>
            </div>

            {/* Password inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endre passord
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Skriv inn nytt passord"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bekreft passord
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Bekreft nytt passord"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={saving}
                className="w-full bg-[#7EACB5] text-white py-2 px-4 rounded-md hover:bg-[#6a9aa3] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Lagrer...' : 'Lagre endringer'}
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-white text-[#BF4646] border-2 border-[#BF4646] py-2 px-4 rounded-md hover:bg-[#BF4646] hover:text-white transition font-medium"
              >
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </main>
      <CopyWright />
    </div>
  );
}