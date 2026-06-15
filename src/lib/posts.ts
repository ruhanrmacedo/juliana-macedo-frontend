import api from "@/lib/api";

export type AdminPostItem = {
    id: number;
    title: string;
    content?: string;
    postType?: string;
    imageUrl?: string | null;
    isActive: boolean;
    views: number;
    createdAt: string;
    updatedAt?: string;
    author?: {
        id: number;
        name: string;
    } | null;
};

export async function getPaginatedPosts(page = 1, pageSize = 6, typeSlug?: string) {
    const qs = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    if (typeSlug) qs.set("type", typeSlug);
    const { data } = await api.get(`/post/postspaginated?${qs.toString()}`);
    return data;
}

export const getTopViewedPosts = async (limit = 3) => {
    const res = await api.get("/post/top", {
        params: {
            limit: Number(limit),
        },
    });
    return res.data;
};

export async function createPost(data: {
    title: string;
    content: string;
    postType: string;
    imageFile?: File | null;
    imageUrl?: string;
}) {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("content", data.content);
    fd.append("postType", data.postType);

    if (data.imageFile) {
        fd.append("image", data.imageFile);
    } else if (data.imageUrl?.trim()) {
        fd.append("imageUrl", data.imageUrl.trim());
    }

    const res = await api.post("/post", fd);
    return res.data;
}

export async function getAdminPosts() {
    const { data } = await api.get("/post/admin");
    return data as AdminPostItem[];
}

export async function togglePostActive(postId: number) {
    const { data } = await api.patch(`/post/${postId}/toggle`);
    return data;
}

export async function deletePost(postId: number) {
    const { data } = await api.delete(`/post/${postId}`);
    return data;
}

export async function updatePost(
    postId: number,
    data: {
        title?: string;
        content?: string;
        postType?: string;
        imageFile?: File | null;
        imageUrl?: string;
    }
) {
    const fd = new FormData();

    if (data.title !== undefined) fd.append("title", data.title);
    if (data.content !== undefined) fd.append("content", data.content);
    if (data.postType !== undefined) fd.append("postType", data.postType);

    if (data.imageFile) {
        fd.append("image", data.imageFile);
    } else if (data.imageUrl?.trim()) {
        fd.append("imageUrl", data.imageUrl.trim());
    }

    const res = await api.put(`/post/${postId}`, fd);
    return res.data;
}

export async function getPostById(postId: number) {
    const { data } = await api.get(`/post/${postId}`);
    return data as AdminPostItem;
}

export async function uploadMedia(imageFile: File) {
    const fd = new FormData();
    fd.append("image", imageFile);

    const { data } = await api.post("/media/image", fd);
    return data as { imageUrl: string; url?: string };
}