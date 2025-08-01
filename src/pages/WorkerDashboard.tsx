import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Star } from "lucide-react";
import Header from "@/components/Header";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [portfolioForm, setPortfolioForm] = useState({
    business_name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    hourly_rate: "",
    years_experience: "",
    availability_hours: ""
  });

  useEffect(() => {
    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const fetchPortfolioData = async () => {
    try {
      // Temporarily just show the form without fetching data
      // Will be implemented once TypeScript types are updated
      console.log('Portfolio fetch will be implemented after types update');
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (portfolio) {
        toast({ title: "Update functionality coming soon!" });
      } else {
        toast({ title: "Create functionality coming soon!" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Worker Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio and services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Form */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={portfolioForm.business_name}
                    onChange={(e) => setPortfolioForm({...portfolioForm, business_name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={portfolioForm.email}
                    onChange={(e) => setPortfolioForm({...portfolioForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={portfolioForm.phone}
                    onChange={(e) => setPortfolioForm({...portfolioForm, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={portfolioForm.location}
                    onChange={(e) => setPortfolioForm({...portfolioForm, location: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={portfolioForm.description}
                    onChange={(e) => setPortfolioForm({...portfolioForm, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate (€)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={portfolioForm.hourly_rate}
                      onChange={(e) => setPortfolioForm({...portfolioForm, hourly_rate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="years_experience">Years Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={portfolioForm.years_experience}
                      onChange={(e) => setPortfolioForm({...portfolioForm, years_experience: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="availability_hours">Availability Hours</Label>
                  <Input
                    id="availability_hours"
                    value={portfolioForm.availability_hours}
                    onChange={(e) => setPortfolioForm({...portfolioForm, availability_hours: e.target.value})}
                    placeholder="e.g., Mon-Fri 9AM-5PM"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {portfolio ? 'Update Portfolio' : 'Create Portfolio'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Coming Soon Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Services Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Services management coming soon!</p>
                <p className="text-sm text-muted-foreground mt-2">Add and manage your services here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Badge className="mb-4">Coming Soon</Badge>
                <p className="text-muted-foreground">Image upload functionality coming soon!</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews yet</p>
                <p className="text-sm text-muted-foreground mt-2">Customer reviews will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;