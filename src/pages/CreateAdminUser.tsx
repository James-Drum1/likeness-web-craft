import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

const CreateAdminUser = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "james@rhyconlaunchpad.com",
    password: "AdminPass2024!",
    fullName: "James - Admin"
  });

  const createAdminUser = async () => {
    setLoading(true);
    try {
      // First create/upgrade the admin user
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: formData
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const successMessage = data.was_existing_user 
        ? `User ${formData.email} has been upgraded to admin successfully!`
        : `Admin user created successfully for ${formData.email}`;

      toast({
        title: "Success!",
        description: successMessage,
      });

      console.log('Admin user processed:', data);

      // Auto-login the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        toast({
          title: "Admin created but login failed",
          description: "Please go to /login to sign in manually",
          variant: "destructive",
        });
        return;
      }

      // Redirect to admin dashboard
      toast({
        title: "Logged in successfully!",
        description: "Redirecting to admin dashboard...",
      });
      
      navigate('/admin');

    } catch (error: any) {
      console.error('Error processing admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process admin user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Create Admin User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Strong password"
            />
          </div>
          
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Admin Name"
            />
          </div>

          <Button 
            onClick={createAdminUser} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Admin User"}
          </Button>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">Login Credentials:</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Password:</strong> {formData.password}</p>
            <p className="text-muted-foreground mt-2">
              Use these credentials to login at /login and you'll be redirected to the admin dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdminUser;