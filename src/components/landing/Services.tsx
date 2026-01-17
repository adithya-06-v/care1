import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mic2, Volume2, Brain, Video } from "lucide-react";

const services = [
  {
    icon: Mic2,
    title: "AI Speech Analysis",
    description: "Advanced algorithms analyze your speech patterns to identify areas for improvement with clinical precision.",
  },
  {
    icon: Volume2,
    title: "Pronunciation Correction",
    description: "Real-time feedback on pronunciation with visual and audio guides to perfect your articulation.",
  },
  {
    icon: Brain,
    title: "Adaptive Therapy Exercises",
    description: "Personalized exercises that adapt to your progress, ensuring optimal learning outcomes.",
  },
  {
    icon: Video,
    title: "Remote Therapy Access",
    description: "Connect with certified speech therapists from anywhere through secure video sessions.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-h2 lg:text-4xl text-foreground mb-4">
            Our Core <span className="italic">Services</span>
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive speech therapy solutions powered by cutting-edge AI technology 
            and backed by certified professionals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-card-hover border-border bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-h3 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
