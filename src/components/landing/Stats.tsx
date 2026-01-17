import { TrendingUp, Users, Award, Heart } from "lucide-react";

const stats = [
  { icon: TrendingUp, value: "99.9%", label: "Recovery Rate" },
  { icon: Award, value: "120+", label: "Expert Therapists" },
  { icon: Users, value: "58K+", label: "Users Helped" },
  { icon: Heart, value: "92%", label: "Satisfaction Rate" },
];

const Stats = () => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          alt="Healthcare technology background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-dark opacity-90" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-h2 lg:text-4xl text-white mb-4">
            Trusted by <span className="italic">Thousands</span>
          </h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Our commitment to excellence has helped countless individuals 
            achieve their speech therapy goals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/70 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
