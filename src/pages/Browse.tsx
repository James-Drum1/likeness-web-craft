import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Zap, Hammer, PaintBucket, Home, Scissors, MapPin, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Browse = () => {
  const serviceCategories = [
    {
      icon: Wrench,
      title: "Plumbing",
      description: "Professional plumbing services including repairs, installations, and maintenance",
      workers: "45+ workers"
    },
    {
      icon: Zap,
      title: "Electrical",
      description: "Licensed electrical work including wiring, installations, and repairs",
      workers: "38+ workers"
    },
    {
      icon: Hammer,
      title: "Carpentry",
      description: "Custom woodwork, furniture making, and carpentry services",
      workers: "29+ workers"
    },
    {
      icon: PaintBucket,
      title: "Painting",
      description: "Interior and exterior painting and decorating services",
      workers: "22+ workers"
    },
    {
      icon: Home,
      title: "Construction",
      description: "Building contractors and construction professionals",
      workers: "31+ workers"
    },
    {
      icon: Scissors,
      title: "Landscaping",
      description: "Garden design, maintenance, and outdoor space development",
      workers: "26+ workers"
    }
  ];

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
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
              </SelectContent>
            </Select>

            {/* Area Select */}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dublin">Dublin</SelectItem>
                <SelectItem value="cork">Cork</SelectItem>
                <SelectItem value="galway">Galway</SelectItem>
                <SelectItem value="limerick">Limerick</SelectItem>
                <SelectItem value="waterford">Waterford</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="bg-white hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          {category.workers}
                        </span>
                        <Button 
                          variant="link" 
                          className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
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
      </div>

      <Footer />
    </div>
  );
};

export default Browse;