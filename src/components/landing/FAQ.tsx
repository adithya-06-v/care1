import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does AI-powered speech therapy work?",
    answer: "Our AI technology analyzes your speech patterns in real-time using advanced voice recognition algorithms. It identifies areas for improvement and provides instant, personalized feedback to help you practice more effectively. The AI adapts to your progress, adjusting exercises to ensure optimal learning outcomes.",
  },
  {
    question: "Is CareVoice suitable for children?",
    answer: "Absolutely! CareVoice is designed for users of all ages, including children. Our platform features engaging, age-appropriate exercises and games that make speech therapy fun and effective. Parents can track progress and work alongside their children during sessions.",
  },
  {
    question: "How accurate is the speech analysis?",
    answer: "Our AI achieves 98% accuracy in speech pattern recognition, validated through clinical studies with leading speech pathologists. The technology is continuously improved based on the latest research and user feedback to ensure the highest quality analysis.",
  },
  {
    question: "Can I connect with human therapists?",
    answer: "Yes! While our AI provides 24/7 practice support, you can also schedule video sessions with our certified speech-language pathologists. This hybrid approach combines the convenience of AI with the expertise of human professionals for comprehensive care.",
  },
  {
    question: "Is my data private and secure?",
    answer: "Your privacy is our top priority. All voice data is encrypted using industry-standard protocols and stored securely. We are HIPAA compliant and never share your personal information with third parties. You can request data deletion at any time.",
  },
];

const FAQ = () => {
  return (
    <section id="resources" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14">
            <h2 className="text-h2 lg:text-4xl text-foreground mb-4">
              Frequently Asked <span className="italic">Questions</span>
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Everything you need to know about CareVoice and AI-powered speech therapy.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 shadow-card data-[state=open]:shadow-card-hover transition-shadow"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
