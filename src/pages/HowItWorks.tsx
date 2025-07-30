import { Search, Star, Calendar, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search for a Worker",
      description: "Enter your location and the service you need to find workers near you."
    },
    {
      icon: Star,
      title: "Compare and Choose",
      description: "Browse profiles, compare reviews, and select the right worker for your job."
    },
    {
      icon: Calendar,
      title: "Contact and Schedule",
      description: "Connect directly with your chosen worker to discuss and schedule your job."
    },
    {
      icon: CheckCircle,
      title: "Leave a Review",
      description: "After the job is complete, share your experience to help others make informed decisions."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="py-20 px-6"
        style={{
          background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(180, 60%, 45%))"
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How WorkersMate Works
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Discover how easy it is to find trusted workers or grow your business with WorkersMate
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Finding and booking trusted workers is quick and easy with WorkersMate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* For Workers Section */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How WorkersMate Helps Grow Your Business
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of workers already growing their businesses through our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sign Up and Create Your Profile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Register your business, add your services, location, and expertise areas.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Showcase Your Work
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload photos of your completed projects and highlight your qualifications.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Receive Job Inquiries
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get notified when customers inquire about your services.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Grow Your Business
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Collect verified reviews and build your online reputation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HowItWorks;