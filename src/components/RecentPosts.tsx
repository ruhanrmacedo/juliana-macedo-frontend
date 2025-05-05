
import PostCard from "./PostCard";

const posts = [
  {
    id: 1,
    title: "10 Benefícios da Alimentação Vegetariana",
    excerpt: "Descubra como uma dieta baseada em plantas pode melhorar sua saúde e bem-estar.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    likes: 156,
    comments: 23,
  },
  {
    id: 2,
    title: "Guia Completo de Proteínas Vegetais",
    excerpt: "Aprenda sobre as melhores fontes de proteína para uma dieta vegetariana equilibrada.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
    likes: 142,
    comments: 18,
  },
  {
    id: 3,
    title: "Receitas Saudáveis para o Café da Manhã",
    excerpt: "Comece seu dia com estas deliciosas e nutritivas opções de café da manhã.",
    image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800",
    likes: 198,
    comments: 34,
  },
];

const RecentPosts = () => {
  return (
    <section className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold mb-8 text-center">
          Posts Recentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;

