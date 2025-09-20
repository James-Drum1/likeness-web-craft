import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        
                if (profile?.user_type === 'admin') {
                  console.log("Admin already logged in, redirecting to admin dashboard");
                  navigate("/admin");
        } else if (profile?.user_type === 'worker') {
          console.log("Worker already logged in, redirecting to dashboard");
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
        console.log("Session user:", session?.user);
        if (session && event !== 'INITIAL_SESSION') {
          console.log("User logged in, checking user type for redirect");
          setLoading(false); // Reset loading state
          
          // Use setTimeout to avoid async deadlock in auth callback
          setTimeout(async () => {
            try {
              console.log("Fetching profile for user:", session.user.id);
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('user_id', session.user.id)
                .single();
              
              console.log("Profile data:", profile, "Error:", error);
              
              if (profile?.user_type === 'admin') {
                console.log("Admin logged in, redirecting to admin dashboard");
                navigate("/admin");
              } else if (profile?.user_type === 'worker') {
                console.log("Worker logged in, redirecting to dashboard");
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-primary mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to manage your memorials</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                  className="w-full bg-primary hover:bg-primary/90" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="text-center mt-6 text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                  Sign up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;