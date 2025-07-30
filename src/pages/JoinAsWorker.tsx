import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const JoinAsWorker = () => {
  const benefits = [
    "Create your professional business profile",
    "Be found by local customers actively searching for your services",
    "Receive job inquiries directly via email or phone",
    "Showcase your work with a customizable photo gallery",
    "Display verified customer reviews and ratings",
    "Track leads and manage your business growth"
  ];

  const monthlyFeatures = [
    "Business profile listing",
    "Logo & business details",
    "Photo gallery (10 photos)",
    "Contact details display",
    "Customer reviews integration"
  ];

  const annualFeatures = [
    "Business profile listing",
    "Logo & business details", 
    "Photo gallery (10 photos)",
    "Contact details display",
    "Customer reviews integration"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back to home link */}
        <div className="mb-8">
          <a 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Grow Your Business with Workers Mate
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with customers searching for your services and expand your business across Ireland.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Why Join Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Why Join Workers Mate?
            </h2>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Create Your Business Profile
              </Button>
              <Button variant="outline" size="lg">
                View Pricing Plans
              </Button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="space-y-6">
            {/* Monthly Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="text-blue-600 font-semibold mb-2">€ 30 per month</div>
                <CardTitle className="text-2xl">Monthly Plan</CardTitle>
                <p className="text-muted-foreground">
                  Flexible option with monthly billing
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {monthlyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Choose Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl font-bold">€300</span>
                  <span className="text-muted-foreground">per year</span>
                </div>
                <CardTitle className="text-2xl">Annual Plan</CardTitle>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Best Value
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {annualFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Choose Annual
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JoinAsWorker;