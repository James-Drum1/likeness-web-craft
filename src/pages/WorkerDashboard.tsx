import { useState, useEffect, useRef } from "react";
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
import { Constants } from "@/integrations/supabase/types";
import { User, Phone, Mail, MapPin, Clock, DollarSign, Upload, Plus, X, Building, Briefcase, Star, Camera, Trash2, Eye, TrendingUp } from "lucide-react";
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
interface PortfolioImage {
  id: string;
  image_url: string;
  caption?: string;
  worker_id: string;
}
interface Location {
  id: string;
  name: string;
  is_active: boolean;
  description?: string;
}
const categories = [...Constants.public.Enums.service_category];
const WorkerDashboard = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    monthlyViews: 0,
    weeklyViews: 0,
    averageRating: 0,
    totalReviews: 0
  });
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [newService, setNewService] = useState({
    service_name: "",
    description: "",
    category: "other",
    price_from: 0,
    price_to: 0
  });
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [workerLocations, setWorkerLocations] = useState<Location[]>([]);
  const [selectedLocationIdToAdd, setSelectedLocationIdToAdd] = useState<string>("");

  // Fetch worker profile and services
  useEffect(() => {
    if (user) {
      fetchWorkerProfile();
      fetchServices();
      fetchPortfolioImages();
      fetchAnalytics();
      fetchAvailableLocations();
      fetchServiceCategories();
    }
  }, [user]);
  const fetchAnalytics = async () => {
    try {
      // Get worker portfolio first to get the worker_id
      const {
        data: portfolioData
      } = await supabase.from('worker_portfolios').select('id').eq('user_id', user?.id).single();
      if (portfolioData) {
        // Fetch all-time profile views
        const {
          data: allViewsData
        } = await supabase.from('profile_views').select('id, created_at').eq('worker_id', portfolioData.id);

        // Fetch profile views for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const {
          data: monthViewsData
        } = await supabase.from('profile_views').select('id').eq('worker_id', portfolioData.id).gte('created_at', startOfMonth.toISOString());

        // Fetch profile views for current week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const {
          data: weekViewsData
        } = await supabase.from('profile_views').select('id').eq('worker_id', portfolioData.id).gte('created_at', startOfWeek.toISOString());

        // Fetch average rating and total reviews
        const {
          data: reviewsData
        } = await supabase.from('worker_reviews').select('rating').eq('worker_id', portfolioData.id);
        const totalReviews = reviewsData?.length || 0;
        const averageRating = totalReviews > 0 ? reviewsData.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews : 0;
        setAnalytics({
          profileViews: allViewsData?.length || 0,
          monthlyViews: monthViewsData?.length || 0,
          weeklyViews: weekViewsData?.length || 0,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };
  const fetchPortfolioImages = async () => {
    try {
      // Get worker portfolio first to get the worker_id
      const {
        data: portfolioData
      } = await supabase.from('worker_portfolios').select('id').eq('user_id', user?.id).single();
      if (portfolioData) {
        const {
          data,
          error
        } = await supabase.from('portfolio_images').select('*').eq('worker_id', portfolioData.id);
        if (error) throw error;
        setPortfolioImages(data || []);
      }
    } catch (error) {
      console.error('Error fetching portfolio images:', error);
    }
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !profile) return;
    for (const file of files) {
      try {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        const {
          error: uploadError
        } = await supabase.storage.from('portfolio-images').upload(fileName, file);
        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data
        } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);

        // Save to database
        const {
          error: dbError
        } = await supabase.from('portfolio_images').insert({
          worker_id: profile.id,
          image_url: data.publicUrl,
          caption: null
        });
        if (dbError) throw dbError;
        toast({
          title: "Success",
          description: "Image uploaded successfully"
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive"
        });
      }
    }

    // Refresh portfolio images
    fetchPortfolioImages();

    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };
  const deletePortfolioImage = async (imageId: string) => {
    try {
      const {
        error
      } = await supabase.from('portfolio_images').delete().eq('id', imageId);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
      fetchPortfolioImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive"
      });
    }
  };
  const fetchWorkerProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('worker_portfolios').select('*').eq('user_id', user?.id).single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      setProfile(data);
      if (data) {
        fetchWorkerLocations(data.id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchServices = async () => {
    try {
      // Get worker portfolio first to get the worker_id
      const {
        data: portfolioData
      } = await supabase.from('worker_portfolios').select('id').eq('user_id', user?.id).single();
      if (portfolioData) {
        const {
          data,
          error
        } = await supabase.from('worker_services').select('*').eq('worker_id', portfolioData.id);
        if (error) throw error;
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const updateProfile = async (updatedProfile: Partial<WorkerProfile>) => {
    try {
      const {
        error
      } = await supabase.from('worker_portfolios').update(updatedProfile).eq('user_id', user?.id);
      if (error) throw error;
      setProfile(prev => prev ? {
        ...prev,
        ...updatedProfile
      } : null);
      setEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };
  // No longer needed - we now use display names directly from service_categories table

  const addService = async () => {
    try {
      if (!profile) return;
      
      // Use the category name directly from service_categories table
      const {
        error
      } = await supabase.from('worker_services').insert({
        worker_id: profile.id,
        ...newService,
        category: newService.category as any
      });
      if (error) throw error;
      
      setNewService({
        service_name: "",
        description: "",
        category: serviceCategories[0]?.name || "other",
        price_from: 0,
        price_to: 0
      });
      fetchServices();
      toast({
        title: "Success",
        description: "Service added successfully"
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive"
      });
    }
  };
  const deleteService = async (serviceId: string) => {
    try {
      const {
        error
      } = await supabase.from('worker_services').delete().eq('id', serviceId);
      if (error) throw error;
      fetchServices();
      toast({
        title: "Success",
        description: "Service deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive"
      });
    }
  };
  const fetchAvailableLocations = async () => {
    try {
      const {
        data
      } = await supabase.from('locations').select('*').eq('is_active', true).order('name', {
        ascending: true
      });
      setAvailableLocations(data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };
  const fetchServiceCategories = async () => {
    try {
      const {
        data
      } = await supabase.from('service_categories').select('*').eq('is_active', true).order('name', {
        ascending: true
      });
      setServiceCategories(data || []);
      
      // Initialize newService category with the first available category
      if ((data || []).length > 0) {
        setNewService(prev => ({
          ...prev,
          category: data[0].name
        }));
      }
    } catch (error) {
      console.error('Error loading service categories:', error);
      // Fallback to enum values if categories table is empty
      const fallbackCategories = Constants.public.Enums.service_category.map(cat => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1)
      }));
      setServiceCategories(fallbackCategories);
      
      if (fallbackCategories.length > 0) {
        setNewService(prev => ({
          ...prev,
          category: fallbackCategories[0].name
        }));
      }
    }
  };
  const fetchWorkerLocations = async (workerId: string) => {
    try {
      const {
        data: links
      } = await supabase.from('worker_locations').select('location_id').eq('worker_id', workerId);
      const ids = (links || []).map((l: any) => l.location_id);
      if (ids.length === 0) {
        setWorkerLocations([]);
        return;
      }
      const {
        data: locs
      } = await supabase.from('locations').select('*').in('id', ids);
      setWorkerLocations(locs || []);
    } catch (error) {
      console.error('Error fetching worker locations:', error);
    }
  };
  const addWorkerLocation = async () => {
    if (!profile || !selectedLocationIdToAdd) return;
    try {
      const {
        error
      } = await supabase.from('worker_locations').insert({
        worker_id: profile.id,
        location_id: selectedLocationIdToAdd
      });
      if (error) throw error;
      setSelectedLocationIdToAdd("");
      await fetchWorkerLocations(profile.id);
      toast({
        title: 'Location added'
      });
    } catch (error: any) {
      console.error('Error adding location:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add location',
        variant: 'destructive'
      });
    }
  };
  const removeWorkerLocation = async (locationId: string) => {
    if (!profile) return;
    try {
      const {
        error
      } = await supabase.from('worker_locations').delete().eq('worker_id', profile.id).eq('location_id', locationId);
      if (error) throw error;
      await fetchWorkerLocations(profile.id);
      toast({
        title: 'Location removed'
      });
    } catch (error: any) {
      console.error('Error removing location:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove location',
        variant: 'destructive'
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="text-lg">Loading your dashboard...</div>
        </div>
        <Footer />
      </div>;
  }
  if (!profile) {
    return <div className="min-h-screen">
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
      </div>;
  }
  return <div className="min-h-screen bg-background">
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
              {profile.is_verified && <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Verified
                </Badge>}
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
                  {editingProfile ? <div className="space-y-4">
                      <div>
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input id="business_name" value={profile.business_name} onChange={e => setProfile(prev => prev ? {
                      ...prev,
                      business_name: e.target.value
                    } : null)} />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={profile.description || ""} onChange={e => setProfile(prev => prev ? {
                      ...prev,
                      description: e.target.value
                    } : null)} placeholder="Tell customers about your business..." rows={3} />
                      </div>
                      <div>
                        <Label htmlFor="years_experience">Years of Experience</Label>
                        <Input id="years_experience" type="number" value={profile.years_experience || 0} onChange={e => setProfile(prev => prev ? {
                      ...prev,
                      years_experience: parseInt(e.target.value)
                    } : null)} />
                      </div>
                      <div>
                        <Label htmlFor="hourly_rate">Hourly Rate (€)</Label>
                        <Input id="hourly_rate" type="number" value={profile.hourly_rate || 0} onChange={e => setProfile(prev => prev ? {
                      ...prev,
                      hourly_rate: parseFloat(e.target.value)
                    } : null)} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => updateProfile(profile)} size="sm">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingProfile(false)} size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div> : <div className="space-y-4">
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
                    </div>}
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

              {/* Service Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Service Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedLocationIdToAdd} onValueChange={setSelectedLocationIdToAdd}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a location to add" />
                      </SelectTrigger>
                      <SelectContent className="z-50">
                        {availableLocations.filter(l => !workerLocations.some(wl => wl.id === l.id)).map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={addWorkerLocation} disabled={!selectedLocationIdToAdd || !profile}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workerLocations.length === 0 && <p className="text-sm text-muted-foreground">No service areas added yet.</p>}
                    {workerLocations.map(loc => <Badge key={loc.id} variant="secondary" className="flex items-center gap-1">
                        {loc.name}
                        <button aria-label={`Remove ${loc.name}`} onClick={() => removeWorkerLocation(loc.id)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>)}
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
                    <Input id="service_name" value={newService.service_name} onChange={e => setNewService(prev => ({
                    ...prev,
                    service_name: e.target.value
                  }))} placeholder="e.g., Kitchen Installation" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                     <Select value={newService.category} onValueChange={value => setNewService(prev => ({
                    ...prev,
                    category: value
                  }))}>
                       <SelectTrigger>
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                         <SelectContent className="z-50">
                      {serviceCategories.map(category => {
                        // Display the full category name from service_categories table
                        const categoryName = category.name || category;
                        return <SelectItem key={category.id || category.name} value={categoryName}>
                                {categoryName}
                              </SelectItem>;
                      })}
                         </SelectContent>
                     </Select>
                  </div>
                  <div>
                    <Label htmlFor="service_description">Description</Label>
                    <Textarea id="service_description" value={newService.description} onChange={e => setNewService(prev => ({
                    ...prev,
                    description: e.target.value
                  }))} placeholder="Describe this service..." rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    
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
                    {services.length === 0 ? <p className="text-muted-foreground text-center py-8">
                        No services added yet. Add your first service to get started!
                      </p> : services.map(service => <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{service.service_name}</h4>
                               <Badge variant="outline" className="mt-1">
                                 {serviceCategories.find(sc => 
                                   sc.name?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '') === service.category.toLowerCase()
                                 )?.name || service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                               </Badge>
                              <p className="text-sm text-muted-foreground mt-2">
                                {service.description}
                              </p>
                              
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteService(service.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>)}
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
                 <div className="space-y-6">
                   {/* Upload Section */}
                   <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                     <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                     <h3 className="text-lg font-medium mb-2">Upload Your Work</h3>
                     <p className="text-muted-foreground mb-4">
                       Showcase your best work to attract more customers
                     </p>
                     <div className="flex flex-col sm:flex-row gap-2 justify-center">
                       <Button onClick={() => uploadInputRef.current?.click()}>
                         Upload Photos
                       </Button>
                       <input ref={uploadInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFileUpload(e)} />
                     </div>
                   </div>

                   {/* Gallery Grid */}
                   {portfolioImages.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {portfolioImages.map(image => <div key={image.id} className="relative group">
                           <img src={image.image_url} alt={image.caption || "Portfolio image"} className="w-full h-32 object-cover rounded-lg" />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg" />
                           <Button variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deletePortfolioImage(image.id)}>
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>)}
                     </div>}

                   {portfolioImages.length === 0 && <div className="text-center py-8 text-muted-foreground">
                       <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                       <p>No images uploaded yet</p>
                     </div>}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Total Profile Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.profileViews}</div>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.monthlyViews}</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.weeklyViews}</div>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analytics.totalReviews > 0 ? analytics.averageRating : 'N/A'}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analytics.totalReviews > 0 ? `Based on ${analytics.totalReviews} review${analytics.totalReviews > 1 ? 's' : ''}` : 'No reviews yet'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>;
};
export default WorkerDashboard;