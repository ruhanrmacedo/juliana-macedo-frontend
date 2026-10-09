
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NewPostModal from "@/components/NewPostModal";
import { useAuth } from "@/hooks/useAuth";
import {
  EDITORIAL_CATEGORIES,
  editorialCategoryPath,
} from "@/lib/editorialNavigation";

const publicLinkClass =
  "nav-link rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContentMenuOpen, setIsContentMenuOpen] = useState(false);
  const [isMobileContentOpen, setIsMobileContentOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const contentMenuRef = useRef<HTMLDivElement>(null);
  const contentButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const closeOnOutsideInteraction = (event: PointerEvent) => {
      if (
        contentMenuRef.current &&
        !contentMenuRef.current.contains(event.target as Node)
      ) {
        setIsContentMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideInteraction);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideInteraction);
  }, []);

  const closePublicNavigation = () => {
    setIsContentMenuOpen(false);
    setIsMobileContentOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    closePublicNavigation();
    navigate("/");
  };

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed top-0 z-50 w-full bg-white shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            onClick={closePublicNavigation}
            className="flex items-center space-x-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <h1 className="font-heading text-xl font-bold text-primary">
              Juliana Macedo
            </h1>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className={publicLinkClass}>
              Início
            </Link>

            <div
              ref={contentMenuRef}
              className="relative"
              onKeyDown={(event) => {
                if (event.key === "Escape" && isContentMenuOpen) {
                  event.preventDefault();
                  setIsContentMenuOpen(false);
                  contentButtonRef.current?.focus();
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsContentMenuOpen(false);
                }
              }}
            >
              <button
                ref={contentButtonRef}
                type="button"
                aria-expanded={isContentMenuOpen}
                aria-controls="desktop-content-menu"
                className={`${publicLinkClass} flex items-center gap-1`}
                onClick={() => setIsContentMenuOpen((open) => !open)}
              >
                Conteúdos
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform ${isContentMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isContentMenuOpen && (
                <div
                  id="desktop-content-menu"
                  aria-label="Conteúdos"
                  className="absolute left-0 mt-2 w-64 overflow-hidden rounded-lg border border-gray-100 bg-white py-2 shadow-lg"
                >
                  <Link
                    to="/conteudos"
                    onClick={() => setIsContentMenuOpen(false)}
                    className="block px-4 py-2 font-medium text-primary hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
                  >
                    Todos os conteúdos
                  </Link>
                  {EDITORIAL_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      to={editorialCategoryPath(category.slug)}
                      onClick={() => setIsContentMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <Link
                      to="/receitas"
                      onClick={() => setIsContentMenuOpen(false)}
                      className="block px-4 py-2 font-medium text-primary hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none"
                    >
                      Receitas
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" className={publicLinkClass}>
              Blog
            </Link>
            <Link to="/#ferramentas" className={publicLinkClass}>
              Ferramentas
            </Link>

            {!loading && isAuthenticated && user?.role === "admin" && (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/patients")}
                  className="rounded-md border border-primary px-3 py-1.5 text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Pacientes
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/posts")}
                  className="rounded-md border border-primary px-3 py-1.5 text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Gerenciar Posts
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(true)}
                  className="rounded-md bg-primary px-3 py-1.5 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Novo Post
                </button>
              </>
            )}

            {loading ? null : isAuthenticated && user?.name ? (
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                  className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                >
                  {user.name}
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 rounded border bg-white shadow-md"
                  >
                    <Link
                      role="menuitem"
                      to="/perfil"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none"
                    >
                      Perfil
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          <button
            ref={mobileMenuButtonRef}
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="rounded-sm p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-navigation"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closePublicNavigation();
                mobileMenuButtonRef.current?.focus();
              }
            }}
            className="absolute left-0 top-16 z-50 w-full animate-fadeIn border-t border-gray-100 bg-white md:hidden"
          >
            <div className="container mx-auto space-y-2 px-4 py-4">
              <Link
                to="/"
                className={`block py-2 ${publicLinkClass}`}
                onClick={closePublicNavigation}
              >
                Início
              </Link>

              <button
                type="button"
                aria-expanded={isMobileContentOpen}
                aria-controls="mobile-content-menu"
                className={`flex w-full items-center justify-between py-2 text-left ${publicLinkClass}`}
                onClick={() => setIsMobileContentOpen((open) => !open)}
              >
                Conteúdos
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`transition-transform ${isMobileContentOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isMobileContentOpen && (
                <div
                  id="mobile-content-menu"
                  className="space-y-1 border-l-2 border-primary/20 pl-4"
                >
                  <Link
                    to="/conteudos"
                    className={`block py-2 ${publicLinkClass}`}
                    onClick={closePublicNavigation}
                  >
                    Todos os conteúdos
                  </Link>
                  {EDITORIAL_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      to={editorialCategoryPath(category.slug)}
                      className={`block py-2 text-sm ${publicLinkClass}`}
                      onClick={closePublicNavigation}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    to="/receitas"
                    className={`block py-2 font-medium ${publicLinkClass}`}
                    onClick={closePublicNavigation}
                  >
                    Receitas
                  </Link>
                </div>
              )}

              <Link
                to="/blog"
                className={`block py-2 ${publicLinkClass}`}
                onClick={closePublicNavigation}
              >
                Blog
              </Link>
              <Link
                to="/#ferramentas"
                className={`block py-2 ${publicLinkClass}`}
                onClick={closePublicNavigation}
              >
                Ferramentas
              </Link>

              {isAuthenticated && user?.role === "admin" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closePublicNavigation();
                      navigate("/patients");
                    }}
                    className="w-full py-2 text-left nav-link hover:bg-gray-100"
                  >
                    Pacientes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePublicNavigation();
                      setShowNewPost(true);
                    }}
                    className="w-full py-2 text-left nav-link hover:bg-gray-100"
                  >
                    Novo Post
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePublicNavigation();
                      navigate("/admin/posts");
                    }}
                    className="w-full py-2 text-left nav-link hover:bg-gray-100"
                  >
                    Gerenciar Posts
                  </button>
                </>
              )}

              {isAuthenticated && (
                <Link
                  to="/perfil"
                  className={`block py-2 ${publicLinkClass}`}
                  onClick={closePublicNavigation}
                >
                  Perfil
                </Link>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="btn-primary block w-full"
                  onClick={closePublicNavigation}
                >
                  Login
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 text-left nav-link hover:bg-gray-100"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {showNewPost && (
        <NewPostModal
          open={showNewPost}
          onClose={() => setShowNewPost(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
