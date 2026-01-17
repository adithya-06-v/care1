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
  { name: "Instagram", image: "https://link-hover-lndev.vercel.app/instagram.png" },
  { name: "LinkedIn", image: "https://link-hover-lndev.vercel.app/linkedin.png" },
  { name: "Twitter", image: "https://link-hover-lndev.vercel.app/x.png" },
  { name: "Facebook", image: "https://link-hover-lndev.vercel.app/facebook.png" },
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
            
            {/* Social Links with hover effect */}
            <div className="mb-8">
              <SocialLinks socials={socialLinks} className="gap-3" />
            </div>
            
            {/* Newsletter */}
            <div>
              <p className="font-semibold mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-pill"
                />
                <Button className="rounded-pill px-6 bg-white text-primary hover:bg-white/90">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
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

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © 2024 CareVoice. All rights reserved.
          </p>
          
          {/* Bottom Social Links - text style matching top */}
          <SocialLinks socials={socialLinks} className="gap-4" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
