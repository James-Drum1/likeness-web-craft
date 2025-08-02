import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Search, Check, Wrench, Zap, Hammer, PaintBucket, Home, Scissors, Sparkles, Lock, Truck, Thermometer, Star, Calendar, CheckCircle } from "lucide-react";

const FindWorkers = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  const handleSearch = () => {
    // Build search parameters
    const params = new URLSearchParams();
    
    if (category && category !== "all-categories") {
      // Map display names to database values
      const categoryMap: { [key: string]: string } = {
        "plumber": "plumbing",
        "electrician": "electrical", 
        "carpenter": "carpentry",
        "painter": "painting",
        "roofer": "roofing",
        "builder": "building",
        "gardener": "gardening",
        "cleaner": "cleaning",
        "locksmith": "locksmith"
      };
      
      const dbCategory = categoryMap[category] || category;
      params.set('category', dbCategory);
    }
    
    if (location && location !== "all-areas") {
      // Convert location values to display names
      const locationMap: { [key: string]: string } = {
        "dublin": "Dublin",
        "cork": "Cork", 
        "galway": "Galway",
        "limerick": "Limerick",
        "waterford": "Waterford"
      };
      
      const locationName = locationMap[location] || location;
      params.set('location', locationName);
    }
    
    // Navigate to browse workers with filters
    const queryString = params.toString();
    navigate(`/browse-workers${queryString ? `?${queryString}` : ''}`);
  };

  const tradeCategories = [
    "All Categories",
    "Plumber", 
    "Electrician",
    "Carpenter",
    "Painter", 
    "Roofer",
    "Builder",
    "Gardener",
    "Cleaner",
    "Locksmith"
  ];

  const popularCategories = [
    { name: "Plumbers", icon: Wrench },
    { name: "Electricians", icon: Zap },
    { name: "Carpenters", icon: Hammer },
    { name: "Painters", icon: PaintBucket },
    { name: "Builders", icon: Home },
    { name: "Gardeners", icon: Scissors },
    { name: "Cleaners", icon: Sparkles },
    { name: "Locksmiths", icon: Lock },
    { name: "Movers", icon: Truck },
    { name: "HVAC", icon: Thermometer }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div 
        className="min-h-[80vh] bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20">
          {/* Main heading */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Find Trusted Trade Professionals
              <br />
              In Your Area
            </h1>
            <p className="text-xl text-white/90 mb-12">
              Connect with verified plumbers, electricians, builders and more across Ireland
            </p>
          </div>
          
          {/* Search Form */}
          <div className="bg-white rounded-xl p-6 shadow-2xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Location
                </label>
                <Select onValueChange={setLocation}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <SelectValue placeholder="Select area" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input 
                        placeholder="Search locations..."
                        className="mb-2"
                      />
                    </div>
                    <SelectItem value="all-areas">All Areas</SelectItem>
                    <SelectItem value="dublin">Dublin</SelectItem>
                    <SelectItem value="cork">Cork</SelectItem>
                    <SelectItem value="galway">Galway</SelectItem>
                    <SelectItem value="limerick">Limerick</SelectItem>
                    <SelectItem value="waterford">Waterford</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trade Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trade Category
                </label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradeCategories.map((trade) => (
                      <SelectItem key={trade} value={trade.toLowerCase().replace(' ', '-')}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button 
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Trades
                </Button>
              </div>
            </div>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Trusted Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="bg-green-500 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span>Free To Use</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Service Categories Section */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Popular Service Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Find verified professionals for any job, big or small. Browse our popular categories or search for 
              exactly what you need.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {popularCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div 
                  key={category.name}
                  className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => {
                    const categoryMap: { [key: string]: string } = {
                      "Plumbers": "plumbing",
                      "Electricians": "electrical", 
                      "Carpenters": "carpentry",
                      "Painters": "painting",
                      "Builders": "building",
                      "Gardeners": "gardening",
                      "Cleaners": "cleaning",
                      "Locksmiths": "locksmith"
                    };
                    
                    const dbCategory = categoryMap[category.name];
                    if (dbCategory) {
                      navigate(`/browse-workers?category=${dbCategory}`);
                    } else {
                      navigate('/browse-workers');
                    }
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 rounded-full p-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {category.name}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* View All Categories Button */}
          <div className="text-center">
            <Button 
              variant="outline" 
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/browse-workers')}
            >
              View All Categories
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Workers Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Featured Workers
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These highly-rated businesses have been verified and reviewed by customers like you.
            </p>
          </div>

          {/* Placeholder for when no workers are available */}
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-xl p-12 max-w-2xl mx-auto">
              <div className="text-gray-400 mb-4">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-3">
                No Featured Workers Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Featured workers will show up here once they join our platform. Check back soon to see verified professionals in your area!
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/browse-workers')}
              >
                View All Workers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Finding and booking trusted workers is quick and easy with WorkersMate
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-6">
                  <Search className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Search for a Worker
              </h3>
              <p className="text-muted-foreground">
                Enter your location and the service you need to find workers near you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-6">
                  <Star className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Compare and Choose
              </h3>
              <p className="text-muted-foreground">
                Browse profiles, compare reviews, and select the right worker for your job.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-6">
                  <Calendar className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Contact and Schedule
              </h3>
              <p className="text-muted-foreground">
                Connect directly with your chosen worker to discuss and schedule your job.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-6">
                  <CheckCircle className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Leave a Review
              </h3>
              <p className="text-muted-foreground">
                After the job is complete, share your experience to help others make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What Customers Say About Us Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What Customers Say About Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it — hear from customers who've found their perfect worker through WorkersMate.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-6">
                "WorkersMate made finding a reliable plumber so easy! I was able to compare different professionals and read genuine reviews before making my choice."
              </p>
              <div>
                <p className="font-semibold text-foreground">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Dublin</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-6">
                "After struggling to find a trustworthy builder, WorkersMate helped me connect with a local professional who did a fantastic job on our extension. Highly recommend!"
              </p>
              <div>
                <p className="font-semibold text-foreground">Emma Thompson</p>
                <p className="text-sm text-muted-foreground">Cork</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-6">
                "The quality of workers on this platform is exceptional. I've hired both an electrician and a gardener through WorkersMate and both exceeded my expectations."
              </p>
              <div>
                <p className="font-semibold text-foreground">David O'Brien</p>
                <p className="text-sm text-muted-foreground">Galway</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FindWorkers;