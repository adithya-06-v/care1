import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Gamepad2, Clock, ShieldCheck } from "lucide-react";

const floatingFeatures = [
  { icon: Gamepad2, label: "Gamified Learning" },
  { icon: Clock, label: "Real-time Feedback" },
  { icon: ShieldCheck, label: "Certified Professionals" },
];

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative gradient-hero overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Mic className="w-3 h-3 mr-1" />
              AI-Powered Speech Therapy
            </Badge>
            
            <h1 className="text-4xl lg:text-display text-white mb-6 leading-tight">
              Your Trusted{" "}
              <span className="italic font-medium">AI-Powered</span>
              <br />
              Speech Therapy Partner
            </h1>
            
            <p className="text-lg lg:text-body-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Transform your speech journey with personalized AI therapy designed for children, 
              adults, and caregivers. Evidence-based, accessible, and available 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button 
                size="lg" 
                className="rounded-pill px-8 py-6 text-lg bg-white text-primary hover:bg-white/90 shadow-button"
                onClick={() => navigate('/auth')}
              >
                Start Your Voice Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-pill px-8 py-6 text-lg border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Floating Feature Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {floatingFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-pill px-4 py-2 text-white/90 text-sm"
                >
                  <feature.icon className="w-4 h-4" />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Main image container */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                  alt="Friendly speech therapist smiling"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Decorative audio waveform */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white rounded-pill px-6 py-3 shadow-card z-20">
                <div className="flex items-end gap-1 h-6">
                  {[40, 70, 50, 85, 60, 75, 45, 80, 55].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-pulse"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1s'
                      }}
                    />
                  ))}
                </div>
                <span className="ml-3 text-sm font-medium text-foreground">Voice Analysis Active</span>
              </div>

              {/* Floating stat card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-card z-20 hidden lg:block">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-xs text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
