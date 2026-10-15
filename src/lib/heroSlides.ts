export type EditorialHeroPost = {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  canonicalPath: string;
};

export type InstitutionalHeroSlide = {
  kind: "institutional";
  id: string;
  title: string;
  credential: string;
  message: string;
  supportingMessage?: string;
  imageUrl: string;
  imageAlt: string;
  primaryAction: {
    label: string;
    to: string;
  };
  secondaryAction?: {
    label: string;
    to: string;
  };
};

export type PostHeroSlide = {
  kind: "post";
  id: string;
  post: EditorialHeroPost;
};

export type HeroSlide = InstitutionalHeroSlide | PostHeroSlide;

export const JULIANA_PROFESSIONAL_SLIDE: InstitutionalHeroSlide = {
  kind: "institutional",
  id: "juliana-professional",
  title: "Conheça Juliana Macedo",
  credential: "Nutricionista • CRN: 10/15292",
  message:
    "Uma trajetória que une formação em Nutrição, pós-graduação em Saúde Mental, experiência hospitalar e conhecimento sobre comportamento alimentar.",
  supportingMessage:
    "Uma abordagem baseada na ciência, no acolhimento e no respeito à individualidade.",
  imageUrl: "/images/juliana/juliana-hero.png",
  imageAlt: "Juliana Macedo, nutricionista.",
  primaryAction: {
    label: "Conheça minha trajetória",
    to: "/juliana",
  },
};

export function composeHeroSlides(
  posts: EditorialHeroPost[],
  institutionalSlides: InstitutionalHeroSlide[] = [],
): HeroSlide[] {
  return [
    ...institutionalSlides,
    ...posts.map((post) => ({
      kind: "post" as const,
      id: `post-${post.id}`,
      post,
    })),
  ];
}
