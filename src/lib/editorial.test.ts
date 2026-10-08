import { describe, expect, it } from "vitest";
import { canonicalPostPath } from "./posts";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
});
