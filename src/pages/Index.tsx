import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import FeatureBadge from "@/components/FeatureBadge";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Users, Star, Wrench, Shield, Heart, Search, Calendar, CheckCircle } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden" style={{
      background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
    }}>
        {/* Stars pattern overlay */}
        <div className="absolute inset-0" style={{
        background: `var(--stars-pattern)`,
        backgroundSize: '200px 200px, 300px 300px, 150px 150px, 250px 250px, 180px 180px, 220px 220px, 160px 160px, 280px 280px'
      }}></div>
        
        {/* Background pattern/overlay */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          {/* Main heading */}
          <div className="text-center mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight max-w-4xl mx-auto">
              Connecting trusted workers with customers across Ireland
            </h1>
          </div>
          
          {/* Service Cards */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-stretch mb-20">
            <ServiceCard title="I Need a Worker" description="Find verified plumbers, electricians, builders and more in your area. Browse reviews and connect with trusted workers." buttonText="Find workers" buttonVariant="customer" onClick={() => window.location.href = '/find-workers'} />
            
            <ServiceCard title="I'm a Worker" description="Grow your business by showcasing your services, receiving job inquiries, and building your online reputation." buttonText="Join as a Worker" buttonVariant="worker" onClick={() => window.location.href = '/join-as-worker'} />
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20 flex flex-col sm:flex-row gap-8 items-center">
              <FeatureBadge text="Verified Workers" />
              <FeatureBadge text="Trusted Reviews" />
              <FeatureBadge text="Free To Use" />
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-6">
              How It Works
            </h2>
            <p className="text-base md:text-xl text-muted-foreground">
              Finding trusted workers made simple
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Search className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Search
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Enter your location and the service you need to find workers near you.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Find workers in your area
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Star className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Compare
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Browse profiles, compare reviews, and select the right worker for your job.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Browse profiles & reviews
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Calendar className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Contact
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Connect directly with your chosen worker to discuss and schedule your job.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Connect & schedule
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <CheckCircle className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Review
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                After the job is complete, share your experience to help others make informed decisions.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Leave feedback
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Our Mission Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Worker Mate was founded to connect customers with trusted local service providers in their area. Whether you're looking for a reliable plumber, painter, electrician, cleaner, or handyman — Workers Mate helps you find the right professional for the job, all in one place. We're on a mission to make hiring easier, faster, and more transparent for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="px-8 py-3" asChild>
                  <a href="/browse-workers">Find Professionals</a>
                </Button>
                <Button variant="outline" className="px-8 py-3" asChild>
                  <a href="/join-as-worker">Join as a Professional</a>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <img src="/lovable-uploads/abff52cc-4987-442c-97b2-691e4a587cbb.png" alt="About Workers Mate" className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section - Hidden on Mobile */}
      <section className="hidden md:block py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              At Workers Mate, we're guided by a set of principles that define how we operate and serve our community of customers and service professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Trust & Reliability</h3>
              <p className="text-muted-foreground">
                We verify all service professionals on our platform to ensure they meet our high standards for quality and reliability.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Community Focus</h3>
              <p className="text-muted-foreground">
                We believe in supporting local communities by connecting customers with service providers in their area.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Quality Service</h3>
              <p className="text-muted-foreground">
                We're committed to helping our users find skilled professionals who deliver excellent workmanship.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Professional Growth</h3>
              <p className="text-muted-foreground">
                We help service professionals grow their businesses through our platform, providing tools and visibility.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in honest reviews, clear pricing, and straightforward communication between all parties.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                Everything we do is aimed at ensuring a positive experience for both customers and service providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business FAQ Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
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
                We currently cover all of Ireland. You can specify your service areas when setting up your profile, and customers will be matched based on location preferences.
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
            <Button asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-8 px-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="px-6 py-2" asChild>
              <a href="/browse-workers">Find Workers</a>
            </Button>
            <Button variant="outline" className="px-6 py-2" asChild>
              <a href="/join-as-worker">Join as a Worker</a>
            </Button>
          </div>
        </div>
      </section>

      {/* For Workers Section - Moved to Bottom & Compacted */}
      <section className="py-12 md:py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-6">
              How WorkersMate Helps Grow Your Business
            </h2>
            <p className="text-base md:text-xl text-muted-foreground">
              Join thousands growing their businesses
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <CheckCircle className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Sign Up
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Register your business, add your services, location, and expertise areas.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Create your profile
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Star className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Showcase
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Upload photos of your completed projects and highlight your qualifications.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Display your work
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Calendar className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Receive Jobs
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Get notified when customers inquire about your services.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Get job inquiries
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 md:mb-6">
                <Search className="w-5 h-5 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Grow
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Collect verified reviews and build your online reputation.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Build your reputation
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;