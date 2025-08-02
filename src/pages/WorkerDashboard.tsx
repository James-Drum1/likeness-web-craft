import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  DollarSign, 
  Upload, 
  Plus, 
  X,
  Building,
  Briefcase,
  Star,
  Camera
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface WorkerProfile {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  years_experience: number;
  hourly_rate: number;
  availability_hours: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  is_verified: boolean;
}

interface Service {
  id: string;
  service_name: string;
  description: string;
  category: string;
  price_from: number;
  price_to: number;
}

const categories = [
  "plumbing", "electrical", "carpentry", "painting", "roofing", 
  "building", "gardening", "cleaning", "locksmith", "other"
];

const WorkerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    service_name: "",
    description: "",
    category: "",
    price_from: 0,
    price_to: 0
  });

  // Fetch worker profile and services
  useEffect(() => {
    if (user) {
      fetchWorkerProfile();
      fetchServices();
    }
  }, [user]);

  const fetchWorkerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('worker_portfolios')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      // Get worker portfolio first to get the worker_id
      const { data: portfolioData } = await supabase
        .from('worker_portfolios')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (portfolioData) {
        const { data, error } = await supabase
          .from('worker_services')
          .select('*')
          .eq('worker_id', portfolioData.id);

        if (error) throw error;
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const updateProfile = async (updatedProfile: Partial<WorkerProfile>) => {
    try {
      const { error } = await supabase
        .from('worker_portfolios')
        .update(updatedProfile)
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      setEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const addService = async () => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('worker_services')
        .insert({
          worker_id: profile.id,
          ...newService,
          category: newService.category as any
        });

      if (error) throw error;

      setNewService({
        service_name: "",
        description: "",
        category: "",
        price_from: 0,
        price_to: 0
      });
      
      fetchServices();
      toast({
        title: "Success",
        description: "Service added successfully",
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('worker_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      fetchServices();
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="text-lg">Loading your dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to WorkersMate!</h2>
              <p className="text-muted-foreground mb-6">
                It looks like you don't have a worker profile yet. This might take a moment to set up after registration.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Worker Dashboard</h1>
              <p className="text-muted-foreground">Manage your business profile and services</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={profile.status === 'active' ? 'default' : 'secondary'}>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </Badge>
              {profile.is_verified && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input
                          id="business_name"
                          value={profile.business_name}
                          onChange={(e) => setProfile(prev => prev ? {...prev, business_name: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={profile.description || ""}
                          onChange={(e) => setProfile(prev => prev ? {...prev, description: e.target.value} : null)}
                          placeholder="Tell customers about your business..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="years_experience">Years of Experience</Label>
                        <Input
                          id="years_experience"
                          type="number"
                          value={profile.years_experience || 0}
                          onChange={(e) => setProfile(prev => prev ? {...prev, years_experience: parseInt(e.target.value)} : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourly_rate">Hourly Rate (€)</Label>
                        <Input
                          id="hourly_rate"
                          type="number"
                          value={profile.hourly_rate || 0}
                          onChange={(e) => setProfile(prev => prev ? {...prev, hourly_rate: parseFloat(e.target.value)} : null)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => updateProfile(profile)} size="sm">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingProfile(false)} size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg">{profile.business_name}</h3>
                        <p className="text-muted-foreground">
                          {profile.description || "No description provided yet."}
                        </p>
                      </div>
                       <div className="grid grid-cols-1 gap-4">
                         <div className="flex items-center gap-2">
                           <Briefcase className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm">{profile.years_experience || 0} years experience</span>
                         </div>
                       </div>
                      <Button variant="outline" onClick={() => setEditingProfile(true)}>
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.availability_hours || "Not specified"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Add New Service */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service_name">Service Name</Label>
                    <Input
                      id="service_name"
                      value={newService.service_name}
                      onChange={(e) => setNewService(prev => ({...prev, service_name: e.target.value}))}
                      placeholder="e.g., Kitchen Installation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newService.category} 
                      onValueChange={(value) => setNewService(prev => ({...prev, category: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="service_description">Description</Label>
                    <Textarea
                      id="service_description"
                      value={newService.description}
                      onChange={(e) => setNewService(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe this service..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_from">Price From (€)</Label>
                      <Input
                        id="price_from"
                        type="number"
                        value={newService.price_from}
                        onChange={(e) => setNewService(prev => ({...prev, price_from: parseFloat(e.target.value)}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_to">Price To (€)</Label>
                      <Input
                        id="price_to"
                        type="number"
                        value={newService.price_to}
                        onChange={(e) => setNewService(prev => ({...prev, price_to: parseFloat(e.target.value)}))}
                      />
                    </div>
                  </div>
                  <Button onClick={addService} className="w-full">
                    Add Service
                  </Button>
                </CardContent>
              </Card>

              {/* Services List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No services added yet. Add your first service to get started!
                      </p>
                    ) : (
                      services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{service.service_name}</h4>
                              <Badge variant="outline" className="mt-1">
                                {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-2">
                                {service.description}
                              </p>
                              <p className="text-sm font-medium mt-2">
                                €{service.price_from} - €{service.price_to}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteService(service.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Your Work</h3>
                  <p className="text-muted-foreground mb-4">
                    Showcase your best work to attract more customers
                  </p>
                  <Button>
                    Upload Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Profile Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">N/A</div>
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default WorkerDashboard;