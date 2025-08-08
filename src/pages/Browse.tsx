import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Zap, Hammer, PaintBucket, Home, Scissors, MapPin, ArrowRight, Sparkles, Lock, Truck, Thermometer, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  workers?: number;
}

interface Location {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

const Browse = () => {
  const navigate = useNavigate();
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesData, locationsData] = await Promise.all([
        supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true }),
        supabase
          .from('locations')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true })
      ]);

      if (servicesData.data) {
        // Fetch active worker IDs once
        const { data: activeWorkers } = await supabase
          .from('worker_portfolios')
          .select('id')
          .eq('status', 'active');

        const activeIds = (activeWorkers || []).map(w => w.id);

        // Get worker counts for each service category
        const categoriesWithCounts = await Promise.all(
          servicesData.data.map(async (category) => {
            if (activeIds.length === 0) {
              return { ...category, workers: 0 };
            }

            // Count services for this category from active workers using the category field
            const { data: workersData } = await supabase
              .from('worker_services')
              .select('worker_id')
              .in('worker_id', activeIds)
              .eq('category', category.name as any);

            const uniqueWorkers = new Set((workersData || []).map(w => w.worker_id));
            return { ...category, workers: uniqueWorkers.size };
          })
        );
        setServiceCategories(categoriesWithCounts);
      }

      if (locationsData.data) {
        setLocations(locationsData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedArea && selectedArea !== 'all') params.set('location', selectedArea);
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    const query = params.toString();
    navigate(`/browse-workers${query ? `?${query}` : ''}`);
  };

  const getIconForCategory = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      'plumbing': Wrench,
      'electrical': Zap,
      'carpentry': Hammer,
      'painting': PaintBucket,
      'construction': Home,
      'landscaping': Scissors,
      'cleaning': Sparkles,
      'locksmith': Lock,
      'moving': Truck,
      'hvac': Thermometer,
    };
    return iconMap[categoryName.toLowerCase()] || Wrench;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Browse Services
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose a service category to find qualified professionals in your area
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg border border-border p-6 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Business Name Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Business name (optional)"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Category Select */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Area Select */}
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.name}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <div>
              <Button className="w-full" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Service Categories Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category) => {
              const IconComponent = getIconForCategory(category.name);
              return (
                <Card key={category.id} className="bg-white hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-sm">
                            {category.workers}+ workers
                          </span>
                          <Button 
                            variant="link" 
                            className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                            onClick={() => navigate(`/browse-workers?category=${category.name.toLowerCase()}`)}
                          >
                            Browse workers
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bottom Message */}
        <div className="text-center mt-12 py-8">
          <p className="text-muted-foreground text-lg">
            Looking for something specific? Use the search above to find exactly what you need.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;