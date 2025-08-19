import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import CommentSection from "@/components/CommentSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye } from "lucide-react";
import LikeButton from "@/components/LikeButton";
import { getErrorMessage } from "@/lib/errors";

interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    views: number;
    author: { name: string };
    createdAt: string;
}

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const parsedId = Number(id);
        if (!parsedId || isNaN(parsedId)) return;

        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/post/${parsedId}`);
                setPost(res.data);
                document.title = `${res.data.title} — Vida & Sabor`;
            } catch (err: unknown) {
                toast({
                    title: "Erro ao carregar post",
                    description: getErrorMessage(err),
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        };

        fetchPost();
    }, [id, toast]);

    if (!post) return <div className="p-10 text-center">Carregando post...</div>;


    return (
        <>
            <Navbar />
            <main className="pt-20"> {/* compensa navbar fixa */}
                {loading ? (
                    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6 animate-pulse">
                        <div className="w-full h-[300px] bg-gray-200 rounded-lg" />
                        <div className="h-9 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-40 bg-gray-200 rounded" />
                    </div>
                ) : !post ? (
                    <div className="max-w-4xl mx-auto py-10 px-4 text-center">
                        Não encontramos esse post.
                    </div>
                ) : (
                    <article className="max-w-4xl mx-auto py-10 px-4 space-y-6">
                        <img
                            src={post.imageUrl || "https://placehold.co/1200x400?text=Sem+Imagem"}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-[800px] object-cover rounded-lg"
                        />

                        <header className="space-y-2">
                            <h1 className="text-4xl font-bold font-heading">{post.title}</h1>
                            <div className="text-gray-500 text-sm flex items-center gap-2">
                                <span>Por {post.author.name}</span>
                                <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                                <span className="inline-flex items-center gap-1">
                                    • <Eye size={16} /> {post.views} visualizações
                                </span>
                                <LikeButton postId={post.id} />
                            </div>
                        </header>

                        <div className="text-lg leading-relaxed whitespace-pre-line">
                            {post.content}
                        </div>

                        <CommentSection postId={post.id} />
                    </article>
                )}
            </main>
            <Footer />
        </>
    );
};

export default PostDetail;
