import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Speech Pathologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "20+ years experience in pediatric speech therapy",
  },
  {
    name: "Dr. Michael Torres",
    role: "Language Pathologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Specialist in adult speech rehabilitation",
  },
  {
    name: "Dr. Emily Nakamura",
    role: "AI Research Lead",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Pioneer in AI-driven speech recognition",
  },
  {
    name: "Dr. James Wilson",
    role: "Clinical Director",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&h=400&q=80",
    bio: "Board-certified speech-language pathologist",
  },
];

const Team = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-h2 lg:text-4xl text-foreground mb-4">
            Meet Our <span className="italic">Experts</span>
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Our team of certified speech therapists and AI specialists work together 
            to deliver the best care for your needs.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.name}
              className="group overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-card-hover border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Social Links on Hover */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-accent transition-colors">
                    <Linkedin className="w-4 h-4 text-primary" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-accent transition-colors">
                    <Twitter className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
              <CardContent className="p-5 text-center">
                <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
