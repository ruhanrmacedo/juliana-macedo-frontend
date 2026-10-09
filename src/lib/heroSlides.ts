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
