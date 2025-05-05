
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-heading font-bold text-primary">
              Juliana Macedo
            </h1>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="nav-link">Início</a>
            <a href="/receitas" className="nav-link">Receitas</a>
            <a href="/artigos" className="nav-link">Artigos</a>
            <a href="/calculadoras" className="nav-link">Calculadoras</a>
            <button className="btn-primary">Login</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-100 animate-fadeIn">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="/" className="block nav-link py-2">Início</a>
              <a href="/receitas" className="block nav-link py-2">Receitas</a>
              <a href="/artigos" className="block nav-link py-2">Artigos</a>
              <a href="/calculadoras" className="block nav-link py-2">Calculadoras</a>
              <button className="btn-primary w-full">Login</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

