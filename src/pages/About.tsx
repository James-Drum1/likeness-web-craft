import { Button } from "@/components/ui/button";
import { Check, Users, Star, Wrench, Shield, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Our Mission Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Our Mission
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Worker Mate was founded to connect customers with trusted local service providers in their area. Whether you're looking for a reliable plumber, painter, electrician, cleaner, or handyman — Workers Mate helps you find the right professional for the job, all in one place. We're on a mission to make hiring easier, faster, and more transparent for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  Find Professionals
                </Button>
                <Button variant="outline" className="px-8 py-3">
                  Join as a Professional
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/lovable-uploads/a0fbc97b-56e3-4d9d-9ba8-2f19fa20e618.png" 
                alt="About Workers Mate" 
                className="w-full max-w-md h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Core Values Section */}
      <section className="py-16 px-6 bg-white">
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
            {/* Trust & Reliability */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Trust & Reliability</h3>
              <p className="text-muted-foreground">
                We verify all service professionals on our platform to ensure they meet our high standards for quality and reliability.
              </p>
            </div>
            
            {/* Community Focus */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Community Focus</h3>
              <p className="text-muted-foreground">
                We believe in supporting local communities by connecting customers with service providers in their area.
              </p>
            </div>
            
            {/* Quality Service */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Quality Service</h3>
              <p className="text-muted-foreground">
                We're committed to helping our users find skilled professionals who deliver excellent workmanship.
              </p>
            </div>
            
            {/* Professional Growth */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Professional Growth</h3>
              <p className="text-muted-foreground">
                We help service professionals grow their businesses through our platform, providing tools and visibility.
              </p>
            </div>
            
            {/* Transparency */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in honest reviews, clear pricing, and straightforward communication between all parties.
              </p>
            </div>
            
            {/* Customer Satisfaction */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                Everything we do is aimed at ensuring a positive experience for both customers and service providers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Ready to Get Started Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Whether you're looking for a service provider or you're a worker wanting to grow your business, Workers Mate is here to help.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Find Workers
            </Button>
            <Button variant="outline" className="px-8 py-3">
              Join as a Worker
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;