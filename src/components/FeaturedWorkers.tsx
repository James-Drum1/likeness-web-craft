import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeaturedWorker {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  is_verified: boolean;
  years_experience: number;
  hourly_rate: number;
}

interface FeaturedWorkersProps {
  limit?: number;
  showTitle?: boolean;
  showViewAll?: boolean;
  className?: string;
}

const FeaturedWorkers = ({ 
  limit = 6, 
  showTitle = true, 
  showViewAll = true,
  className = ""
}: FeaturedWorkersProps) => {
  const [featuredWorkers, setFeaturedWorkers] = useState<FeaturedWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedWorkers();
  }, [limit]);

  const loadFeaturedWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('worker_portfolios')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      setFeaturedWorkers(data || []);
    } catch (error) {
      console.error('Error loading featured workers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`py-12 md:py-20 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading featured workers...</div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredWorkers.length === 0) {
    return (
      <div className={`py-12 md:py-20 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          {showTitle && (
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
                Featured Workers
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                These highly-rated businesses have been verified and featured by our team.
              </p>
            </div>
          )}
          
          <div className="text-center py-8 md:py-16">
            <div className="bg-muted/30 rounded-xl p-8 md:p-12 max-w-2xl mx-auto">
              <div className="text-muted-foreground mb-4">
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <CheckCircle className="w-8 h-8 md:w-12 md:h-12" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                No Featured Workers Yet
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Featured workers will show up here once they're selected by our team. Check back soon!
              </p>
              {showViewAll && (
                <Button onClick={() => navigate('/browse-workers')}>
                  View All Workers
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-12 md:py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
              Featured Workers
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              These highly-rated businesses have been verified and featured by our team.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {featuredWorkers.map((worker) => (
            <Card key={worker.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/worker/${worker.id}`)}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-foreground mb-1">
                      {worker.business_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                      {worker.location}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                      Featured
                    </Badge>
                    {worker.is_verified && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {worker.description && (
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">
                    {worker.description}
                  </p>
                )}

                <div className="space-y-2 mb-3 md:mb-4">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    {worker.years_experience} years experience
                  </div>
                  {worker.hourly_rate && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                      <Star className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                      From €{worker.hourly_rate}/hour
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 md:pt-3 border-t">
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs md:text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/worker/${worker.id}`);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${worker.email}`;
                    }}
                  >
                    <Mail className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showViewAll && featuredWorkers.length > 0 && (
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate('/browse-workers')}>
              View All Workers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedWorkers;