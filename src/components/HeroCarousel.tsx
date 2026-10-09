import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditorialPost, getTopViewedPosts } from "@/lib/posts";
import { stripHtml } from "@/lib/text";
import { composeHeroSlides, HeroSlide } from "@/lib/heroSlides";

const HeroCarousel = () => {
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const data = await getTopViewedPosts(3);
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Erro ao buscar destaques", err);
      }
    };

    fetchTopPosts();
  }, []);

  const slides: HeroSlide[] = useMemo(() => composeHeroSlides(posts), [posts]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      slides.length ? (prev - 1 + slides.length) % slides.length : 0,
    );

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[400px] overflow-hidden bg-surface-secondary">
      <div
        className="h-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => {
          if (slide.kind === "institutional") {
            return (
              <div key={slide.id} className="relative h-full w-full flex-shrink-0">
                <img
                  src={slide.imageUrl}
                  alt={slide.imageAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-950/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="container mx-auto px-4 text-center text-white">
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
                      {slide.credential}
                    </p>
                    <h2 className="mb-4 font-heading text-4xl font-bold md:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-emerald-50">
                      {slide.message}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => navigate(slide.primaryAction.to)}
                      >
                        {slide.primaryAction.label}
                      </button>
                      {slide.secondaryAction && (
                        <button
                          type="button"
                          className="rounded-lg border border-white/80 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                          onClick={() => navigate(slide.secondaryAction!.to)}
                        >
                          {slide.secondaryAction.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const { post } = slide;
          return (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={
                  post.imageUrl ?? "https://placehold.co/1200x400?text=Sem+Imagem"
                }
                alt={post.imageAlt || post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 text-white text-center">
                  <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                    {post.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    {stripHtml(post.excerpt)}
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigate(post.canonicalPath)}
                  >
                    Ler mais
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;


