import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Search,
  Trash2,
  UserPlus
} from "lucide-react";
import Header from "@/components/Header";

interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  user_type: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [numberOfCodes, setNumberOfCodes] = useState(10);
  const [codePrefix, setCodePrefix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const [qrSearchCode, setQrSearchCode] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Mock stats - replace with real data later
  const [stats] = useState({
    totalQRCodes: 611,
    activeMemorials: 8,
    unclaimedCodes: 603,
    pendingOrders: 0
  });

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

      await loadAllUsers();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
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

  const handleGenerateQRCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      console.log('Generating QR codes:', { numberOfCodes, codePrefix });
      
      const { data, error } = await supabase.functions.invoke('generate-qr-codes', {
        body: {
          numberOfCodes,
          prefix: codePrefix
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      console.log('QR codes generated:', data);
      
      toast({
        title: "QR Codes Generated Successfully",
        description: `Generated ${numberOfCodes} QR codes${codePrefix ? ` with prefix "${codePrefix}"` : ''}`,
      });
    } catch (error: any) {
      console.error('Error generating QR codes:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "An error occurred while generating QR codes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPromoting(true);

    try {
      // Find user by email
      const userToPromote = allUsers.find(u => u.user_id === promoteEmail);
      
      if (!userToPromote) {
        toast({
          title: "User Not Found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }

      // Update user role to admin
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('user_id', promoteEmail);

      if (error) throw error;

      await loadAllUsers();
      setPromoteEmail("");
      
      toast({
        title: "User Promoted",
        description: `User has been promoted to admin successfully`,
      });
    } catch (error) {
      toast({
        title: "Promotion Failed",
        description: "An error occurred while promoting user",
        variant: "destructive",
      });
    } finally {
      setIsPromoting(false);
    }
  };

  const handleQRSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Mock QR search - replace with real search logic later
      setSearchResults({
        code: qrSearchCode,
        status: "Unclaimed",
        createdAt: new Date().toISOString(),
        memorial: null
      });
      
      toast({
        title: "QR Code Found",
        description: `Found QR code: ${qrSearchCode}`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "QR code not found",
        variant: "destructive",
      });
    }
  };

  const assignUserRole = async (userId: string, newRole: 'admin' | 'worker' | 'customer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      await loadAllUsers();

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

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: 'customer' })
        .eq('user_id', userId);

      if (error) throw error;

      await loadAllUsers();

      toast({
        title: "Admin Removed",
        description: "User is no longer an admin",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin privileges",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-8 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalQRCodes}</div>
                <div className="text-sm text-muted-foreground">Total QR Codes</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.activeMemorials}</div>
                <div className="text-sm text-muted-foreground">Active Memorials</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.unclaimedCodes}</div>
                <div className="text-sm text-muted-foreground">Unclaimed Codes</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.pendingOrders}</div>
                <div className="text-sm text-muted-foreground">Pending Orders</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR Code Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleGenerateQRCodes} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfCodes">Number of QR Codes (max 50)</Label>
                  <Input
                    id="numberOfCodes"
                    type="number"
                    min="1"
                    max="50"
                    value={numberOfCodes}
                    onChange={(e) => setNumberOfCodes(parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codePrefix">Code Prefix (optional)</Label>
                  <Input
                    id="codePrefix"
                    type="text"
                    value={codePrefix}
                    onChange={(e) => setCodePrefix(e.target.value)}
                    placeholder="e.g., MEM2024"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating QR Codes..." : "Generate QR Code"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Promote User to Admin</Label>
                <form onSubmit={handlePromoteToAdmin} className="space-y-3 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="promoteEmail">Email Address</Label>
                    <Input
                      id="promoteEmail"
                      type="email"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isPromoting}
                  >
                    {isPromoting ? "Promoting..." : "Promote To Admin"}
                  </Button>
                </form>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">All Users</Label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {loadingUsers ? (
                    <div className="text-center text-muted-foreground">Loading users...</div>
                  ) : (
                    allUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">Role: {user.user_type}</div>
                        </div>
                        <div className="flex gap-2">
                          {user.user_type === 'admin' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeAdmin(user.user_id)}
                            >
                              Remove Admin
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => assignUserRole(user.user_id, 'admin')}
                            >
                              Make Admin
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            See Options
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Lookup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">QR Code Lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Search QR Code</Label>
                <form onSubmit={handleQRSearch} className="space-y-3 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="qrSearchCode">Enter QR code ID</Label>
                    <Input
                      id="qrSearchCode"
                      type="text"
                      value={qrSearchCode}
                      onChange={(e) => setQrSearchCode(e.target.value)}
                      placeholder="QR code ID"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Search
                  </Button>
                </form>
              </div>

              {searchResults && (
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="text-sm font-medium">Search Results:</div>
                  <div className="text-sm text-muted-foreground">
                    Code: {searchResults.code}<br/>
                    Status: {searchResults.status}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-center">
                Export All Data
              </Button>
              <Button variant="outline" className="w-full justify-center">
                View System Logs
              </Button>
              <Button variant="outline" className="w-full justify-center">
                Control Moderation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;