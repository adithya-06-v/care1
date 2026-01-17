"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface Feature {
  name: string
  description: string
  included: boolean
}

interface Tier {
  name: string
  price: { monthly: number; yearly: number }
  description: string
  highlight?: boolean
  badge?: string
  features: Feature[]
  image: string
}

const tiers: Tier[] = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Free plan for basic AI speech therapy practice",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=250&fit=crop",
    features: [
      { name: "Basic Pronunciation Practice", description: "AI feedback for simple words", included: true },
      { name: "5 Daily Sessions", description: "Limited therapy exercises per day", included: true },
      { name: "Speech Accuracy Score", description: "Basic pronunciation score", included: true },
      { name: "Advanced Reports", description: "Detailed analytics", included: false },
    ],
  },
  {
    name: "Pro",
    price: { monthly: 20, yearly: 192 },
    description: "Advanced AI therapy with personalized learning",
    highlight: true,
    badge: "Recommended",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
    features: [
      { name: "Unlimited Therapy", description: "Practice without limits", included: true },
      { name: "Real-Time Correction", description: "Instant AI feedback", included: true },
      { name: "Personalized Plans", description: "Adaptive therapy exercises", included: true },
      { name: "Detailed Analytics", description: "Track improvement reports", included: true },
    ],
  },
]

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false)
  const [hoveredTier, setHoveredTier] = useState<string | null>(null)

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0">
            Pricing
          </Badge>
          <h2 className="text-h2 text-foreground mb-4">Simple Therapy Pricing</h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Accessible AI speech therapy for everyone
          </p>
          
          {/* Toggle */}
          <div className="flex justify-center mt-8 gap-2">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={`px-6 py-2.5 rounded-pill border transition-all duration-300 font-medium ${
                  (period === "Yearly") === isYearly
                    ? "bg-primary text-primary-foreground border-primary shadow-button"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {period}
                {period === "Yearly" && (
                  <span className="ml-2 text-xs opacity-80">Save 20%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
                tier.highlight 
                  ? "border-primary bg-card shadow-card-hover scale-[1.02]" 
                  : "border-border bg-card shadow-card hover:shadow-card-hover"
              }`}
              onMouseEnter={() => setHoveredTier(tier.name)}
              onMouseLeave={() => setHoveredTier(null)}
            >
              {/* Image with grayscale-to-color hover effect */}
              <div className="mb-6 overflow-hidden rounded-xl">
                <img 
                  src={tier.image} 
                  alt={`${tier.name} plan`}
                  className={`w-full h-40 object-cover transition-all duration-500 ${
                    hoveredTier === tier.name 
                      ? "grayscale-0 scale-105" 
                      : "grayscale"
                  }`}
                />
              </div>

              {/* Badge */}
              {tier.highlight && tier.badge && (
                <Badge className="mb-4 bg-primary text-primary-foreground w-fit">
                  {tier.badge}
                </Badge>
              )}

              {/* Plan Name */}
              <h3 className="text-h3 text-foreground mb-2">{tier.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl lg:text-5xl font-bold text-foreground">
                  ${isYearly ? tier.price.yearly : tier.price.monthly}
                </span>
                <span className="text-muted-foreground ml-2">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8">{tier.description}</p>

              {/* Features */}
              <div className="space-y-4 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature.name} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 ${feature.included ? "text-success" : "text-muted-foreground/50"}`}>
                      {feature.included ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <div>
                      <p className={`font-medium ${feature.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                        {feature.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                className={`mt-8 w-full rounded-pill h-12 transition-all ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground shadow-button hover:shadow-card-hover"
                    : "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
                variant={tier.highlight ? "default" : "outline"}
              >
                {tier.highlight ? "Buy Pro Plan" : "Start Free"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
