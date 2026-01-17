import { Card, CardContent } from "@/components/ui/card";
import { Star, Play } from "lucide-react";

const testimonials = [
  {
    name: "Maria Rodriguez",
    role: "Parent of a 7-year-old",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80",
    quote: "CareVoice transformed my son's confidence. The AI exercises made therapy feel like a game, and his speech improved dramatically within months.",
    rating: 5,
    hasVideo: true,
  },
  {
    name: "David Thompson",
    role: "Stroke Recovery Patient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    quote: "After my stroke, I struggled to speak clearly. CareVoice's personalized therapy helped me regain my voice. I'm forever grateful.",
    rating: 5,
    hasVideo: false,
  },
  {
    name: "Jennifer Park",
    role: "ESL Teacher",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
    quote: "I recommend CareVoice to all my students. The multilingual support and real-time feedback accelerate their pronunciation learning.",
    rating: 5,
    hasVideo: true,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-h2 lg:text-4xl text-foreground mb-4">
            What Our <span className="italic">Users Say</span>
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from people who transformed their speech journey with CareVoice.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="group hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-card-hover border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                {/* Video Thumbnail or Quote Icon */}
                {testimonial.hasVideo && (
                  <div className="relative mb-6 rounded-xl overflow-hidden bg-muted aspect-video">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform shadow-button">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
