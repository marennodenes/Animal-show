'use client'

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { getComments, addComment, deleteComment, CommentWithUserName } from "@/lib/comments";
import { createClient } from "@/utils/supabase/client";

interface CurrentUser {
    id: string;
    name?: string | null;
}

interface Comment extends CommentWithUserName {
    comment: string;
}

interface CommentsPageProps {
    animal_id: string;
    competition_id: string;
    onCommentCountChange?: (count: number) => void;
    onClose: () => void;
}

export default function CommentsPage({
    animal_id,
    competition_id,
    onCommentCountChange,
    onClose,
}: CommentsPageProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    useEffect(() => {
        const loadCurrentUser = async () => {
            const storedUser = sessionStorage.getItem("user");
            if (!storedUser) {
                return;
            }

            const parsedUser = JSON.parse(storedUser) as CurrentUser;

            if (parsedUser.name?.trim()) {
                setCurrentUser(parsedUser);
                return;
            }

            const supabase = createClient();
            const { data } = await supabase
                .from("User")
                .select("id, name")
                .eq("id", parsedUser.id)
                .single();

            const refreshedUser = {
                ...parsedUser,
                name: data?.name ?? parsedUser.name ?? "",
            };

            sessionStorage.setItem("user", JSON.stringify(refreshedUser));
            setCurrentUser(refreshedUser);
        };

        void loadCurrentUser();
    }, []);

    useEffect(() => {
        const loadComments = async () => {
            const fetchedComments = await getComments(animal_id, competition_id);
            setComments(fetchedComments);
            onCommentCountChange?.(fetchedComments.length);
        };

        void loadComments();
    }, [animal_id, competition_id, onCommentCountChange]);

    const getDisplayName = (comment: Comment) => {
        if (comment.user_name?.trim()) {
            return comment.user_name;
        }

        if (comment.user_id === currentUser?.id && currentUser.name?.trim()) {
            return currentUser.name;
        }

        return "Ukjent bruker";
    };

    const handleAddComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!currentUser || !newComment.trim()) return;

        await addComment(currentUser.id, animal_id, competition_id, newComment);
        setNewComment("");
        const fetchedComments = await getComments(animal_id, competition_id);
        setComments(fetchedComments);
        onCommentCountChange?.(fetchedComments.length);
    };

    const handleDeleteComment = async (comment_id: string) => {
        if (!currentUser) return;
        await deleteComment(currentUser.id, comment_id);
        setComments((prev) => {
            const updatedComments = prev.filter((c) => c.id !== comment_id);
            onCommentCountChange?.(updatedComments.length);
            return updatedComments;
        });
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
                                <span><strong>{getDisplayName(c)}</strong>: {c.comment}</span>
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
