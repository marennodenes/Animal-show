import { createClient } from "@/utils/supabase/server"; 
import { redirect } from 'next/navigation';
import SettingsForm from "@/components/Settings/SettingsForm";
import Sidebar from "@/components/shared/Sidebar";
import CopyWright from "@/components/shared/CopyRight";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('User')
    .select('name, bio,image_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[var(--background)] py-10">
      <SettingsForm userEmail={user.email || ''}
       userId={user.id}
       initialName={userData?.name || ''}
       initialBio={userData?.bio || ''}
       imageUrl={userData?.image_url || ''}
      />
      <Sidebar />
              <main className="flex-1 p-8 ml-50 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                </div>
              </main>
              <CopyWright />
    </div>
    

  );
}
