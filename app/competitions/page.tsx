import Sidebar from "@/components/shared/Sidebar";
import NewPost from "@/components/HomePage/NewPost";
import CopyWright from "@/components/shared/CopyRight";
import NewCompetition from "@/components/CompetitionPage/NewCompetition";


export default function competitions(){
    return (
        <div className="fixed inset-0 flex bg-[#f5f2ef]">
          <Sidebar />
          <main className="flex-1 ml-50 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Konkurranser</h1>
              <NewCompetition />
            </div>
          </main>
          <CopyWright />
        </div>
    );
}
