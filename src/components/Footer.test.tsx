import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Footer from "./Footer";
import { buildWhatsAppUrl } from "@/utils/whatsapp";

describe("Footer", () => {
  it("mantém as redes existentes e substitui Facebook por WhatsApp seguro", () => {
    const html = renderToStaticMarkup(<Footer />);
    const whatsappUrl = buildWhatsAppUrl("Olá, Juliana! Conheci seu site e gostaria de saber mais sobre seu atendimento nutricional.");

    expect(html).toContain("instagram.com");
    expect(html).toContain("linkedin.com");
    expect(html).not.toContain("facebook.com");
    expect(html).toContain("Nutricionista • CRN: 10/15292");
    expect(html).toContain("© 2026 Juliana Macedo. Todos os direitos reservados.");
    expect(html).not.toContain("Juliana Macedo Vida &amp; Sabor");
    expect(html).toContain(whatsappUrl);
    expect(html).toContain('aria-label="Conversar com Juliana no WhatsApp"');
    expect(html).toMatch(/href="https:\/\/wa\.me\/5548991169041\?text=[^"]+" target="_blank" rel="noopener noreferrer"/);
  });
});
