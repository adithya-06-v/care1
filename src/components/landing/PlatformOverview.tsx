import { Card, CardContent } from "@/components/ui/card";
import { Target, Clock, Gamepad2 } from "lucide-react";

const features = [
  {
    icon: Target,
    stat: "98%",
    label: "Pronunciation Accuracy",
    description: "AI-driven analysis with clinical precision",
  },
  {
    icon: Clock,
    stat: "24/7",
    label: "AI Coach Available",
    description: "Practice anytime, anywhere you need",
  },
  {
    icon: Gamepad2,
    stat: "Fun & Engaging",
    label: "Gamified Learning",
    description: "Interactive exercises designed to keep kids motivated",
  },
];

const PlatformOverview = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="flex-1">
            <h2 className="text-h2 lg:text-4xl text-foreground mb-6">
              Personalized <span className="italic">AI Speech Therapy</span>
              <br />
              Tailored to Your Needs
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8 max-w-lg">
              Our advanced AI technology adapts to your unique speech patterns, 
              creating customized therapy plans that evolve with your progress. 
              Experience the future of speech therapy with real-time feedback and 
              evidence-based exercises.
            </p>

          </div>

          {/* Right Content - Feature Cards */}
          <div className="flex-1 grid gap-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.label} 
                className="group hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover border-border"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="flex items-center gap-6 p-6">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-primary">{feature.stat}</span>
                      <span className="text-sm font-medium text-foreground">{feature.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
