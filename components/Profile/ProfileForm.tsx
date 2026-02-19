/**
 * Profile Form Component
 * Form for editing user profile information
 * @author noravsk
 * @author marennod
 */

'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import TextInput from '@/components/shared/TextInput';
import PasswordInput from '@/components/shared/PasswordInput';
import DisabledEmailInput from '@/components/Profile/DisabledEmailInput';
import ErrorMessage from '@/components/shared/ErrorMessage';
import SuccessMessage from '@/components/shared/SuccessMessage';
import ProfilePictureUpload from '@/components/Profile/ProfilePictureUpload';

interface ProfileFormProps {
  initialUserName: string;
  userEmail: string;
}

export default function ProfileForm({ initialUserName, userEmail }: ProfileFormProps) {
  const router = useRouter();
  const [userName, setUserName] = useState(initialUserName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <ProfilePictureUpload
          image={profileImage}
          onImageChange={setProfileImage}
        />

        <TextInput
          label="Navn"
          value={userName}
          onChange={setUserName}
        />
        
        <DisabledEmailInput
          label="Epost"
          value={userEmail}
        />

        <PasswordInput
          label="Endre passord"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Skriv inn nytt passord"
          minLength={6}
        />

        <PasswordInput
          label="Bekreft passord"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Bekreft nytt passord"
          minLength={6}
        />

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
