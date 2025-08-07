import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Zap, Hammer, PaintBucket, Home, Scissors, MapPin, ArrowRight, Sparkles, Lock, Truck, Thermometer } from "lucide-react";
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
        // Get worker counts for each service category
        const categoriesWithCounts = await Promise.all(
          servicesData.data.map(async (category) => {
            // Get active worker IDs
            const { data: activeWorkers } = await supabase
              .from('worker_portfolios')
              .select('id')
              .eq('status', 'active');
            
            if (!activeWorkers) {
              return {
                ...category,
                workers: 0
              };
            }

            // Count services for this category from active workers
            const { data: workersData } = await supabase
              .from('worker_services')
              .select('worker_id')
              .in('worker_id', activeWorkers.map(w => w.id))
              .ilike('service_name', `%${category.name}%`);
            
            // Get unique worker count
            const uniqueWorkers = new Set(workersData?.map(w => w.worker_id) || []);
            
            return {
              ...category,
              workers: uniqueWorkers.size
            };
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location or business name"
                className="pl-10"
              />
            </div>

            {/* Category Select */}
            <Select>
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
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.name.toLowerCase()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select>
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