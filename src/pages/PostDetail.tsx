import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import { Eye } from "lucide-react";
import { EditorialPost, getAdminPostById, getPostBySlug } from "@/lib/posts";
import { usePageSeo } from "@/lib/seo";
import { getErrorMessage } from "@/lib/errors";

type Props = { preview?: boolean };
export default function PostDetail({ preview = false }: Props) {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const location = useLocation(); const navigate = useNavigate();
  const [post, setPost] = useState<EditorialPost | null>(null); const [error, setError] = useState("");
  useEffect(() => { (async () => { try {
    const data = preview ? await getAdminPostById(Number(id)) : await getPostBySlug(slug || "");
    if (!preview && data.canonicalPath && data.canonicalPath !== location.pathname) { navigate(data.canonicalPath, { replace: true }); return; }
    setPost(data); window.scrollTo({ top: 0 });
  } catch (err) { setError(getErrorMessage(err)); } })(); }, [slug, id, preview, location.pathname, navigate]);
  const jsonLd = useMemo(() => post ? ({ "@context": "https://schema.org", "@type": post.format === "RECIPE" ? "Recipe" : post.channel === "BLOG" ? "BlogPosting" : "Article", headline: post.title, description: post.seoDescription || post.excerpt, image: post.imageUrl || undefined, datePublished: post.publishedAt, dateModified: post.updatedAt, author: post.author ? { "@type": "Person", name: post.author.displayName, jobTitle: post.author.headline } : undefined, mainEntityOfPage: `${window.location.origin}${post.canonicalPath}` }) : undefined, [post]);
  usePageSeo({ title: `${post?.seoTitle || post?.title || "Conteúdo"} — Vida & Sabor`, description: post?.seoDescription || post?.excerpt || "Conteúdo de Juliana Macedo", canonical: post?.canonicalPath || location.pathname, image: post?.imageUrl, jsonLd });
  if (error) return <><Navbar/><main className="pt-28 text-center">{error}</main><Footer/></>;
  if (!post) return <div className="p-10 text-center">Carregando conteúdo...</div>;
  return <><Navbar/><main className="pt-20"><article className="max-w-4xl mx-auto py-10 px-4 space-y-6">
    {preview && <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900">Pré-visualização administrativa • {post.status}</div>}
    {post.imageUrl && <figure><img src={post.imageUrl} alt={post.imageAlt || post.title} className="w-full max-h-[700px] object-cover rounded-lg"/><figcaption className="mt-2 text-sm text-gray-500">{post.imageCaption}{post.imageCredit && ` • ${post.imageCredit}`}</figcaption></figure>}
    <header className="space-y-4 border-b pb-6"><div className="text-sm text-emerald-700">{post.channel === "BLOG" ? "Blog da Juliana" : post.format === "RECIPE" ? "Receita" : post.category?.name || "Conteúdo"}</div><h1 className="font-heading text-3xl md:text-5xl font-extrabold">{post.title}</h1><p className="text-lg text-gray-600">{post.excerpt}</p><div className="text-gray-500 text-sm flex flex-wrap items-center gap-2"><span>Por {post.author?.displayName || post.author?.name}</span><span>{post.author?.headline}</span><span>• {new Date(post.publishedAt || post.createdAt).toLocaleDateString("pt-BR")}</span><span className="inline-flex items-center gap-1">• <Eye size={16}/>{post.views}</span>{!preview && <LikeButton postId={post.id}/>}</div>{post.tags?.length > 0 && <div className="flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag.id} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">#{tag.name}</span>)}</div>}</header>
    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }}/>{!preview && <CommentSection postId={post.id}/>}</article></main><Footer/></>;
}
