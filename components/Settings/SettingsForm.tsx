/**
 * Settings Form Component
 * Form for editing account settings (name, bio, password, logout)
 * @author noravsk
 * @author marennod
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ErrorMessage from '@/components/shared/ErrorMessage';
import SuccessMessage from '@/components/shared/SuccessMessage';

interface SettingsFormProps {
  userEmail: string;
  userId: string;
  initialName?: string;
  initialBio?: string;
}

export default function SettingsForm({ userEmail, userId, initialName, initialBio }: SettingsFormProps) {
  const router = useRouter();
  const defaultName = userEmail.split('@')[0];
  
  const [name, setName] = useState(initialName || defaultName);
  const [bio, setBio] = useState(initialBio || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveChanges = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      const supabase = createClient();
      
      // Oppdater profil (navn og bio)
      const { error: profileError } = await supabase
        .from('User')
        .update({
          name: name,
          bio: bio
        })
        .eq('id', userId);
      
      if (profileError) {
        setError(profileError.message);
        setSaving(false);
        return;
      }
      
      // Oppdater passord hvis det er fylt ut
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError('Passordene samsvarer ikke');
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
        
        setNewPassword('');
        setConfirmPassword('');
      }
      
      setSuccess('Endringene ble lagret');
      router.refresh();
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Noe gikk galt');
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Innstillinger</h1>
      
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Navn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ditt navn"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-post
          </label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biografi
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fortell litt om deg selv..."
            rows={4}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5] resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">{bio.length}/100 tegn</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nytt passord (valgfritt)
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Skriv inn nytt passord"
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bekreft passord
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Bekreft nytt passord"
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7EACB5]"
          />
        </div>

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
  );
}