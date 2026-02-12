import Sidebar from '@/components/shared/Sidebar';
import NewPost from '@/components/HomePage/NewPost';
import CopyWright from '@/components/shared/CopyRight';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#f5f2ef]">
      <Sidebar />
      <NewPost />
      <CopyWright />
    </div>
    
  );
}
