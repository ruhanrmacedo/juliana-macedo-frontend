import api from "@/lib/api";

export type EditorialChannel = "CONTENT" | "BLOG";
export type ContentFormat = "ARTICLE" | "RECIPE";
export type EditorialStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type Category = { id: number; name: string; slug: string };
export type Tag = { id: number; name: string; slug: string };
export type AuthorProfile = { id: number; name?: string; displayName: string; slug: string; headline: string; shortBio?: string | null; avatarUrl?: string | null };
export type EditorialPost = {
  id: number; title: string; slug: string; canonicalPath: string; content?: string; excerpt: string;
  postType?: string; channel: EditorialChannel; format: ContentFormat; status: EditorialStatus;
  publishedAt?: string | null; isActive: boolean; imageUrl?: string | null; imageAlt?: string | null;
  imageCaption?: string | null; imageCredit?: string | null; seoTitle?: string | null; seoDescription?: string | null;
  isFeatured: boolean; featuredPriority?: number | null; category?: Category | null; tags: Tag[]; author: AuthorProfile | null;
  views: number; likes?: number; likesCount?: number; commentsCount?: number; createdAt: string; updatedAt?: string;
  redirectedFrom?: string | null;
};
export type AdminPostItem = EditorialPost & { technicalAuthor?: { id: number; name: string } | null; editedBy?: { id: number; name: string } | null };
export type EditorialInput = Partial<EditorialPost> & { title: string; content: string; tagNames?: string[]; categoryId?: number | null; authorProfileId?: number; imageFile?: File | null };
export type Taxonomy = { categories: Category[]; tags: Tag[]; authors: Array<AuthorProfile & { name?: never }> };

export function canonicalPostPath(post: Pick<EditorialPost, "slug" | "channel" | "format">) {
  if (post.channel === "BLOG") return `/blog/${post.slug}`;
  if (post.format === "RECIPE") return `/receitas/${post.slug}`;
  return `/conteudos/${post.slug}`;
}
export async function getPaginatedPosts(page = 1, pageSize = 6, typeSlug?: string, filters: { channel?: EditorialChannel; format?: ContentFormat; category?: string; tag?: string } = {}) {
  const qs = new URLSearchParams({ page: String(page), limit: String(pageSize) });
  if (typeSlug) qs.set("type", typeSlug);
  Object.entries(filters).forEach(([key, value]) => value && qs.set(key, value));
  return (await api.get(`/post/postspaginated?${qs}`)).data;
}
export async function getEditorialListing(kind: "conteudos" | "blog" | "receitas", page = 1) {
  const filters = kind === "blog" ? { channel: "BLOG" as const } : kind === "receitas" ? { channel: "CONTENT" as const, format: "RECIPE" as const } : { channel: "CONTENT" as const, format: "ARTICLE" as const };
  return getPaginatedPosts(page, 12, undefined, filters);
}
export const getTopViewedPosts = async (limit = 3) => (await api.get("/post/top", { params: { limit } })).data;
export const getAdminPosts = async () => (await api.get("/post/admin")).data as AdminPostItem[];
export const getAdminPostById = async (id: number) => (await api.get(`/post/admin/${id}`)).data as AdminPostItem;
export const getPostById = async (id: number) => (await api.get(`/post/${id}`)).data as EditorialPost;
export const getPostBySlug = async (slug: string) => (await api.get(`/post/slug/${encodeURIComponent(slug)}`)).data as EditorialPost;
export const getTaxonomy = async () => (await api.get("/post/taxonomy")).data as Taxonomy;

function toFormData(data: EditorialInput) {
  const fd = new FormData();
  const fields: Array<keyof EditorialInput> = ["title","content","postType","slug","excerpt","channel","format","status","publishedAt","categoryId","authorProfileId","imageUrl","imageAlt","imageCaption","imageCredit","seoTitle","seoDescription","isFeatured","featuredPriority"];
  fields.forEach((key) => { const value = data[key]; if (value !== undefined && value !== null) fd.append(String(key), String(value)); });
  fd.append("tagNames", JSON.stringify(data.tagNames || []));
  if (data.imageFile) fd.append("image", data.imageFile);
  return fd;
}
export const createPost = async (data: EditorialInput) => (await api.post("/post", toFormData(data))).data as AdminPostItem;
export const updatePost = async (id: number, data: EditorialInput) => (await api.put(`/post/${id}`, toFormData(data))).data as AdminPostItem;
export const togglePostActive = async (id: number) => (await api.patch(`/post/${id}/toggle`)).data;
export const deletePost = async (id: number) => (await api.delete(`/post/${id}`)).data;
export async function uploadMedia(imageFile: File) { const fd = new FormData(); fd.append("image", imageFile); return (await api.post("/media/image", fd)).data as { imageUrl: string; url?: string }; }
