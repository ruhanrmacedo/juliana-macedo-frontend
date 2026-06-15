import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold mb-3">
              Juliana Macedo
            </h3>

            <p className="text-white/80 leading-relaxed">
              Conteúdos sobre nutrição, saúde e bem-estar para ajudar você a
              construir uma rotina mais equilibrada.
            </p>
          </div>

          <div className="text-center md:text-right">
            <h4 className="font-heading text-lg font-bold mb-4">
              Acompanhe nas redes
            </h4>

            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://www.instagram.com/julcmacedo/?hl=pt-br"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
              >
                <Instagram size={22} />
              </a>

              <a
                href="https://www.facebook.com/juliana.lacerdamacedo.1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
              >
                <Facebook size={22} />
              </a>

              <a
                href="https://www.linkedin.com/in/juhlacerdah/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors"
              >
                <Linkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
          <p>
            &copy; 2026 Juliana Macedo Vida & Sabor. Todos os direitos
            reservados.
          </p>

          <p className="mt-2">
            Desenvolvido por{" "}
            <a
              href="https://www.linkedin.com/in/ruhan-macedo-4a25a3182/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline hover:text-white/80 transition-colors"
            >
              Ruhan Roberto Macedo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;