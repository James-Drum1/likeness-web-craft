import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Pricing = () => {
  const features = [
    "Business profile listing",
    "Logo & business details",
    "Photo gallery (10 photos)",
    "Contact details display",
    "Customer reviews integration",
    "Google Maps location",
    "Priority email support",
    "Featured listing",
    "Premium placement in search",
    "Verified business badge",
    "Lead notification alerts",
    "Custom color theme",
    "Video uploads"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="py-20 px-6" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Get started with WorkersMate today
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="border border-gray-200 rounded-lg p-8 bg-white">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h2>
                <p className="text-gray-600 mb-6">Pay monthly with flexibility to cancel anytime</p>
                <div className="flex items-baseline mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-bold text-gray-400 line-through">€30</span>
                      <span className="text-4xl font-bold text-green-600">FREE</span>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium text-center">
                      🎉 Limited Time - Testing Phase
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                Get Started
              </Button>
            </div>

            {/* Annual Plan */}
            <div className="border-2 border-blue-500 rounded-lg p-8 bg-white relative">
              <div className="absolute -top-3 right-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Annual</h2>
                <p className="text-gray-600 mb-6">Our best value option with yearly billing</p>
                <div className="flex items-baseline mb-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-bold text-gray-400 line-through">€300</span>
                      <span className="text-4xl font-bold text-green-600">FREE</span>
                    </div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium text-center">
                      🎉 Limited Time - Testing Phase
                    </div>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                Best Value
              </Button>
            </div>
          </div>

          {/* Sign in link */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;