import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedWorkers from "@/components/FeaturedWorkers";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Search, Check, Wrench, Zap, Hammer, PaintBucket, Home, Scissors, Sparkles, Lock, Truck, Thermometer, Star, Calendar, CheckCircle } from "lucide-react";
interface Location {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}
interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}
const FindWorkers = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load locations and services from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const [locationsResponse, servicesResponse] = await Promise.all([supabase.from('locations').select('*').eq('is_active', true).order('name', {
          ascending: true
        }), supabase.from('service_categories').select('*').eq('is_active', true).order('name', {
          ascending: true
        })]);
        setLocations(locationsResponse.data || []);
        setServiceCategories(servicesResponse.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const handleSearch = () => {
    // Build search parameters
    const params = new URLSearchParams();
    if (category && category !== "all-categories") {
      params.set('category', category);
    }
    if (location && location !== "all-areas") {
      params.set('location', location);
    }

    // Navigate to browse workers with filters
    const queryString = params.toString();
    navigate(`/browse-workers${queryString ? `?${queryString}` : ''}`);
  };

  // Icon mapping for service categories
  const getServiceIcon = (serviceName: string) => {
    const iconMap: {
      [key: string]: any;
    } = {
      'plumbing': Wrench,
      'electrical': Zap,
      'carpentry': Hammer,
      'painting': PaintBucket,
      'roofing': Home,
      'cleaning': Sparkles,
      'gardening': Scissors,
      'handyman': Lock,
      'moving': Truck,
      'hvac': Thermometer
    };
    return iconMap[serviceName.toLowerCase()] || Wrench;
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading services and locations...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="min-h-[80vh] relative overflow-hidden">
        {/* Desktop background with professional worker image */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" style={{
            background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
          }}>
            {/* Top half with worker image */}
            <div className="absolute top-0 left-0 right-0 h-1/2">
              <img 
                src="/lovable-uploads/137ebcff-dc9c-4a2b-9e5c-35b4b05023b3.png" 
                alt="Professional service worker with van"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            {/* Bottom half with blue gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-br from-blue-600 to-blue-800" style={{
              background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
            }}></div>
          </div>
        </div>
        
        {/* Mobile background - simplified blue gradient */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" style={{
        background: "linear-gradient(135deg, hsl(231, 60%, 45%), hsl(231, 60%, 35%))"
      }}>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20">
          {/* Main heading */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Find Trusted Service Professionals
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>In Your Area
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-8 md:mb-12">
              Connect with verified service providers across Ireland
            </p>
          </div>
          
          {/* Search Form - Compact on mobile */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-2xl mb-6 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {/* Location Dropdown */}
              <div className="relative">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Your Location
                </label>
                <Select onValueChange={setLocation}>
                  <SelectTrigger className="w-full h-9 md:h-10">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                      <SelectValue placeholder="Select area" />
                    </div>
                  </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all-areas">All Areas</SelectItem>
                     {locations.map(loc => <SelectItem key={loc.id} value={loc.name}>
                         {loc.name}
                       </SelectItem>)}
                   </SelectContent>
                 </Select>
               </div>

               {/* Service Category Dropdown */}
               <div>
                 <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                   Service Category
                 </label>
                 <Select onValueChange={setCategory}>
                   <SelectTrigger className="w-full h-9 md:h-10">
                     <SelectValue placeholder="Select a service" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all-categories">All Categories</SelectItem>
                     {serviceCategories.map(service => <SelectItem key={service.id} value={service.name}>
                         {service.name.charAt(0).toUpperCase() + service.name.slice(1)}
                       </SelectItem>)}
                   </SelectContent>
                 </Select>
               </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full h-9 md:h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base" onClick={handleSearch}>
                  <Search className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Search Services</span>
                  <span className="sm:hidden">Search</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Feature badges - Compact on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
            <div className="flex items-center gap-2 text-white text-sm md:text-base">
              <div className="bg-green-500 rounded-full p-0.5 md:p-1">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2 text-white text-sm md:text-base">
              <div className="bg-green-500 rounded-full p-0.5 md:p-1">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <span>Trusted Reviews</span>
            </div>
            <div className="flex items-center gap-2 text-white text-sm md:text-base">
              <div className="bg-green-500 rounded-full p-0.5 md:p-1">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />
              </div>
              <span>Free To Use</span>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Service Categories Section */}
      <div className="bg-gray-50 py-10 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
              Popular Service Categories
            </h2>
            
          </div>

          {/* Categories Grid - showing first 8 service categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            {serviceCategories.slice(0, 8).map(service => {
            const IconComponent = getServiceIcon(service.name);
            return <div key={service.id} className="bg-white rounded-lg p-4 md:p-8 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-200" onClick={() => {
              navigate(`/browse-workers?category=${service.name}`);
            }}>
                  <div className="flex justify-center mb-2 md:mb-4">
                    <div className="bg-blue-100 rounded-full p-2 md:p-4">
                      <IconComponent className="h-4 w-4 md:h-8 md:w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground capitalize">
                    {service.name}
                  </h3>
                  {service.description && <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2 hidden md:block">
                      {service.description}
                    </p>}
                </div>;
          })}
          </div>

          {/* View All Categories Button */}
          <div className="text-center">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-sm md:text-base px-4 md:px-6 py-2" onClick={() => navigate('/browse-workers')}>
              View All Categories
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Workers Section */}
      <FeaturedWorkers 
        limit={8} 
        showTitle={true} 
        showViewAll={true}
        className="bg-background"
      />

      {/* How It Works Section */}
      <div className="bg-gray-50 py-10 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
              How It Works
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              Finding and booking trusted workers is quick and easy with WorkersMate
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-3 md:mb-6">
                <div className="bg-blue-100 rounded-full p-3 md:p-6">
                  <Search className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Search for a Worker
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-tight md:leading-relaxed">
                Enter your location and the service you need to find workers near you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-3 md:mb-6">
                <div className="bg-blue-100 rounded-full p-3 md:p-6">
                  <Star className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Compare and Choose
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-tight md:leading-relaxed">
                Browse profiles, compare reviews, and select the right worker for your job.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-3 md:mb-6">
                <div className="bg-blue-100 rounded-full p-3 md:p-6">
                  <Calendar className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Contact and Schedule
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-tight md:leading-relaxed">
                Connect directly with your chosen worker to discuss and schedule your job.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="flex justify-center mb-3 md:mb-6">
                <div className="bg-blue-100 rounded-full p-3 md:p-6">
                  <CheckCircle className="h-6 w-6 md:h-10 md:w-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-4">
                Leave a Review
              </h3>
              <p className="text-xs md:text-base text-muted-foreground leading-tight md:leading-relaxed">
                After the job is complete, share your experience to help others make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What Customers Say About Us Section */}
      <div className="py-10 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
              What Customers Say About Us
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it — hear from customers who've found their perfect worker through WorkersMate.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg border border-gray-100">
              <div className="flex mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 md:h-5 md:w-5 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-xs md:text-base text-muted-foreground italic mb-4 md:mb-6 leading-tight md:leading-relaxed">
                "WorkersMate made finding a reliable plumber so easy! I was able to compare different professionals and read genuine reviews before making my choice."
              </p>
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground">Sarah Johnson</p>
                <p className="text-xs md:text-sm text-muted-foreground">Dublin</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg border border-gray-100">
              <div className="flex mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 md:h-5 md:w-5 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-xs md:text-base text-muted-foreground italic mb-4 md:mb-6 leading-tight md:leading-relaxed">
                "After struggling to find a trustworthy builder, WorkersMate helped me connect with a local professional who did a fantastic job on our extension. Highly recommend!"
              </p>
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground">Emma Thompson</p>
                <p className="text-xs md:text-sm text-muted-foreground">Cork</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg border border-gray-100">
              <div className="flex mb-3 md:mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 md:h-5 md:w-5 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-xs md:text-base text-muted-foreground italic mb-4 md:mb-6 leading-tight md:leading-relaxed">
                "The quality of workers on this platform is exceptional. I've hired both an electrician and a gardener through WorkersMate and both exceeded my expectations."
              </p>
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground">David O'Brien</p>
                <p className="text-xs md:text-sm text-muted-foreground">Galway</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default FindWorkers;