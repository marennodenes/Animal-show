import {Plus} from "lucide-react"
/**
 * NewPost component for creating a new post
 * @author marennod
 * @author noravsk
 */
export default function NewPost() {
  return (
    <button 
      className="fixed bottom-16 right-12 bg-[#BF4646] hover:bg-[#A03A3A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
      aria-label="Nytt innlegg"
    >
      <Plus size={60} />
    </button>
  );
}
