import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Download } from "lucide-react";

const QRGeneration = () => {
  const [numberOfCodes, setNumberOfCodes] = useState(10);
  const [codePrefix, setCodePrefix] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([]);
  const [allCodes, setAllCodes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAllCodes();
  }, []);

  const loadAllCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAllCodes(data || []);
    } catch (error) {
      console.error('Error loading QR codes:', error);
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
      setGeneratedCodes(data.codes || []);
      await loadAllCodes(); // Refresh the list
      
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

  const handleDeleteAllQRCodes = async () => {
    if (!confirm('Are you sure you want to delete ALL QR codes? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (error) throw error;
      
      setAllCodes([]);
      setGeneratedCodes([]);
      
      toast({
        title: "All QR Codes Deleted",
        description: "All QR codes have been successfully removed from the system",
      });
    } catch (error: any) {
      console.error('Error deleting QR codes:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting QR codes",
        variant: "destructive",
      });
    }
  };

  const handleExportLatestQRCode = async () => {
    setIsExporting(true);
    try {
      // Get the most recent QR code
      const latestCode = allCodes[0]; // Since allCodes is sorted by created_at desc
      
      if (!latestCode) {
        toast({
          title: "No QR Codes Found",
          description: "No QR codes available to download",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('export-qr-codes', {
        body: { codes: [latestCode] } // Only export the latest code
      });

      if (error) throw error;

      // Download the single QR code as PNG file
      if (data.qrImages && data.qrImages.length > 0) {
        const item = data.qrImages[0];
        
        // Create canvas to convert SVG to PNG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = 300;
          canvas.height = 300;
          ctx?.drawImage(img, 0, 0, 300, 300);
          
          // Convert to PNG blob
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `QR_${latestCode.id}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(link.href);
            }
          }, 'image/png');
        };
        
        img.src = item.blob;

        toast({
          title: "Latest QR Code Downloaded",
          description: `Downloaded QR code: ${latestCode.id}`,
        });
      }
    } catch (error: any) {
      console.error('Error downloading latest QR code:', error);
      toast({
        title: "Download Failed",
        description: error.message || "An error occurred while downloading the QR code",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
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

                <Button 
                  type="button"
                  onClick={handleExportLatestQRCode}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium py-3"
                  disabled={isExporting || allCodes.length === 0}
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Downloading..." : "Download Latest QR Code"}
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
                <Link to="/view-all-memories">View All Memorials</Link>
              </Button>
              
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium py-3"
                  size="lg"
                >
                  <Link to="/pricing">Manage Shop</Link>
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAllQRCodes}
                  className="w-full font-medium py-3"
                  size="lg"
                  disabled={allCodes.length === 0}
                >
                  Delete All QR Codes ({allCodes.length})
                </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated QR Codes Section */}
        {(generatedCodes.length > 0 || allCodes.length > 0) && (
          <div className="mt-12 max-w-6xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  {generatedCodes.length > 0 ? "Recently Generated QR Codes" : "All QR Codes"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {(generatedCodes.length > 0 ? generatedCodes : allCodes.slice(0, 10)).map((code) => (
                    <div key={code.id} className="border rounded-lg p-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-mono text-sm font-semibold">ID: {code.code}</p>
                          <p className="text-sm text-muted-foreground">
                            URL: {window.location.origin}/memory/{code.code}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(code.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`${window.location.origin}/memory/${code.code}`)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {allCodes.length > 10 && generatedCodes.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Showing first 10 of {allCodes.length} total QR codes
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGeneration;