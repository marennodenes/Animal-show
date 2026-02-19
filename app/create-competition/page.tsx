import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyRight';
import CreateCompetitionForm from '@/components/CreateCompetitionPage/CreateCompetitionForm';

/**
 * Create Competition Page
 * Page for creating a new competition
 * @author marennod
 * @author mahberg
 */
export default function CreateCompetition() {
  return (
    <div className="fixed inset-0 flex bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 ml-50 overflow-y-auto p-8">
        <CreateCompetitionForm />
      </main>
      <CopyWright />
    </div>
  );
}
