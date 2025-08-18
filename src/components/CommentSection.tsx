import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        name: string;
    };
}

const CommentSection = ({ postId }: { postId: number }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments/post/${postId}/paginated`, {
                    params: { page, limit },
                });
                setComments(res.data.comments);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Erro ao carregar comentários:", err);
            }
        };

        fetchComments();
    }, [postId, page]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="mt-10 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Comentários</h2>
            {comments.length === 0 && <p>Nenhum comentário ainda.</p>}

            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment.id} className="border p-4 rounded">
                        <div className="text-sm text-gray-500">
                            {comment.user.name} em {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        <p>{comment.content}</p>
                    </li>
                ))}
            </ul>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-primary text-white" : ""}`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
