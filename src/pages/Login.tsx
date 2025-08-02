import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Wrench, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const leadData = [
  { category: "Plumber", leads: 48 },
  { category: "Electrician", leads: 36 },
  { category: "Carpenter", leads: 25 },
  { category: "Painter", leads: 55 },
  { category: "Roofer", leads: 58 },
  { category: "Builder", leads: 26 },
  { category: "Gardener", leads: 82 },
  { category: "Cleaner", leads: 74 },
  { category: "Locksmith", leads: 71 },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      console.log("Checking session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session);
      console.log("Session error:", error);
      if (session) {
        console.log("User is logged in, redirecting to home");
        navigate("/");
      } else {
        console.log("No active session found");
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        if (session) {
          console.log("User logged in, redirecting to home");
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (createPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (createPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: createEmail,
        password: createPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            user_type: userType,
            business_name: userType === "tradesperson" ? businessName : null,
            phone: userType === "tradesperson" ? phone : null,
            location: userType === "tradesperson" ? location : null,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">WorkersMate</h1>
            <p className="text-muted-foreground">Log in or create an account to get started</p>
          </div>
          
          {/* Login Form */}
          <Card className="w-full">
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="create">Create Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-customer-blue hover:bg-customer-blue/90" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="create" className="space-y-6 mt-6">
                  {/* User Type Selection */}
                  <div className="space-y-3">
                    <p className="font-medium text-center">I am signing up as a:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType("customer")}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          userType === "customer" 
                            ? "border-customer-blue bg-customer-blue/5 text-customer-blue" 
                            : "border-border hover:border-customer-blue/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          <span className="font-medium">Customer</span>
                        </div>
                        {userType === "customer" && <ChevronRight className="h-4 w-4" />}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setUserType("tradesperson")}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                          userType === "tradesperson" 
                            ? "border-worker-orange bg-worker-orange/5 text-worker-orange" 
                            : "border-border hover:border-worker-orange/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          <span className="font-medium">Tradesperson</span>
                        </div>
                        {userType === "tradesperson" && <ChevronRight className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {userType === "tradesperson" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-700 font-medium">🎉 Free during testing phase!</p>
                        <p className="text-xs text-green-600">No payment required to create your worker profile</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Form Fields */}
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    {userType === "tradesperson" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="business-name">Business Name</Label>
                          <Input
                            id="business-name"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="e.g., Ryan's Plumbing Services"
                            className="w-full"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g., 087 123 4567"
                            className="w-full"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Dublin, Cork, Galway"
                            className="w-full"
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={createEmail}
                        onChange={(e) => setCreateEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Password</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={createPassword}
                        onChange={(e) => setCreatePassword(e.target.value)}
                        placeholder="Enter a strong password"
                        className="w-full"
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-customer-blue hover:bg-customer-blue/90" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : 
                        userType === "tradesperson" ? "Create Worker Account" : "Create Customer Account"
                      }
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;