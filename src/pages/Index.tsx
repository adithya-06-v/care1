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
import { AnimeNavBar } from "@/components/ui/anime-navbar";
import { Briefcase, FileText, CreditCard, HelpCircle } from "lucide-react";

const navItems = [
  { name: "Services", url: "#services", icon: Briefcase },
  { name: "How It Works", url: "#how-it-works", icon: FileText },
  { name: "Pricing", url: "#pricing", icon: CreditCard },
  { name: "FAQ", url: "#faq", icon: HelpCircle },
];

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
        <Testimonials />
      </main>
      <Footer />
      <AnimeNavBar items={navItems} defaultActive="Services" />
    </div>
  );
};

export default Index;
