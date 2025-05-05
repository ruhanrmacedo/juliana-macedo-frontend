
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import RecentPosts from "@/components/RecentPosts";
import Calculadoras from "@/components/Calculadoras";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <HeroCarousel />
        
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
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

