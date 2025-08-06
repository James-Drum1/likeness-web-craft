import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  FileText, 
  Camera, 
  Star,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Search,
  Filter,
  Activity
} from "lucide-react";

interface AdminSettings {
  [key: string]: string;
}

interface Worker {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  location: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
  years_experience: number;
  viewCount?: number;
}

interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  user_type: string;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  worker_id: string;
  customer_id: string;
}

interface ActivityLog {
  id: string;
  action: string;
  target_type: string;
  created_at: string;
  details: any;
}

interface Location {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [newLocation, setNewLocation] = useState({ name: '', description: '' });
  const [newService, setNewService] = useState({ name: '', description: '' });
  const [analytics, setAnalytics] = useState({
    totalWorkers: 0,
    totalCustomers: 0,
    totalReviews: 0,
    averageRating: 0,
    activeWorkers: 0,
    pendingWorkers: 0
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Check admin access
  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user?.id)
        .single();

      if (profile?.user_type !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Load all admin data
      await Promise.all([
        loadSettings(),
        loadWorkers(),
        loadCustomers(),
        loadReviews(),
        loadActivityLogs(),
        loadAnalytics(),
        loadLocations(),
        loadServiceCategories(),
        loadAllUsers()
      ]);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('*');

      const settingsObj: AdminSettings = {};
      data?.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadWorkers = async () => {
    try {
      const { data } = await supabase
        .from('worker_portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch view counts for each worker
      if (data) {
        const workersWithViews = await Promise.all(
          data.map(async (worker) => {
            const { data: viewsData } = await supabase
              .from('profile_views')
              .select('id')
              .eq('worker_id', worker.id);
            
            return {
              ...worker,
              viewCount: viewsData?.length || 0
            };
          })
        );
        setWorkers(workersWithViews);
      }
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'customer')
        .order('created_at', { ascending: false });

      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const { data } = await supabase
        .from('worker_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const { data } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [workersData, customersData, reviewsData] = await Promise.all([
        supabase.from('worker_portfolios').select('status'),
        supabase.from('profiles').select('user_type').eq('user_type', 'customer'),
        supabase.from('worker_reviews').select('rating')
      ]);

      console.log('Analytics Debug - Workers:', workersData.data?.length);
      console.log('Analytics Debug - Customers:', customersData.data?.length);
      console.log('Analytics Debug - Reviews:', reviewsData.data?.length);

      const totalWorkers = workersData.data?.length || 0;
      const totalCustomers = customersData.data?.length || 0;
      const totalReviews = reviewsData.data?.length || 0;
      const activeWorkers = workersData.data?.filter(w => w.status === 'active').length || 0;
      const pendingWorkers = workersData.data?.filter(w => w.status === 'pending').length || 0;
      
      const averageRating = totalReviews > 0 
        ? reviewsData.data!.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
        : 0;

      setAnalytics({
        totalWorkers,
        totalCustomers,
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        activeWorkers,
        pendingWorkers
      });

      console.log('Analytics set:', {
        totalWorkers,
        totalCustomers,
        totalReviews,
        averageRating: parseFloat(averageRating.toFixed(1)),
        activeWorkers,
        pendingWorkers
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      setLocations(data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const loadServiceCategories = async () => {
    try {
      const { data } = await supabase
        .from('service_categories')
        .select('*')
        .order('name', { ascending: true });

      setServiceCategories(data || []);
    } catch (error) {
      console.error('Error loading service categories:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setAllUsers(data || []);
    } catch (error) {
      console.error('Error loading all users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const assignUserRole = async (userId: string, newRole: 'admin' | 'worker' | 'customer') => {
    try {
      const { data, error } = await supabase.functions.invoke('assign-user-role', {
        body: {
          targetUserId: userId,
          newRole: newRole
        }
      });

      if (error) throw error;

      // Refresh the users list
      await loadAllUsers();
      await loadAnalytics();

      toast({
        title: "Role Updated",
        description: `User role changed to ${newRole} successfully`,
      });
    } catch (error) {
      console.error('Error assigning user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.user_id.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.user_type === roleFilter;
    return matchesSearch && matchesRole;
  });

  const addLocation = async () => {
    try {
      if (!newLocation.name.trim()) return;

      const { error } = await supabase
        .from('locations')
        .insert({
          name: newLocation.name.trim(),
          description: newLocation.description.trim()
        });

      if (error) throw error;

      await loadLocations();
      setNewLocation({ name: '', description: '' });
      
      await logAdminActivity('add_location', 'location', null, { name: newLocation.name });

      toast({
        title: "Location Added",
        description: `${newLocation.name} has been added successfully`,
      });
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: "Error",
        description: "Failed to add location",
        variant: "destructive",
      });
    }
  };

  const deleteLocation = async (locationId: string, locationName: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;

      await loadLocations();
      
      await logAdminActivity('delete_location', 'location', locationId, { name: locationName });

      toast({
        title: "Location Deleted",
        description: `${locationName} has been permanently deleted`,
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const toggleLocationStatus = async (locationId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: !isActive })
        .eq('id', locationId);

      if (error) throw error;

      await loadLocations();
      
      await logAdminActivity('toggle_location_status', 'location', locationId, { new_status: !isActive });

      toast({
        title: "Location Updated",
        description: `Location ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    }
  };

  const addService = async () => {
    try {
      if (!newService.name.trim()) return;

      const { error } = await supabase
        .from('service_categories')
        .insert({
          name: newService.name.trim(),
          description: newService.description.trim()
        });

      if (error) throw error;

      await loadServiceCategories();
      setNewService({ name: '', description: '' });
      
      await logAdminActivity('add_service_category', 'service_category', null, { name: newService.name });

      toast({
        title: "Service Added",
        description: `${newService.name} has been added successfully`,
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

  const deleteService = async (serviceId: string, serviceName: string) => {
    try {
      const { error } = await supabase
        .from('service_categories')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      await loadServiceCategories();
      
      await logAdminActivity('delete_service_category', 'service_category', serviceId, { name: serviceName });

      toast({
        title: "Service Deleted",
        description: `${serviceName} has been permanently deleted`,
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

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('service_categories')
        .update({ is_active: !isActive })
        .eq('id', serviceId);

      if (error) throw error;

      await loadServiceCategories();
      
      await logAdminActivity('toggle_service_status', 'service_category', serviceId, { new_status: !isActive });

      toast({
        title: "Service Updated",
        description: `Service ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ setting_key: key, setting_value: value });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      
      // Log admin activity
      await logAdminActivity('update_setting', 'setting', null, { setting_key: key, new_value: value });

      toast({
        title: "Setting Updated",
        description: `${key} has been updated successfully`,
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const updateWorkerStatus = async (workerId: string, newStatus: 'pending' | 'active' | 'inactive' | 'suspended') => {
    try {
      const { error } = await supabase
        .from('worker_portfolios')
        .update({ status: newStatus })
        .eq('id', workerId);

      if (error) throw error;

      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, status: newStatus } : worker
      ));

      await logAdminActivity('update_worker_status', 'worker', workerId, { new_status: newStatus });

      toast({
        title: "Worker Status Updated",
        description: `Worker status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating worker status:', error);
      toast({
        title: "Error",
        description: "Failed to update worker status",
        variant: "destructive",
      });
    }
  };

  const toggleFeaturedStatus = async (workerId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('worker_portfolios')
        .update({ is_featured: !isFeatured })
        .eq('id', workerId);

      if (error) throw error;

      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, is_featured: !isFeatured } : worker
      ));

      await logAdminActivity('toggle_featured_status', 'worker', workerId, { is_featured: !isFeatured });

      toast({
        title: "Featured Status Updated",
        description: `Worker ${!isFeatured ? 'added to' : 'removed from'} featured list`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const logAdminActivity = async (action: string, targetType: string, targetId: string | null, details: any) => {
    try {
      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_user_id: user?.id,
          action,
          target_type: targetType,
          target_id: targetId,
          details
        });
    } catch (error) {
      console.error('Error logging admin activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="ml-auto">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Site
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalWorkers}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.activeWorkers} active, {analytics.pendingWorkers} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                Average: {analytics.averageRating} stars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.averageRating >= 4 ? "Excellent" : analytics.averageRating >= 3 ? "Good" : "Needs Attention"}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on user ratings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="workers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="workers">Workers</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management & Role Assignment</CardTitle>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    <Input
                      placeholder="Search by name or user ID..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{user.full_name || 'No name provided'}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>ID: {user.user_id}</span>
                            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              user.user_type === 'admin' ? 'destructive' : 
                              user.user_type === 'worker' ? 'default' : 'secondary'
                            }
                          >
                            {user.user_type}
                          </Badge>
                          <Select 
                            value={user.user_type} 
                            onValueChange={(value) => assignUserRole(user.user_id, value as 'admin' | 'worker' | 'customer')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="worker">Worker</SelectItem>
                              <SelectItem value="customer">Customer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No users found matching your criteria.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Worker Management</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                   {workers.map((worker) => (
                     <div key={worker.id} className="flex items-center justify-between p-4 border rounded-lg">
                       <div className="space-y-1">
                         <h4 className="font-medium">{worker.business_name}</h4>
                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
                           <span className="flex items-center gap-1">
                             <Mail className="h-3 w-3" />
                             {worker.email}
                           </span>
                           <span className="flex items-center gap-1">
                             <MapPin className="h-3 w-3" />
                             {worker.location}
                           </span>
                           <span className="flex items-center gap-1">
                             <Briefcase className="h-3 w-3" />
                             {worker.years_experience} years
                           </span>
                           <span className="flex items-center gap-1">
                             <Eye className="h-3 w-3" />
                             {worker.viewCount || 0} views
                           </span>
                         </div>
                       </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={worker.status === 'active' ? 'default' : 
                                     worker.status === 'pending' ? 'secondary' : 'destructive'}
                          >
                            {worker.status}
                          </Badge>
                          {worker.is_verified && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              Verified
                            </Badge>
                          )}
                          {worker.is_featured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Featured
                            </Badge>
                          )}
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`featured-${worker.id}`} className="text-sm">Featured</Label>
                            <Switch
                              id={`featured-${worker.id}`}
                              checked={worker.is_featured}
                              onCheckedChange={() => toggleFeaturedStatus(worker.id, worker.is_featured)}
                            />
                          </div>
                          <Select 
                            value={worker.status} 
                            onValueChange={(value) => updateWorkerStatus(worker.id, value as 'pending' | 'active' | 'inactive' | 'suspended')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                     </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{customer.full_name || 'No name provided'}</h4>
                        <p className="text-sm text-muted-foreground">
                          Joined: {new Date(customer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Customer</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Location Management
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Location</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="location_name">Location Name</Label>
                          <Input
                            id="location_name"
                            value={newLocation.name}
                            onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Dublin, Cork"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location_description">Description</Label>
                          <Textarea
                            id="location_description"
                            value={newLocation.description}
                            onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Optional description"
                          />
                        </div>
                        <Button onClick={addLocation} className="w-full">
                          Add Location
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{location.name}</h4>
                        {location.description && (
                          <p className="text-sm text-muted-foreground">{location.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Added: {new Date(location.created_at).toLocaleDateString()}
                        </p>
                      </div>
                       <div className="flex items-center gap-2">
                         <Badge variant={location.is_active ? 'default' : 'secondary'}>
                           {location.is_active ? 'Active' : 'Inactive'}
                         </Badge>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => toggleLocationStatus(location.id, location.is_active)}
                         >
                           {location.is_active ? 'Deactivate' : 'Activate'}
                         </Button>
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => deleteLocation(location.id, location.name)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Service Management
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="service_name">Service Name</Label>
                          <Input
                            id="service_name"
                            value={newService.name}
                            onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., plumbing, electrical"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service_description">Description</Label>
                          <Textarea
                            id="service_description"
                            value={newService.description}
                            onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the service category"
                          />
                        </div>
                        <Button onClick={addService} className="w-full">
                          Add Service
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceCategories.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium capitalize">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Added: {new Date(service.created_at).toLocaleDateString()}
                        </p>
                      </div>
                       <div className="flex items-center gap-2">
                         <Badge variant={service.is_active ? 'default' : 'secondary'}>
                           {service.is_active ? 'Active' : 'Inactive'}
                         </Badge>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => toggleServiceStatus(service.id, service.is_active)}
                         >
                           {service.is_active ? 'Deactivate' : 'Activate'}
                         </Button>
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => deleteService(service.id, service.name)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                      onBlur={(e) => updateSetting('site_name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={settings.site_description || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                      onBlur={(e) => updateSetting('site_description', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Review Moderation</Label>
                      <div className="text-sm text-muted-foreground">
                        Require admin approval for new reviews
                      </div>
                    </div>
                    <Switch
                      checked={settings.review_moderation === 'true'}
                      onCheckedChange={(checked) => updateSetting('review_moderation', checked.toString())}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Worker Approval Required</Label>
                      <div className="text-sm text-muted-foreground">
                        Require admin approval for new workers
                      </div>
                    </div>
                    <Switch
                      checked={settings.worker_approval_required === 'true'}
                      onCheckedChange={(checked) => updateSetting('worker_approval_required', checked.toString())}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        Show maintenance message to visitors
                      </div>
                    </div>
                    <Switch
                      checked={settings.maintenance_mode === 'true'}
                      onCheckedChange={(checked) => updateSetting('maintenance_mode', checked.toString())}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Admin Activity Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{log.action.replace(/_/g, ' ').toUpperCase()}</h4>
                        <p className="text-sm text-muted-foreground">
                          Target: {log.target_type} | {new Date(log.created_at).toLocaleString()}
                        </p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;