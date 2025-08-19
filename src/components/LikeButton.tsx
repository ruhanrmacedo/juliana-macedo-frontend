import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage, getStatus } from "@/lib/errors";


type Props = {
    postId: number;
    initialCount?: number;
    className?: string;
};

type LikesCountResponse = { likes: number };

export default function LikeButton({ postId, initialCount = 0, className }: Props) {
    const storageKey = `liked:${postId}`;
    const [liked, setLiked] = useState<boolean>(() => localStorage.getItem(storageKey) === "1");
    const [count, setCount] = useState<number>(initialCount);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await api.get<LikesCountResponse>(`/likes/${postId}`);
                if (mounted) setCount(res.data.likes);
            } catch {
                /* silencioso */
            }
        })();
        return () => {
            mounted = false;
        };
    }, [postId]);

    async function handleLike() {
        if (liked || loading) return;
        setLoading(true);
        try {
            await api.post("/likes", { postId });
            setLiked(true);
            localStorage.setItem(storageKey, "1");
            setCount((c) => c + 1);
        } catch (err: unknown) {
            const status = getStatus(err);
            if (status === 409) {
                setLiked(true);
                localStorage.setItem(storageKey, "1");
                try {
                    const res = await api.get<LikesCountResponse>(`/likes/${postId}`);
                    setCount(res.data.likes);
                } catch {
                    /* noop */
                }
            } else {
                console.error(getErrorMessage(err));
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleLike}
            disabled={liked || loading}
            className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded hover:bg-surface-secondary disabled:opacity-60 ${className ?? ""}`}
            title={liked ? "Você já curtiu" : "Curtir"}
        >
            <Heart size={18} className={liked ? "fill-current" : ""} />
            <span>{count}</span>
        </button>
    );
}
