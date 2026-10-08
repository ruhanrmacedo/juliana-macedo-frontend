import { useEffect } from "react";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.appendChild(element); }
  element.content = content;
}
export function usePageSeo(input: { title: string; description: string; canonical: string; image?: string | null; type?: string; jsonLd?: unknown }) {
  useEffect(() => {
    const base = window.location.origin;
    document.title = input.title;
    setMeta('meta[name="description"]', "name", "description", input.description);
    setMeta('meta[property="og:title"]', "property", "og:title", input.title);
    setMeta('meta[property="og:description"]', "property", "og:description", input.description);
    setMeta('meta[property="og:type"]', "property", "og:type", input.type || "article");
    setMeta('meta[property="og:url"]', "property", "og:url", `${base}${input.canonical}`);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", input.image ? "summary_large_image" : "summary");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", input.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", input.description);
    if (input.image) { setMeta('meta[property="og:image"]', "property", "og:image", input.image); setMeta('meta[name="twitter:image"]', "name", "twitter:image", input.image); }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${base}${input.canonical}`;
    const old = document.getElementById("page-json-ld"); old?.remove();
    if (input.jsonLd) { const script = document.createElement("script"); script.id = "page-json-ld"; script.type = "application/ld+json"; script.text = JSON.stringify(input.jsonLd); document.head.appendChild(script); }
  }, [input.title, input.description, input.canonical, input.image, input.type, input.jsonLd]);
}
