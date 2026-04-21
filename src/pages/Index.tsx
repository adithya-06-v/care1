import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PlatformOverview from "@/components/landing/PlatformOverview";
import Services from "@/components/landing/Services";
import Stats from "@/components/landing/Stats";
import Team from "@/components/landing/Team";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <PlatformOverview />
        <Services />
        <Stats />
        <Team />
        <Pricing />
        <FAQ />
          </main>
      <Footer />
    </div>
  );
};

export default Index;
