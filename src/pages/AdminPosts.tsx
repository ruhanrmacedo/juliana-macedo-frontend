import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
    AdminPostItem,
    deletePost,
    getAdminPosts,
    togglePostActive,
} from "@/lib/posts";
import { getErrorMessage } from "@/lib/errors";
import NewPostModal from "@/components/NewPostModal";

export default function AdminPosts() {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<AdminPostItem[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [selectedPost, setSelectedPost] = useState<AdminPostItem | null>(null);

    const isAdmin = isAuthenticated && user?.role === "admin";

    async function loadPosts() {
        try {
            setIsFetching(true);
            setError("");
            const data = await getAdminPosts();
            setPosts(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsFetching(false);
        }
    }

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate("/");
            return;
        }

        if (!loading && isAdmin) {
            loadPosts();
        }
    }, [loading, isAdmin, navigate]);

    async function handleToggle(post: AdminPostItem) {
        const confirmText = post.isActive
            ? "Deseja arquivar este post?"
            : "Deseja publicar novamente este post?";

        if (!window.confirm(confirmText)) return;

        try {
            await togglePostActive(post.id);
            await loadPosts();
        } catch (err) {
            alert(getErrorMessage(err));
        }
    }

    async function handleDelete(post: AdminPostItem) {
        if (!window.confirm(`Excluir permanentemente o post "${post.title}"?`)) return;

        try {
            await deletePost(post.id);
            await loadPosts();
        } catch (err) {
            alert(getErrorMessage(err));
        }
    }

    if (loading || isFetching) {
        return (
            <>
                <Navbar />
                <main className="container mx-auto px-4 pt-24 pb-10">
                    <h1 className="text-2xl font-bold">Gerenciar Posts</h1>
                    <p className="mt-4 text-muted-foreground">Carregando posts...</p>
                </main>
                <Footer />
            </>
        );
    }

    if (!isAdmin) return null;

    return (
        <>
            <Navbar />

            <main className="container mx-auto px-4 pt-24 pb-10">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Gerenciar Posts</h1>
                        <p className="text-sm text-muted-foreground">
                            Visualize, edite, arquive ou exclua posts.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="px-4 py-3 font-semibold">Título</th>
                                <th className="px-4 py-3 font-semibold">Autor</th>
                                <th className="px-4 py-3 font-semibold">Data</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Views</th>
                                <th className="px-4 py-3 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        Nenhum post encontrado.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="border-t">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{post.title}</div>
                                            {post.postType && (
                                                <div className="text-xs text-muted-foreground">{post.postType}</div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">{post.author?.name ?? "-"}</td>

                                        <td className="px-4 py-3">
                                            {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${post.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                {post.isActive ? "Ativo" : "Arquivado"}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">{post.views ?? 0}</td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedPost(post)}
                                                    className="rounded-md border px-3 py-1.5 hover:bg-gray-50"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => handleToggle(post)}
                                                    className="rounded-md border px-3 py-1.5 hover:bg-gray-50"
                                                >
                                                    {post.isActive ? "Arquivar" : "Publicar novamente"}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(post)}
                                                    className="rounded-md border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <Footer />

            {selectedPost && (
                <NewPostModal
                    open={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                    mode="edit"
                    initialData={selectedPost}
                    onSuccess={async () => {
                        setSelectedPost(null);
                        await loadPosts();
                    }}
                />
            )}
        </>
    );
}