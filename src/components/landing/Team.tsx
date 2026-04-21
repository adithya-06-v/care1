import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Priya Sharma",
    role: "Speech Pathologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80",
    bio: "8+ years experience specializing in Fluency & Stammering",
  },
  {
    name: "Dr. Anjali Verma",
    role: "Language Pathologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80",
    bio: "10+ years experience in Child Speech & Language development",
  },
  {
    name: "Dr. Rahul Mehta",
    role: "Clinical Specialist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&q=80",
    bio: "6+ years experience focusing on Accent & Intonation",
  },
  {
    name: "Dr. Arjun Reddy",
    role: "Communicative Specialist",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format&q=80",
    bio: "12+ years experience in Pronunciation & Articulation",
  },
  {
    name: "Dr. Kavita Nair",
    role: "Fluency Specialist",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&q=80",
    bio: "5+ years experience in Voice Therapy & Resonance",
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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
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
