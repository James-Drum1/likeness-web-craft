import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Wrench, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const Login = () => {
  const [email, setEmail] = useState("name@example.com");
  const [password, setPassword] = useState("........");
  const [userType, setUserType] = useState("customer");

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
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Button className="w-full bg-customer-blue hover:bg-customer-blue/90" size="lg">
                    Login
                  </Button>
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
                            ? "border-customer-blue bg-customer-blue/5 text-customer-blue" 
                            : "border-border hover:border-customer-blue/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          <span className="font-medium">Tradesperson</span>
                        </div>
                        {userType === "tradesperson" && <ChevronRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        placeholder="name@example.com"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Password</Label>
                      <Input
                        id="create-password"
                        type="password"
                        placeholder="........"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="........"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full bg-customer-blue hover:bg-customer-blue/90" size="lg">
                    Create Personal Account
                  </Button>
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