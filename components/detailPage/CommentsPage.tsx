import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getComments, addComment, deleteComment } from "@/lib/comments";

interface Comment {
    id: string;
    comment: string;
    user_id: string;
    User: { name: string };
}

interface CommentsPageProps {
    animal_id: string;
    competition_id: string;
    onClose: () => void;
}

export default function CommentsPage({ animal_id, competition_id, onClose }: CommentsPageProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) setCurrentUser(JSON.parse(user));
    }, []);

    useEffect(() => {
        getComments(animal_id, competition_id).then(setComments);
    }, [animal_id, competition_id]);

    const handleAddComment = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!currentUser || !newComment.trim()) return;

        await addComment(currentUser.id, animal_id, competition_id, newComment);
        //load comments again after a comment is posted.
        setComments((prev) => [
            ...prev,
            { id: Date.now().toString(), comment: newComment, user_id: currentUser.id, User: { name: currentUser.name } },
        ]);
        setNewComment("");
    };

    const handleDeleteComment = async (comment_id: string) => {
        if (!currentUser) return;
        setComments((prev) => prev.filter((c) => c.id !== comment_id));
        await deleteComment(currentUser.id, comment_id);
    };

    return (
        <div className="flex items-center justify-center">
            <div className=" rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Kommentarer</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm">Ingen kommentarer lagt ut.</p>
                ) : (
                    <ul className="space-y-2 mb-4 max-h-60 overflow-auto">
                        {comments.map((c) => (
                            <li key={c.id} className="flex justify-between items-center text-sm text-gray-700">
                                <span><strong>{c.User?.name ?? ""}</strong>: {c.comment}</span>
                                {c.user_id === currentUser?.id && (
                                    <button onClick={() => handleDeleteComment(c.id)} className="text-red-400 hover:text-red-600 text-xs ml-2">
                                        Slett
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <form onSubmit={handleAddComment} className="flex gap-2 mt-4">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Del dine tanker..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    />
                    <button type="submit" className="bg-[#7EACB5] hover:bg-[#6898A5] text-white text-sm px-4 py-2 rounded-lg transition">
                        Legg til kommentar
                    </button>
                </form>
            </div>
        </div>
    );
}
