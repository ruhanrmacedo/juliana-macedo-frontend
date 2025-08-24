export enum PostType {
    RECEITA = "Receita",
    SAUDE = "Saúde",
    ARTIGO = "Artigo",
    ALIMENTACAO = "Alimentação",
    DICAS = "Dicas",
    NOVIDADES = "Novidades",
}

export const PostTypeSlug: Record<PostType, string> = {
    [PostType.RECEITA]: "receitas",
    [PostType.SAUDE]: "saude",
    [PostType.ARTIGO]: "artigos",
    [PostType.ALIMENTACAO]: "alimentacao",
    [PostType.DICAS]: "dicas",
    [PostType.NOVIDADES]: "novidades",
};

export function slugToPostType(slug?: string): PostType | undefined {
    if (!slug) return;
    const entry = Object.entries(PostTypeSlug).find(([, s]) => s === slug);
    return entry?.[0] as PostType | undefined;
}
