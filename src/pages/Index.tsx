import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import FeatureBadge from "@/components/FeatureBadge";
import Footer from "@/components/Footer";
import FeaturedWorkers from "@/components/FeaturedWorkers";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Users, Star, Wrench, Shield, Heart, Search, Calendar, CheckCircle } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Desktop background */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-primary to-primary/80" style={{
          background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
        }}>
          {/* Stars pattern overlay for desktop */}
          <div className="absolute inset-0" style={{
            background: `var(--stars-pattern)`,
            backgroundSize: '200px 200px, 300px 300px, 150px 150px, 250px 250px, 180px 180px, 220px 220px, 160px 160px, 280px 280px'
          }}></div>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
        
        {/* Mobile background - image on top, blue gradient on bottom */}
        <div className="md:hidden absolute inset-0">
          {/* Top half with image */}
          <div className="absolute top-0 left-0 right-0 h-1/2">
            <img 
              src="/lovable-uploads/1c0c92f7-cdee-45dc-a1f5-1a31fffc9188.png" 
              alt="Worker with van"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          {/* Bottom half with yellow gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-br from-primary to-primary/80" style={{
            background: "var(--hero-background)"
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          {/* Main heading */}
          <div className="text-center mb-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight max-w-4xl mx-auto drop-shadow-lg">
              Connecting storytellers with readers through meaningful narratives
            </h1>
          </div>
          
          {/* Service Cards - Side by side on mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 justify-center mb-20 max-w-5xl mx-auto">
            <div className="bg-secondary/95 backdrop-blur-sm rounded-xl p-6 lg:p-8 shadow-xl border border-primary/20 text-center flex flex-col h-full">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-3 lg:mb-4">I Want Stories</h2>
              <p className="text-sm lg:text-base text-muted-foreground mb-5 lg:mb-6 leading-relaxed hidden lg:block flex-grow">
                Discover powerful narratives, read inspiring stories, and connect with storytellers who share meaningful experiences.
              </p>
              <p className="text-sm text-muted-foreground mb-4 lg:hidden flex-grow">
                Discover meaningful stories
              </p>
              <Button 
                className="w-full h-11 lg:h-12 text-sm lg:text-base font-semibold mt-auto" 
                onClick={() => window.location.href = '/find-workers'}
              >
                Explore Stories
              </Button>
            </div>
            
            <div className="bg-secondary/95 backdrop-blur-sm rounded-xl p-6 lg:p-8 shadow-xl border border-primary/20 text-center flex flex-col h-full">
              <h2 className="text-xl lg:text-2xl font-bold text-primary mb-3 lg:mb-4">I'm a Storyteller</h2>
              <p className="text-sm lg:text-base text-muted-foreground mb-5 lg:mb-6 leading-relaxed hidden lg:block flex-grow">
                Share your stories with the world, connect with readers, and build a community around your narratives.
              </p>
              <p className="text-sm text-muted-foreground mb-4 lg:hidden flex-grow">
                Share your stories
              </p>
              <Button 
                className="w-full h-11 lg:h-12 text-sm lg:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center whitespace-nowrap mt-auto" 
                onClick={() => window.location.href = '/join-as-worker'}
              >
                Join as Storyteller
              </Button>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center mb-20">
            <div className="bg-primary/20 backdrop-blur-md rounded-xl px-4 lg:px-6 py-2 lg:py-3 border border-primary/30 flex flex-col sm:flex-row gap-4 lg:gap-8 items-center">
              <FeatureBadge text="Verified Storytellers" />
              <FeatureBadge text="Authentic Stories" />
              <FeatureBadge text="Free To Use" />
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-8 md:py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-16">
            <h2 className="text-xl md:text-4xl font-bold text-foreground mb-2 md:mb-6">
              How It Works
            </h2>
            <p className="text-sm md:text-xl text-muted-foreground">
              Discovering meaningful stories made simple
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-10 h-10 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 md:mb-6">
                <Search className="w-4 h-4 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-xs md:text-xl font-semibold text-foreground mb-1 md:mb-4">
                Search
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Browse through our collection of stories by genre, theme, or storyteller to find what resonates with you.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Browse stories by theme
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-10 h-10 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 md:mb-6">
                <Star className="w-4 h-4 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-xs md:text-xl font-semibold text-foreground mb-1 md:mb-4">
                Compare
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Read stories, explore different perspectives, and discover narratives that inspire and move you.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Read & discover stories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-10 h-10 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 md:mb-6">
                <Calendar className="w-4 h-4 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-xs md:text-xl font-semibold text-foreground mb-1 md:mb-4">
                Contact
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Connect with storytellers, leave comments, and engage with the community around shared experiences.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Connect & engage
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-10 h-10 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-2 md:mb-6">
                <CheckCircle className="w-4 h-4 md:w-8 md:h-8 text-primary" />
              </div>
              <h3 className="text-xs md:text-xl font-semibold text-foreground mb-1 md:mb-4">
                Review
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-relaxed hidden md:block">
                Share your thoughts on stories you've read and help others discover meaningful narratives.
              </p>
              <p className="text-xs text-muted-foreground leading-tight md:hidden">
                Share your thoughts
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
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Heart of Stories was founded to connect readers with meaningful narratives and storytellers from around the world. Whether you're seeking inspiration, entertainment, personal growth, or simply a good story — Heart of Stories helps you discover authentic narratives that resonate with your heart. We're on a mission to make storytelling more accessible, diverse, and impactful for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="px-8 py-3" asChild>
                  <a href="/browse-workers">Discover Stories</a>
                </Button>
                <Button variant="outline" className="px-8 py-3" asChild>
                  <a href="/join-as-worker">Join as a Storyteller</a>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <img src="/lovable-uploads/abff52cc-4987-442c-97b2-691e4a587cbb.png" alt="About Heart of Stories" className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg" />
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
              At Heart of Stories, we're guided by a set of principles that define how we operate and serve our community of readers and storytellers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Authenticity & Truth</h3>
              <p className="text-muted-foreground">
                We curate genuine stories from real people to ensure authentic narratives that resonate with truth and honesty.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Community Connection</h3>
              <p className="text-muted-foreground">
                We believe in connecting people through shared experiences and building bridges between diverse communities through storytelling.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Quality Narratives</h3>
              <p className="text-muted-foreground">
                We're committed to featuring well-crafted stories that inspire, educate, and touch the hearts of our readers.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Storyteller Growth</h3>
              <p className="text-muted-foreground">
                We help storytellers reach wider audiences and develop their craft through our platform, providing tools and community support.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in honest storytelling, clear content guidelines, and open communication between readers and storytellers.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Reader Satisfaction</h3>
              <p className="text-muted-foreground">
                Everything we do is aimed at ensuring a meaningful experience for both readers and storytellers in our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workers Section */}
      <FeaturedWorkers 
        limit={6} 
        showTitle={true} 
        showViewAll={true}
        className="bg-muted/30"
      />

      {/* Business FAQ Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                How do I share my stories on Heart of Stories?
              </AccordionTrigger>
              <AccordionContent>
                You can start sharing your stories by clicking "Join as a Storyteller" and creating your profile. You'll need to provide some background about yourself and can begin submitting your narratives for review.
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
                How do payments work?
              </AccordionTrigger>
              <AccordionContent>
                Payments are handled directly between you and the customer. We provide a secure messaging platform for you to discuss project details and pricing. You maintain full control over your rates and payment terms.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                How are businesses verified?
              </AccordionTrigger>
              <AccordionContent>
                We have a thorough verification process that includes checking business registration, insurance documents, qualifications, and conducting reference checks. This ensures customers can trust the quality of businesses on our platform.
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