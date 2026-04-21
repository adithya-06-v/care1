import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLinks } from "@/components/ui/social-links";
import { ArrowRight } from "lucide-react";

const footerLinks = {
  about: [
    { name: "Our Story", href: "#" },
    { name: "Team", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  services: [
    { name: "AI Speech Analysis", href: "#" },
    { name: "Therapy Sessions", href: "#" },
    { name: "For Children", href: "#" },
    { name: "For Adults", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "Community", href: "#" },
    { name: "Resources", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "HIPAA Compliance", href: "#" },
    { name: "Accessibility", href: "#" },
  ],
};

const socialLinks = [
  { name: "Instagram", image: "https://cdn-icons-png.flaticon.com/512/174/174855.png" },
  { name: "LinkedIn", image: "https://cdn-icons-png.flaticon.com/512/174/174857.png" },
  { name: "Twitter", image: "https://cdn-icons-png.flaticon.com/512/733/733579.png" },
  { name: "Facebook", image: "https://cdn-icons-png.flaticon.com/512/174/174848.png" },
];

const Footer = () => {
  return (
    <footer className="gradient-dark text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left - Brand & Newsletter */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary font-bold">CV</span>
              </div>
              <span className="text-2xl font-bold">CareVoice</span>
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Empowering voices through AI-driven speech therapy. 
              Join thousands who have transformed their communication journey.
            </p>
          </div>

          {/* Right - Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
