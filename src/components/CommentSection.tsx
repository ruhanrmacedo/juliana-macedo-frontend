import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { getErrorMessage, getStatus } from "@/lib/errors";
import { useAuth } from "@/hooks/useAuth";


interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
    };
}

type PaginatedCommentsResponse = {
    comments: Comment[];
    total: number;
};

const CommentSection = ({ postId }: { postId: number }) => {
    const { toast } = useToast();
    const { user } = useAuth(); // ✅ sem any
    const isAuthenticated = !!user?.id;

    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const limit = 5;
    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

    async function fetchComments(p = page) {
        try {
            setLoading(true);
            const res = await api.get<PaginatedCommentsResponse>(`/comments/post/${postId}/paginated`, {
                params: { page: p, limit },
            });
            setComments(res.data.comments);
            setTotal(res.data.total);
        } catch (err: unknown) {
            toast({
                title: "Erro ao carregar comentários",
                description: getErrorMessage(err),
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId, page]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim()) {
            toast({ title: "Escreva algo 👀", description: "O comentário está vazio." });
            return;
        }
        try {
            setSubmitting(true);
            const res = await api.post<Comment>("/comments", { postId, content: content.trim() });
            setContent("");
            setComments((prev) => [res.data, ...prev]);
            setTotal((t) => t + 1);
            toast({ title: "Comentário publicado!" });
        } catch (err: unknown) {
            const status = getStatus(err);
            const message =
                status === 401
                    ? "Você precisa estar logado para comentar."
                    : status === 429
                        ? "Espere 10 segundos entre comentários."
                        : getErrorMessage(err);
            toast({ title: "Ops", description: message, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(commentId: number) {
        try {
            await api.delete(`/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            setTotal((t) => Math.max(0, t - 1));
            if (comments.length === 1 && page > 1) setPage((p) => p - 1);
            toast({ title: "Comentário removido" });
        } catch (err: unknown) {
            toast({
                title: "Erro ao remover",
                description: getErrorMessage(err),
                variant: "destructive",
            });
        }
    }

    return (
        <div className="mt-10 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Comentários</h2>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                    <textarea
                        className="w-full border rounded p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Escreva seu comentário…"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={2000}
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !content.trim()}
                            className="btn-primary disabled:opacity-60"
                        >
                            {submitting ? "Publicando…" : "Publicar comentário"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-6 p-4 border rounded bg-surface-secondary text-sm">
                    <span className="mr-2">Faça login para comentar.</span>
                    <a href="/login" className="text-primary underline">
                        Entrar
                    </a>
                </div>
            )}

            {loading ? (
                <p>Carregando…</p>
            ) : comments.length === 0 ? (
                <p>Nenhum comentário ainda.</p>
            ) : (
                <ul className="space-y-4">
                    {comments.map((comment) => {
                        const isOwner = user?.id === comment.user.id;
                        return (
                            <li key={comment.id} className="border p-4 rounded">
                                <div className="text-sm text-gray-500 flex items-center justify-between">
                                    <span>
                                        {comment.user.name} — {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                    {isOwner && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-red-600 hover:underline inline-flex items-center gap-1"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} /> Excluir
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 whitespace-pre-line">{comment.content}</p>
                            </li>
                        );
                    })}
                </ul>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        className="px-3 py-1 border rounded"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-primary text-white" : ""}`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="px-3 py-1 border rounded"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
