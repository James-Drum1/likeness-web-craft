import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Our Mission Section */}
      <section className="py-16 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Our Mission
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Worker Mate was founded to connect customers with trusted local tradespeople and service providers in their area. Whether you're looking for a reliable plumber, painter, electrician, cleaner, or handyman — Workers Mate helps you find the right professional for the job, all in one place. We're on a mission to make hiring easier, faster, and more transparent for everyone.
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
              <div className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;