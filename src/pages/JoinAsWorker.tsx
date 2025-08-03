import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, Star } from "lucide-react";
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
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Back to home link */}
        <div className="mb-4 md:mb-8">
          <a 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-6">
            Grow Your Business with Workers Mate
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with customers searching for your services and expand your business across Ireland.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start">
          {/* Why Join Section */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4 md:mb-8">
              Why Join Workers Mate?
            </h2>
            
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                    <Check className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
                  </div>
                  <p className="text-sm md:text-base text-foreground">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
                onClick={() => window.location.href = '/tradesperson-signup'}
              >
                Create Your Business Profile
              </Button>
              <Button 
                variant="outline" 
                className="text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
                onClick={() => window.location.href = '/pricing'}
              >
                View Pricing Plans
              </Button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-2 gap-2 md:gap-6">
            {/* Monthly Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-2 md:px-4 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pb-2 md:pb-4 pt-4 md:pt-6">
                <div className="flex flex-col items-center mb-1 md:mb-2">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 mb-1 md:mb-2">
                    <span className="text-blue-400 font-semibold line-through text-xs md:text-base">€30 per month</span>
                    <span className="text-green-600 font-bold text-sm md:text-xl">FREE</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium">
                    🎉 Limited Time Only
                  </div>
                </div>
                <CardTitle className="text-base md:text-2xl">Monthly Plan</CardTitle>
                <p className="text-muted-foreground text-xs md:text-base">
                  Flexible option with monthly billing
                </p>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  {monthlyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-3">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs md:text-sm py-2"
                  onClick={() => window.location.href = '/tradesperson-signup?plan=monthly'}
                >
                  Choose Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card>
              <CardHeader className="text-center pb-2 md:pb-4 pt-4 md:pt-6">
                <div className="flex flex-col items-center mb-1 md:mb-2">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 mb-1 md:mb-2">
                    <span className="text-xl md:text-2xl font-bold text-gray-400 line-through">€300</span>
                    <span className="text-xl md:text-2xl font-bold text-green-600">FREE</span>
                    <span className="text-muted-foreground line-through text-xs md:text-base">per year</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium">
                    🎉 Limited Time Only
                  </div>
                </div>
                <CardTitle className="text-base md:text-2xl">Annual Plan</CardTitle>
                <div className="bg-blue-100 text-blue-600 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium inline-block">
                  Best Value
                </div>
              </CardHeader>
              <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  {annualFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-3">
                      <Check className="h-3 w-3 md:h-4 md:w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-xs md:text-sm py-2"
                  onClick={() => window.location.href = '/tradesperson-signup?plan=annual'}
                >
                  Choose Annual
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="py-10 md:py-20 bg-gray-50 mt-8 md:mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-4">
                Success Stories from Workers
              </h2>
              <p className="text-base md:text-xl text-muted-foreground">
                Hear from professionals who've grown their business with WorkersMate
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 md:gap-8">
              {/* Thomas Ryan - Plumber */}
              <Card className="bg-white">
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-1 mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    "Since joining WorkersMate, my plumbing business has seen a 40% increase in local clients. The platform makes it easy to showcase my work and qualifications."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground text-sm md:text-base">Thomas Ryan</div>
                    <div className="text-blue-600 text-xs md:text-sm">Plumber</div>
                    <div className="text-muted-foreground text-xs md:text-sm">Dublin</div>
                  </div>
                </CardContent>
              </Card>

              {/* Sarah O'Connor - Electrician */}
              <Card className="bg-white">
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-1 mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    "As an electrician with 15 years of experience, I was skeptical about online platforms. WorkersMate changed my mind completely. My schedule is now fully booked months in advance."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground text-sm md:text-base">Sarah O'Connor</div>
                    <div className="text-blue-600 text-xs md:text-sm">Electrician</div>
                    <div className="text-muted-foreground text-xs md:text-sm">Cork</div>
                  </div>
                </CardContent>
              </Card>

              {/* James Murphy - Carpenter */}
              <Card className="bg-white">
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-1 mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                    "The subscription fee pays for itself within the first week. I've connected with quality clients who value craftsmanship and are willing to pay for expertise."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground text-sm md:text-base">James Murphy</div>
                    <div className="text-blue-600 text-xs md:text-sm">Carpenter</div>
                    <div className="text-muted-foreground text-xs md:text-sm">Galway</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JoinAsWorker;