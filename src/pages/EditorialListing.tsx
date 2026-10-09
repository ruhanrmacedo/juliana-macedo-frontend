import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar"; import Footer from "@/components/Footer"; import PostCard from "@/components/PostCard";
import { EditorialPost, getEditorialListing } from "@/lib/posts";
import { usePageSeo } from "@/lib/seo";
import { getErrorMessage } from "@/lib/errors";
import { getListingViewState } from "@/lib/listingState";
import { editorialCategoryPath, resolveEditorialCategory } from "@/lib/editorialNavigation";

export default function EditorialListing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const kind = location.pathname.split("/")[1] as "conteudos" | "blog" | "receitas";
  const activeCategory = resolveEditorialCategory(kind, searchParams.get("category"));
  const categorySlug = activeCategory?.slug;
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (searchParams.has("category") &&
        (searchParams.getAll("category").length !== 1 || searchParams.get("category") !== categorySlug)) {
      const normalized = new URLSearchParams(searchParams);
      normalized.delete("category");
      if (categorySlug) normalized.set("category", categorySlug);
      setSearchParams(normalized, { replace: true });
    }
  }, [searchParams, setSearchParams, categorySlug]);

  const baseLabels =
    kind === "blog"
      ? {
          title: "Blog da Juliana",
          description:
            "Reflexões, aprendizados e cotidiano profissional de Juliana Macedo.",
          emptyMessage: "Nenhuma publicação autoral encontrada no momento.",
        }
      : kind === "receitas"
        ? {
            title: "Receitas",
            description: "Receitas possíveis para a vida real.",
            emptyMessage: "Nenhuma receita publicada encontrada no momento.",
          }
        : {
            title: activeCategory
              ? `Conteúdos • ${activeCategory.name}`
              : "Conteúdos",
            description: activeCategory
              ? `Artigos e orientações educativas na categoria ${activeCategory.name}.`
              : "Conteúdos educativos sobre alimentação, comportamento e saúde mental.",
            emptyMessage: activeCategory
              ? `Nenhum conteúdo publicado na categoria ${activeCategory.name} no momento.`
              : "Nenhum conteúdo publicado nesta seção no momento.",
          };

  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getEditorialListing(kind, 1, categorySlug)
      .then((data) => { if (active) setPosts(data.posts || []); })
      .catch((err) => {
        if (!active) return;
        console.error("Erro ao carregar listagem editorial:", err);
        setError(
          getErrorMessage(
            err,
            "Não foi possível carregar as publicações desta seção. Tente novamente em instantes.",
          ),
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, categorySlug, reloadKey]);

  usePageSeo({
    title: `${baseLabels.title} — Juliana Macedo Nutricionista`,
    description: baseLabels.description,
    canonical: categorySlug ? editorialCategoryPath(categorySlug) : `/${kind}`,
    type: "website",
  });

  const viewState = getListingViewState({
    loading,
    error,
    itemCount: posts.length,
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <header className="max-w-3xl mb-10">
          <h1 className="text-4xl font-bold">{baseLabels.title}</h1>
          <p className="mt-3 text-gray-600">{baseLabels.description}</p>
        </header>

        {viewState === "loading" && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-gray-100 bg-surface-secondary p-8 text-center text-gray-600"
          >
            Carregando publicações...
          </div>
        )}

        {viewState === "error" && (
          <div
            role="alert"
            className="space-y-4 rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center text-red-900"
          >
            <p>{error}</p>
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
          <div className="rounded-2xl border border-gray-100 bg-surface-secondary p-8 text-center text-gray-600">
            {baseLabels.emptyMessage}
          </div>
        )}

        {viewState === "success" && (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                image={post.imageUrl || "https://placehold.co/800x400?text=Sem+Imagem"}
                imageAlt={post.imageAlt || post.title}
                likes={post.likes ?? post.likesCount ?? 0}
                comments={post.commentsCount ?? 0}
                views={post.views}
                onReadMore={() => navigate(post.canonicalPath)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
