import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { getTopViewedPosts } from "@/lib/posts";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
}

const HeroCarousel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const data = await getTopViewedPosts(3);
        setPosts(data.posts);
      } catch (err) {
        console.error("Erro ao buscar destaques", err);
      }
    };

    fetchTopPosts();
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % posts.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);

  if (posts.length === 0) return null;

  return (
    <div className="relative h-[400px] overflow-hidden bg-surface-secondary">
      <div
        className="h-full transition-transform duration-500 ease-out flex"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {posts.map((post) => (
          <div key={post.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={
                post.imageUrl ?? "https://placehold.co/1200x400?text=Sem+Imagem"
              }
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
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  Ler mais
                </button>
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
