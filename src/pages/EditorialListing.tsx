import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar"; import Footer from "@/components/Footer"; import PostCard from "@/components/PostCard";
import { EditorialPost, getEditorialListing } from "@/lib/posts"; import { usePageSeo } from "@/lib/seo";
export default function EditorialListing() {
  const location = useLocation(); const navigate = useNavigate(); const kind = location.pathname.split("/")[1] as "conteudos"|"blog"|"receitas";
  const labels = kind === "blog" ? { title: "Blog da Juliana", description: "Reflexões, aprendizados e cotidiano profissional de Juliana Macedo." } : kind === "receitas" ? { title: "Receitas", description: "Receitas possíveis para a vida real." } : { title: "Conteúdos", description: "Conteúdos educativos sobre alimentação, comportamento e saúde mental." };
  const [posts, setPosts] = useState<EditorialPost[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); getEditorialListing(kind).then(data => setPosts(data.posts)).finally(() => setLoading(false)); }, [kind]);
  usePageSeo({ title: `${labels.title} — Vida & Sabor`, description: labels.description, canonical: `/${kind}`, type: "website" });
  return <><Navbar/><main className="container mx-auto px-4 pt-28 pb-16"><header className="max-w-3xl mb-10"><h1 className="text-4xl font-bold">{labels.title}</h1><p className="mt-3 text-gray-600">{labels.description}</p></header>{loading ? <p>Carregando...</p> : posts.length === 0 ? <p>Nenhum conteúdo publicado nesta seção.</p> : <div className="grid gap-8 md:grid-cols-2">{posts.map(post => <PostCard key={post.id} id={post.id} title={post.title} excerpt={post.excerpt} image={post.imageUrl || "https://placehold.co/800x400?text=Sem+Imagem"} imageAlt={post.imageAlt || post.title} likes={post.likes || post.likesCount || 0} comments={post.commentsCount || 0} views={post.views} onReadMore={() => navigate(post.canonicalPath)}/>)}</div>}</main><Footer/></>;
}
