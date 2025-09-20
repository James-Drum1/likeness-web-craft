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

interface User {
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
  const [numberOfCodes, setNumberOfCodes] = useState(10);
  const [codePrefix, setCodePrefix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrSearchCode, setQrSearchCode] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalClients: 0,
    totalQRCodes: 0
  });
  
  // New user creation state
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserType, setNewUserType] = useState<'admin' | 'customer'>('customer');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

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
      await loadStats();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get user counts
      const { data: users } = await supabase
        .from('profiles')
        .select('user_type');

      // Get QR code count
      const { count: qrCount } = await supabase
        .from('qr_codes')
        .select('*', { count: 'exact', head: true });

      const totalUsers = users?.length || 0;
      const totalAdmins = users?.filter(u => u.user_type === 'admin').length || 0;
      const totalClients = users?.filter(u => u.user_type === 'customer').length || 0;

      setStats({
        totalUsers,
        totalAdmins,
        totalClients,
        totalQRCodes: qrCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
      await loadStats(); // Refresh stats after generating codes
      
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

  const handleQRSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('code', qrSearchCode)
        .single();

      if (error) {
        throw new Error('QR code not found');
      }

      setSearchResults({
        code: data.code,
        status: data.is_claimed ? "Claimed" : "Unclaimed",
        createdAt: data.created_at,
        memorial: data.memory_id
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
      setSearchResults(null);
    }
  };

  const assignUserRole = async (userId: string, newRole: 'admin' | 'customer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      await loadAllUsers();
      await loadStats(); // Refresh stats

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-user-with-role', {
        body: {
          email: newUserEmail,
          password: newUserPassword,
          fullName: newUserName,
          userType: newUserType
        }
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      console.log('User created successfully:', data);
      
      // Reset form
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      setNewUserType('customer');
      
      // Reload users and stats
      await loadAllUsers();
      await loadStats();
      
      toast({
        title: "User Created Successfully",
        description: `${newUserType} user "${newUserEmail}" has been created and can now log in`,
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "User Creation Failed",
        description: error.message || "An error occurred while creating the user",
        variant: "destructive",
      });
    } finally {
      setIsCreatingUser(false);
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
                <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalAdmins}</div>
                <div className="text-sm text-muted-foreground">Admin Users</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalClients}</div>
                <div className="text-sm text-muted-foreground">Client Users</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalQRCodes}</div>
                <div className="text-sm text-muted-foreground">QR Codes Generated</div>
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
                  {isGenerating ? "Generating QR Codes..." : "Generate QR Codes"}
                </Button>

                <Button 
                  type="button"
                  onClick={() => window.location.href = '/qr-generation'}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium py-3 mt-4"
                  size="lg"
                >
                  Go to QR Export Page
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Create New User Section */}
              <div>
                <Label className="text-sm font-medium">Create New User</Label>
                <form onSubmit={handleCreateUser} className="space-y-3 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="newUserEmail">Email</Label>
                      <Input
                        id="newUserEmail"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="user@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserPassword">Password</Label>
                      <Input
                        id="newUserPassword"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUserName">Full Name</Label>
                    <Input
                      id="newUserName"
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUserType">User Type</Label>
                    <select 
                      id="newUserType"
                      value={newUserType}
                      onChange={(e) => setNewUserType(e.target.value as 'admin' | 'customer')}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="customer">Client (Memorial Manager)</option>
                      <option value="admin">Admin (Full Access)</option>
                    </select>
                  </div>
                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isCreatingUser}
                  >
                    {isCreatingUser ? "Creating User..." : `Create ${newUserType === 'admin' ? 'Admin' : 'Client'} User`}
                  </Button>
                </form>
              </div>

              {/* All Users List */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">All Users ({allUsers.length})</Label>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {loadingUsers ? (
                    <div className="text-center text-muted-foreground">Loading users...</div>
                  ) : allUsers.length === 0 ? (
                    <div className="text-center text-muted-foreground">No users found</div>
                  ) : (
                    allUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                         <div className="flex-1">
                           <div className="font-medium">{user.full_name}</div>
                           <div className="text-sm text-muted-foreground">
                             {user.user_type === 'admin' ? 'Admin' : 'Client'} • Created {new Date(user.created_at).toLocaleDateString()}
                           </div>
                         </div>
                        <div className="flex gap-2">
                          <Badge variant={user.user_type === 'admin' ? 'default' : 'secondary'}>
                            {user.user_type === 'admin' ? 'Admin' : 'Client'}
                          </Badge>
                          {user.user_type === 'admin' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => assignUserRole(user.user_id, 'customer')}
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
                    Status: {searchResults.status}<br/>
                    Created: {new Date(searchResults.createdAt).toLocaleDateString()}
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