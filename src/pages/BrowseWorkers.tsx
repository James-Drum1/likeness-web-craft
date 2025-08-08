import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Phone, Mail, Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BrowseWorkers = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  // Apply URL parameters when workers are loaded
  useEffect(() => {
    if (workers.length > 0) {
      const categoryParam = searchParams.get('category');
      const locationParam = searchParams.get('location');
      const qParam = searchParams.get('q');
      
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
      
      if (locationParam) {
        setSelectedLocation(locationParam);
      }

      if (qParam) {
        setSearchTerm(qParam);
      }
    }
  }, [workers, searchParams]);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      // Fetch active worker portfolios with their services, reviews and linked locations
      const [workersRes, locationsRes] = await Promise.all([
        supabase
          .from('worker_portfolios')
          .select(`
            *,
            worker_services (
              service_name,
              category,
              price_from
            ),
            worker_reviews (
              rating
            ),
            worker_locations (
              location_id
            )
          `)
          .eq('status', 'active'),
        supabase
          .from('locations')
          .select('*')
          .eq('is_active', true)
      ]);

      if (workersRes.error) throw workersRes.error;
      if (locationsRes.error) throw locationsRes.error;

      const locationMap = new Map<string, string>((locationsRes.data || []).map((l: any) => [l.id, l.name]));

      // Process the data to include calculated ratings and services
      const processedWorkers = (workersRes.data || []).map((worker: any) => {
        const reviews = worker.worker_reviews || [];
        const services = worker.worker_services || [];
        const links = worker.worker_locations || [];
        const linkedLocationNames = links
          .map((wl: any) => locationMap.get(wl.location_id))
          .filter(Boolean);
        
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / totalReviews
          : 0;

        return {
          ...worker,
          rating: parseFloat(averageRating.toFixed(1)),
          review_count: totalReviews,
          services: services.map((s: any) => s.service_name),
          categories: services.map((s: any) => s.category),
          main_category: services.length > 0 ? services[0].category : 'other',
          linked_locations: linkedLocationNames as string[],
        };
      });

      // Use all active locations from DB for filters
      const locations = (locationsRes.data || []).map((l: any) => l.name).filter(Boolean);
      setAvailableLocations(locations);
      const categories = [...new Set(processedWorkers.flatMap((w: any) => w.categories))];
      setAvailableCategories(categories.filter(Boolean));
      setWorkers(processedWorkers);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (category: string, location: string) => {
    const params = new URLSearchParams();
    
    if (category !== "all") {
      params.set('category', category);
    }
    
    if (location !== "all") {
      params.set('location', location);
    }
    
    const queryString = params.toString();
    navigate(`/browse-workers${queryString ? `?${queryString}` : ''}`, { replace: true });
  };

  const filteredWorkers = workers.filter(worker => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      worker.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.services.some((service: string) => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      worker.categories.some((category: string) => category.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = selectedCategory === "all" || 
      worker.categories.includes(selectedCategory);

    // Location filter
    const matchesLocation = selectedLocation === "all" || 
      worker.location === selectedLocation ||
      (worker.linked_locations && worker.linked_locations.includes(selectedLocation)) ||
      (selectedLocation && worker.location?.toLowerCase().includes(selectedLocation.toLowerCase())) ||
      (selectedLocation && Array.isArray(worker.linked_locations) && worker.linked_locations.some((n: string) => n.toLowerCase().includes(selectedLocation.toLowerCase())));

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading workers...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Workers</h1>
          <p className="text-muted-foreground">Find skilled professionals for your next project</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, service, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="text-sm font-medium">Filter by Category</label>
              <Select value={selectedCategory} onValueChange={(value) => {
                setSelectedCategory(value);
                updateURL(value, selectedLocation);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <label className="text-sm font-medium">Filter by Location</label>
              <Select value={selectedLocation} onValueChange={(value) => {
                setSelectedLocation(value);
                updateURL(selectedCategory, value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {availableLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory !== "all" || selectedLocation !== "all" || searchTerm !== "") && (
              <div className="flex flex-col gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                    setSearchTerm("");
                    updateURL("all", "all");
                  }}
                  className="self-end"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
            {selectedLocation !== "all" && ` near ${selectedLocation}`}
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{worker.business_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{worker.location}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {worker.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(worker.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {worker.rating} ({worker.review_count} reviews)
                  </span>
                </div>
                
                {/* Services */}
                <div>
                  <p className="text-sm font-medium mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.services.slice(0, 3).map((service: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {worker.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{worker.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Experience & Rate */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-medium">{worker.years_experience} years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">€{worker.hourly_rate}/hr</p>
                  </div>
                </div>
                
                {/* Contact Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(`tel:${worker.phone}`, '_self')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(`mailto:${worker.email}`, '_self')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
                
                <Button 
                  className="w-full mt-2"
                  onClick={() => navigate(`/worker/${worker.id}`)}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No workers found matching your search.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BrowseWorkers;