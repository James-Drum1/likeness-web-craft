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
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/tradesperson-signup'}
              >
                Create Your Business Profile
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/pricing'}
              >
                View Pricing Plans
              </Button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-blue-400 font-semibold line-through">€30 per month</span>
                    <span className="text-green-600 font-bold text-xl">FREE</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    🎉 Limited Time Only
                  </div>
                </div>
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
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = '/tradesperson-signup?plan=monthly'}
                >
                  Choose Monthly
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-gray-400 line-through">€300</span>
                    <span className="text-2xl font-bold text-green-600">FREE</span>
                    <span className="text-muted-foreground line-through">per year</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    🎉 Limited Time Only
                  </div>
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
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/tradesperson-signup?plan=annual'}
                >
                  Choose Annual
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Success Stories from Workers
              </h2>
              <p className="text-xl text-muted-foreground">
                Hear from professionals who've grown their business with WorkersMate
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Thomas Ryan - Plumber */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-6 leading-relaxed">
                    "Since joining WorkersMate, my plumbing business has seen a 40% increase in local clients. The platform makes it easy to showcase my work and qualifications."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground">Thomas Ryan</div>
                    <div className="text-blue-600 text-sm">Plumber</div>
                    <div className="text-muted-foreground text-sm">Dublin</div>
                  </div>
                </CardContent>
              </Card>

              {/* Sarah O'Connor - Electrician */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-6 leading-relaxed">
                    "As an electrician with 15 years of experience, I was skeptical about online platforms. WorkersMate changed my mind completely. My schedule is now fully booked months in advance."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground">Sarah O'Connor</div>
                    <div className="text-blue-600 text-sm">Electrician</div>
                    <div className="text-muted-foreground text-sm">Cork</div>
                  </div>
                </CardContent>
              </Card>

              {/* James Murphy - Carpenter */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-6 leading-relaxed">
                    "The subscription fee pays for itself within the first week. I've connected with quality clients who value craftsmanship and are willing to pay for expertise."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground">James Murphy</div>
                    <div className="text-blue-600 text-sm">Carpenter</div>
                    <div className="text-muted-foreground text-sm">Galway</div>
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