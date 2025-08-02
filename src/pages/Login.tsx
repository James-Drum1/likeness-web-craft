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
  const [userType] = useState("customer"); // Always customer for this page
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
        console.log("User is logged in, checking user type for redirect");
        
        // Get user profile to determine redirect destination
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile?.user_type === 'tradesperson') {
          console.log("Tradesperson already logged in, redirecting to dashboard");
          navigate("/worker-dashboard");
        } else {
          console.log("Customer already logged in, redirecting to home");
          navigate("/");
        }
      } else {
        console.log("No active session found");
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        if (session && event !== 'INITIAL_SESSION') {
          console.log("User logged in, checking user type for redirect");
          setLoading(false); // Reset loading state
          
          // Use setTimeout to avoid async deadlock in auth callback
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('user_id', session.user.id)
                .single();
              
              if (profile?.user_type === 'tradesperson') {
                console.log("Tradesperson logged in, redirecting to dashboard");
                navigate("/worker-dashboard");
              } else {
                console.log("Customer logged in, redirecting to home");
                navigate("/");
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
              // Default to home page if profile fetch fails
              navigate("/");
            }
          }, 0);
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
        setLoading(false); // Reset loading on error
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
      // Don't reset loading here - let auth state change handle redirect
    } catch (error) {
      setLoading(false); // Reset loading on error
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
      console.log("Starting signup process for:", userType);
      console.log("Signup metadata:", {
        full_name: fullName,
        user_type: userType,
        business_name: userType === "tradesperson" ? businessName : null,
        phone: userType === "tradesperson" ? phone : null,
        location: userType === "tradesperson" ? location : null,
      });

      const { data, error } = await supabase.auth.signUp({
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

      console.log("Signup response:", { data, error });

      if (error) {
        setLoading(false);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          // User is automatically logged in
          toast({
            title: "Account created successfully!",
            description: "Welcome to WorkersMate!",
          });
          // Don't set loading to false here - let auth state change handle it
        } else {
          // Email confirmation required
          setLoading(false);
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        setLoading(false);
        toast({
          title: "Sign up failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
                  {/* Customer Account Creation */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 p-4 border border-customer-blue bg-customer-blue/5 text-customer-blue rounded-lg">
                        <User className="h-5 w-5" />
                        <span className="font-medium">Creating Customer Account</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Looking to hire tradespeople? <br />
                        Create your customer account below.
                      </p>
                    </div>
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
                      {loading ? "Creating Account..." : "Create Customer Account"}
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