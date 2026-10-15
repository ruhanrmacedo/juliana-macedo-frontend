import { ArrowDown, ArrowUpRight, Leaf, MapPin, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { professionalPreview, type ProfessionalPageContent } from "@/features/professional/profilePreview";
import { usePageSeo } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/utils/whatsapp";
import "./Juliana.css";

const sections = [
  ["historia", "Minha história"],
  ["trajetoria", "Trajetória"],
  ["abordagem", "Minha abordagem"],
  ["servicos", "Serviços"],
  ["perguntas", "Perguntas frequentes"],
  ["contato", "Contato"],
] as const;

/** Página exclusivamente visual: a fonte é local; nenhum efeito busca dados. */
export default function Juliana({ content = professionalPreview }: { content?: ProfessionalPageContent }) {
  usePageSeo({
    title: "Juliana Macedo — Nutricionista",
    description: "Conheça Juliana Macedo, nutricionista: escuta, cuidado, respeito e equilíbrio para uma alimentação que conversa com a vida.",
    canonical: "/juliana",
    type: "website",
  });

  return (
    <div className="juliana-page">
      <a className="jp-skip" href="#juliana-main">Pular para o conteúdo</a>
      <Navbar />
      <main id="juliana-main" tabIndex={-1} className="jp-main">
        <div className="jp-container jp-preview-bar">
          <span className="jp-breadcrumb"><Link to="/">Início</Link><span aria-hidden="true">/</span>Juliana Macedo</span>
        </div>

        <section className="jp-container jp-hero" aria-labelledby="juliana-title">
          <div className="jp-hero-copy jp-enter">
            <p className="jp-eyebrow"><Leaf size={17} aria-hidden="true" />Nutricionista</p>
            <h1 id="juliana-title" className="jp-display">{content.displayName.split(" ")[0]}<br /><em>{content.displayName.split(" ").slice(1).join(" ")}</em><span className="jp-title-dot" aria-hidden="true">.</span></h1>
            <p className="jp-hero-headline">{content.headline}</p>
            <p className="jp-hero-intro">{content.institutionalPhrase}</p>
            <div className="jp-hero-actions">
              <a className="jp-button" href="#trajetoria">Conheça minha trajetória<ArrowDown size={17} aria-hidden="true" /></a>
              <a className="jp-text-link" href="#servicos">Como funciona a consulta<ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
          <figure className="jp-portrait jp-enter">
            <div className="jp-portrait-frame">
              <img src="/images/juliana/juliana-hero.png" width={600} height={760} alt="Juliana Macedo, nutricionista." loading="eager" />
            </div>
            <figcaption>Juliana Macedo <span>Nutricionista</span></figcaption>
          </figure>
        </section>

        <nav className="jp-section-nav" aria-label="Seções da página profissional">
          <div className="jp-container jp-section-links">
            {sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </div>
        </nav>

        <section id="historia" className="jp-container jp-section jp-story" aria-labelledby="historia-title">
          <div className="jp-section-heading"><p className="jp-eyebrow">01 / Raízes</p><h2 id="historia-title" className="jp-heading">Minha história</h2></div>
          <div className="jp-story-layout">
            <div className="jp-story-copy">
              <p className="jp-serif-lead">Muito além do prato,<br /><em>uma história para contar.</em></p>
              {content.introduction.map((paragraph) => <p key={paragraph} className="jp-body">{paragraph}</p>)}
            </div>
            <figure className="jp-story-image">
              <img src="/images/juliana/livros-trajetoria.jpg" width={800} height={650} loading="lazy" alt="Livros de nutrição, saúde mental, recursos humanos e comunicação sobre uma mesa." />
              <figcaption>Referências que acompanham o cuidado.<span>Nutrição, saúde mental, comunicação e pessoas.</span></figcaption>
            </figure>
          </div>
        </section>

        <section id="trajetoria" className="jp-trajectory" aria-labelledby="trajetoria-title">
          <div className="jp-container jp-section jp-trajectory-layout">
            <div><p className="jp-eyebrow">02 / Caminhos</p><h2 id="trajetoria-title" className="jp-heading">Trajetória<br />e propósito</h2><p className="jp-body jp-trajectory-intro">O que aprendemos pelo caminho também transforma a maneira de cuidar.</p><Leaf className="jp-large-leaf" size={70} strokeWidth={.8} aria-hidden="true" /></div>
            <div className="jp-timeline">
              <article><span className="jp-timeline-number" aria-hidden="true">01</span><div><h3>Escuta e respeito pelas pessoas</h3><p className="jp-body">{content.professionalJourney}</p></div></article>
              <article><span className="jp-timeline-number" aria-hidden="true">02</span><div><h3>Da gestão de pessoas à Nutrição</h3><p className="jp-body">{content.education}</p></div></article>
              <article><span className="jp-timeline-number" aria-hidden="true">03</span><div><h3>Ciência, acolhimento e individualidade</h3><p className="jp-body">{content.carePhilosophy}</p></div></article>
            </div>
          </div>
        </section>

        <section id="abordagem" className="jp-container jp-section" aria-labelledby="abordagem-title">
          <div className="jp-approach-layout">
            <div><p className="jp-eyebrow">03 / Um olhar para você</p><h2 id="abordagem-title" className="jp-heading">Minha abordagem</h2><p className="jp-body jp-approach-intro">Uma abordagem que une ciência, reeducação alimentar e respeito à individualidade, sem promessas milagrosas ou terrorismo nutricional.</p>
              <div className="jp-principles">
                <article><span aria-hidden="true">01</span><div><h3>Ciência com individualidade.</h3><p>A orientação nutricional parte de evidências e considera história, preferências e contexto.</p></div></article>
                <article><span aria-hidden="true">02</span><div><h3>Reeducação para a vida real.</h3><p>Comportamento alimentar, emoções, cultura e rotina fazem parte do cuidado.</p></div></article>
                <article><span aria-hidden="true">03</span><div><h3>Mudanças possíveis e sustentáveis.</h3><p>Sem culpa ou perfeição: o processo respeita o tempo e as possibilidades de cada pessoa.</p></div></article>
              </div>
            </div>
            <aside className="jp-manifesto" aria-label="Mensagem institucional">
              <Leaf size={38} strokeWidth={1} aria-hidden="true" />
              <p className="jp-manifesto-quote">Uma relação mais consciente, equilibrada e possível com a alimentação.</p>
              <div className="jp-manifesto-rule" /><p>Com acolhimento, ciência e respeito.<br />Sem culpa ou terrorismo nutricional.</p>
            </aside>
          </div>
        </section>

        <section id="servicos" className="jp-services-section" aria-labelledby="servicos-title">
          <div className="jp-container jp-section">
            <div className="jp-section-heading jp-heading-inline"><div><p className="jp-eyebrow">04 / Possibilidades de cuidado</p><h2 id="servicos-title" className="jp-heading">Serviços</h2></div><p className="jp-body">Para agendamentos e informações sobre valores, entre em contato pelo WhatsApp.</p></div>
            <div className="jp-services">
              {content.services.map((service, index) => {
                const Icon = service.modality === "ONLINE" ? Monitor : MapPin;
                return <article className={`jp-service ${service.featured ? "jp-service--featured" : ""}`} key={service.id}>
                  <div className="jp-service-top"><Icon size={26} strokeWidth={1.3} aria-hidden="true" /><span className="jp-eyebrow">0{index + 1}</span></div>
                  <p className="jp-modality">{service.modality === "ONLINE" ? "Consulta online" : "Consulta presencial"}</p>
                  <h3>{service.name}</h3><p className="jp-body">{service.description}</p>
                  <a className="jp-button jp-service-whatsapp" href={buildWhatsAppUrl(service.whatsappMessage)} target="_blank" rel="noopener noreferrer">Conversar no WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="perguntas" className="jp-container jp-section jp-faq-layout" aria-labelledby="perguntas-title">
          <div><p className="jp-eyebrow">05 / Vamos conversar?</p><h2 id="perguntas-title" className="jp-heading">Perguntas<br />frequentes</h2><p id="faq-preview-note" className="jp-body">Informações objetivas para orientar os próximos passos.</p></div>
          <Accordion type="single" collapsible className="jp-accordion" aria-describedby="faq-preview-note">
            {content.faqs.map((faq, index) => <AccordionItem key={faq.id} value={faq.id} className="jp-faq-item"><AccordionTrigger className="jp-faq-trigger"><span className="jp-faq-question"><span className="jp-faq-number" aria-hidden="true">0{index + 1}</span>{faq.question}</span></AccordionTrigger><AccordionContent className="jp-faq-answer">{faq.answer}</AccordionContent></AccordionItem>)}
          </Accordion>
        </section>

        <section id="contato" className="jp-container jp-contact-section" aria-labelledby="contato-title">
          <div className="jp-contact"><Leaf size={30} strokeWidth={1} aria-hidden="true" /><p className="jp-eyebrow">06 / Um próximo encontro</p><h2 id="contato-title" className="jp-heading">Boas conversas<br />abrem novos caminhos.</h2><p>Quer saber mais sobre o atendimento nutricional?<br />Vamos conversar.</p><div className="jp-contact-actions"><a className="jp-button" href={buildWhatsAppUrl("Olá, Juliana! Conheci seu site e gostaria de saber mais sobre seu atendimento nutricional.")} target="_blank" rel="noopener noreferrer">Conversar com Juliana no WhatsApp<ArrowUpRight size={17} aria-hidden="true" /></a><Link to="/conteudos" className="jp-text-link">Explore os conteúdos<ArrowUpRight size={17} aria-hidden="true" /></Link></div><p id="contact-status" className="jp-small-note">O contato é iniciado pelo WhatsApp; não há agendamento automático por esta página.</p></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
