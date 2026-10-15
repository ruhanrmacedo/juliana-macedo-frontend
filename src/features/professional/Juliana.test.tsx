import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Juliana from "@/pages/Juliana";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import { professionalPreview } from "./profilePreview";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false, isAuthenticated: false, logout: vi.fn() }),
}));

function renderPage() {
  return renderToStaticMarkup(<StaticRouter location="/juliana"><Juliana /></StaticRouter>);
}

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("Fase 3C — página profissional pública e isolada", () => {
  it("registra uma rota pública e mantém o menu desktop e móvel", () => {
    const app = source("src/App.tsx");
    expect(app).toContain('<Route path="/juliana" element={<Juliana />} />');
    expect(app.indexOf('path="/juliana"')).toBeLessThan(app.indexOf('<Route element={<RequireRole'));
    expect(source("src/components/Navbar.tsx").match(/to="\/juliana"/g)).toHaveLength(2);
    expect(renderPage()).toContain('aria-current="page"');
  });

  it("renderiza um único título principal e todas as seções", () => {
    const html = renderPage();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('id="juliana-title"');
    expect(html).toContain("Nutricionista");
    expect(html).toContain("Uma nutrição que vai além do prato.");
    expect(html).toContain("Recursos Humanos");
    expect(html).toContain("pós-graduação em Saúde Mental");
    for (const id of ["historia", "trajetoria", "abordagem", "servicos", "perguntas", "contato"]) {
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`href="#${id}"`);
      expect(html).toContain(`id="${id}-title"`);
    }
  });

  it("usa somente fotografias locais", () => {
    const html = renderPage();
    const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image[1]).toMatch(/^\/images\/juliana\/.+\.(png|jpg)$/);
      expect(readFileSync(resolve(process.cwd(), `public${image[1]}`)).byteLength).toBeGreaterThan(0);
    }
  });

  it("não inventa credenciais, preços ou agenda e usa o WhatsApp autorizado", () => {
    const html = renderPage();
    expect(professionalPreview.contacts).toBeNull();
    expect(professionalPreview).not.toHaveProperty("crn");
    for (const service of professionalPreview.services) {
      expect(service.bookingEnabled).toBe(false);
      expect(service.price.amount).toBeNull();
      expect(service.price.visibility).toBe("HIDDEN");
    }
    expect(html).not.toMatch(/R\$|CRN[-\s]*\d|mailto:|tel:/);
    for (const service of professionalPreview.services) {
      expect(html).toContain(buildWhatsAppUrl(service.whatsappMessage));
    }
    expect(html).toContain(buildWhatsAppUrl("Olá, Juliana! Conheci seu site e gostaria de saber mais sobre seu atendimento nutricional."));
    expect(html).not.toContain("Contato em breve");
    expect(html).not.toContain("<form");
    expect(html).toContain("Consulta nutricional presencial");
    expect(html).toContain("Para agendamentos e informações sobre valores, entre em contato pelo WhatsApp.");
  });

  it("mantém o FAQ acessível", () => {
    const html = renderPage();
    expect(html).toContain('aria-describedby="faq-preview-note"');
    expect(html).toContain('aria-expanded="false"');
    for (const faq of professionalPreview.faqs) {
      expect(html).toContain(faq.question);
      expect(faq.answer.length).toBeGreaterThan(0);
    }
    expect(source("src/pages/Juliana.tsx")).toContain('<Accordion type="single" collapsible');
  });

  it("oferece skip link, foco, layouts responsivos e redução de movimento", () => {
    const html = renderPage();
    expect(html).toContain('href="#juliana-main"');
    expect(html).toContain('id="juliana-main" tabindex="-1"');
    const css = source("src/pages/Juliana.css");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("não importa cliente API, faz fetch ou interpreta HTML remoto", () => {
    for (const path of ["src/pages/Juliana.tsx", "src/features/professional/profilePreview.ts"]) {
      const text = source(path);
      expect(text).not.toMatch(/\bfetch\s*\(|\baxios\b|from ["'].*\/api["']|dangerouslySetInnerHTML/);
      expect(text).not.toMatch(/api\.(get|post|patch|put|delete)\(/);
    }
  });
});
