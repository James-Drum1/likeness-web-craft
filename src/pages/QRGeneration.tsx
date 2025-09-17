import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const QRGeneration = () => {
  const [numberOfCodes, setNumberOfCodes] = useState(10);
  const [codePrefix, setCodePrefix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateQRCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Simulate QR code generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "QR Codes Generated Successfully",
        description: `Generated ${numberOfCodes} QR codes with prefix "${codePrefix || 'Default'}"`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating QR codes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">QR Code Generation</h1>
          <p className="text-xl text-muted-foreground">Generate and manage QR codes for memorial items</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* QR Code Generation Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleGenerateQRCodes} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numberOfCodes" className="text-sm font-medium">
                    Number of QR Codes (max 50)
                  </Label>
                  <Input
                    id="numberOfCodes"
                    type="number"
                    min="1"
                    max="50"
                    value={numberOfCodes}
                    onChange={(e) => setNumberOfCodes(parseInt(e.target.value) || 1)}
                    className="text-lg font-semibold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codePrefix" className="text-sm font-medium">
                    Code Prefix (optional)
                  </Label>
                  <Input
                    id="codePrefix"
                    type="text"
                    value={codePrefix}
                    onChange={(e) => setCodePrefix(e.target.value)}
                    placeholder="e.g., MEM2024"
                    className="text-sm"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg"
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? "Generating QR Codes..." : "Generate QR Codes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                asChild 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium py-3"
                size="lg"
              >
                <Link to="/admin">Go to Admin Dashboard</Link>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium py-3"
                size="lg"
              >
                <Link to="/browse-workers">View All Memorials</Link>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium py-3"
                size="lg"
              >
                <Link to="/pricing">Manage Shop</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRGeneration;