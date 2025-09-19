import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import FeatureBadge from "@/components/FeatureBadge";
import Footer from "@/components/Footer";
import FeaturedWorkers from "@/components/FeaturedWorkers";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Users, Star, Wrench, Shield, Heart, Search, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  return <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Light background with soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Soft pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            background: `radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)`,
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          {/* Main heading */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
              <span className="text-primary">Honor Their Memory</span>
              <br />
              <span className="text-foreground">Forever</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create beautiful, lasting digital memorials with physical QR codes. Share stories, photos, and memories that will be preserved for generations.
            </p>
          </div>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg"
              asChild
            >
              <Link to="/login">Order Memorial QR Code</Link>
            </Button>
            <Button 
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold rounded-lg"
              onClick={() => window.location.href = '/memory/sample'}
            >
              View Sample Memorial
            </Button>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center mb-20">
            <div className="bg-primary/10 backdrop-blur-md rounded-xl px-4 lg:px-6 py-2 lg:py-3 border border-primary/20 flex flex-col sm:flex-row gap-4 lg:gap-8 items-center">
              <FeatureBadge text="Lasting Memorials" />
              <FeatureBadge text="QR Code Access" />
              <FeatureBadge text="Forever Preserved" />
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Order Your QR Code
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from our selection of beautiful memorial plaques with engraved or printed QR codes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Scan & Activate
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When you receive your plaque, scan the QR code and create your account to claim your memorial page.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Create & Share
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Build a beautiful memorial with photos, stories, and memories. Share the QR code with family and friends.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Permanent Digital Memorials Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-12">
            Permanent Digital Memorials
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Lifetime Hosting</h3>
                <p className="text-muted-foreground">No recurring fees. Your memorial stays online forever.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Easy to Update</h3>
                <p className="text-muted-foreground">Add new photos, stories, and memories anytime.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Privacy Controls</h3>
                <p className="text-muted-foreground">Choose who can view and contribute to the memorial.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1"></div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Mobile Optimized</h3>
                <p className="text-muted-foreground">Perfect viewing experience on all devices.</p>
              </div>
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
              <Link to="/login">Contact Support</Link>
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
              <Link to="/login">Create Memorial</Link>
            </Button>
            <Button variant="outline" className="px-6 py-2" asChild>
              <Link to="/memory/sample">View Sample</Link>
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