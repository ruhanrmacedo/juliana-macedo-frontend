import api from "@/lib/api";

export const getPaginatedPosts = async (page = 1, limit = 6) => {
    const res = await api.get("/post/postspaginated", {
        params: {
            page: Number(page),
            limit: Number(limit),
        },
    });
    return res.data;
};

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
        fd.append("image", data.imageFile); // TEM que ser "image"
    } else if (data.imageUrl?.trim()) {
        fd.append("imageUrl", data.imageUrl.trim());
    }
    const res = await api.post("/post", fd); // o interceptor já coloca o Bearer
    return res.data; // deve retornar o post criado (com id)
}
