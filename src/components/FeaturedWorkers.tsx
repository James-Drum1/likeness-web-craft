import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeaturedMemorial {
  id: string;
  title: string;
  description: string;
  birth_date: string | null;
  death_date: string | null;
  created_at: string;
  is_public: boolean;
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
  const [featuredMemorials, setFeaturedMemorials] = useState<FeaturedMemorial[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedMemorials();
  }, [limit]);

  const loadFeaturedMemorials = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('memorials').select('*').eq('is_public', true).order('created_at', {
        ascending: false
      }).limit(limit);

      if (error) throw error;
      setFeaturedMemorials(data || []);
    } catch (error) {
      console.error('Error loading featured memorials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={`py-12 md:py-20 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">Loading featured memorials...</div>
          </div>
        </div>
      </div>;
  }

  if (featuredMemorials.length === 0) {
    return <div className={`py-12 md:py-20 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          {showTitle && <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
                Featured Memorials
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Beautiful memorials created by our community to honor their loved ones.
              </p>
            </div>}
          
          <div className="text-center py-8 md:py-16">
            <div className="bg-muted/30 rounded-xl p-8 md:p-12 max-w-2xl mx-auto">
              <div className="text-muted-foreground mb-4">
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <CheckCircle className="w-8 h-8 md:w-12 md:h-12" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                No Featured Memorials Yet
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Featured memorials will show up here once they're created by our community. Check back soon!
              </p>
              {showViewAll && <Button onClick={() => navigate('/view-all-memories')}>
                  View All Memorials
                </Button>}
            </div>
          </div>
        </div>
      </div>;
  }

  return <div className={`py-12 md:py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {showTitle && <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6">
              Featured Memorials
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Beautiful memorials created by our community to honor their loved ones.
            </p>
          </div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredMemorials.map((memorial) => (
            <Card key={memorial.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {memorial.title}
                    </h3>
                    {memorial.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {memorial.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {memorial.birth_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Born: {new Date(memorial.birth_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {memorial.death_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Passed: {new Date(memorial.death_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <Badge variant="secondary" className="text-xs">
                      Memorial
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showViewAll && featuredMemorials.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/view-all-memories')}
              variant="outline"
              size="lg"
              className="bg-primary/5 border-primary/20 hover:bg-primary/10"
            >
              View All Memorials
            </Button>
          </div>
        )}
      </div>
    </div>;
};

export default FeaturedWorkers;