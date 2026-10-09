export type EditorialCategoryLink = {
  name: string;
  slug: string;
};

// Slugs definidos em CreateEditorialContentFoundation no backend.
// /post/postspaginated filtra category pelo slug; /post/taxonomy retorna as ativas.
export const EDITORIAL_CATEGORIES: EditorialCategoryLink[] = [
  { name: "Alimentação", slug: "alimentacao" },
  { name: "Saúde", slug: "saude" },
  { name: "Comportamento alimentar", slug: "comportamento-alimentar" },
  { name: "Saúde mental", slug: "saude-mental" },
  { name: "Rotina", slug: "rotina" },
];

export function editorialCategoryPath(slug: string) {
  return `/conteudos?category=${encodeURIComponent(slug)}`;
}

export function findEditorialCategory(slug?: string | null) {
  return EDITORIAL_CATEGORIES.find((category) => category.slug === slug);
}

export function resolveEditorialCategory(kind: string, slug?: string | null) {
  return kind === "conteudos" ? findEditorialCategory(slug) : undefined;
}
