import Sidebar from '@/components/shared/Sidebar';
import NewPost from '@/components/HomePage/NewPost';
import CopyWright from '@/components/shared/CopyRight';

export default function Home() {
  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto">
        <NewPost />
      </main>
      <CopyWright />
    </div>
    
  );
}
