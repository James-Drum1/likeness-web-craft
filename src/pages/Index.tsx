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
                        radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)`
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
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg" asChild>
              <Link to="/login">Order Memorial QR Code</Link>
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold rounded-lg" onClick={() => window.location.href = '/memory/sample'}>
              View Sample Memorial
            </Button>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center items-center mb-20">
            <div className="bg-primary/10 backdrop-blur-md rounded-xl px-4 lg:px-6 py-2 lg:py-3 border border-primary/20 flex flex-col sm:flex-row gap-4 lg:gap-8 items-center">
              <FeatureBadge text="Lasting Memorials" />
              <FeatureBadge text="QR Code Access" />
              
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-lg md:text-xl">1</span>
              </div>
              <h3 className="text-base md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Order Your QR Code
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Choose from our selection of beautiful memorial plaques and order your personalized QR code memorial.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-lg md:text-xl">2</span>
              </div>
              <h3 className="text-base md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Share & Activate
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Receive your QR code and activate your digital memorial with photos, stories, and memories.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-lg md:text-xl">3</span>
              </div>
              <h3 className="text-base md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Create & Share
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Build a beautiful memorial page and share memories that will be preserved for generations.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Permanent Digital Memorials Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 pl-8 lg:pl-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Permanent Digital Memorials
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-muted-foreground">
                    Weatherproof QR codes designed to last generations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-muted-foreground">
                    Beautiful memorial pages with photos and stories
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-muted-foreground">
                    Secure hosting and unlimited access for families
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-muted-foreground">
                    Easy updates and new memories can be added
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-muted-foreground">
                    Perfect for cemeteries and all locations
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-start pl-4">
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <img src="/lovable-uploads/memorial-plaques-heart.jpeg" alt="Memorial Plaque" className="w-full h-80 object-cover rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;