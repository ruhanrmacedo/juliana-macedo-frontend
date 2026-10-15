import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EditorialPost, getTopViewedPosts } from "@/lib/posts";
import { stripHtml } from "@/lib/text";
import { composeHeroSlides, HeroSlide, JULIANA_PROFESSIONAL_SLIDE } from "@/lib/heroSlides";

const HeroCarousel = () => {
  const [posts, setPosts] = useState<EditorialPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const data = await getTopViewedPosts(2);
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Erro ao buscar destaques", err);
      }
    };

    fetchTopPosts();
  }, []);

  const slides: HeroSlide[] = useMemo(
    () => composeHeroSlides(posts, [JULIANA_PROFESSIONAL_SLIDE]),
    [posts],
  );

  const nextSlide = () =>
    setCurrentSlide((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      slides.length ? (prev - 1 + slides.length) % slides.length : 0,
    );

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[560px] overflow-hidden bg-surface-secondary md:h-[430px]">
      <div
        className="h-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => {
          if (slide.kind === "institutional") {
            return (
              <div key={slide.id} className="h-full w-full flex-shrink-0 bg-[#f4f1e7]">
                <div className="container mx-auto grid h-full grid-rows-[1fr_220px] px-4 md:grid-cols-[1.1fr_.9fr] md:grid-rows-1 md:px-8">
                  <div className="flex min-w-0 flex-col justify-center py-9 text-left md:py-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#68754f]">
                      {slide.credential}
                    </p>
                    <h2 className="mb-4 mt-3 font-heading text-4xl font-bold text-[#35422f] md:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="mb-4 max-w-xl text-sm leading-relaxed text-[#526042] md:text-base">
                      {slide.message}
                    </p>
                    {slide.supportingMessage && (
                      <p className="mb-7 max-w-xl font-medium leading-relaxed text-[#35422f]">
                        {slide.supportingMessage}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4">
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
                  <div className="relative min-h-0 overflow-hidden rounded-t-[120px] bg-[#d8d4c4] md:rounded-none md:rounded-l-[170px]">
                    <img
                      src={slide.imageUrl}
                      alt={slide.imageAlt}
                      className="h-full w-full object-cover object-[center_25%]"
                    />
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


