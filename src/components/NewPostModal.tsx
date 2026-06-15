import { useEffect, useMemo, useState } from "react";
import { createPost, updatePost, AdminPostItem } from "@/lib/posts";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/errors";
import DOMPurify from "dompurify";
import RichTextEditor from "@/components/RichTextEditor";

type Props = {
    open: boolean;
    onClose: () => void;
    mode?: "create" | "edit";
    initialData?: AdminPostItem | null;
    onSuccess?: () => void | Promise<void>;
};

const POST_TYPES = ["Receita", "Saúde", "Artigo", "Alimentação", "Dicas", "Novidades"] as const;

export default function NewPostModal({
    open,
    onClose,
    mode = "create",
    initialData = null,
    onSuccess,
}: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState<(typeof POST_TYPES)[number]>("Saúde");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initialData) {
            setTitle(initialData.title ?? "");
            setContent(initialData.content ?? "");
            setPostType((initialData.postType as (typeof POST_TYPES)[number]) ?? "Saúde");
            setImageUrl(initialData.imageUrl ?? "");
            setImageFile(null);
        }

        if (mode === "create") {
            setTitle("");
            setContent("");
            setPostType("Saúde");
            setImageUrl("");
            setImageFile(null);
        }
    }, [open, mode, initialData]);

    const previewUrl = useMemo(() => {
        if (imageFile) return URL.createObjectURL(imageFile);
        if (imageUrl) return imageUrl;
        return "";
    }, [imageFile, imageUrl]);

    if (!open) return null;

    const handleFile = (f?: File | null) => {
        if (!f) return;

        if (!f.type.startsWith("image/")) {
            alert("Selecione uma imagem.");
            return;
        }

        if (f.size > 5 * 1024 * 1024) {
            alert("Imagem até 5MB.");
            return;
        }

        setImageFile(f);
        setImageUrl("");
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("Título e conteúdo são obrigatórios.");
            return;
        }

        setIsSubmitting(true);

        try {
            const cleanContent = DOMPurify.sanitize(content);

            if (mode === "edit" && initialData?.id) {
                await updatePost(initialData.id, {
                    title,
                    content: cleanContent,
                    postType,
                    imageFile,
                    imageUrl,
                });

                await onSuccess?.();
                onClose();
                return;
            }

            const created = await createPost({
                title,
                content: cleanContent,
                postType,
                imageFile,
                imageUrl,
            });

            await onSuccess?.();
            onClose();

            if (created?.id) navigate(`/posts/${created.id}`);
        } catch (err: unknown) {
            alert(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-xl">
                <div className="bg-gradient-to-r from-emerald-500 to-lime-500 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            {mode === "edit" ? "Editar Post" : "Novo Post"}
                        </h2>

                        <button
                            onClick={onClose}
                            className="rounded-full bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
                            type="button"
                        >
                            Fechar
                        </button>
                    </div>

                    <p className="mt-1 text-sm text-emerald-50/90">
                        Compartilhe conteúdo de saúde, nutrição e bem-estar 🌿
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex-1 overflow-y-auto bg-white px-6 py-5">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-emerald-800">
                                Título
                            </label>
                            <input
                                className="w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                                placeholder="Ex.: Café da manhã proteico e prático"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-emerald-800">
                                    Categoria
                                </label>
                                <select
                                    className="w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                                    value={postType}
                                    onChange={(e) => setPostType(e.target.value as (typeof POST_TYPES)[number])}
                                >
                                    {POST_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-emerald-800">
                                    Imagem (URL)
                                </label>
                                <input
                                    className="w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                                    placeholder="https://..."
                                    value={imageUrl}
                                    onChange={(e) => {
                                        setImageUrl(e.target.value);
                                        if (e.target.value) setImageFile(null);
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-emerald-800">
                                Imagem (arquivo)
                            </label>
                            <div className="rounded-lg border-2 border-dashed border-emerald-200 p-4 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFile(e.target.files?.[0] || null)}
                                />
                                <p className="mt-1 text-xs text-emerald-700/70">PNG, JPG até 5MB.</p>
                            </div>
                        </div>

                        {previewUrl && (
                            <div>
                                <label className="mb-1 block text-sm font-medium text-emerald-800">
                                    Pré-visualização
                                </label>
                                <div className="overflow-hidden rounded-xl border border-emerald-200">
                                    <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="max-h-72 w-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-sm font-medium text-emerald-800">
                                Conteúdo
                            </label>
                            <RichTextEditor value={content} onChange={setContent} />

                            <div className="mt-1 text-right text-xs text-emerald-700/70">
                                {content.replace(/<[^>]+>/g, "").trim().length} caracteres
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Salvando..." : mode === "edit" ? "Salvar alterações" : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}