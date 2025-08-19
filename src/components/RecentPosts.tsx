import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { getPaginatedPosts } from "@/lib/posts";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  views: number;
}

const RecentPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPaginatedPosts(1, 6);
        setPosts(data.posts);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">
          Posts Recentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.imageUrl ?? "https://placehold.co/800x400?text=Sem+Imagem"}
              likes={post.likes}
              comments={post.commentsCount}
              views={post.views}
              onReadMore={() => navigate(`/posts/${post.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;
