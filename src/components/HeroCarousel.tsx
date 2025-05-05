
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "Alimentação Saudável: Um Guia Completo",
    excerpt: "Descubra como montar um prato equilibrado e nutritivo para sua rotina diária.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
    likes: 245,
    comments: 42,
  },
  {
    id: 2,
    title: "Receitas Práticas para o Dia a Dia",
    excerpt: "Aprenda receitas rápidas e saudáveis para uma rotina movimentada.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
    likes: 189,
    comments: 35,
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return (
    <div className="relative h-[600px] overflow-hidden bg-surface-secondary">
      <div
        className="h-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-white text-center">
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                  {post.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                  {post.excerpt}
                </p>
                <button className="btn-primary">Ler mais</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default HeroCarousel;

