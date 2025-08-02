import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BusinessFaq = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Business FAQ
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about joining WorkersMate as a business
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                How do I register my business on WorkersMate?
              </AccordionTrigger>
              <AccordionContent>
                You can register your business by clicking "Join as a Worker" and selecting the business option. You'll need to provide your business registration details, insurance information, and examples of your work.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                What are the requirements to join as a business?
              </AccordionTrigger>
              <AccordionContent>
                To join as a business, you need: valid business registration, public liability insurance, proof of qualifications for your service category, references from previous clients, and a portfolio of completed work.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                How much does it cost to list my business?
              </AccordionTrigger>
              <AccordionContent>
                We offer flexible pricing plans starting from basic listings to premium featured placements. Check our Pricing page for detailed information about our plans and what's included in each tier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                How do I receive job requests?
              </AccordionTrigger>
              <AccordionContent>
                Once your profile is approved, customers can find you through search and send job requests directly through the platform. You'll receive notifications via email and through your dashboard when new requests come in.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                What areas do you cover?
              </AccordionTrigger>
              <AccordionContent>
                We currently cover all of Ireland and the UK. You can specify your service areas when setting up your profile, and customers will be matched based on location preferences.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                How do payments work?
              </AccordionTrigger>
              <AccordionContent>
                Payments are handled directly between you and the customer. We provide a secure messaging platform for you to discuss project details and pricing. You maintain full control over your rates and payment terms.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                Can I update my business profile?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can update your business profile at any time through your dashboard. This includes adding new services, updating your portfolio, changing your service areas, and modifying your contact information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                What support do you provide for businesses?
              </AccordionTrigger>
              <AccordionContent>
                We provide dedicated business support including profile optimization advice, help with customer communication, technical support, and guidance on best practices for winning more jobs through our platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-left">
                How are businesses verified?
              </AccordionTrigger>
              <AccordionContent>
                We have a thorough verification process that includes checking business registration, insurance documents, qualifications, and conducting reference checks. This ensures customers can trust the quality of businesses on our platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-left">
                Can I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel your subscription at any time through your account settings. Your profile will remain active until the end of your current billing period, and you won't be charged for the following period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessFaq;