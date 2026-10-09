import { describe, expect, it } from "vitest";
import { canonicalPostPath, getEditorialListingFilters } from "./posts";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EDITORIAL_CATEGORIES, editorialCategoryPath, resolveEditorialCategory } from "./editorialNavigation";
import { getErrorMessage } from "./errors";
import { AxiosError, AxiosHeaders } from "axios";
import { getListingViewState } from "./listingState";
import { composeHeroSlides } from "./heroSlides";

describe("Conteúdo 2.0", () => {
  it("gera rotas canônicas por canal e formato", () => {
    expect(canonicalPostPath({ slug: "reflexao", channel: "BLOG", format: "ARTICLE" })).toBe("/blog/reflexao");
    expect(canonicalPostPath({ slug: "receita", channel: "CONTENT", format: "RECIPE" })).toBe("/receitas/receita");
    expect(canonicalPostPath({ slug: "artigo", channel: "CONTENT", format: "ARTICLE" })).toBe("/conteudos/artigo");
  });
  it("mantém rotas públicas e compatibilidade legada", () => {
    const app = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");
    ["/conteudos", "/conteudos/:slug", "/blog", "/blog/:slug", "/receitas", "/receitas/:slug", "/posts/:id"].forEach(route => expect(app).toContain(route));
  });
  it("usa excerpt e canonicalPath na Home sem voltar ao conteúdo truncado", () => {
    const recent = readFileSync(resolve(process.cwd(), "src/components/RecentPosts.tsx"), "utf8");
    const hero = readFileSync(resolve(process.cwd(), "src/components/HeroCarousel.tsx"), "utf8");
    expect(recent).toContain("post.canonicalPath");
    expect(hero).toContain("post.canonicalPath");
    expect(recent).not.toContain("/posts/${post.id}");
  });

  it("isola filtros por seção e suporta filtro de categoria em conteúdos", () => {
    expect(getEditorialListingFilters("blog")).toEqual({ channel: "BLOG" });
    expect(getEditorialListingFilters("receitas")).toEqual({
      channel: "CONTENT",
      format: "RECIPE",
    });
    expect(getEditorialListingFilters("conteudos")).toEqual({
      channel: "CONTENT",
      format: "ARTICLE",
    });
    expect(getEditorialListingFilters("conteudos", "alimentacao")).toEqual({
      channel: "CONTENT",
      format: "ARTICLE",
      category: "alimentacao",
    });
    expect(getEditorialListingFilters("blog", "alimentacao")).toEqual({
      channel: "BLOG",
    });
  });

  it("computa estados de listagem sem mascarar erro como lista vazia", () => {
    expect(getListingViewState({ loading: true, error: "", itemCount: 0 })).toBe("loading");
    expect(
      getListingViewState({
        loading: false,
        error: "Falha de rede",
        itemCount: 0,
      }),
    ).toBe("error");
    expect(getListingViewState({ loading: false, error: "", itemCount: 0 })).toBe("empty");
    expect(getListingViewState({ loading: false, error: "", itemCount: 2 })).toBe("success");
  });

  it("mantém a Navbar pública apontando apenas para rotas e âncoras reais", () => {
    const navbar = readFileSync(resolve(process.cwd(), "src/components/Navbar.tsx"), "utf8");
    expect(navbar).toContain('to="/"');
    expect(navbar).toContain('to="/conteudos"');
    expect(navbar).toContain('to="/blog"');
    expect(navbar).toContain('to="/receitas"');
    expect(navbar).toContain('to="/#ferramentas"');
    const contentDropdown = navbar.slice(navbar.indexOf('ref={contentMenuRef}'), navbar.indexOf('to="/blog"'));
    expect(contentDropdown).not.toContain('role="menu');
    expect(contentDropdown).not.toContain('aria-haspopup="menu"');
    expect(contentDropdown).toContain('event.key === "Escape"');
    expect(contentDropdown).toContain('contentButtonRef.current?.focus()');
    expect(navbar).toContain("aria-expanded=");
    expect(navbar).not.toContain('to="/juliana"');
    expect(navbar).not.toContain('to="/atendimento"');
    expect(navbar).not.toContain('to="/agendar"');
    EDITORIAL_CATEGORIES.forEach((category) => {
      expect(editorialCategoryPath(category.slug)).toBe(
        `/conteudos?category=${encodeURIComponent(category.slug)}`,
      );
    });
  });

  it("preserva a âncora de ferramentas fora do componente de calculadoras", () => {
    const index = readFileSync(resolve(process.cwd(), "src/pages/Index.tsx"), "utf8");
    const calculadoras = readFileSync(resolve(process.cwd(), "src/components/Calculadoras.tsx"), "utf8");
    expect(index).toContain('id="ferramentas"');
    expect(index).toContain("<Calculadoras />");
    expect(calculadoras).not.toContain('id="ferramentas"');
  });

  it("restringe categorias conhecidas à seção de conteúdos", () => {
    expect(resolveEditorialCategory("conteudos", "saude")?.name).toBe("Saúde");
    expect(resolveEditorialCategory("conteudos", "inexistente")).toBeUndefined();
    expect(resolveEditorialCategory("conteudos", "")).toBeUndefined();
    expect(resolveEditorialCategory("blog", "saude")).toBeUndefined();
    expect(resolveEditorialCategory("receitas", "saude")).toBeUndefined();
  });

  it("usa mensagens alternativas sem quebrar chamadas existentes ou ocultar erros da API", () => {
    const fallback = "Não foi possível carregar as publicações.";
    expect(getErrorMessage(new Error("Falha original"))).toBe("Falha original");
    expect(getErrorMessage(null)).toBe("Erro desconhecido.");
    expect(getErrorMessage(null, fallback)).toBe(fallback);
    expect(getErrorMessage(new AxiosError("Network Error"), fallback)).toBe(fallback);
    const apiError = new AxiosError("Request failed");
    apiError.response = {
      data: { message: "Serviço indisponível" },
      status: 503,
      statusText: "Service Unavailable",
      headers: {},
      config: { headers: new AxiosHeaders() },
    };
    expect(getErrorMessage(apiError, fallback)).toBe("Serviço indisponível");
  });

  it("prepara a arquitetura do Hero preservando os posts atuais quando não há slide institucional ativo", () => {
    const samplePosts = [
      {
        id: 2,
        title: "Pão Caseiro",
        excerpt: "Receita",
        canonicalPath: "/receitas/pao-caseiro",
      },
      {
        id: 3,
        title: "Guia Alimentar",
        excerpt: "Artigo",
        canonicalPath: "/conteudos/guia-alimentar",
      },
    ];

    const currentSlides = composeHeroSlides(samplePosts);
    expect(currentSlides).toHaveLength(2);
    expect(currentSlides.map((slide) => slide.kind)).toEqual(["post", "post"]);

    const preparedSlides = composeHeroSlides(samplePosts, [
      {
        kind: "institutional",
        id: "institutional-juliana",
        title: "Juliana Lacerda Macedo",
        credential: "Nutricionista • CRN-10 15292",
        message:
          "Nutrição além do prato: alimentação, comportamento e saúde mental caminhando juntos.",
        imageUrl: "https://example.com/juliana.jpg",
        imageAlt: "Foto profissional da nutricionista Juliana Macedo",
        primaryAction: { label: "Conhecer trabalho", to: "/conteudos" },
      },
    ]);

    expect(preparedSlides).toHaveLength(3);
    expect(preparedSlides[0].kind).toBe("institutional");
    expect(preparedSlides.slice(1).map((slide) => slide.kind)).toEqual([
      "post",
      "post",
    ]);
  });
});
