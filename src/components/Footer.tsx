
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">
              Juliana Macedo
            </h3>
            <p className="text-white/80">
              Criadora de conteúdo, ajudando você a ter uma vida mais saudável.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/sobre" className="text-white/80 hover:text-white transition-colors">Sobre</a></li>
              <li><a href="/receitas" className="text-white/80 hover:text-white transition-colors">Receitas</a></li>
              <li><a href="/artigos" className="text-white/80 hover:text-white transition-colors">Artigos</a></li>
              <li><a href="/contato" className="text-white/80 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/julcmacedo/?hl=pt-br" className="hover:text-white/80 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://www.facebook.com/juliana.lacerdamacedo.1" className="hover:text-white/80 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://www.linkedin.com/in/juhlacerdah/" className="hover:text-white/80 transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
          <p>&copy; 2024 Juliana Macedo Vida & Sabor. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

