import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ParallaxDivider from "@/components/ParallaxDivider";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import heroNails from "@/assets/hero-nails.jpg";
import serviceBridal from "@/assets/service-bridal.jpg";

const Index = () => (
  <div className="min-h-screen">
    <TopBar />
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ParallaxDivider
      image={heroNails}
      alt="Luxurious manicured nails close-up"
      quote="Where every detail is an act of devotion"
      author="Estique"
    />
    <ServicesSection />
    <ParallaxDivider
      image={serviceBridal}
      alt="Elegant bridal nail art"
      height="h-48 md:h-64"
      overlay="bg-foreground/30"
    />
    <Footer />
  </div>
);

export default Index;
