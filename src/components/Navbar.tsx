
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewPostModal from "@/components/NewPostModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

            {/* Botão Novo Post - só admin */}
            {!loading && isAuthenticated && user?.role === "admin" && (
              <button
                onClick={() => setShowNewPost(true)}
                className="px-3 py-1.5 rounded-md bg-primary text-white hover:opacity-90 transition"
              >
                Novo Post
              </button>
            )}

            {loading ? null : (
              isAuthenticated && user?.name ? (
                <div className="relative">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user.name} <ChevronDown size={18} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-md border rounded">
                      <Link to="/perfil" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                      <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary">Login</Link>
              )
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-100 animate-fadeIn z-50">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a href="/" className="block nav-link py-2">Início</a>
              <a href="/receitas" className="block nav-link py-2">Receitas</a>
              <a href="/artigos" className="block nav-link py-2">Artigos</a>
              <a href="/calculadoras" className="block nav-link py-2">Calculadoras</a>

              {/* Novo Post no mobile */}
              {isAuthenticated && user?.role === "admin" && (
                <button
                  onClick={() => { setIsMenuOpen(false); setShowNewPost(true); }}
                  className="w-full text-left nav-link py-2 hover:bg-gray-100"
                >
                  Novo Post
                </button>
              )}

              {isAuthenticated && <a href="/perfil" className="block nav-link py-2">Perfil</a>}
              {!isAuthenticated ? (
                <Link to="/login" className="btn-primary w-full">Login</Link>
              ) : (
                <button onClick={handleLogout} className="w-full text-left nav-link py-2 hover:bg-gray-100">Logout</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Novo Post */}
      {showNewPost && (
        <NewPostModal open={showNewPost} onClose={() => setShowNewPost(false)} />
      )}
    </nav>
  );
};

export default Navbar;