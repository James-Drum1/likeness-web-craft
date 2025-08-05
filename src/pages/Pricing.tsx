import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Pricing = () => {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'basic';

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get user profile to determine redirect destination
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile?.user_type === 'tradesperson') {
          navigate("/worker-dashboard");
        } else {
          navigate("/");
        }
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && event !== 'INITIAL_SESSION') {
          setLoading(false);
          
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('user_id', session.user.id)
                .single();
              
              if (profile?.user_type === 'tradesperson') {
                navigate("/worker-dashboard");
              } else {
                navigate("/");
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
              navigate("/worker-dashboard"); // Default to worker dashboard for tradesperson signup
            }
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Starting tradesperson signup process");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/worker-dashboard`,
          data: {
            full_name: fullName,
            user_type: 'tradesperson',
            business_name: businessName,
            phone: phone,
            location: location,
            selected_plan: selectedPlan,
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
        if (data.user.email_confirmed_at) {
          toast({
            title: "Tradesperson account created!",
            description: "Welcome to WorkersMate! Setting up your dashboard...",
          });
        } else {
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

  const planDisplayName = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wrench className="h-8 w-8 text-worker-orange" />
              <h1 className="text-3xl font-bold text-foreground">Join as Tradesperson</h1>
            </div>
            <p className="text-muted-foreground">Create your professional profile and start getting leads</p>
          </div>

          {/* Selected Plan Display */}
          <div className="mb-6 p-4 bg-worker-orange/5 border border-worker-orange/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Selected Plan:</p>
            <p className="font-semibold text-worker-orange">{planDisplayName} Package</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-green-700 font-medium">🎉 Free during testing phase!</p>
              <p className="text-xs text-green-600">No payment required to create your worker profile</p>
            </div>
          </div>
          
          {/* Signup Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-worker-orange" />
                Create Tradesperson Account
              </CardTitle>
              <CardDescription>
                Fill in your business details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  className="w-full bg-worker-orange hover:bg-worker-orange/90" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Tradesperson Account"}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Pricing;