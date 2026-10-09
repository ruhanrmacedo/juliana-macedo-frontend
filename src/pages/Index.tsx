
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import RecentPosts from "@/components/RecentPosts";
import Calculadoras from "@/components/Calculadoras";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (location.hash !== "#ferramentas") return;
    const target = document.getElementById("ferramentas");
    if (!target) return;

    // Reposiciona enquanto o Hero carrega, até o usuário assumir a navegação.
    let frame = 0;
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    };
    const observer = new ResizeObserver(scroll);
    if (mainRef.current) observer.observe(mainRef.current);
    const stop = () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    scroll();
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("pointerdown", stop);
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [location.hash, location.key]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main ref={mainRef} className="flex-1 pt-16">
        <HeroCarousel />
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div id="ferramentas" className="lg:col-span-1 scroll-mt-24">
              <div className="space-y-6">
                <Calculadoras />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <RecentPosts />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
