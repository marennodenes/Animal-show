import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import AddDogForm from "@/components/addDog/AddDogForm";
import Sidebar from "@/components/shared/Sidebar";
import CopyWright from "@/components/shared/CopyRight";

export default async function AddDogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 p-8 ml-50 overflow-y-auto">
        <AddDogForm userId={user.id} />
      </main>
      <CopyWright />
    </div>
  );
}