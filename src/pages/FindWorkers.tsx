import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Check, Wrench, Zap, Hammer, PaintBucket, Home, Scissors, Sparkles, Lock, Truck, Thermometer } from "lucide-react";

const FindWorkers = () => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [showLocationSearch, setShowLocationSearch] = useState(false);

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
      {/* Header */}
      <header className="w-full bg-background px-6 py-4 border-b border-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/2bd22362-5e04-465b-b40f-d5c0c26db7b9.png" 
              alt="Workers Mate" 
              className="h-10 w-auto"
            />
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-muted-foreground hover:text-foreground">Home</a>
            <a href="/find-workers" className="text-foreground font-medium">Find Workers</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Categories</a>
            <a href="/how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</a>
            <a href="/about" className="text-muted-foreground hover:text-foreground">About Us</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">For Workers</a>
          </nav>
        </div>
      </header>

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
                <Button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white">
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
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View All Workers
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWorkers;