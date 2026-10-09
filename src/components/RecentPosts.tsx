import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EditorialPost, getPaginatedPosts } from "@/lib/posts";
import { getErrorMessage } from "@/lib/errors";
import { getListingViewState } from "@/lib/listingState";

const RecentPosts = () => {
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get("type") || undefined;

  useEffect(() => {
    let active = true;
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPaginatedPosts(1, 6, type);
        if (active) setPosts(data.posts || []);
      } catch (err) {
        if (!active) return;
        console.error("Erro ao carregar posts:", err);
        setError(getErrorMessage(err, "Não foi possível carregar os posts recentes. Tente novamente em instantes."));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPosts();
    return () => { active = false; };
  }, [type, reloadKey]);

  const viewState = getListingViewState({
    loading,
    error,
    itemCount: posts.length,
  });

  return (
    <section className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">
          Posts Recentes
        </h2>
        {viewState === "loading" && (
          <div
            role="status"
            aria-live="polite"
            className="space-y-4 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
          >
            <p className="text-gray-600">Carregando posts recentes...</p>
          </div>
        )}

        {viewState === "error" && (
          <div
            role="alert"
            className="space-y-4 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
          >
            <p className="text-gray-800">{error}</p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setReloadKey((prev) => prev + 1)}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {viewState === "empty" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Nenhum post publicado encontrado no momento.
            </p>
          </div>
        )}

        {viewState === "success" && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                imageAlt={post.imageAlt || post.title}
                image={post.imageUrl ?? "https://placehold.co/800x400?text=Sem+Imagem"}
                likes={post.likes ?? post.likesCount ?? 0}
                comments={post.commentsCount ?? 0}
                views={post.views}
                onReadMore={() => navigate(post.canonicalPath)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPosts;


